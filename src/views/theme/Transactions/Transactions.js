import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Spin, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import moment from 'moment'; // Import moment for date formatting

const Transactions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getorder');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      messageApi.error('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (order) => {
    setCurrentOrder(order);
    form.setFieldsValue({
      ...order,
      order_date: moment(order.order_date), // Set date for DatePicker
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/editorder/${currentOrder.orders_id}`, values);
      setData(data.map(order => (order.orders_id === currentOrder.orders_id ? { ...order, ...values } : order)));
      messageApi.success('Order updated successfully!');
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating order:', error);
      messageApi.error('Failed to update order.');
    }
  };

  const handleDelete = (orders_id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this order?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deleteorder/${orders_id}`);
          setData(data.filter(order => order.orders_id !== orders_id));
          messageApi.success('Order deleted successfully!');
        } catch (error) {
          console.error('Error deleting order:', error);
          messageApi.error('Failed to delete order.');
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

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orders_id',
      key: 'orders_id',
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
        title: 'price',
        dataIndex: 'price',
        key: 'price',
      },
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Payment Method',
      dataIndex: 'method_name',
      key: 'method_name',
    },
 
    {
      title: 'Order Date',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (text) => moment(text).format('YYYY-MM-DD'), // Format date
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Action',
      key: 'action',
      render: (order) => (
        <span>
          <EditOutlined
            onClick={() => showEditModal(order)}
            style={{ cursor: 'pointer', marginRight: 10, color: 'green', fontSize: 20 }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(order.orders_id)}
            style={{ cursor: 'pointer', color: 'red', fontSize: 20 }}
          />
        </span>
      ),
    },
  ];

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
      <Table
        columns={columns}
        dataSource={data}
        rowKey="orders_id"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={handleUpdate}
          layout="horizontal"
        >
          <Form.Item name="product_name" label="Product">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Customer">
            <Input />
          </Form.Item>
          <Form.Item name="method_name" label="Payment Method">
            <Input />
          </Form.Item>
          <Form.Item name="orders_status_id" label="Order Status">
            <InputNumber />
          </Form.Item>
          <Form.Item name="order_date" label="Order Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="total" label="Total">
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Transactions;
