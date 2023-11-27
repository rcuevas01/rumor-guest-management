import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [instagramUsers, setInstagramUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/instagram_users')
      .then(response => {
        setInstagramUsers(response.data);
      })
      .catch(error => console.error('Error fetching data', error));
  }, []);

  const goToInstagram = (username) => {
    window.open(`https://www.instagram.com/${username}`, '_blank');
  };

  return (
    <div>
      {instagramUsers.map((username, index) => (
        <button key={index} onClick={() => goToInstagram(username)}>
          Go to {username}'s Instagram
        </button>
      ))}
    </div>
  );
}

export default App;