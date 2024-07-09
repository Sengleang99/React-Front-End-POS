import React, { useState } from 'react';
import Items from './Items';
import Sales from './Sales';

function POS() {
    const [cart, setCart] = useState([]);

    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product_id === product.product_id);
            if (existingItem) {
                // Update quantity if item already in cart
                return prevCart.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item to cart
                return [...prevCart, { ...product, quantity: 1 }];
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
                    <Sales cart={cart} />
                </div>
            </div>   
        </div>
    );
}

export default POS;
