import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useCart } from '../components/CartContent';
import globalStyles from '../styles/AllStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  HomeScreen: undefined;
  CheckoutScreen: { soloItem?: any };
};

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CheckoutScreen'>;
type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'CheckoutScreen'>;

interface Props {
  navigation: CheckoutScreenNavigationProp;
  route: CheckoutScreenRouteProp;
}

const CheckoutScreen: React.FC<Props> = ({ navigation, route }) => {
  const { cart, clearCart } = useCart();
  const { soloItem } = route.params;
  const displayedItems = soloItem ? [soloItem] : cart; // Only show soloItem if it exists

  const totalPrice = displayedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleCheckout = () => {
    if (!name || !phone || !address) {
      Alert.alert('Error', 'Please fill in all details.');
      return;
    }

    Alert.alert('Order Confirmed', `Thank you, ${name}! Your order will be delivered to:\n${address}.`, [
      {
        text: 'OK',
        onPress: () => {
          if (!soloItem) {
            clearCart(); // Only clear cart if this is a full order
          }
          navigation.navigate('HomeScreen');
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={globalStyles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.headerText}>
          Checkout ({displayedItems.reduce((sum, item) => sum + item.quantity, 0)})
        </Text>

        {displayedItems.length === 0 ? (
          <Text style={globalStyles.emptyCartText}>Your cart is empty.</Text>
        ) : (
          <>
            <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {displayedItems.map((item) => (
                <View key={item.id} style={globalStyles.item}>
                  <Image source={item.image} style={globalStyles.image} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={globalStyles.text}>{item.name}</Text>
                    <Text style={globalStyles.priceText}>₱{item.price * item.quantity} ({item.quantity})</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <Text style={globalStyles.totalPrice}>Total: ₱{totalPrice.toFixed(2)}</Text>

            <TextInput style={globalStyles.input} placeholder="Full Name" value={name} onChangeText={setName} returnKeyType="next" />
            <TextInput style={globalStyles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} returnKeyType="next" />
            <TextInput style={globalStyles.input} placeholder="Delivery Address" value={address} onChangeText={setAddress} multiline returnKeyType="done" />

            <TouchableOpacity
              style={[globalStyles.checkoutButton, (!name || !phone || !address) && globalStyles.disabledButton]}
              onPress={handleCheckout}
              disabled={!name || !phone || !address}
            >
              <Text style={globalStyles.buttonText}>Confirm Purchase</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CheckoutScreen;
