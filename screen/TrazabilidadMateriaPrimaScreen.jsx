import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const TrazabilidadMateriaPrimaScreen = ({ navigation }) => {
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedMateriaPrima, setSelectedMateriaPrima] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Para la búsqueda

  useEffect(() => {
    fetchMateriasPrimas();
  }, []);

  const fetchMateriasPrimas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backendfitmrp-production.up.railway.app/api/materiaprima');
      setMateriasPrimas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las materias primas:', error);
      setLoading(false);
    }
  };

  const fetchMovimientos = async (materia_prima_id) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://backendfitmrp-production.up.railway.app/api/movements-materiaprima/materia-prima/${materia_prima_id}`);
      setMovimientos(response.data);
      setSelectedMateriaPrima(materia_prima_id);
      setShowTimeline(true);
      setLoading(false);
    } catch (error) {
      Alert.alert('Sin Trazabilidad', 'No hay trazabilidad de esta materia prima.');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    return materiasPrimas.filter((item) =>
      item.nombre && item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardSubtitle}>ID: {item.id}</Text>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => fetchMovimientos(item.id)}
      >
        <FontAwesome name="eye" size={16} color="#FFF" />
        <Text style={styles.viewButtonText}>Ver Trazabilidad</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMovimiento = ({ item }) => (
    <View style={styles.timelineItem}>
      <FontAwesome name="exchange" size={24} color="#4CAF50" style={styles.timelineIcon} />
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
            <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
              <FontAwesome name="bars" size={24} color="#FF5722" />
            </TouchableOpacity>
            <Text style={styles.title}>Trazabilidad de Materia Prima</Text>
            <TouchableOpacity style={styles.userIcon} onPress={() => navigation.navigate('UserProfile')}>
              <FontAwesome name="user" size={24} color="#FF5722" />
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda */}
          {!showTimeline && (
            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={20} color="#757575" style={styles.searchIcon} />
              <TextInput
                style={styles.searchBar}
                placeholder="Buscar materia prima..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          {/* Lista de Materia Prima o Timeline de Movimientos */}
          {!showTimeline ? (
            <FlatList
              data={handleSearch()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              numColumns={2} // Para mostrar 2 columnas
              key={'2-columns'} // Cambia el key para forzar un renderizado nuevo
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <FlatList
              data={movimientos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMovimiento}
              key={'1-column'} // Cambia el key para una sola columna
              contentContainerStyle={styles.timelineContainer}
              ListFooterComponent={() => (
                <TouchableOpacity
                  style={styles.finalizarButton}
                  onPress={() => {
                    setShowTimeline(false);
                    setMovimientos([]);
                    setSelectedMateriaPrima(null);
                  }}
                >
                  <Text style={styles.finalizarButtonText}>Finalizar Trazabilidad</Text>
                </TouchableOpacity>
              )}
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
  cardContainer: {
    backgroundColor: '#FFF',
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
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Botón verde
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default TrazabilidadMateriaPrimaScreen;
