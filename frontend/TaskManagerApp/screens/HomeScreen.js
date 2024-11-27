import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getTasks, deleteTask } from '../services/api';
import Animated, { Easing, withRepeat, withTiming, useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Shared values for rotation and edge distortion for each shape
  const rotations = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];
  const distortions = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];
  const positions = [useSharedValue({ top: 0, left: 0 }), useSharedValue({ top: 0, left: 0 }), useSharedValue({ top: 0, left: 0 })];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tasks: ' + err.message);
        setLoading(false);
      }
    };

    fetchTasks();

    // Randomize positions for each shape
    positions.forEach((position) => {
      position.value = { top: Math.random() * 500, left: Math.random() * 300 }; // Randomize position within the screen
    });

    // Continuous rotation for each shape
    rotations.forEach((rotation, index) => {
      rotation.value = withRepeat(
        withTiming(360, { duration: 5000 + index * 1000, easing: Easing.linear }), // Different speed for each shape
        -1,
        false
      );
    });

    // Random distortion for edges of each shape
    const waveEffect = () => {
      distortions.forEach((distortion) => {
        distortion.value = withRepeat(
          withTiming(Math.random() * 10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );
      });
    };

    waveEffect();
  }, []);

  // Animated styles for each shape
  const animatedStyle = (index) => {
    // Randomize edge distortion using the distortion value for each shape
    const randomEdge = interpolate(distortions[index].value, [0, 10], [5, 20], Extrapolate.CLAMP);
    return useAnimatedStyle(() => ({
      transform: [
        { rotate: `${rotations[index].value}deg` }, // Rotation for each shape
      ],
      borderRadius: randomEdge, // Random edge distortion for wavy look
      position: 'absolute',
      top: positions[index].value.top,
      left: positions[index].value.left,
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Rotating and Waving Shapes with Random Placement */}
      <Animated.View style={[styles.shape, styles.circle, animatedStyle(0)]} />
      <Animated.View style={[styles.shape, styles.square, animatedStyle(1)]} />
      <Animated.View style={[styles.shape, styles.triangle, animatedStyle(2)]} />

      <View style={styles.contentContainer}>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>Track your day!</Text>
        </View>

        <Text style={styles.header}>Task Manager</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#D3F1DF" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : !tasks.length ? (
          <Text style={styles.noTasksText}>No tasks available.</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('Edit', { task: item })}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('View', { taskId: item._id })}
                  >
                    <Text style={styles.buttonText}>View Task Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Create')}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  shape: {
    width: 150,
    height: 150,
    opacity: 0.7,
  },
  circle: {
    backgroundColor: 'rgba(0, 123, 255, 0.6)', // Semi-transparent blue
  },
  square: {
    backgroundColor: 'rgba(255, 99, 71, 0.6)', // Semi-transparent red
    transform: [{ rotate: '45deg' }], // Create square effect with rotated shape
  },
  triangle: {
    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Semi-transparent green
    width: 0,
    height: 0,
    borderLeftWidth: 75,
    borderRightWidth: 75,
    borderBottomWidth: 130,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(75, 192, 192, 0.6)', // Green triangle color
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  quoteContainer: {
    alignSelf: 'center',
    marginVertical: 40,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,    // Defines the width of the border
    borderColor: "#525B44", // Defines the color of the border
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#333',
  },
  taskCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,  // Sets the border radius for rounded corners
    marginBottom: 8,
    margin: 23,
    marginTop: 8,
    
    // Border properties
    borderWidth: 1,    // Defines the width of the border
    borderColor: "#525B44", // Defines the color of the border
  
  
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#5A6C57',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  detailsButton: {
    backgroundColor: '#85A98F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#525B44',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    margin: 23,
    alignItems: 'center'
    
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noTasksText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginVertical: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
