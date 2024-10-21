import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

const ProductosScreen = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Para la búsqueda

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

  // Función para obtener el nombre de la categoría
  const getCategoriaNombre = (id) => {
    const categoria = categorias.find((cat) => cat.id === id);
    return categoria ? categoria.nombre : 'Sin Categoría';
  };

  // Función para manejar el filtrado de productos
  const handleSearch = () => {
    return productos.filter((item) =>
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      {/* Imagen del producto */}
      <Image source={{ uri: item.image }} style={styles.productImage} />

      {/* Título del producto */}
      <Text style={styles.productTitle}>{item.nombre}</Text>

      {/* Precio del producto */}
      <Text style={styles.productPrice}>${item.precio}</Text>

      {/* Categoría del producto */}
      <Text style={styles.productCategory}>{getCategoriaNombre(item.categoria_id)}</Text>

      {/* Botón de añadir */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F00" style={styles.loadingIndicator} />
      ) : (
        <>
          {/* Barra superior con ícono de hamburguesa, título y de usuario */}
          <View style={styles.topBar}>
            {/* Ícono de hamburguesa a la izquierda */}
            <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
              <FontAwesome name="bars" size={24} color="#FF5722" />
            </TouchableOpacity>

            {/* Título de la página */}
            <Text style={styles.title}>Productos</Text>

            {/* Ícono de usuario a la derecha */}
            <TouchableOpacity style={styles.userIcon} onPress={() => navigation.navigate('UserProfile')}>
              <FontAwesome name="user" size={24} color="#FF5722" />
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda debajo del título */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#757575" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Buscar productos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Lista de Productos */}
          <FlatList
            data={handleSearch()} // Filtrar productos por la búsqueda
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2} // Mostrar productos en dos columnas
            key={'2-columns'} // Forzar renderizado con la clave "2-columns"
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
    backgroundColor: '#F5F5F5', // Fondo gris claro
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    elevation: 3,
    shadowColor: '#F5F5F5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#37474F', // Cambié el color a un gris oscuro más natural y armonioso
  },
  userIcon: {
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginVertical: 10, // Separación de la barra de búsqueda
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 10,
    padding: 15,
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
    color: '#212121', // Negro
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722', // Naranja para el precio
    marginTop: 5,
  },
  productCategory: {
    fontSize: 14,
    color: '#00796B', // Verde para la categoría
    marginTop: 5,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#FF5722', // Botón naranja
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default ProductosScreen;
