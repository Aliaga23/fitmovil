import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ProductosScreen = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductosYCategorias = async () => {
      try {
        setLoading(true);
        // Obtener productos desde la API
        const productosResponse = await axios.get('https://backendfitmrp-production.up.railway.app/api/products');
        setProductos(productosResponse.data);

        // Obtener categorías desde la API
        const categoriasResponse = await axios.get('https://backendfitmrp-production.up.railway.app/api/categories');
        setCategorias(categoriasResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setLoading(false);
      }
    };

    fetchProductosYCategorias();
  }, []);

  const getCategoriaNombre = (id) => {
    const categoria = categorias.find((cat) => cat.id === id);
    return categoria ? categoria.nombre : 'Sin Categoría';
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productTitle}>{item.nombre}</Text>
      <Text style={styles.productDescription}>{item.descripcion}</Text>
      <Text style={styles.productPrice}>${item.precio}</Text>
      <Text style={styles.productCategory}>{getCategoriaNombre(item.categoria_id)}</Text>
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
            <Text style={styles.headerText}>Lista de Productos</Text>
          </View>

          {/* Lista de Productos */}
          <FlatList
            data={productos}
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
  productContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC107', // Amarillo
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474F',
  },
  productDescription: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
    marginTop: 8,
  },
  productCategory: {
    fontSize: 14,
    color: '#00796B',
    marginTop: 4,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default ProductosScreen;
