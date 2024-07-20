import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have this import if not already

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState('');
  const [newBranch, setNewBranch] = useState({ name: '', address: '', phone: '' });
  const [editBranch, setEditBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/branches')
      .then(response => {
        setBranches(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching branches:', error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddBranch = () => {
    setAdding(true);
    axios.post('http://127.0.0.1:8000/api/branches', newBranch)
      .then(() => {
        fetchBranches();
        setNewBranch({ name: '', address: '', phone: '' });
        setAdding(false);
      })
      .catch(error => {
        console.error('Error adding branch:', error);
        setAdding(false);
      });
  };

  const handleEditBranch = (branch) => {
    setEditBranch(branch);
  };

  const handleUpdateBranch = () => {
    setUpdating(true);
    axios.put(`http://127.0.0.1:8000/api/branches/${editBranch.id}`, editBranch)
      .then(() => {
        fetchBranches();
        setEditBranch(null);
        setUpdating(false);
      })
      .catch(error => {
        console.error('Error updating branch:', error);
        setUpdating(false);
      });
  };

  const handleDeleteBranch = (id) => {
    setDeleting(true);
    axios.delete(`http://127.0.0.1:8000/api/branches/${id}`)
      .then(() => {
        fetchBranches();
        setDeleting(false);
      })
      .catch(error => {
        console.error('Error deleting branch:', error);
        setDeleting(false);
      });
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(search.toLowerCase()) ||
    branch.address.toLowerCase().includes(search.toLowerCase()) ||
    branch.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container my-4" dir="rtl">
      <h2 className="text-center mb-4">الفروع</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={handleSearch}
          className="form-control mb-2"
          style={{ margin: '0 0 10px 0' }}
        />
      </div>

      <div className="mb-4">
        <h3 className="mb-3">إضافة فرع جديد</h3>
        <div className="form-row">
          <div className="col mb-2">
            <input
              type="text"
              placeholder="الاسم"
              value={newBranch.name}
              onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
              className="form-control"
              style={{ margin: '0 0 10px 0' }}
            />
          </div>
          <div className="col mb-2">
            <input
              type="text"
              placeholder="العنوان"
              value={newBranch.address}
              onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
              className="form-control"
              style={{ margin: '0 0 10px 0' }}
            />
          </div>
          <div className="col mb-2">
            <input
              type="text"
              placeholder="الهاتف"
              value={newBranch.phone}
              onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
              className="form-control"
              style={{ margin: '0 0 10px 0' }}
            />
          </div>
          <div className="col mb-2">
            <button onClick={handleAddBranch} className="btn btn-primary btn-block">
              {adding ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'إضافة فرع'}
            </button>
          </div>
        </div>
      </div>

      {editBranch && (
        <div className="mb-4">
          <h3 className="mb-3">تعديل فرع</h3>
          <div className="form-row">
            <div className="col mb-2">
              <input
                type="text"
                placeholder="الاسم"
                value={editBranch.name}
                onChange={(e) => setEditBranch({ ...editBranch, name: e.target.value })}
                className="form-control"
                style={{ margin: '0 0 10px 0' }}
              />
            </div>
            <div className="col mb-2">
              <input
                type="text"
                placeholder="العنوان"
                value={editBranch.address}
                onChange={(e) => setEditBranch({ ...editBranch, address: e.target.value })}
                className="form-control"
                style={{ margin: '0 0 10px 0' }}
              />
            </div>
            <div className="col mb-2">
              <input
                type="text"
                placeholder="الهاتف"
                value={editBranch.phone}
                onChange={(e) => setEditBranch({ ...editBranch, phone: e.target.value })}
                className="form-control"
                style={{ margin: '0 0 10px 0' }}
              />
            </div>
            <div className="col mb-2">
              <button onClick={handleUpdateBranch} className="btn btn-success btn-block">
                {updating ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'تحديث الفرع'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center">جاري التحميل...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>العنوان</th>
              <th>الهاتف</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredBranches.map(branch => (
              <tr key={branch.id} className="fade-in">
                <td>{branch.name}</td>
                <td>{branch.address}</td>
                <td>{branch.phone}</td>
                <td>
                  <button onClick={() => handleEditBranch(branch)} className="btn btn-warning btn-sm mr-2">تعديل</button>
                  <button onClick={() => handleDeleteBranch(branch.id)} className="btn btn-danger btn-sm">
                    {deleting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'حذف'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Branches;
