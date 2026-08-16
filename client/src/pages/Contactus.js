import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './ContactUs.css'; // Import the CSS file for ContactUs page
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../api';
import { setUser } from '../redux/features/userSlice';
import { message } from 'antd';

const ContactUs = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
        try 
        {
      const res = await axios.post('http://localhost:8080/api/v1/user/user-feedback', { text: feedback, userId:user._id},
      {
        
        headers:{
           Authorization:`Bearer ${localStorage.getItem("token")}`
        },

     }); 
     if(res.data.success)
    {
      message.success(res.data.message);
    setFeedback(e.target.value);
    // Set submitted to true to trigger the thank you message
    setSubmitted(true);

    }
    else
    {
        message.error(res.data.message)
    }
    
       
            
        } catch (error) 
        {
            console.log(error);
        }
  };

  const handleChange = (e) => {
      setFeedback(e.target.value);
  };

  return (
    <Layout>
      <div className="contact-us">
        <h1>Contact Us</h1>
        <p className="contact-us-text">If you have any questions, concerns, or feedback, please feel free to reach out to us.</p>
        
        {submitted ? (
          <div className="thank-you-message">
            <h3>Thanks for your feedback!</h3>
            <span role="img" aria-label="Smile">😊</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback" className="feedback-label">Feedback:</label>
              <textarea
                id="feedback"
                name="feedback"
                value={feedback}
                onChange={handleChange}
                placeholder="Enter your feedback"
                required
                className="feedback-textarea"
                rows={6}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary submit-button">Submit</button>
          </form>
        )}
      </div>

      <footer className="reach-out-footer">
        <div className="reach-out-content">
          <h2 className="reach-out-heading">Reach Me Out</h2>
          <p className="reach-out-description">If you prefer, you can also reach out to me on social media:</p>
          <div className="social-media-handles m-3">
            <a href="https://www.instagram.com/anas._6757" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-instagram m-3"></i>
            </a>
            <a href="https://www.linkedin.com/in/anas6757/" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-linkedin m-3"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100063625742899" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-facebook m-3"></i>
            </a>
           

            
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default ContactUs;



