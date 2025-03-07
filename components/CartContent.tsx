import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of a product in the cart
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: any;
}

// Define the context structure
interface CartContextType {
  cart: Product[];
  totalQuantity: number;
  addToCart: (product: Omit<Product, 'quantity'>) => void;
  updateQuantity: (productId: number, amount: number) => void;
  removeFromCart: (productId: number) => void;
  clearItemFromCart: (id: number) => void; // ✅ Added function
  clearCart: () => void;
}

// Create context
const CartContext = createContext<CartContextType | null>(null);

// Define provider props type
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const updateTotalQuantity = (cartItems: Product[]) => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(total);
  };

  const addToCart = (product: Omit<Product, 'quantity'>) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      if (!prevCart.some((item) => item.id === product.id)) {
        updatedCart.push({ ...product, quantity: 1 });
      }
      updateTotalQuantity(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (productId: number, amount: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0);
      updateTotalQuantity(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      updateTotalQuantity(updatedCart);
      return updatedCart;
    });
  };

  // ✅ Function to completely remove an item from the cart
  const clearItemFromCart = (id: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      updateTotalQuantity(updatedCart); // ✅ Fix: Update total quantity correctly
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setTotalQuantity(0);
  };

  return (
    <CartContext.Provider value={{ cart, totalQuantity, addToCart, updateQuantity, removeFromCart, clearItemFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
