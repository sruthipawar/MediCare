import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios';

const UserFeedback = () => 
{
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/admin/get-feedback',
        { 
          headers: {
            Authorization:`Bearer ${localStorage.getItem("token")}`
         },
        });
        if(res.data.success)
            {
                setFeedbacks(res.data.data);

            }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Layout>
        <div>
      <h1>Admin Profile</h1>
      <h2>User Feedbacks</h2>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id}>{feedback.text}</li>
        ))}
      </ul>
    </div>
    </Layout>
  )
}

export default UserFeedback


 
