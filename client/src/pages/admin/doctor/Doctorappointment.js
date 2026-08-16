import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import moment from 'moment'
import axios from 'axios'
import { Table, message } from 'antd'
const Doctorappointment = () => 
{
    const [appointments,setappointments]=useState([])
    const getappointments=async()=>{
        try
        {
            const res=await axios.get("http://localhost:8080/api/v1/doctor/doctor-appointments",
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
  const handleStaus=  async(record,status) =>
  {
    try 
    {
        const res=await axios.post("http://localhost:8080/api/v1/doctor/update-status",
        {
            appointmentsId:record._id, status
        },
        {
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
             },  
        });
        if(res.data.success)
        {
            message.success(res.data.message);
            getappointments();

        }
        
        
    } catch (error) {
        
    }

  }
    const columns=[
        {
            title:'ID',
            dataIndex:'_id'
        },
        
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
        {
            title:'Actions',
            dataIndex:'actions',
            render:(text,record)=>(
                <div className="d-flex">
                    {record.status==="pending"&&(
                        <div className="d-flex">
                            <button className='btn btn-success' onClick={()=>handleStaus(record,'approved')}>Approve</button>
                            <button className='btn btn-danger ms-2' onClick={()=>handleStaus(record,'reject')}>Reject</button>
                        </div>
                    )}
                   
                </div>
            ),

        },


    ]
  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table columns ={columns} dataSource={appointments}/>
    </Layout>
  )
}

export default Doctorappointment
