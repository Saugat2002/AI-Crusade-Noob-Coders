import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  StatusBar, 
  Modal, 
  TextInput 
} from 'react-native';

export default function DailyTasks() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('12:00 PM');
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([
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

  const handleEditTask = () => {
    if (!editingTask || newTaskTitle.trim() === '') return;

    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, title: newTaskTitle, time: newTaskTime }
        : task
    ));

    setEditModalVisible(false);
    setNewTaskTitle('');
    setNewTaskTime('12:00 PM');
    setEditingTask(null);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskTime(task.time);
    setEditModalVisible(true);
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
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
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
        onPress={() => setModalVisible(true)}
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

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Enter time (e.g., 12:00 PM)"
              value={newTaskTime}
              onChangeText={setNewTaskTime}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddTask}
              >
                <Text style={styles.modalAddButtonText}>Add Task</Text>
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
            <Text style={styles.modalTitle}>Edit Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Enter time (e.g., 12:00 PM)"
              value={newTaskTime}
              onChangeText={setNewTaskTime}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleEditTask}
              >
                <Text style={styles.modalAddButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  editButtonText: {
    color: '#6B4E71',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6B4E71',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  modalCancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalAddButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#6B4E71',
  },
  modalAddButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});