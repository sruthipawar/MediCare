import React,{useEffect,useState} from 'react'
import Layout from '../../components/Layout'
import axios from "axios";
import { Modal, Table, message } from 'antd';
const Doctors = () => 
{
  const [doctors, setdoctors]=useState([])
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  //get users
  const getDoctors=async()=>{
    try {
      const res=await axios.get("http://localhost:8080/api/v1/admin/getAllDoctors",
     { 
      headers: {
        Authorization:`Bearer ${localStorage.getItem("token")}`
     },
    })
    if(res.data.success)
    {
      setdoctors(res.data.data)
    }
    } catch (error) 
    {
      console.log(error)
      
    }
  };
  //handling rejected doctors
  const showConfirmModal = (userName) => {
    setUserToBlock(userName);
    setConfirmModalVisible(true);
  };
  //account handle
  const handleAccountStatus=async(record,status)=>{
   try {
    const res=await axios.post("http://localhost:8080/api/v1/admin/changeAccountStatus",
      {  doctorId: record._id, userId:record.userId, status: status},
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        }
    
    )
      if(res.data.success)
      {
        message.succes("Account Status updated");
        window.location.reload();
      }
    
   } catch (error)
    {
      console.log(error);
    
   }
  }
  useEffect(()=>{
    getDoctors()
  },[]);
  const handleBlockUser=async(record)=>{
    try {
      
      
      const res = await axios.post(
        'http://localhost:8080/api/v1/admin/rejectdoctor',
        {
          doctorId: record._id,
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
  }
  const handleCancel = () => {
    setConfirmModalVisible(false);
  };
  const columns =[
    {
      title:'Name',
      dataIndex:'name',
      render:(text,record)=>(
        <span>
          {record.firstName} {record.lastName}
        </span>
      )
    },
    {
      title:'Status',
      dataIndex:'status'
    },
    {
      title:'Phone',
      dataIndex:'phone'

    },
    {
      title:'Actions',
      dataIndex:'actions',
      render:(text,record)=>(
        <div className="d-flex">
          {record.status==='pending'?<button className="btn btn-success " onClick={()=> handleAccountStatus(record,'approved')}>Approve</button>:<button className="btn btn-danger"  onClick={() => showConfirmModal(record.name)}>Reject</button>}

        </div>
      )

    }

  ]
  return (
    <Layout>
     <h1 className ="text-center m-2">Doctors List</h1>
     <Table columns ={columns} dataSource={doctors}/>
     <Modal
        title="Confirm Block User"
        visible={confirmModalVisible}
        onOk={handleBlockUser}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you really want to reject  this doctor's approval?</p>
      </Modal>
     </Layout>
  )
}

export default Doctors
