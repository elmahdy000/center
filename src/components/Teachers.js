import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.rtl.min.css'; // RTL Bootstrap

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [newTeacher, setNewTeacher] = useState({ name: '', phone: '', email: '' });
  const [editTeacher, setEditTeacher] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState({}); // Individual delete loading states

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/teachers')
      .then(response => {
        setTeachers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddTeacher = () => {
    setAdding(true);
    axios.post('http://127.0.0.1:8000/api/teachers', newTeacher)
      .then(() => {
        fetchTeachers();
        setNewTeacher({ name: '', phone: '', email: '' });
        setAdding(false);
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Error adding teacher:', error);
        setAdding(false);
      });
  };

  const handleEditTeacher = (teacher) => {
    setEditTeacher(teacher);
    setShowEditModal(true);
  };

  const handleUpdateTeacher = () => {
    setUpdating(true);
    axios.put(`http://127.0.0.1:8000/api/teachers/${editTeacher.id}`, editTeacher)
      .then(() => {
        fetchTeachers();
        setEditTeacher(null);
        setShowEditModal(false);
        setUpdating(false);
      })
      .catch(error => {
        console.error('Error updating teacher:', error);
        setUpdating(false);
      });
  };

  const handleDeleteTeacher = (id) => {
    setDeleting((prev) => ({ ...prev, [id]: true }));
    axios.delete(`http://127.0.0.1:8000/api/teachers/${id}`)
      .then(() => {
        fetchTeachers();
        setDeleting((prev) => ({ ...prev, [id]: false }));
      })
      .catch(error => {
        console.error('Error deleting teacher:', error);
        setDeleting((prev) => ({ ...prev, [id]: false }));
      });
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    teacher.email.toLowerCase().includes(search.toLowerCase()) ||
    teacher.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-center mb-4">المعلمون</h2>

      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={handleSearch}
          className="mb-2"
        />
      </div>

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-4">
        إضافة معلم جديد
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>إضافة معلم جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الاسم"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الهاتف</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الهاتف"
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddTeacher} disabled={adding}>
              {adding ? <Spinner animation="border" size="sm" /> : 'إضافة معلم'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تعديل المعلم</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الاسم"
                value={editTeacher?.name || ''}
                onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={editTeacher?.email || ''}
                onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الهاتف</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الهاتف"
                value={editTeacher?.phone || ''}
                onChange={(e) => setEditTeacher({ ...editTeacher, phone: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateTeacher} disabled={updating}>
              {updating ? <Spinner animation="border" size="sm" /> : 'تحديث المعلم'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الهاتف</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map(teacher => (
              <tr key={teacher.id} className="fade-in">
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditTeacher(teacher)} className="me-2">تعديل</Button>
                  <Button variant="danger" onClick={() => handleDeleteTeacher(teacher.id)} disabled={deleting[teacher.id]}>
                    {deleting[teacher.id] ? <Spinner animation="border" size="sm" /> : 'حذف'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Teachers;
