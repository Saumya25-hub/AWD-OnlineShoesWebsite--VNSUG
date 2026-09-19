import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shoeCartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoeCartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems((prevItems) => {
      // Find if item with same productId and same size already exists
      const existingIndex = prevItems.findIndex(
        (item) => item.product === product._id && item.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category?.name || 'Shoe',
            size: size || (product.sizes && product.sizes[0]) || '8',
            quantity: Number(quantity),
            stock: product.stock
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId && item.size === size) {
          return { ...item, quantity: Math.min(newQty, item.stock || 99) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product === productId && item.size === size))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
