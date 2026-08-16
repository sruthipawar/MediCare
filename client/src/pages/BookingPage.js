import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { DatePicker, TimePicker, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice'
import { setUser } from '../redux/features/userSlice'
import { fetchUser } from '../api'
import moment from 'moment'
const BookingPage = () => {
  const {user}=useSelector(state =>state.user)
  const [doctors,setDoctors]=useState([]);
  const params=useParams();
  const dispatch=useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchuser = await fetchUser();
        
         // Fetch user data from your backend using the fetchUser function
        dispatch(setUser(fetchuser));
      } catch (error) {
        // Handle error scenarios
        console.error(error);
      }
    };
    
    fetchData();
  }, [dispatch]);
  const [time,setTime]=useState();
  const [date,setdate]=useState();
  const navigate=useNavigate();
  const [isAvailaible,setisAvailable]=useState(false);

  //login user data
  const getUserData= async()=>{

    try {
      const res=await axios.post("http://localhost:8080/api/v1/doctor/getdoctorById",
      {doctorId:params.doctorId}, 
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        },
      });
      if(res.data.success)
        {
          setDoctors(res.data.data)
  
       }
     
      
    } catch (error) {
      console.log(error)
      
    }
  };
  useEffect(()=>{
    getUserData()
  
  },[])
//booking function
const handlebooking=async()=>{
  try 
  {
    
    if(!date && !time)
    {
      return alert("Date and time required");
    }
    dispatch(showLoading())
    const res=await axios.post(
      "http://localhost:8080/api/v1/user/book-appointment",
      {
        doctorId:params.doctorId,
        userId:user._id,
        doctorInfo:doctors,
        date:date,
        userInfo:user.data, 
        time:time,
      },
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        },
      }
    );
    dispatch(hideLoading());
    if(res.data.success)
    {
      message.success(res.data.message);
      navigate("/");

    }
    
  } catch (error) 
  {
    dispatch(hideLoading())
    console.log(error)
    
  }
} 
const handleAvailabilty=async()=>{
  try 
  {
    dispatch(showLoading())
    const res=await axios.post("http://localhost:8080/api/v1/user/booking-availibilty",{
      doctorId:params.doctorId,
      date: date.format('DD-MM-YYYY'),
      time: time.format("HH:mm"),
      
    },
    
    {
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      },

    });
    dispatch(hideLoading())
    if(res.data.success)
    {
      setisAvailable(true);
      
      message.success(res.data.message);
    }
    else
    {
      
      setisAvailable(false);
      message.error(res.data.message)
    } 
  } catch (error) 
  {
    
    setisAvailable(false);
    dispatch(hideLoading())
    console.log(error)
    
  }
}
  return (
    <Layout>
        <h3>Book an appointment</h3>
        <div className='container m-2'>
          {doctors && (
            <div>
              <h4>
                Dr. {doctors.firstName} {doctors.lastName} 
              </h4>
             <h4>Fees : {doctors.feesPerConsultation}</h4> 
                  
                <div className='d-flex flex-column w-50'>
                  <DatePicker
                  className="m-2"
                   format="DD-MM-YYYY" onChange={(value) =>
                        
                           setdate(value)
                        }/>
                  <TimePicker
                 className="m-2"
               format="HH:mm"
              onChange={(value) => setTime(value)}
                       />
                  <button className="btn btn-primary mt-2"
                     onClick={handleAvailabilty}
                     >
                    Check Availaibility
                  </button>
                  
                  <button
          className="btn btn-dark mt-2"
          onClick={handlebooking}
          disabled={isAvailaible}
        >
          Book now
        </button>

                  
                  
              </div>
              </div>
           )}
        </div>
    </Layout>
  )
}

export default BookingPage
