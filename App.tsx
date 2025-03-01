import react from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './components/CartContent';
import HomeScreen from './components/HomeScreen';
import CartScreen from './components/CartScreen';
import CheckoutScreen from './components/CheckoutScreen';

const Stack = createStackNavigator();

const app = () => (
  <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{title: 'Home'}}/>
        <Stack.Screen name="CartScreen" component={CartScreen} options={{title: 'Cart'}}/>
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{title: 'Checkout'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  </CartProvider>
);

export default App;