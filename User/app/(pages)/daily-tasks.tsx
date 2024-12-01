import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import texts from "@/utils/texts";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function DailyTasks() {
  const { language } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("12:00 PM");
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { user } = useUser();

  // Notification state
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notificationIds, setNotificationIds] = useState({});
  const notificationListener = useRef();
  const responseListener = useRef();

  // Load tasks and set up notifications on component mount
  useEffect(() => {
    // Request notification permissions and get token
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Fetch existing tasks
    const getTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URI}/fetchTasks`
        );
        const result = await response.json();
        setTasks(result.tasks);

        // Reschedule notifications for existing tasks
        result.tasks.forEach(scheduleTaskNotification);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getTasks();

    // Load saved notification IDs
    const loadNotificationIds = async () => {
      try {
        const savedIds = await AsyncStorage.getItem('taskNotificationIds');
        if (savedIds) {
          setNotificationIds(JSON.parse(savedIds));
        }
      } catch (error) {
        console.error('Failed to load notification IDs', error);
      }
    };
    loadNotificationIds();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification response:", response);
    });

    // Clean up listeners
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Save notification IDs to AsyncStorage
  const saveNotificationIds = async (updatedIds) => {
    try {
      await AsyncStorage.setItem('taskNotificationIds', JSON.stringify(updatedIds));
      setNotificationIds(updatedIds);
    } catch (error) {
      console.error('Failed to save notification IDs', error);
    }
  };

  // Schedule notification for a specific task
  const scheduleTaskNotification = async (task) => {
    // Skip scheduling for completed tasks
    if (task.completed) return null;

    // Parse the time
    const [time, period] = task.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    let convertedHours = hours;
    if (period === 'PM' && hours !== 12) {
      convertedHours += 12;
    } else if (period === 'AM' && hours === 12) {
      convertedHours = 0;
    }

    // Create a date for today at the specified time
    const now = new Date();
    const notificationTime = new Date(
      now.getFullYear(), 
      now.getMonth(), 
      now.getDate(), 
      convertedHours, 
      minutes
    );

    // If the time has already passed today, schedule for tomorrow
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    try {
      // Schedule the notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder 📅",
          body: `Time for: ${task.task}`,
          data: { taskId: task._id },
        },
        trigger: notificationTime,
      });

      // Save the notification identifier for this task
      const updatedIds = {
        ...notificationIds,
        [task._id]: identifier
      };
      await saveNotificationIds(updatedIds);

      return identifier;
    } catch (error) {
      console.error("Failed to schedule notification:", error);
      return null;
    }
  };

  // Cancel a specific task's notification
  const cancelTaskNotification = async (taskId) => {
    try {
      // Get the notification identifier for this task
      const notificationId = notificationIds[taskId];

      if (notificationId) {
        // Cancel the scheduled notification
        await Notifications.cancelScheduledNotificationAsync(notificationId);

        // Remove the notification ID from storage
        const updatedIds = { ...notificationIds };
        delete updatedIds[taskId];
        await saveNotificationIds(updatedIds);
      }
    } catch (error) {
      console.error('Failed to cancel notification', error);
    }
  };

  // Add a new task
  const handleAddTask = async () => {
    if (newTaskTitle.trim() === "") return;

    const newTask = {
      userId: user?._id,
      task: newTaskTitle, 
      time: newTaskTime,
      completed: false,
      priority: "Medium",
      category: "Daily Routine",
    };

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/addTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        const taskWithId = { ...newTask, _id: result.taskId };
        
        // Add task to list
        setTasks([...tasks, taskWithId]);
        
        // Schedule notification
        await scheduleTaskNotification(taskWithId);
        
        // Reset modal state
        setModalVisible(false);
        setNewTaskTitle("");
        setNewTaskTime("12:00 PM");
      } else {
        console.error("Failed to add task:", result.message);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Edit an existing task
  const handleEditTask = async () => {
    if (!editingTask || newTaskTitle.trim() === "") return;

    const updatedTask = {
      taskId: editingTask._id,
      task: newTaskTitle,
      time: newTaskTime,
      completed: editingTask.completed,
      priority: editingTask.priority,
      category: editingTask.category,
    };

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/updateTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        const updatedTaskWithDetails = { 
          ...editingTask, 
          task: newTaskTitle, 
          time: newTaskTime 
        };
        
        // Cancel previous notification
        await cancelTaskNotification(editingTask._id);
        
        // Schedule new notification
        await scheduleTaskNotification(updatedTaskWithDetails);
        
        // Update tasks list
        setTasks(
          tasks.map((task) =>
            task._id === editingTask._id ? updatedTaskWithDetails : task
          )
        );
        
        // Reset modal state
        setEditModalVisible(false);
        setNewTaskTitle("");
        setNewTaskTime("12:00 PM");
        setEditingTask(null);
      } else {
        console.error("Failed to update task:", result.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/deleteTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId }),
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        // Cancel the notification for this task
        await cancelTaskNotification(taskId);

        // Remove the task from the list
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        console.error("Failed to delete task:", result.message);
      } 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/updateTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId,
            ...updatedTask,
          }),
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        // Update tasks list
        setTasks(
          tasks.map((t) =>
            t._id === taskId 
              ? { ...t, completed: !t.completed } 
              : t
          )
        );

        // Manage notification based on completion status
        if (updatedTask.completed) {
          await cancelTaskNotification(taskId);
        } else {
          await scheduleTaskNotification(updatedTask);
        }
      } else {
        console.error("Failed to update task:", result.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Request notification permissions
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({ 
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID 
    })).data;
    
    return token;
  }

  // Render task item
  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTaskCompletion(item._id)}
      >
        <View style={styles.taskHeader}>
          <Text
            style={[styles.taskTitle, item.completed && styles.completedText]}
          >
            {item.task}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditingTask(item);
            setNewTaskTitle(item.task);
            setNewTaskTime(item.time);
            setEditModalVisible(true);
          }}
        >
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleDeleteTask(item._id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>{texts[language].dailyTasks}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ {texts[language].addNewTask}</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskItem item={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{texts[language].addNewTask}</Text>

            <TextInput
              style={styles.input}
              placeholder={texts[language].enterTaskTitle}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <TextInput
              style={styles.input}
              placeholder={texts[language].enterTime}
              value={newTaskTime}
              onChangeText={setNewTaskTime}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>
                  {texts[language].cancel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddTask}
              >
                <Text style={styles.modalAddButtonText}>
                  {texts[language].addTask}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{texts[language].editTask}</Text>

            <TextInput
              style={styles.input}
              placeholder={texts[language].enterTaskTitle}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <TextInput
              style={styles.input}
              placeholder={texts[language].enterTime}
              value={newTaskTime}
              onChangeText={setNewTaskTime}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>
                  {texts[language].cancel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleEditTask}
              >
                <Text style={styles.modalAddButtonText}>
                  {texts[language].saveChanges}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B4E71",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#6B4E71",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "column",
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  timeText: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e6e6fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  editButtonText: {
    color: "#6B4E71",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#ff5252",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6B4E71",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  modalCancelButtonText: {
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  modalAddButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#6B4E71",
  },
  modalAddButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
