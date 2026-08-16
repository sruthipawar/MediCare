import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { fetchUser } from '../api';

export default function ProtectedRoute({ children }) {
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
    
    
      
  // Get user data
  //eslint-disable-next-line
  const getUser = async () => {
    try {
        dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/getUserData",
        {
          token: localStorage.getItem("token"),
        },
        {
          headers: {
            Authorization: `Bearer  ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading())
       
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else 
      {
        
         <Navigate to="/login" />;
      }
    } catch (error) 
    {
      dispatch(hideLoading())
      
      console.log(error);

    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user,getUser]);

  if (localStorage.getItem('token')) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
