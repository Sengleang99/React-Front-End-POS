import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Spin, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { useForm } = Form;

const Employee = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getemployee');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
      messageApi.error('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    const values = form.getFieldsValue();
    try {
      if (employeeId) {
        await axios.put(`http://127.0.0.1:8000/api/editemployee/${employeeId}`, values);
        setData(data.map(employee =>
          employee.employees_id === employeeId
            ? { ...employee, ...values }
            : employee
        ));
        messageApi.success('Employee updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/addemployee', values);
        setData([...data, response.data]);
        messageApi.success('Employee added successfully!');
      }
      handleClose();
    } catch (error) {
      console.error("Error saving employee", error);
      messageApi.error('Failed to save employee.');
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deleteemployee/${employeeId}`);
      setData(data.filter(employee => employee.employees_id !== employeeId));
      messageApi.success('Employee deleted successfully!');
    } catch (error) {
      console.error("Error deleting employee", error);
      messageApi.error('Failed to delete employee.');
    }
  };

  const handleEditShow = (employee) => {
    setEmployeeId(employee.employees_id);
    form.setFieldsValue(employee);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setEmployeeId(null);
    form.resetFields();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className='container-fluid'>
      {contextHolder}
      <Input.Search
        className='mt-3 mb-4'
        placeholder="Search products"
        enterButton
        style={{ maxWidth: 400, margin: '0 auto' }}
      />
        <Button type="primary" onClick={() => setVisible(true)} style={{float:'inline-end', margin:'10px'}}>
          Create New
        </Button>
      
      <Modal
        title={employeeId ? 'Edit Employee' : 'Add New Employee'}
        open={visible}
        onCancel={handleClose}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: 'Please input the position!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {employeeId ? 'Update Employee' : 'Add Employee'}
            </Button>
            <Button onClick={handleClose} style={{ marginLeft: '8px' }}>
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={data} rowKey="employees_id" pagination={{ pageSize: 5 }}>
        <Table.Column title="Id" dataIndex="employees_id" key="employees_id" />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Position" dataIndex="position" key="position" />
        <Table.Column title="Email" dataIndex="email" key="email" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, employee) => (
            <>
              <EditOutlined 
                onClick={() => handleEditShow(employee)}
                style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }}
              />
              <Popconfirm
                title="Are you sure to delete this employee?"
                onConfirm={() => handleDelete(employee.employees_id)}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined
                  style={{ cursor: 'pointer', color: 'red' }}
                />
              </Popconfirm>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default Employee;
