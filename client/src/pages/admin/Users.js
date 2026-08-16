import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';

import { Table, Modal, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../api';
import { setUser } from '../../redux/features/userSlice';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const {user}=useSelector(state =>state.user)

  const dispatch=useDispatch()
  useEffect(() => {
      const fetchData = async () => {
        try {
          const user = await fetchUser();
          
           // Fetch user data from your backend using the fetchUser function
          dispatch(setUser(user));
        } catch (error) {
          // Handle error scenarios
          console.error(error);
        }
      };
  
      fetchData();
    }, [dispatch]);
  // Get users
  const getUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/admin/getAllUsers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) 
      {
        
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Handling block user
  const showConfirmModal = (userName) => {
    setUserToBlock(userName);
    setConfirmModalVisible(true);
  };

  const handleBlockUser = async (record) => {
    try {
      
      
      const res = await axios.post(
        'http://localhost:8080/api/v1/admin/blockUser',
        {
          userName: userToBlock,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message)
        setBlockedUsers([...blockedUsers, userToBlock]);
        setUsers(users.filter((user) => user.name !== userToBlock));
      }
      setConfirmModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  // Antd table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Doctor',
      dataIndex: 'isDoctor',
      render: (text, record) => (
        <span>
          {record.isDoctor ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger" onClick={() => showConfirmModal(record.name)}>
            Block
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Users List</h1>
      <Table columns={columns} dataSource={users} />

      <Modal
        title="Confirm Block User"
        visible={confirmModalVisible}
        onOk={handleBlockUser}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you really want to block this user?</p>
      </Modal>
    </Layout>
  );
};

export default Users;
