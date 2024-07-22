import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Product = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const [productId, setProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  // Modal state
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    form.resetFields();
  };

  const handleShow = () => {
    form.resetFields();
    setProductId(null);
    setShow(true);
  };

  const handleEditShow = (product) => {
    setProductId(product.products_id);
    form.setFieldsValue({
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      categories_id: product.categories_id,
      stock_quantity: product.stock_quantity,
    });
    setShow(true);
  };

  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch products function
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getallproduct');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      messageApi.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories function
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getcategory');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      messageApi.error('Failed to fetch categories.');
    }
  };

  // Handle product creation
  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/addproduct', {
        product_name: values.product_name,
        description: values.description,
        price: parseFloat(values.price),
        categories_id: parseInt(values.categories_id),
        stock_quantity: parseInt(values.stock_quantity),
      });
      // Update the data state with the new product
      setData([...data, response.data]);
      // Show success message
      messageApi.success('Product added successfully!');
      handleClose();
    } catch (error) {
      console.error("Error adding product", error);
      messageApi.error('Failed to add product.');
    }
  };

  // Handle product update
  const handleUpdate = async (values) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/editproduct/${productId}`, {
        product_name: values.product_name,
        description: values.description,
        price: parseFloat(values.price),
        categories_id: parseInt(values.categories_id),
        stock_quantity: parseInt(values.stock_quantity),
      });

      const updatedData = data.map((product) =>
        product.products_id === productId ? { ...product, ...values } : product
      );
      setData(updatedData);

      // Show success message
      messageApi.success('Product updated successfully!');
      handleClose();
    } catch (error) {
      console.error("Error updating product", error);
      messageApi.error('Failed to update product.');
    }
  };

  // Handle product deletion with confirmation
  const handleDelete = (productId) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deleteproduct/${productId}`);
          setData(data.filter(product => product.products_id !== productId));
          messageApi.success('Product deleted successfully!');
        } catch (error) {
          console.error("Error deleting product", error);
          messageApi.error('Failed to delete product.');
        }
      },
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const filteredData = data.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm)
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'products_id',
      key: 'products_id'
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Category',
      dataIndex: 'categories_id',
      key: 'categories_id',
      render: (text) => {
        const category = categories.find(c => c.categories_id === text);
        return category ? category.categories_name : 'Unknown';
      }
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity'
    },
    {
      title: 'Action',
      key: 'action',
      render: (product) => (
        <span>
          <EditOutlined
            onClick={() => handleEditShow(product)}
            style={{
              cursor: 'pointer',
              marginRight: '10px',
              color: 'green',
              fontSize: '20px',
            }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(product.products_id)}
            style={{ cursor: 'pointer', color: 'red', fontSize: '20px' }}
          />
        </span>
      ),
    }
  ]

  return (
    <div className='container-fluid'>
      {contextHolder}
      <Input.Search
        className='mt-3 mb-4'
        placeholder="Search products"
        enterButton
        onSearch={(value) => setSearchTerm(value.toLowerCase())}
        style={{ maxWidth: 400, margin: '0 auto' }}
      />
      <Button type="primary" onClick={handleShow} style={{ float: 'right', margin: '10px' }}>
        Create New
      </Button>

      <Modal
        title={productId ? 'Edit Product' : 'Add New Product'}
        open={show}
        onCancel={handleClose}
        footer={null}
      >
        <Form
          layout="horizontal"
          form={form}
          onFinish={productId ? handleUpdate : handleCreate}
        >
          <Form.Item
            label="Product Name"
            name="product_name"
            rules={[{ required: true, message: 'Please input the product name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="categories_id"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.categories_id} value={category.categories_id}>
                  {category.categories_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Stock Quantity"
            name="stock_quantity"
            rules={[{ required: true, message: 'Please input the stock quantity!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={handleClose} style={{ marginLeft: '8px' }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
         className='mt-3'
         dataSource={filteredData}
         columns={columns}
         rowKey="products_id"
         pagination={{ pageSize: 10 }}
      >
      </Table>
    </div>
  );
};

export default Product;
