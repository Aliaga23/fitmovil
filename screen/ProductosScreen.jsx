import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductosScreen = ({ navigation }) => {
  const userId = 24; // ID de usuario simulado para pruebas
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0); // Estado local para el contador de carrito

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://backendfitmrp-production.up.railway.app/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const addToCart = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'https://backendfitmrp-production.up.railway.app/api/carrito/add-item',
        { usuario_id: userId, producto_id: productId, cantidad: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartCount(cartCount + 1); // Actualiza el contador de carrito en el estado local
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.nombre}</Text>
      <Text style={styles.productPrice}>${item.precio}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item.id)}>
        <Text style={styles.addButtonText}>Agregar al Carrito</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F00" />
      ) : (
        <>
          {/* Barra superior con el ícono del carrito y contador */}
          <View style={styles.topBar}>
            <Text style={styles.title}>Productos</Text>
            <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('Cart')}>
              <FontAwesome name="shopping-cart" size={24} color="#FF5722" />
              {cartCount > 0 && (
                <View style={styles.cartCount}>
                  <Text style={styles.cartCountText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Lista de productos */}
          <FlatList
            data={productos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#37474F',
  },
  cartIcon: {
    position: 'relative',
  },
  cartCount: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  cartCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 8,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginTop: 5,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ProductosScreen;
