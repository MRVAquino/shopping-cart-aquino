import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../components/CartContent';
import globalStyles from '../styles/AllStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Define navigation type
type RootStackParamList = {
  CartScreen: undefined;
  CheckoutScreen: { soloItem?: any };
};

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CartScreen'>;

interface Props {
  navigation: CartScreenNavigationProp;
}

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { cart, addToCart, removeFromCart, clearItemFromCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleDeleteItem = (id: number) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item completely?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => {
          clearItemFromCart(id);
          setSelectedItem(null);
          setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
        },
      },
    ]);
  };

  const handleSoloOrder = (item: any) => {
    Alert.alert(
      'Solo Order',
      `Do you want to order only ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Order',
          onPress: () => {
            navigation.navigate('CheckoutScreen', { soloItem: { ...item, quantity: 1 } });
          },
        },
      ]
    );
  };

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedAll(false);
      setSelectedItems([]);
    } else {
      setSelectedAll(true);
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert('Delete Selected', 'Are you sure you want to delete all selected items?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          selectedItems.forEach((id) => clearItemFromCart(id));
          setSelectedItems([]);
          setSelectedAll(false);
        },
      },
    ]);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Your Cart</Text>
      <Text style={globalStyles.totalItemsText}>Total Items: {totalItems}</Text>

      {cart.length === 0 ? (
        <Text style={globalStyles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          {/* Select All & Delete All Buttons */}
          <View style={globalStyles.actionRow}>
            <TouchableOpacity style={globalStyles.selectAllButton} onPress={handleSelectAll}>
              <Ionicons name={selectedAll ? 'checkbox' : 'square-outline'} size={24} color="black" style={{ marginRight: 8 }} />
              <Text style={globalStyles.buttonText}>Select All</Text>
            </TouchableOpacity>

            {selectedItems.length > 1 && (
              <TouchableOpacity style={globalStyles.deleteAllButton} onPress={handleDeleteSelected}>
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text style={globalStyles.buttonText}>Delete All</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedItems.includes(item.id);

              return (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedItems((prev) =>
                      isSelected ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                    )
                  }
                >
                  <View style={[globalStyles.item, isSelected ? globalStyles.selectedItem : {}]}>
                    <Image source={item.image} style={globalStyles.image} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={globalStyles.text}>
                        {item.name} <Text style={globalStyles.quantityLabel}>x{item.quantity}</Text>
                      </Text>
                      <Text style={globalStyles.priceText}>₱{item.price * item.quantity}</Text>

                      {/* Quantity Controls */}
                      <View style={globalStyles.quantityContainer}>
                        <TouchableOpacity
                          onPress={() => removeFromCart(item.id)}
                          style={globalStyles.quantityButton}
                        >
                          <Ionicons name="remove-circle-outline" size={24} color="red" />
                        </TouchableOpacity>

                        <Text style={globalStyles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                          onPress={() => addToCart(item)}
                          style={globalStyles.quantityButton}
                        >
                          <Ionicons name="add-circle-outline" size={24} color="green" />
                        </TouchableOpacity>
                      </View>

                      {/* Action Buttons - Only show if selected */}
                      {isSelected && (
                        <View style={globalStyles.actionContainer}>
                          <TouchableOpacity
                            style={globalStyles.deleteButton}
                            onPress={() => handleDeleteItem(item.id)}
                          >
                            <Ionicons name="trash-outline" size={24} color="white" />
                            <Text style={globalStyles.buttonText}>Delete</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={globalStyles.soloOrderButton}
                            onPress={() => handleSoloOrder(item)}
                          >
                            <Ionicons name="cart-outline" size={24} color="white" />
                            <Text style={globalStyles.buttonText}>Solo Order</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* Go to Checkout Button */}
          <TouchableOpacity 
            style={globalStyles.buttonPrimary} 
            onPress={() => navigation.navigate('CheckoutScreen', { soloItem: undefined })}
          >
            <Text style={globalStyles.buttonText}>Go to Checkout</Text>
          </TouchableOpacity>

        </>
      )}
    </View>
  );
};

export default CartScreen;
