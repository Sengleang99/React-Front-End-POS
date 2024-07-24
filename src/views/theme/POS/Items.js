import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AudioOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Input, Card, List, Spin, message } from 'antd';

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1677ff',
    }}
  />
);

const Items = ({ onAddToCart }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getallproduct');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      message.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredData = data.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm) ||
    product.categories_name.toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className='site-layout-content'
      style={{
        padding: '24px',
        maxWidth: '100%',
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Search
        className='mt-3 mb-4'
        placeholder="Search products or category"
        onSearch={handleSearch}
        suffix={suffix}
        enterButton
        style={{ maxWidth: 400, margin: '0 auto' }}
      />
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={filteredData}
        pagination={{ pageSize: 6 }}
        renderItem={product => (
          <List.Item>
            <Card
              hoverable
              style={{
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              cover={
                <img
                  alt={product.product_name}
                  src={product.image ? `http://127.0.0.1:8000/storage/${product.image}` : 'https://via.placeholder.com/150'}
                  style={{  width:'100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                />
              }
              actions={[
                <ShoppingCartOutlined
                  key="add-to-cart"
                  onClick={() => onAddToCart(product)}
                  style={{ fontSize: '25px', color: '#84c2f5' }}
                />
              ]}
            >
              <h6 style={{ fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>{product.product_name}</h6>
              <p style={{ textAlign: 'center' }}>{product.description}</p>
              <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{product.price}$</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Items;