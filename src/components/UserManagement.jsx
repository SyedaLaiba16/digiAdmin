import React, { useEffect, useState } from 'react';
import Table from './Table';
import Sidebar from './Sidebar';
import './UserManagement.css';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "Default@123",
    role: "",
    age: "",
    gender: "",
    status: "active",
    dyslexiaLevel: "",
    parentName: "",
    contactNumber: "",
    relationship: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    contactNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  // Realtime Fetch Users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "usersadd"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });
    return () => unsub();
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      errors: {
        length: hasMinLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        number: hasNumber,
        specialChar: hasSpecialChar
      }
    };
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {
      fullName: !newUser.fullName ? "Full name is required" : "",
      email: !newUser.email ? "Email is required" : 
             !validateEmail(newUser.email) ? "Invalid email format" : "",
      password: !newUser.password ? "Password is required" : "",
      role: !newUser.role ? "Role is required" : "",
      contactNumber: !validatePhone(newUser.contactNumber) ? "Invalid phone number" : ""
    };

    if (!editId) {
      const passwordValidation = validatePassword(newUser.password);
      if (!passwordValidation.isValid) {
        newErrors.password = "Password must contain: 8+ chars, uppercase, lowercase, number, and special char";
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Add/Update User with Authentication and Sync to users collection
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (editId) {
        // Update existing user
        const userRef = doc(db, "usersadd", editId);
        await updateDoc(userRef, {
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          age: newUser.age || null,
          gender: newUser.gender || null,
          status: newUser.status,
          dyslexiaLevel: newUser.dyslexiaLevel || null,
          parentName: newUser.parentName || null,
          contactNumber: newUser.contactNumber || null,
          relationship: newUser.relationship || null,
          description: newUser.description || null,
          lastUpdated: serverTimestamp()
        });

        // Also update in users collection if exists
        const userInAuth = await getUserByEmail(newUser.email);
        if (userInAuth) {
          await setDoc(doc(db, "users", userInAuth.uid), {
            full_name: newUser.fullName,
            email: newUser.email,
            lastUpdated: serverTimestamp()
          }, { merge: true });
        }
      } else {
        // Create new user in Auth and both collections
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          newUser.email,
          newUser.password
        );
        
        const user = userCredential.user;
        const timestamp = serverTimestamp();
        
        // Add to usersadd (management)
        await addDoc(collection(db, "usersadd"), {
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          age: newUser.age || null,
          gender: newUser.gender || null,
          status: newUser.status,
          dyslexiaLevel: newUser.dyslexiaLevel || null,
          parentName: newUser.parentName || null,
          contactNumber: newUser.contactNumber || null,
          relationship: newUser.relationship || null,
          description: newUser.description || null,
          uid: user.uid,
          joined: timestamp,
          lastLogin: null
        });

        // Also add to users (authentication)
        await setDoc(doc(db, "users", user.uid), {
          full_name: newUser.fullName,
          email: newUser.email,
          isAdmin: newUser.role === "Admin",
          createdAt: timestamp,
          lastUpdated: timestamp,
          uid: user.uid
        });
      }

      // Reset form
      setNewUser({
        fullName: "",
        email: "",
        password: "Default@123",
        role: "",
        age: "",
        gender: "",
        status: "active",
        dyslexiaLevel: "",
        parentName: "",
        contactNumber: "",
        relationship: "",
        description: "",
      });
      setShowForm(false);
      setEditId(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user by email
  const getUserByEmail = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  };

  // Delete User
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "usersadd", id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setNewUser({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "Default@123", // Reset password field
      role: user.role || "",
      age: user.age || "",
      gender: user.gender || "",
      status: user.status || "active",
      dyslexiaLevel: user.dyslexiaLevel || "",
      parentName: user.parentName || "",
      contactNumber: user.contactNumber || "",
      relationship: user.relationship || "",
      description: user.description || "",
    });
    setEditId(user.id);
    setShowForm(true);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h2>User Management</h2>
          <div className="header-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setNewUser({
                  fullName: "",
                  email: "",
                  password: "Default@123",
                  role: "",
                  age: "",
                  gender: "",
                  status: "active",
                  dyslexiaLevel: "",
                  parentName: "",
                  contactNumber: "",
                  relationship: "",
                  description: "",
                });
                setErrors({
                  fullName: "",
                  email: "",
                  password: "",
                  role: "",
                  contactNumber: ""
                });
              }}
              disabled={loading}
            >
              <i className="fas fa-plus"></i> Add User
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Add/Edit User Form */}
        {showForm && (
          <form className="add-user-form" onSubmit={handleSaveUser}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                required
                disabled={loading}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
                disabled={loading || !!editId}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {!editId && (
              <div className="form-group">
                <label>Password *</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
                {!errors.password && (
                  <div className="password-requirements">
                    Password must contain:
                    <ul>
                      <li className={newUser.password.length >= 8 ? "valid" : "invalid"}>8+ characters</li>
                      <li className={/[A-Z]/.test(newUser.password) ? "valid" : "invalid"}>1 uppercase letter</li>
                      <li className={/[a-z]/.test(newUser.password) ? "valid" : "invalid"}>1 lowercase letter</li>
                      <li className={/[0-9]/.test(newUser.password) ? "valid" : "invalid"}>1 number</li>
                      <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newUser.password) ? "valid" : "invalid"}>1 special character</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
              </select>
              {errors.role && <span className="error-text">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={newUser.age}
                onChange={(e) => setNewUser({...newUser, age: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                value={newUser.gender}
                onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dyslexia Level</label>
              <select
                value={newUser.dyslexiaLevel}
                onChange={(e) => setNewUser({...newUser, dyslexiaLevel: e.target.value})}
                disabled={loading}
              >
                <option value="">Select Level</option>
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Parent/Guardian Name</label>
              <input
                type="text"
                value={newUser.parentName}
                onChange={(e) => setNewUser({...newUser, parentName: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                value={newUser.contactNumber}
                onChange={(e) => setNewUser({...newUser, contactNumber: e.target.value})}
                disabled={loading}
                placeholder="e.g., 03001234567"
              />
              {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
            </div>

            <div className="form-group">
              <label>Relationship</label>
              <select
                value={newUser.relationship}
                onChange={(e) => setNewUser({...newUser, relationship: e.target.value})}
                disabled={loading}
              >
                <option value="">Select Relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description/Weaknesses</label>
              <textarea
                value={newUser.description}
                onChange={(e) => setNewUser({...newUser, description: e.target.value})}
                disabled={loading}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : editId ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="table-container">
          <Table
            headers={['Name', 'Email', 'Role', 'Age', 'Gender', 'Dyslexia Level', 'Parent Name', 'Description', 'Joined', 'Status', 'Actions']}
            data={users}
            renderRow={(item) => (
              <>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.age || '-'}</td>
                <td>{item.gender || '-'}</td>
                <td>{item.dyslexiaLevel || '-'}</td>
                <td>{item.parentName || '-'}</td>
                <td className="description-cell">
                  {item.description ? (
                    <div className="description-tooltip">
                      {item.description.length > 20 ? 
                        `${item.description.substring(0, 20)}...` : 
                        item.description}
                      <span className="tooltip-text">{item.description}</span>
                    </div>
                  ) : '-'}
                </td>
                <td>{item.joined?.toDate?.().toLocaleDateString() || item.joined || '-'}</td>
                <td>
                  <span className={`status ${item.status || 'active'}`}>
                    {item.status || 'active'}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => handleEdit(item)}
                    disabled={loading}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;