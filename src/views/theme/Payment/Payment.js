import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Spin, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are applied

const Payment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methodName, setMethodName] = useState(''); // Renamed to methodName for consistency
  const [paymentMethodsId, setPaymentMethodsId] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShow = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const handleEditShow = (payment) => {
    setPaymentMethodsId(payment.payment_methods_id);
    form.setFieldsValue({
      method_name: payment.method_name,
    });
    setIsModalVisible(true);
  };

  // Fetch payment methods on mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch payment methods function
  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getpayment');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching payments", error);
      messageApi.error('Failed to fetch payment methods.');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment method creation
  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/addpayment', {
        method_name: values.method_name
      });
      setData([...data, response.data]);
      resetForm();
      setIsModalVisible(false);
      messageApi.success('Payment method added successfully!');
    } catch (error) {
      console.error("Error adding payment method", error);
      messageApi.error('Failed to add payment method.');
    }
  };

  // Handle payment method update
  const handleUpdate = async (values) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/editpayment/${paymentMethodsId}`, {
        method_name: values.method_name
      });
      const updatedData = data.map(payment =>
        payment.payment_methods_id === paymentMethodsId
          ? { ...payment, method_name: values.method_name }
          : payment
      );
      setData(updatedData);
      resetForm();
      setIsModalVisible(false);
      messageApi.success('Payment method updated successfully!');
    } catch (error) {
      console.error("Error updating payment method", error);
      messageApi.error('Failed to update payment method.');
    }
  };

  // Handle payment method deletion with confirmation
  const handleDelete = async (paymentMethodsId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this payment method?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deletepayment/${paymentMethodsId}`);
          setData(data.filter(payment => payment.payment_methods_id !== paymentMethodsId));
          messageApi.success('Payment method deleted successfully!');
        } catch (error) {
          console.error("Error deleting payment method", error);
          messageApi.error('Failed to delete payment method.');
        }
      },
    });
  };

  // Reset form fields
  const resetForm = () => {
    setPaymentMethodsId(null);
    form.resetFields();
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
      title: 'Id',
      dataIndex: 'payment_methods_id',
      key: 'payment_methods_id',
    },
    {
      title: 'Payment Method',
      dataIndex: 'method_name',
      key: 'method_name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (payment) => (
        <span>
          <EditOutlined
            onClick={() => handleEditShow(payment)}
            style={{
              cursor: 'pointer',
              marginRight: '10px',
              color: 'green',
              fontSize: '20px',
            }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(payment.payment_methods_id)}
            style={{ cursor: 'pointer', color: 'red', fontSize: '20px' }}
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
        style={{ maxWidth: 400, margin: '0 auto' }}
      />
      <Button type="primary" onClick={handleShow} style={{float:'inline-end', margin:'10px'}}>
        Create New
      </Button>
      <Modal
        title={paymentMethodsId ? 'Edit Payment Method' : 'Add New Payment Method'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={paymentMethodsId ? handleUpdate : handleCreate}
          initialValues={{}}
        >
          <Form.Item
            label="Payment Method Name"
            name="method_name"
            rules={[{ required: true, message: 'Please input the payment method name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      <Table
        className='mt-3'
        dataSource={data}
        columns={columns}
        rowKey="payment_methods_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Payment;
