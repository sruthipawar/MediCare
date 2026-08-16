import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import {Form,Col,Row,Input, TimePicker, message} from "antd"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { fetchUser } from '../api';
import { setUser } from '../redux/features/userSlice';
import moment from 'moment'
function ApplyDoctor() 
{
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
      
    const navigate=useNavigate()
    const handleFinish= async (values)=>{
        try {
      dispatch(showLoading())
      const startTime = moment(values.timings[0]).format("HH:mm");
    const endTime = moment(values.timings[1]).format("HH:mm");

    const res = await axios.post(
      "http://localhost:8080/api/v1/user/apply-doctor",
      {
        ...values,
        userId: user._id,
        timings: [startTime, endTime],
      },
      {
         headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
         },

      })
      dispatch(hideLoading());
      if(res.data.success)
      {
      message.success("Doctor Applied Successfully")
      navigate("/");
      }
      else
      message.error(res.data.success)
            
        } catch (error) {
            dispatch(hideLoading());

           // console.log(error)
            console.log(error.response.data) 
            message.error("Something went wrong")
            
        }
    };
  return (
    <Layout>
    <h1 className="text-center">ApplyDoctor</h1>
    <Form layout="vertical" onFinish={handleFinish} className='m-3'>
        <h4 className=" ">Personal Details :</h4>
        <Row gutter={15}>
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="First Name" name="firstName" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your name"/>
                </Form.Item>
            </Col>
            
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Last Name" name="lastName" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your name"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Phone no" name="phone" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your phone"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Email" name="email" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your email"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Address" name="address" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your address"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Website" name="website" > 
                 <Input type ="text" placeholder="Your website"/>
                </Form.Item>
            </Col>

        </Row>
        <h4 className=" ">Professional Details :</h4>
        <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Specialization" name="specialization" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your specialization"/>
                </Form.Item>
            </Col>
            
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Experience" name="experience" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your experience"/>
                </Form.Item>
            </Col>
            
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="FeesPerConsultation" name="feesPerConsultation" required rules={[{required:true}]}> 
                 <Input type ="text" placeholder="Your FeesPerConsultation"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
                <Form.Item label="Timings" name="timings" required > 
                  <TimePicker.RangePicker format="HH:mm"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
            <button className="btn btn-primary form-btn" type="submit">
                Submit
            </button>
            </Col>
        </Row>

    </Form>
    </Layout>
  )
}

export default ApplyDoctor