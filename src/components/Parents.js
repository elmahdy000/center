import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Parents = () => {
  const [parents, setParents] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/parents')
      .then(response => setParents(response.data))
      .catch(error => console.error('Error fetching parents:', error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Parents</h2>
      <ul>
        {parents.map(parent => (
          <li key={parent.id} className="mb-2 p-2 bg-gray-100 border">
            {parent.name} - {parent.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Parents;
