import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/attendances')
      .then(response => setAttendanceRecords(response.data))
      .catch(error => console.error('Error fetching attendance records:', error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Attendance</h2>
      <ul>
        {attendanceRecords.map(record => (
          <li key={record.id} className="mb-2 p-2 bg-gray-100 border">
            NFC ID: {record.nfc_id} - Check In: {new Date(record.check_in).toLocaleString()} - Check Out: {new Date(record.check_out).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Attendance;
