import React from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Importación para el gradiente

const LandingScreen = () => {
  const navigation = useNavigation();

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fitmovil.jpeg')}
      style={styles.background}
    >
      <View style={styles.overlay} />

      <View style={styles.contentContainer}>
        {/* Título */}
        <Text style={styles.title}>FitMovil</Text>

        {/* Botones para navegar */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Productos')}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FFFFFF']} // Fondo blanco
            style={styles.gradientButton}
          >
            <Text style={[styles.buttonText, styles.orangeText]}>Lista de Productos</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Trazabilidad')}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FFFFFF']} // Fondo blanco
            style={styles.gradientButton}
          >
            <Text style={[styles.buttonText, styles.orangeText]}>Trazabilidad</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Inventario')}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FFFFFF']} // Fondo blanco
            style={styles.gradientButton}
          >
            <Text style={[styles.buttonText, styles.orangeText]}>Ver Inventario</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={['#FF3D00', '#FF4500']} // Fondo rojo para "Cerrar Sesión"
            style={styles.gradientButton}
          >
            <Text style={[styles.buttonText, { color: '#FFF' }]}>Cerrar Sesión</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: -1, height: 2 },
    textShadowRadius: 15,
  },
  button: {
    width: 270,
    marginVertical: 12,
    alignItems: 'center',
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  logoutButton: {
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orangeText: {
    color: '#000', // Naranja para el texto
  },
});
