import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Spin, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Category = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const [categoriesId, setCategoriesId] = useState(null);
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
    setCategoriesId(null);
    setShow(true);
  };

  const handleEditShow = (category) => {
    setCategoriesId(category.categories_id);
    form.setFieldsValue({
      categories_name: category.categories_name,
      description: category.description,
    });
    setShow(true);
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories function
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getcategory');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      messageApi.open({
        type: 'error',
        content: 'Failed to fetch categories.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle category creation
  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/addcategory', values);
      setData([...data, response.data]);
      handleClose();
      messageApi.open({
        type: 'success',
        content: 'Category added successfully!',
      });
    } catch (error) {
      console.log("Error adding category", error);
      messageApi.open({
        type: 'error',
        content: 'Failed to add category.',
      });
    }
  };

  // Handle category update
  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/editcategory/${categoriesId}`, values);
      const updatedData = data.map((category) => 
        category.categories_id === categoriesId ? response.data : category
      );
      setData(updatedData);
      handleClose();
      messageApi.open({
        type: 'success',
        content: 'Category updated successfully!',
      });
    } catch (error) {
      console.log("Error updating category", error);
      messageApi.open({
        type: 'error',
        content: 'Failed to update category.',
      });
    }
  };

  // Handle category deletion with confirmation
  const handleDelete = (categoriesId) => {
    confirm({
      title: 'Are you sure you want to delete this category?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deletecategory/${categoriesId}`);
          setData(data.filter(category => category.categories_id !== categoriesId));
          messageApi.open({
            type: 'success',
            content: 'Category deleted successfully!',
          });
        } catch (error) {
          console.error("Error deleting category", error);
          messageApi.open({
            type: 'error',
            content: 'Failed to delete category.',
          });
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
        title={categoriesId ? 'Edit Category' : 'Add New Category'}
        open={show}
        onCancel={handleClose}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={categoriesId ? handleUpdate : handleCreate}
        >
          <Form.Item
            label="Category Name"
            name="categories_name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button onClick={handleClose} style={{ marginLeft: '8px' }}>
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>
          
      <Table
        dataSource={data}
        rowKey="categories_id"
        pagination={{ pageSize: 5 }}
      >
        <Table.Column title="Id" dataIndex="categories_id" key="categories_id" />
        <Table.Column title="Category Name" dataIndex="categories_name" key="categories_name" />
        <Table.Column title="Description" dataIndex="description" key="description" />
        <Table.Column
          title="Action"
          key="action"
          render={(text, category) => (
            <>
              <EditOutlined 
                onClick={() => handleEditShow(category)}
                style={{
                  cursor: 'pointer',
                  marginRight: '10px',
                  color: 'green',
                  fontSize: '18px',
                }}
              />
              <DeleteOutlined 
                onClick={() => handleDelete(category.categories_id)}
                style={{ cursor: 'pointer', color: 'red', fontSize: '18px' }}
              />
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default Category;
