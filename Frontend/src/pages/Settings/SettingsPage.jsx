import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Edit2, X, Save, User, Mail, Briefcase } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Professional User',
    email: 'user@architect-iq.com',
    id: 'USER-82910',
    role: 'AI Architect'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setEditForm(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    navigate('/login');
    window.location.reload(); // Force app re-check
  };

  const handleSave = () => {
    localStorage.setItem('currentUser', JSON.stringify(editForm));
    setUser(editForm);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <motion.div 
        className="profile-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="profile-header">PROFILE</div>

        <div className="avatar">
          {user.name.charAt(0)}
        </div>

        <div className="profile-details">
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="profile-role-badge">{user.role}</div>
        </div>

        <div className="divider" />

        <div className="profile-id-section">
          <div className="profile-id">{user.id}</div>
        </div>

        <div className="profile-actions">
          <button className="btn-secondary" onClick={() => setIsEditing(true)}>
            <Edit2 size={13} />
            <span>Edit Profile</span>
          </button>
          <button className="btn-primary" onClick={handleLogout}>
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content profile-edit-modal"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
            >
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button className="close-btn" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="edit-form">
                <div className="edit-input-group">
                  <label><User size={12} /> Name</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="edit-input-group">
                  <label><Mail size={12} /> Email</label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div className="edit-input-group">
                  <label><Briefcase size={12} /> Role</label>
                  <select 
                    value={editForm.role} 
                    onChange={e => setEditForm({...editForm, role: e.target.value})}
                  >
                    <option>AI Architect</option>
                    <option>Senior Developer</option>
                    <option>DevOps Lead</option>
                    <option>CTO</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSave}>
                  <Save size={14} />
                  <span>Update Profile</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="settings-ambient-bg">
        <div className="orb settings-orb" />
      </div>
    </div>
  );
}
