import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useCart } from '../components/CartContent';
import globalStyles from '../styles/AllStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  HomeScreen: undefined;
  CartScreen: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

// Define product type
interface Product {
  id: number;
  name: string;
  price: number;
  image: any;
}

const products: Product[] = [
  { id: 1, name: 'Iphone 16', price: 60000, image: require('../assets/iphone 16.jpg') },
  { id: 2, name: 'Acoustic Guitar', price: 15000, image: require('../assets/acoustic guitar.jpg') },
  { id: 3, name: 'Electric Guitar', price: 20000, image: require('../assets/electric guitar.jpg') },
  { id: 4, name: 'Keyboard', price: 5000, image: require('../assets/keyboard.jpg') },
  { id: 5, name: 'Monitor', price: 10000, image: require('../assets/monitor.jpg') },
  { id: 6, name: 'Acer Laptop', price: 40000, image: require('../assets/acer laptop.jpeg') },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { cart, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0); // ✅ Total amount

  // Sort products based on price
  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === 'asc' ? a.price - b.price : b.price - a.price
  );

  return (
    <View style={globalStyles.container}>
      {/* Header Container for Filter and Cart */}
      <View style={globalStyles.headerContainer}>
        {/* Filter Button */}
        <TouchableOpacity
          style={globalStyles.filterButton}
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Ionicons name="filter-outline" size={24} color="white" />
          <Text style={globalStyles.buttonText}>
            {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
          </Text>
        </TouchableOpacity>

        {/* Cart Icon with Quantity Badge */}
        <TouchableOpacity style={globalStyles.cartIcon} onPress={() => setCartVisible(true)}>
          <Ionicons name="cart-outline" size={28} color="black" />
          {totalQuantity > 0 && (
            <View style={globalStyles.cartBadge}>
              <Text style={globalStyles.cartBadgeText}>{totalQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={sortedProducts} // ✅ Using sorted list
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedProduct(item)}>
            <View style={globalStyles.item}>
              <Image source={item.image} style={globalStyles.image} />
              <Text style={globalStyles.text}>{item.name} - ₱{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Product Modal */}
      <Modal visible={!!selectedProduct} transparent animationType="slide">
        <View style={globalStyles.modalContainer}>
          {selectedProduct && (
            <View style={globalStyles.modalContent}>
              <Image source={selectedProduct.image} style={globalStyles.modalImage} />
              <Text style={globalStyles.text}>{selectedProduct.name}</Text>
              <Text style={globalStyles.text}>Price: ₱{selectedProduct.price}</Text>

              {/* Add to Cart Button */}
              <TouchableOpacity
                style={globalStyles.buttonPrimary}
                onPress={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <Text style={globalStyles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={globalStyles.buttonDanger}
                onPress={() => setSelectedProduct(null)}
              >
                <Text style={globalStyles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* Cart Modal */}
      <Modal visible={cartVisible} transparent animationType="fade">
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.cartModalContent}>
            <Text style={globalStyles.headerText}>Cart Items ({totalQuantity})</Text>

            {cart.length === 0 ? (
              <Text style={globalStyles.emptyCartText}>Your cart is empty.</Text>
            ) : (
              <>
                <FlatList
                  data={cart} // ✅ Ensure correct cart data is displayed
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={globalStyles.cartItem}>
                      <Image source={item.image} style={globalStyles.cartItemImage} />
                      <Text style={globalStyles.text}>
                        {item.name} (x{item.quantity}) 
                      </Text>
                      <Text style={globalStyles.priceText}>₱{item.price * item.quantity}</Text>
                    </View>
                  )}
                />
                
                {/* Total Amount */}
                <View style={globalStyles.totalPrice}>
                  <Text style={globalStyles.priceText}>Total: ₱{totalPrice}</Text>
                </View>
              </>
            )}

            {/* Close Cart Button */}
            <TouchableOpacity
              style={globalStyles.buttonDanger}
              onPress={() => setCartVisible(false)}
            >
              <Text style={globalStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Go to Cart Button */}
      <TouchableOpacity
        style={globalStyles.buttonPrimary}
        onPress={() => navigation.navigate('CartScreen')}
      >
        <Text style={globalStyles.buttonText}>Go to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
