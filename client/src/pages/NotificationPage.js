import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { Tabs, message } from 'antd'
import { fetchUser } from '../api';
import { setUser } from '../redux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
const NotificationPage = () => 
{
    const {user}=useSelector(state =>state.user)
    const dispatch=useDispatch()
    useEffect(() => {
        const fetchData = async () => {
          try {
            const user = await fetchUser();
            
            dispatch(setUser(user));
          } catch (error) {
            // Handle error scenarios
            console.error(error);
          }
        };
    
        fetchData();
      }, [dispatch]);
    const handleMarkAllRead=async()=>{
        try {
            dispatch(showLoading())
            const res = await axios.post("http://localhost:8080/api/v1/user/get-all-notifications",{userId:user._id},{
         headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
         },

      })
            dispatch(hideLoading())
            if(res.data.success)
              message.success(res.data.message)
              else
              message.error(res.data.message)
            
        } catch (error) {
            console.log(error)
            message.error("Something went wrong")
             
        }
    };
    const handleDeleteAllRead=async()=>{
      try 
      {
        dispatch(showLoading());
        const res = await axios.post("http://localhost:8080/api/v1/user/delete-all-notifications",
        {
          userId:user._id,
        },
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
         },

        })
        dispatch(hideLoading())
        if(res.data.success)
          message.success(res.data.message)
          else
          message.error(res.data.message)
        
      } catch (error) 
      {
        dispatch(hideLoading())
        console.log(error);
        message.error("Something went wrong")
        
      }
    };
  return (
    <Layout>
        <h4 className='p-3 text-center'>NotificationPage</h4>
    <Tabs>
<Tabs.TabPane tab="Unread" key={0}>
    <div className='d-flex justufy-content-end '>
        <h4 className='p-2 text-primary m-3' style={{cursor:"pointer"}} onClick={handleMarkAllRead}>
          Mark All read
        </h4>
    </div>
    {
      user?.data?.notification.map(notificationmsgs=>(
        <div className="card" style={{cursor:"pointer"}} >
          <div className="card-text" onClick={notificationmsgs.onClickPath}>
            {notificationmsgs.message
            }

          </div>


        </div>
      ))
        
    }
</Tabs.TabPane>
<Tabs.TabPane tab="Read" key={1}>
    <div className='d-flex justufy-content-end '>
        <h4 className='p-2 text-primary m-3' style={{cursor:"pointer"}} onClick={handleDeleteAllRead}>
       Delete All read
        </h4>
    </div>
    {
      user?.data?.seennotification.map(notificationmsgs=>(
        <div className="card" style={{cursor:"pointer"}} >
          <div className="card-text" onClick={notificationmsgs.onClickPath}>
            {notificationmsgs.message
            }

          </div>


        </div>
      ))
        
    }
</Tabs.TabPane>
    </Tabs>
        
    </Layout>
      
    
  )
}

export default NotificationPage
