import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import texts from "@/utils/texts";

export default function DailyTasks() {
  const { language } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("12:00 PM");
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const {user} = useUser();

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/fetchTasks`
      );
      const result = await response.json();
      console.log(result);

      setTasks(result.tasks);
    };
    getTasks();
  }, []);

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

    const request = new Request(
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

    try {
      const response = await fetch(request);
      const result = await response.json();
      if (response.status === 200) {
        setTasks([...tasks, { ...newTask, _id: result.taskId }]);
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

    const request = new Request(
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

    try {
      const response = await fetch(request);
      const result = await response.json();
      if (response.status === 200) {
        setTasks(
          tasks.map((task) =>
            task._id === editingTask._id ? updatedTask : task
          )
        );
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

  const handleDeleteTask = async (taskId) => {
    const request = new Request(
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

    try {
      const response = await fetch(request);
      const result = await response.json();
      if (response.status === 200) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        console.error("Failed to delete task:", result.message);
      } 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    const task1 = tasks.find((task) => task._id === taskId);
    if (!task1) return;
    console.log(task1);

    const updatedTask = {
      ...task1,
      completed: !task1.completed,
    };
    console.log(updatedTask);
    const {
      taskId: _id,
      task,
      time,
      completed,
      priority,
      category,
    } = updatedTask;    

    const request = new Request(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/updateTask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          task,
          time,
          completed,
          priority,
          category,
        }),
        credentials: "include",
      }
    );

    try {
      const response = await fetch(request);
      const result = await response.json();
      if (response.status === 200) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
      } else {
        console.error("Failed to update task:", result.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.task);
    setNewTaskTime(task.time);
    setEditModalVisible(true);
  };

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
          onPress={() => openEditModal(item)}
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
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  timeText: {
    fontSize: 14,
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
