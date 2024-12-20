import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, TextInput, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';

const screenWidth = Dimensions.get('window').width; // Obtener el ancho de la pantalla

const MovimientosScreen = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Para la búsqueda de productos

  useEffect(() => {
    const fetchProductosYCategorias = async () => {
      try {
        setLoading(true);
        const productosResponse = await axios.get('https://backendfitmrp-production.up.railway.app/api/products');
        setProductos(productosResponse.data);

        const categoriasResponse = await axios.get('https://backendfitmrp-production.up.railway.app/api/categories');
        setCategorias(categoriasResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los productos y categorías:', error);
        setLoading(false);
      }
    };
    fetchProductosYCategorias();
  }, []);

  const fetchMovimientos = async (producto_id) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://backendfitmrp-production.up.railway.app/api/movements/producto/${producto_id}`);
      setMovimientos(response.data);
      setShowTimeline(true);
      setLoading(false);
    } catch (error) {
      Alert.alert('Sin Trazabilidad', 'No hay trazabilidad de este producto.');
      setLoading(false);
    }
  };

  const getCategoriaNombre = (id) => {
    const categoria = categorias.find((cat) => cat.id === id);
    return categoria ? categoria.nombre : 'Sin Categoría';
  };

  const handleSearch = () => {
    return productos.filter((item) =>
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderProducto = ({ item }) => (
    <View key={item.id} style={styles.productContainer}>
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productCategory}>{getCategoriaNombre(item.categoria_id)}</Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => fetchMovimientos(item.id)}
      >
        <Ionicons name="eye-outline" size={20} color="#FFF" />
        <Text style={styles.viewButtonText}>Ver Trazabilidad</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMovimiento = ({ item }) => (
    <View style={styles.timelineItem} key={item.id}>
      <Ionicons name="time-outline" size={24} color="#007BFF" style={styles.timelineIcon} />
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{item.tipo_movimiento}</Text>
        <Text style={styles.timelineDate}>{item.fecha}</Text>
        <Text style={styles.timelineDescription}>{item.observaciones}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF5722" style={styles.loadingIndicator} />
      ) : (
        <>
          {/* Barra superior con ícono de hamburguesa, título y de usuario */}
          <View style={styles.topBar}>
            {/* Ícono de hamburguesa a la izquierda */}
            <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
              <FontAwesome name="bars" size={24} color="#FF5722" />
            </TouchableOpacity>

            {/* Título de la página */}
            <Text style={styles.title}>Movimientos</Text>

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

          {!showTimeline ? (
            <FlatList
              data={handleSearch()}
              renderItem={renderProducto}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2} // Mostrar dos tarjetas por fila
              columnWrapperStyle={styles.row} // Ajustar la fila para las dos columnas
              contentContainerStyle={styles.listContainer}
              key={'2-columns'} // Forzar renderizado con esta clave única
            />
          ) : (
            <FlatList
              data={movimientos}
              renderItem={renderMovimiento}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.timelineContainer}
              ListFooterComponent={() => (
                <TouchableOpacity
                  style={styles.finalizarButton}
                  onPress={() => {
                    setShowTimeline(false);
                    setMovimientos([]);
                  }}
                >
                  <Text style={styles.finalizarButtonText}>Finalizar Trazabilidad</Text>
                </TouchableOpacity>
              )}
              key={'timeline'} // Clave única para el timeline
            />
          )}
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
    backgroundColor: '#FFF',
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
    color: '#37474F', // Gris oscuro natural y armonioso
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
    marginVertical: 10,
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
  row: {
    justifyContent: 'space-between',
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 10,
    padding: 15,
    width: (screenWidth / 2) - 30, // Ajustar para que dos tarjetas quepan en una fila
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 0, // Quitar el borde naranja
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121', // Negro elegante para el nombre
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 14,
    color: '#00796B', // Verde azulado para la categoría
    marginTop: 5,
    textAlign: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722', // Naranja deportivo para el botón
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 10,
  },
  viewButtonText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 16,
  },
  timelineContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  timelineItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 0, // Quitar el borde en las tarjetas del timeline
  },
  timelineIcon: {
    marginRight: 10,
    color: '#007BFF', // Azul deportivo para los íconos de tiempo
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: '#FF3D00', // Rojo deportivo para el botón de finalizar
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default MovimientosScreen;
