import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import axios from 'axios';

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      // Realizar la solicitud a la API para registrarse
      await axios.post('https://backendfitmrp-production.up.railway.app/api/auth/signup', {
        nombre: name,
        email,
        password,
        rol_id: 2, // Ajustar `rol_id` según la lógica de la aplicación
      });

      // Limpiar los campos del formulario
      setName("");
      setEmail("");
      setPassword("");

      // Mostrar un mensaje de éxito
      Alert.alert('Registro exitoso', '¡Te has registrado correctamente!');
    } catch (error) {
      // Mostrar un mensaje de error
      Alert.alert('Error', error.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen superior */}
      <View style={styles.topImageContainer}>
        <Image source={require("../assets/topVector.png")} style={styles.topImage} />
      </View>

      {/* Encabezado */}
      <Text style={styles.headerText}>Create account</Text>

      {/* Campos de entrada */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={24} color="#6e6e6e" style={styles.icon} />
        <TextInput
          placeholder="Username"
          placeholderTextColor="#a1a1a1"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={24} color="#6e6e6e" style={styles.icon} />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#a1a1a1"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={24} color="#6e6e6e" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#a1a1a1"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Botón de registro */}
      <TouchableOpacity style={styles.createButton} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 5,
  },
  topImageContainer: {
    height: 150,
  },
  topImage: {
    width: "100%",
    height: 125,
  },
  headerText: {
    fontSize: 40,
    fontWeight: '500',
    color: '#262626',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '94%',
    alignSelf: 'center',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#262626',
  },
  createButton: {
    marginTop: 30,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8E2DE2', // Soft purple color
    paddingVertical: 15,
    width: '94%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
