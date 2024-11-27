import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import EditTaskScreen from './screens/EditTaskScreen'; // Optional edit screen
import ViewTaskScreen from './screens/ViewTaskScreen';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={CreateTaskScreen} />
        <Stack.Screen name="Edit" component={EditTaskScreen} />
        <Stack.Screen name="View" component={ViewTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;