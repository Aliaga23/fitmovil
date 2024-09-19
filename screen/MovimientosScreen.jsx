import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';

const MovimientosScreen = () => {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    fetchProductos();
  }, []);

  const fetchMovimientos = async (producto_id) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://backendfitmrp-production.up.railway.app/api/movements/producto/${producto_id}`);
      setMovimientos(response.data);
      setSelectedProduct(producto_id);
      setShowTimeline(true);
      setLoading(false);
    } catch (error) {
      Alert.alert('Sin Trazabilidad', 'No hay trazabilidad de este producto.');
      setLoading(false);
      return;
    }
  };

  const renderMovimiento = ({ item }) => (
    <View style={styles.timelineItem} key={item.id}>
      <Ionicons name="time-outline" size={24} color="#4CAF50" style={styles.timelineIcon} />
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{item.tipo_movimiento}</Text>
        <Text style={styles.timelineDate}>{item.fecha}</Text>
        <Text style={styles.timelineDescription}>{item.observaciones}</Text>
      </View>
    </View>
  );

  const renderProducto = ({ item }) => (
    <View key={item.id} style={styles.productContainer}>
      <Text style={styles.productName}>{item.nombre}</Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => fetchMovimientos(item.id)}
      >
        <Ionicons name="eye-outline" size={20} color="#FFF" />
        <Text style={styles.viewButtonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />}
      {!showTimeline ? (
        <FlatList
          data={productos}
          renderItem={renderProducto}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.section}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Movimientos de Productos</Text>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={movimientos}
          renderItem={renderMovimiento}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.timelineContainer}
          ListHeaderComponent={() => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Timeline de Movimientos</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity
              style={styles.finalizarButton}
              onPress={() => {
                setShowTimeline(false);
                setMovimientos([]);
                setSelectedProduct(null);
              }}
            >
              <Text style={styles.finalizarButtonText}>Finalizar Trazabilidad</Text>
            </TouchableOpacity>
          )}
        />
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
    shadowOffset: { width: 0, height: 4 }, // Ajuste de sombra más sutil
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6, // Elevación un poco más sutil
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 1,
    marginHorizontal: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold', // Manteniendo el peso del texto más fuerte
    marginBottom: 15,
    color: '#37474F',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    color: '#37474F',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewButtonText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 16,
  },
  timelineContainer: {
    
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineIcon: {
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold', // Ajustando el peso del texto
    color: '#37474F',
  },
  timelineDate: {
    fontSize: 14,
    color: '#757575',
    marginVertical: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#424242',
  },
  finalizarButton: {
    backgroundColor: '#FF3D00',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  finalizarButtonText: {
    color: '#FFF',
    fontWeight: 'bold', // Asegurando consistencia en el estilo de los textos
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});


export default MovimientosScreen;
