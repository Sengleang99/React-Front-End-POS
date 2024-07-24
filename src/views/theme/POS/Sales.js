import React, { useState, useEffect, useRef } from 'react';
import { InputNumber, Button, Form, Typography, Divider, Row, Col, Select, List, message, Spin, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { MinusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Sales = ({ cart, setCart }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [form] = Form.useForm();
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchPaymentMethods(), fetchCustomers(), fetchOrderStatuses()]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getpayment');
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Error fetching payment methods", error);
      message.error('Failed to fetch payment methods.');
    }
  };

  const fetchOrderStatuses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/readorderStatus');
      setOrderStatuses(response.data);
    } catch (error) {
      console.error("Error fetching order statuses", error);
      message.error('Failed to fetch order statuses.');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getcustomer');
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers", error);
      message.error('Failed to fetch customers.');
    }
  };

    // function calculate total price and another
  const calculateSubTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const totalAfterDiscount = subTotal - (discount * subTotal / 100);
    const totalWithTax = totalAfterDiscount + (totalAfterDiscount * tax / 100);
    return totalWithTax;
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
    // function add sales products
    const handleCheckOut = async () => {
      try {
          const values = await form.validateFields();
          const total = calculateTotal();
          const order_date = moment().format('YYYY-MM-DD'); // Changed date format to match SQL standard
  
          if (cart.length === 0) {
              message.error('Cart is empty.');
              return;
          }
  
          // data from field database
          const orderData = {
              customers_id: values.customers_id,
              payment_methods_id: values.payment_methods_id,
              order_statuses_id: values.order_statuses_id,
              order_date: order_date,
              total: total,
              items: cart.map(item => ({
                  products_id: item.products_id,
                  quantity: item.quantity,
                  price: item.price
              }))
          };
  
          console.log(orderData);
  
          // fetch API
          const response = await axios.post('http://127.0.0.1:8000/api/addorder', orderData);
  
          if (response.status === 201) {
              message.success('Order placed successfully!');
              setCart([]); // Clear cart after successful order
              setOrderData({ ...orderData, totalItems: calculateTotalItems(), subTotal: calculateSubTotal() }); // Store order data for the invoice
              setInvoiceVisible(true); // Show the invoice modal
          } else {
              message.error('Failed to place order.');
          }
      } catch (error) {
          if (error.response && error.response.data) {
              message.error(`Error placing order: ${error.response.data.message}`);
          } else {
              console.error("Error placing order", error);
              message.error('Failed to place order.');
          }
      }
  };
  
  // remove item product
  const handleRemoveItem = (productId) => {
    const updatedCart = cart.map(item => {
      if (item.products_id === productId) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(item => item.quantity > 0);
    setCart(updatedCart);
  };

  // print invioce when we add cash
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
      <Form form={form} layout="vertical">
        <Form.Item
          name="customers_id"
          label="Customer"
          rules={[{ required: true, message: 'Please select a customer!' }]}
        >
          <Select placeholder="Select a customer">
            {customers.map((customer) => (
              <Select.Option key={customer.customers_id} value={customer.customers_id}>
                {customer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="payment_methods_id"
          label="Payment Method"
          rules={[{ required: true, message: 'Please select a payment method!' }]}
        >
          <Select placeholder="Select a payment method">
            {paymentMethods.map((payment) => (
              <Select.Option key={payment.payment_methods_id} value={payment.payment_methods_id}>
                {payment.method_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="order_statuses_id"
          label="Order Status"
          rules={[{ required: true, message: 'Please select an order status!' }]}
        >
          <Select placeholder="Select an order status">
            {orderStatuses.map((orderstatus) => (
              <Select.Option key={orderstatus.order_statuses_id} value={orderstatus.order_statuses_id}>
                {orderstatus.status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Divider />
        <List
          header={<div>Order Items</div>}
          dataSource={cart}
          renderItem={item => (
            <List.Item>
              <Row style={{ width: '100%' }}>
                <Col span={12}>
                  <Text>{item.product_name}</Text>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Text>${item.price}</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Text>{item.quantity}</Text>
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  <Button type="link" icon={<MinusOutlined style={{ color: 'red' }} />} onClick={() => handleRemoveItem(item.products_id)} />
                </Col>
              </Row>
            </List.Item>
          )}
        />
        <Divider />
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Text>Sub Total</Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>${calculateSubTotal().toFixed(2)}</Text>
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
              value={discount}
              onChange={setDiscount}
              style={{ width: '100%' }}
              placeholder="0"
            />
          </Col>
        </Row>
        <Row gutter={16} align="middle" style={{ marginTop: '8px' }}>
          <Col span={12}>
            <Text>Tax (%)</Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <InputNumber
              size="small"
              min={0}
              value={tax}
              onChange={setTax}
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
            <Title level={5} type="danger">${calculateTotal().toFixed(2)}</Title>
          </Col>
        </Row>
        <Button type="primary" block onClick={handleCheckOut} disabled={cart.length === 0}>Check Out</Button>
      </Form>
      {orderData && (
        <Modal
          title="Invoice"
          visible={invoiceVisible}
          onCancel={() => setInvoiceVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setInvoiceVisible(false)}>
              Cancel
            </Button>,
            <Button key="print" type="primary" onClick={handlePrint}>
              Print
            </Button>,
          ]}
        >
          <div ref={invoiceRef} style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>Invoice</Title>
            <Text><b>Customer:</b> {customers.find(customer => customer.customers_id === orderData.customers_id)?.name}</Text><br />
            <Text><b>Order Date:</b> {orderData.order_date}</Text><br />
            <Text><b>Payment Method:</b> {paymentMethods.find(payment => payment.payment_methods_id === orderData.payment_methods_id)?.method_name}</Text><br />
            <Text><b>Order Status:</b> {orderStatuses.find(status => status.order_statuses_id === orderData.order_statuses_id)?.status}</Text>
            <Divider />
            <List
              header={<div>Order Items</div>}
              dataSource={orderData.items}
              renderItem={item => (
                <List.Item>
                  <Row style={{ width: '100%' }}>
                    <Col span={12}>
                      <Text>{item.products_id}</Text>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      <Text>${item.price}</Text>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      <Text>{item.quantity}</Text>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
            <Divider />
            <Row gutter={16} align="middle">
              <Col span={12}>
                <Text>Sub Total</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>${orderData.subTotal.toFixed(2)}</Text>
              </Col>
            </Row>
            <Row gutter={16} align="middle" style={{ marginTop: '8px' }}>
              <Col span={12}>
                <Text>Discount</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>${discount.toFixed(2)}</Text>
              </Col>
            </Row>
            <Row gutter={16} align="middle" style={{ marginTop: '8px' }}>
              <Col span={12}>
                <Text>Tax</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>${tax.toFixed(2)}</Text>
              </Col>
            </Row>
            <Row gutter={16} align="middle" style={{ marginTop: '8px' }}>
              <Col span={12}>
                <Text>Total Items</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>{orderData.totalItems}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16} style={{ marginTop: '24px', marginBottom: '16px' }}>
              <Col span={12}>
                <Title level={5}>Total to pay</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={5} type="danger">${orderData.total.toFixed(2)}</Title>
              </Col>
            </Row>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Sales;
