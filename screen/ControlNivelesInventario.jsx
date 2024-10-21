import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const ControlNivelesInventario = ({ navigation }) => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Para la búsqueda

  useEffect(() => {
    fetchInventario();
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

  const handleSearch = () => {
    return inventario.filter((item) =>
      item.nombre && item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderItem = ({ item }) => {
    const nombreProducto = item.nombre ? item.nombre : 'Producto Desconocido';
    const cantidadDisponible = item.cantidad_disponible ? item.cantidad_disponible : 0;

    return (
      <View style={styles.inventoryContainer}>
        <Text style={styles.inventoryProduct}>{nombreProducto}</Text>
        <Text style={styles.inventoryQuantity}>
          {`Cantidad Disponible: ${cantidadDisponible}`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF5722" style={styles.loadingIndicator} />
      ) : (
        <>
          {/* Barra superior con ícono de hamburguesa, título y de usuario */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
              <FontAwesome name="bars" size={24} color="#FF5722" />
            </TouchableOpacity>
            <Text style={styles.title}>Inventario</Text>
            <TouchableOpacity style={styles.userIcon} onPress={() => navigation.navigate('UserProfile')}>
              <FontAwesome name="user" size={24} color="#FF5722" />
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda debajo del título */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#757575" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Buscar producto..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Lista de Inventario */}
          <FlatList
            data={handleSearch()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2} // Mostrar dos tarjetas por fila
            columnWrapperStyle={styles.row} // Ajustar las columnas para la fila
            contentContainerStyle={styles.listContainer}
            key={'2-columns'} // Forzar renderizado con esta clave única
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
    color: '#37474F',
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
  inventoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 10,
    padding: 15,
    width: (screenWidth / 2) - 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 0,
  },
  inventoryProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  inventoryQuantity: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default ControlNivelesInventario;
