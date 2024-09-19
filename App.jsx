import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screen/LoginScreen";
import SignupScreen from "./screen/SignupScreen";
import ProductosScreen from "./screen/ProductosScreen"; // Importa la nueva pantalla
import MovimientosScreen from "./screen/MovimientosScreen";
import ControlNivelesInventario from "./screen/ControlNivelesInventario";
import LandingScreen from "./screen/LandingScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Productos" component={ProductosScreen} /> 
        <Stack.Screen name="Trazabilidad" component={MovimientosScreen} /> 
        <Stack.Screen name="Inventario" component={ControlNivelesInventario} /> 
        <Stack.Screen name="Landing" component={LandingScreen} /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
