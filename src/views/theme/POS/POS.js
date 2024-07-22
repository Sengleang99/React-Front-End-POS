import React, { useState } from 'react';
import Items from './Items';
import Sales from './Sales';

function POS() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.products_id === product.products_id);
      if (existingItem) {
        return prevCart.map(item =>
          item.products_id === product.products_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.products_id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.products_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.products_id !== productId);
      }
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-lg-8'>
          <Items onAddToCart={handleAddToCart} />
        </div>
        <div className='col-lg-4'>
          <Sales cart={cart} setCart={setCart} onRemoveFromCart={handleRemoveFromCart} />
        </div>
      </div>
    </div>
  );
}

export default POS;
