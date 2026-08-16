import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import moment from 'moment'
import { Table } from 'antd'
const Appointments = () =>
 
{
    const [appointments,setappointments]=useState([])
    const getappointments=async()=>{
        try
        {
            const res=await axios.get("http://localhost:8080/api/v1/user/appointments-list",
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                 },
            })
            if(res.data.success)
            {
                setappointments(res.data.data);

            }
            
        } catch (error)
         {
            console.log(error);
            
        }
    };
    useEffect(() =>{
        getappointments()
    },[]);
    const columns=[
        {
            title:'ID',
            dataIndex:'_id'
        },
        /*{
            title:'Name',
            dataIndex:'name',
            render:(text,record)=>(
                <span>
                    {record.doctorId.firstName} {record.doctorId.lastName} 
                </span>
            ),

        },
        {
            title:'Phone',
            dataIndex:'photo',
            render:(text,record)=>(
                <span>
                    {record.doctorId.phone} 
                </span>
            ),

        },*/
        {
            title:'Date and Time',
            dataIndex:'date',
            render:(text,record)=>(
                <span>
                    {moment(record.date).format("DD-MM-YYYY")} &nbsp;
                    {moment(record.time).format("HH:mm")}
                </span>
            ),

        },
        {
            title:'Status',
            dataIndex:'status'
        },

    ]
  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table columns ={columns} dataSource={appointments}/>

      
    </Layout>
  )
}

export default Appointments
