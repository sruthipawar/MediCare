import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Row, Col, Button } from 'antd';
import DoctorList from '../components/DoctorList';
import DoctorList2 from '../components/DoctorList2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../api';
import { setUser } from '../redux/features/userSlice';

import './HomePage.css'; // Import the CSS file for custom styling
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate=useNavigate() 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser();
        dispatch(setUser(user));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);

  const getUserData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/user/getDoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    
    <Layout>
      
      <div className="homepage-container">
        <div className="hero-section">
          <h1>Welcome to MyDoctorApp</h1>
        </div>

        <div id="doctors" className="doctors-section">
          <h2>Find the Right Doctor for You</h2>
          <Row>
            {user?.data?.isDoctor ? (
              doctors.map((doctor) => <DoctorList2 doctor={doctor} />)
            ) : (
              doctors.map((doctor) => <DoctorList doctor={doctor} />)
            )}
          </Row>
        </div>
      
        
      </div>
      
    </Layout>
   
    
  );
}
