import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const CartScreen = () => {
  const userId = 24; // Simulación del ID de usuario
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchCartItems = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'https://backendfitmrp-production.up.railway.app/api/carrito/get-or-create',
        { usuario_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const items = response.data.items || [];
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://backendfitmrp-production.up.railway.app/api/pedido/history/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error al obtener el historial de pedidos:', error);
      Alert.alert('Error', 'Hubo un problema al cargar el historial de pedidos.');
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (Number(item.precio_unitario) * item.cantidad), 0);
    setTotalPrice(total.toFixed(2));

    if (total > 1500) {
      const discount = total * 0.1;
      setDiscountedPrice((total - discount).toFixed(2));
    } else {
      setDiscountedPrice(total.toFixed(2));
    }
  };

  const generateQuotation = async () => {
    const htmlContent = `
      <h1 style="text-align: center;">Cotización de Compra</h1>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
      <h2>Productos Cotizados:</h2>
      <ul>
        ${cartItems
          .map(
            (item) =>
              `<li>${item.nombre} - Cantidad: ${item.cantidad} - Precio Unitario: $${item.precio_unitario}</li>`
          )
          .join('')}
      </ul>
      <p>Total antes de descuento: $${totalPrice}</p>
      ${totalPrice > 1500 ? `<p>Descuento aplicado: 10%</p><p>Total con descuento: $${discountedPrice}</p>` : ''}
    `;

    const fileUri = FileSystem.documentDirectory + 'cotizacion_compra.html';
    try {
      await FileSystem.writeAsStringAsync(fileUri, htmlContent, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert('Cotización generada', `Archivo HTML guardado en: ${fileUri}`);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'La opción de compartir no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al generar la cotización:', error);
      Alert.alert('Error', 'Hubo un problema al generar la cotización.');
    }
  };

  const generateInvoice = async (order) => {
    const htmlContent = `
      <h1 style="text-align: center;">Factura de Compra</h1>
      <p>Usuario: ${userId}</p>
      <p>Fecha: ${new Date(order.fecha).toLocaleDateString()}</p>
      <h2>Productos Comprados:</h2>
      <ul>
        ${order.items
          .map(
            (item) =>
              `<li>${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio_unitario}</li>`
          )
          .join('')}
      </ul>
      <p>Total: $${order.total}</p>
    `;

    const fileUri = FileSystem.documentDirectory + `factura_${order.id}.html`;
    try {
      await FileSystem.writeAsStringAsync(fileUri, htmlContent, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'La opción de compartir no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al generar la factura:', error);
      Alert.alert('Error', 'Hubo un problema al generar la factura.');
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        'https://backendfitmrp-production.up.railway.app/api/carrito/update-item',
        { usuario_id: userId, producto_id: productId, cantidad: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCartItems();
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete('https://backendfitmrp-production.up.railway.app/api/carrito/remove-item', {
        headers: { Authorization: `Bearer ${token}` },
        data: { usuario_id: userId, producto_id: productId },
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const handlePayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'https://backendfitmrp-production.up.railway.app/api/carrito/checkout',
        { usuario_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Pago realizado con éxito', response.data.message);
      setCartItems([]);
      setTotalPrice(0);
      setDiscountedPrice(0);
      fetchCartItems();
      fetchOrderHistory();
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      Alert.alert('Error', 'Hubo un problema al procesar el pago.');
    }
  };

  // Nueva función para solicitar devolución
  const requestRefund = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'https://backendfitmrp-production.up.railway.app/api/devoluciones',
        { pedido_id: orderId, motivo: 'Solicitud de devolución', estado: 'pendiente' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Devolución solicitada exitosamente');
    } catch (error) {
      console.error('Error al solicitar devolución:', error);
      Alert.alert('Error', 'Hubo un problema al solicitar la devolución.');
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchOrderHistory();
  }, [fetchCartItems]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.nombre}</Text>
      <Text style={styles.itemPrice}>${Number(item.precio_unitario).toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleQuantityChange(item.producto_id, item.cantidad - 1)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.cantidad}</Text>
        <TouchableOpacity onPress={() => handleQuantityChange(item.producto_id, item.cantidad + 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item.producto_id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  // Modificación mínima en renderOrderItem para añadir el botón de "Pedir Devolución"
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text>Pedido ID: {item.id}</Text>
      <Text>Total: ${Number(item.total).toFixed(2)}</Text>
      <Text>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
      <View style={styles.orderActions}>
        <TouchableOpacity onPress={() => generateInvoice(item)} style={styles.invoiceButton}>
          <Text style={styles.invoiceButtonText}>Visualizar Factura</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => requestRefund(item.id)} style={styles.refundButton}>
          <Text style={styles.refundButtonText}>Pedir Devolución</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F00" />
      ) : (
        <>
          <Text style={styles.title}>Carrito de Compras</Text>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.producto_id.toString()}
            renderItem={renderItem}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${totalPrice}</Text>
            {totalPrice > 1500 && (
              <Text style={styles.discountText}>Descuento aplicado: ${discountedPrice}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={generateQuotation}>
            <Text style={styles.checkoutText}>Generar Cotización</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
            <Text style={styles.paymentText}>Pagar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.showOrdersButton}
            onPress={() => setShowOrderHistory(!showOrderHistory)}
          >
            <Text style={styles.showOrdersText}>{showOrderHistory ? 'Ocultar Facturas' : 'Mostrar Facturas'}</Text>
          </TouchableOpacity>
          {showOrderHistory && (
            <View style={styles.orderHistoryContainer}>
              <Text style={styles.historyTitle}>Historial de Pedidos</Text>
              <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrderItem}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#37474F' },
  showOrdersButton: { backgroundColor: '#2196F3', padding: 16, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  showOrdersText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  orderHistoryContainer: { marginTop: 20, backgroundColor: '#E8E8E8', padding: 16, borderRadius: 8 },
  historyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#37474F', textAlign: 'center' },
  orderContainer: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, marginBottom: 10 },
  orderActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  invoiceButton: { backgroundColor: '#FF9800', padding: 10, borderRadius: 8, alignItems: 'center', flex: 1, marginRight: 5 },
  invoiceButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  refundButton: { backgroundColor: '#FF5722', padding: 10, borderRadius: 8, alignItems: 'center', flex: 1 },
  refundButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default CartScreen;
