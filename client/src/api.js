import axios from 'axios';

export const fetchUser = async () => {
  try {
    const token = localStorage.getItem('token'); // Retrieve the authentication token from local storage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post('http://localhost:8080/api/v1/user/getUserData', {}, config);
    return response.data;
  } catch (error) {
    
    console.error(error);
    // Handle error scenarios
    return null;
  }
};

