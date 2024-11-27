import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>{task.title}</Text>
      <Text>{task.description}</Text>
      <Text>{task.dueDate}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="Edit" onPress={() => onEdit(task)} />
        <Button title="Delete" onPress={() => onDelete(task._id)} />
      </View>
    </View>
  );
};

export default TaskItem;