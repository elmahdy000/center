import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Spinner } from 'react-bootstrap';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', email: '', nfc_id: '', stage_id: '', parent_id: '' });
  const [editStudent, setEditStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchStudents();
    checkNfcSupport();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/students')
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });
  };

  const checkNfcSupport = () => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddStudent = () => {
    setAdding(true);
    axios.post('http://127.0.0.1:8000/api/students', newStudent)
      .then(() => {
        fetchStudents();
        setNewStudent({ name: '', phone: '', email: '', nfc_id: '', stage_id: '', parent_id: '' });
        setAdding(false);
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Error adding student:', error);
        setAdding(false);
      });
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setShowEditModal(true);
  };

  const handleUpdateStudent = () => {
    axios.put(`http://127.0.0.1:8000/api/students/${editStudent.id}`, editStudent)
      .then(() => {
        fetchStudents();
        setEditStudent(null);
        setShowEditModal(false);
      })
      .catch(error => console.error('Error updating student:', error));
  };

  const handleDeleteStudent = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/students/${id}`)
      .then(() => {
        fetchStudents();
      })
      .catch(error => console.error('Error deleting student:', error));
  };

  const startNfcScan = async () => {
    try {
      setScanning(true);
      const ndef = new window.NDEFReader();
      await ndef.scan();
      ndef.onreading = event => {
        const nfcId = event.message.records[0].data;
        setNewStudent({ ...newStudent, nfc_id: nfcId });
        setScanning(false);
      };
    } catch (error) {
      console.error('Error scanning NFC:', error);
      setScanning(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    student.phone.toLowerCase().includes(search.toLowerCase()) ||
    student.nfc_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">الطلاب</h2>

      <Form.Control
        type="text"
        placeholder="بحث..."
        value={search}
        onChange={handleSearch}
        className="mb-4"
      />

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-4">
        إضافة طالب جديد
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>إضافة طالب جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الاسم"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>رقم الهاتف</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل رقم الهاتف"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>معرف المرحلة</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل معرف المرحلة"
                value={newStudent.stage_id}
                onChange={(e) => setNewStudent({ ...newStudent, stage_id: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>معرف الوالد</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل معرف الوالد"
                value={newStudent.parent_id}
                onChange={(e) => setNewStudent({ ...newStudent, parent_id: e.target.value })}
              />
            </Form.Group>
            {nfcSupported ? (
              <Button variant="info" onClick={startNfcScan} disabled={scanning}>
                {scanning ? 'جار المسح...' : 'مسح بطاقة NFC'}
              </Button>
            ) : (
              <div className="text-danger">NFC غير مدعوم على هذا الجهاز</div>
            )}
            <Button variant="primary" onClick={handleAddStudent} disabled={adding} className="mt-3">
              {adding ? <Spinner animation="border" size="sm" /> : 'إضافة الطالب'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تعديل الطالب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الاسم"
                value={editStudent?.name || ''}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={editStudent?.email || ''}
                onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>رقم الهاتف</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل رقم الهاتف"
                value={editStudent?.phone || ''}
                onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>معرف المرحلة</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل معرف المرحلة"
                value={editStudent?.stage_id || ''}
                onChange={(e) => setEditStudent({ ...editStudent, stage_id: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>معرف الوالد</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل معرف الوالد"
                value={editStudent?.parent_id || ''}
                onChange={(e) => setEditStudent({ ...editStudent, parent_id: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateStudent}>
              تعديل الطالب
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {loading ? (
        <div>جار التحميل...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>رقم الهاتف</th>
              <th>معرف NFC</th>
              <th>معرف المرحلة</th>
              <th>معرف الوالد</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.nfc_id}</td>
                <td>{student.stage_id}</td>
                <td>{student.parent_id}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditStudent(student)} className="me-2">تعديل</Button>
                  <Button variant="danger" onClick={() => handleDeleteStudent(student.id)}>حذف</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Students;
