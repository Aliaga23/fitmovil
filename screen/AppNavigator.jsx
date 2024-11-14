import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import CartScreen from './CartScreen';
import ProductosScreen from './ProductosScreen';
import MovimientosScreen from './MovimientosScreen';
import ControlNivelesInventario from './ControlNivelesInventario';
import TrazabilidadMateriaPrimaScreen from './TrazabilidadMateriaPrimaScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ocultar encabezado predeterminado
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Productos') {
            iconName = 'shopping-bag';
          } else if (route.name === 'Trazabilidad') {
            iconName = 'exchange';
          } else if (route.name === 'Inventario') {
            iconName = 'cubes';
          } else if (route.name === 'TrazabilidadMP') {
            iconName = 'home';
          } else if (route.name === 'Carrito') {
            iconName = 'shopping-cart';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF5722', // Naranja para el icono activo
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#212121', // Fondo oscuro
        },
      })}
    >
      <Tab.Screen name="TrazabilidadMP" component={TrazabilidadMateriaPrimaScreen} />
      <Tab.Screen name="Productos" component={ProductosScreen} />
      <Tab.Screen name="Trazabilidad" component={MovimientosScreen} />
      <Tab.Screen name="Inventario" component={ControlNivelesInventario} />
      <Tab.Screen name="Carrito" component={CartScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
