import React, { useState, useEffect } from 'react';
import { Input, InputNumber, Button, Form, Typography, Divider, Row, Col, Select, message, Spin } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

function Sales() {
  const [payment_methods, setpayment_method] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchPayment(), fetchCustomer()]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const fetchPayment = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getpayment');
      setpayment_method(response.data);
    } catch (error) {
      console.error("Error fetching payment", error);
      message.error('Failed to fetch payment.');
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getcustomer');
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer", error);
      message.error('Failed to fetch customer.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>Sales Order</Title>
      <Form layout="vertical">
        <Form.Item
          label="Customer"
          name="customers_id"
          rules={[{ required: true, message: 'Please select a customer!' }]}
        >
          <Select placeholder="Select Customer">
            {customer.map((customer) => (
              <Select.Option key={customer.customers_id} value={customer.customers_id}>
                {customer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Payment"
          name="payment_methods_id"
          rules={[{ required: true, message: 'Please select a payment method!' }]}
        >
          <Select placeholder="Select Payment Method">
            {payment_methods.map((payment) => (
              <Select.Option key={payment.payment_methods_id} value={payment.payment_methods_id}>
                {payment.method_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Order Status" required>
          <Input placeholder="Enter order status" />
        </Form.Item>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Text>Sub Total</Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text type="danger">100$</Text>
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ marginTop: '8px' }}>
          <Col span={12}>
            <Text>Discount</Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <InputNumber
              size="small"
              min={0}
              style={{ width: '100%' }}
              placeholder="0"
            />
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ marginTop: '8px' }}>
          <Col span={12}>
            <Text>Tax</Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <InputNumber
              size="small"
              min={0}
              style={{ width: '100%' }}
              placeholder="0"
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16} style={{ marginTop: '24px', marginBottom: '16px' }}>
          <Col span={12}>
            <Title level={5}>Total</Title>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Title level={5} type="danger">1500$</Title>
          </Col>
        </Row>
        <Button type="primary" block>Check Out</Button>
      </Form>
    </div>
  );
}

export default Sales;
