import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ControlNivelesInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventario();
    fetchProductos();
  }, []);

  const fetchInventario = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backendfitmrp-production.up.railway.app/api/inventories');
      setInventario(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backendfitmrp-production.up.railway.app/api/products');
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setLoading(false);
    }
  };

  const getProductoNombre = (id) => {
    const producto = productos.find((prod) => prod.id === id);
    return producto ? producto.nombre : 'Producto Desconocido';
  };

  const renderItem = ({ item }) => (
    <View style={styles.inventoryContainer}>
      <Text style={styles.inventoryProduct}>{getProductoNombre(item.producto_id)}</Text>
      <Text style={styles.inventoryQuantity}>Cantidad Disponible: {item.cantidad_disponible}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
      ) : (
        <>
          {/* Encabezado */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Control de Niveles de Inventario</Text>
          </View>

          {/* Lista de Inventario */}
          <FlatList
            data={inventario}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
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
    backgroundColor: '#F9FAFB', // Fondo gris claro más moderno
  },
  headerContainer: {
    backgroundColor: '#4CAF50',
    padding: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inventoryContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC107', // Amarillo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inventoryProduct: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474F',
  },
  inventoryQuantity: {
    fontSize: 16,
    color: '#757575',
    marginTop: 4,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default ControlNivelesInventario;
