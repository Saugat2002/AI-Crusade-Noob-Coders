import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import React, { useState } from 'react';

export default function DailyTasks() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('12:00 PM');
  const [tasks, setTasks] = useState([
    // Example tasks - in real implementation these would come from voice input
    { id: '1', title: 'Morning Medicine', time: '8:00 AM', completed: false },
    { id: '2', title: 'Memory Exercise', time: '10:00 AM', completed: false },
  ]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      time: newTaskTime,
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setModalVisible(false);
    setNewTaskTitle('');
    setNewTaskTime('12:00 PM');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTask(item.id)}
      >
        <View style={styles.taskHeader}>
          <Text style={[
            styles.taskTitle,
            item.completed && styles.completedText
          ]}>
            {item.title}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            item.completed && styles.checkboxChecked
          ]}
          onPress={() => toggleTask(item.id)}
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeTask(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Daily Tasks</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // Add a new task with default values
          const newTask = {
            id: Date.now().toString(),
            title: 'New Task',
            time: '12:00 PM',
            completed: false
          };
          setTasks([...tasks, newTask]);
        }}
      >
        <Text style={styles.addButtonText}>+ Add New Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskItem item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B4E71',
    marginBottom: 20,
    marginTop: 10,
  },
  list: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
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
    flexDirection: 'column',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B4E71',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#6B4E71',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ff5252',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#6B4E71',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
