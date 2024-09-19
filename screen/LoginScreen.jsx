import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      // Realizar la solicitud a la API para iniciar sesión
      const response = await axios.post('https://backendfitmrp-production.up.railway.app/api/auth/login', {
        email,
        password,
      });

      // Comprobar si hay datos del usuario en la respuesta
      const user = response.data.user;
      if (!user) {
        throw new Error('Datos de usuario no recibidos');
      }

      // Guardar los datos del usuario en AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Limpiar los campos del formulario
      setEmail("");
      setPassword("");

      // Navegar a la siguiente pantalla (reemplazar 'Inventario' con la pantalla objetivo)
      navigation.navigate('Landing');
    } catch (error) {
      // Mostrar mensaje de error
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
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

      {/* Texto de bienvenida */}
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Hello</Text>
      </View>

      {/* Texto de inicio de sesión */}
      <View>
        <Text style={styles.signInText}>Sign in to your account</Text>
      </View>

      {/* Campos de entrada */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={24} color="#6e6e6e" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#a1a1a1"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={24} color="#6e6e6e" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor="#a1a1a1"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* Texto de "Olvidaste tu contraseña" */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Botón de inicio de sesión */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
        <Text style={styles.signInButtonText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
      </TouchableOpacity>

      {/* Opciones de inicio de sesión social */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={28} color="#DB4437" />
        </TouchableOpacity>
      </View>

      {/* Botón de registro */}
      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpButtonText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    paddingHorizontal: 5,
  },
  topImageContainer: {
    height: 150,
  },
  topImage: {
    width: "100%",
    height: 125,
  },
  helloContainer: {},
  helloText: {
    textAlign: "center",
    fontSize: 70,
    fontWeight: "500",
    color: "#262626",
  },
  signInText: {
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
  },
  inputContainer: {
    marginTop: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 40,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    color: "#262626",
  },
  forgotText: {
    textAlign: "center",
    color: "#a1a1a1",
    marginTop: 15,
  },
  signInButton: {
    backgroundColor: "#8E2DE2",
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '94%',
    alignSelf: 'center',
  },
  signInButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 50,
  },
  socialButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: "#8E2DE2",
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
