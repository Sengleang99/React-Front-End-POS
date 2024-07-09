import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Spin, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are applied

const Customer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customersId, setCustomersId] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShow = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const handleEditShow = (customer) => {
    setCustomersId(customer.customers_id);
    form.setFieldsValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
    setIsModalVisible(true);
  };

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers function
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getcustomer');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching customers", error);
      messageApi.error('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  // Handle customer creation
  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/addcustomer', values);
      setData([...data, response.data]);
      resetForm();
      setIsModalVisible(false);
      messageApi.success('Customer added successfully!');
    } catch (error) {
      console.error("Error adding customer", error);
      messageApi.error('Failed to add customer.');
    }
  };

  // Handle customer update
  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/editcustomer/${customersId}`, values);
      const updatedData = data.map(customer =>
        customer.customers_id === customersId
          ? { ...customer, ...values }
          : customer
      );
      setData(updatedData);
      resetForm();
      setIsModalVisible(false);
      messageApi.success('Customer updated successfully!');
    } catch (error) {
      console.error("Error updating customer", error);
      messageApi.error('Failed to update customer.');
    }
  };

  // Handle customer deletion with confirmation
  const handleDelete = async (customersId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this customer?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deletecustomer/${customersId}`);
          setData(data.filter(customer => customer.customers_id !== customersId));
          messageApi.success('Customer deleted successfully!');
        } catch (error) {
          console.error("Error deleting customer", error);
          messageApi.error('Failed to delete customer.');
        }
      },
    });
  };

  // Reset form fields
  const resetForm = () => {
    setCustomersId(null);
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
      dataIndex: 'customers_id',
      key: 'customers_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Action',
      key: 'action',
      render: (customer) => (
        <span>
          <EditOutlined
            onClick={() => handleEditShow(customer)}
            style={{
              cursor: 'pointer',
              marginRight: '10px',
              color: 'green',
              fontSize: '20px',
            }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(customer.customers_id)}
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
        title={customersId ? 'Edit Customer' : 'Add New Customer'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={customersId ? handleUpdate : handleCreate}
          initialValues={{}}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the customer name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the customer email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input the customer phone!' }]}
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
        rowKey="customers_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Customer;
