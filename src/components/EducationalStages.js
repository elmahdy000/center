import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.rtl.min.css'; // Ensure you have this import if not already

const EducationalStages = () => {
  const [stages, setStages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState('');
  const [newStage, setNewStage] = useState({ name: '', branch_id: '' });
  const [editStage, setEditStage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState({}); // Individual delete loading states

  useEffect(() => {
    fetchStages();
    fetchBranches();
  }, []);

  const fetchStages = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/stages')
      .then(response => {
        setStages(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stages:', error);
        setLoading(false);
      });
  };

  const fetchBranches = () => {
    axios.get('http://127.0.0.1:8000/api/branches')
      .then(response => {
        setBranches(response.data);
      })
      .catch(error => {
        console.error('Error fetching branches:', error);
      });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddStage = () => {
    setAdding(true);
    axios.post('http://127.0.0.1:8000/api/stages', newStage)
      .then(() => {
        fetchStages();
        setNewStage({ name: '', branch_id: '' });
        setAdding(false);
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Error adding stage:', error);
        setAdding(false);
      });
  };

  const handleEditStage = (stage) => {
    setEditStage(stage);
    setShowEditModal(true);
  };

  const handleUpdateStage = () => {
    setUpdating(true);
    axios.put(`http://127.0.0.1:8000/api/stages/${editStage.id}`, editStage)
      .then(() => {
        fetchStages();
        setEditStage(null);
        setShowEditModal(false);
        setUpdating(false);
      })
      .catch(error => {
        console.error('Error updating stage:', error);
        setUpdating(false);
      });
  };

  const handleDeleteStage = (id) => {
    setDeleting((prev) => ({ ...prev, [id]: true }));
    axios.delete(`http://127.0.0.1:8000/api/stages/${id}`)
      .then(() => {
        fetchStages();
        setDeleting((prev) => ({ ...prev, [id]: false }));
      })
      .catch(error => {
        console.error('Error deleting stage:', error);
        setDeleting((prev) => ({ ...prev, [id]: false }));
      });
  };

  const filteredStages = stages.filter(stage =>
    stage.name.toLowerCase().includes(search.toLowerCase()) ||
    stage.branch_id.toString().includes(search)
  );

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-center mb-4">المراحل التعليمية</h2>

      <Form.Control
        type="text"
        placeholder="بحث..."
        value={search}
        onChange={handleSearch}
        className="mb-4"
      />

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-4">
        إضافة مرحلة جديدة
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>إضافة مرحلة جديدة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الاسم"
                value={newStage.name}
                onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الفرع</Form.Label>
              <Form.Control
                as="select"
                value={newStage.branch_id}
                onChange={(e) => setNewStage({ ...newStage, branch_id: e.target.value })}
              >
                <option value="">اختر فرع</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddStage} disabled={adding}>
              {adding ? <Spinner animation="border" size="sm" /> : 'إضافة مرحلة'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تعديل المرحلة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الاسم"
                value={editStage?.name || ''}
                onChange={(e) => setEditStage({ ...editStage, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الفرع</Form.Label>
              <Form.Control
                as="select"
                value={editStage?.branch_id || ''}
                onChange={(e) => setEditStage({ ...editStage, branch_id: e.target.value })}
              >
                <option value="">اختر فرع</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateStage} disabled={updating}>
              {updating ? <Spinner animation="border" size="sm" /> : 'تحديث المرحلة'}
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
              <th>الفرع</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredStages.map(stage => (
              <tr key={stage.id} className="fade-in">
                <td>{stage.name}</td>
                <td>{branches.find(branch => branch.id === stage.branch_id)?.name || stage.branch_id}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditStage(stage)} className="me-2">تعديل</Button>
                  <Button variant="danger" onClick={() => handleDeleteStage(stage.id)} disabled={deleting[stage.id]}>
                    {deleting[stage.id] ? <Spinner animation="border" size="sm" /> : 'حذف'}
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

export default EducationalStages;
