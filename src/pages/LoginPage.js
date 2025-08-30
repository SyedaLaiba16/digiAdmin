import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSignInAlt, 
  FaSpinner, 
  FaExclamationCircle
} from 'react-icons/fa';
import { auth, db, database } from "../config/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    return emailPattern.test(email.trim());
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate email format
    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address (e.g., example@domain.com).");
      return;
    }

    // Validate password format
    if (!validatePassword(formData.password)) {
      setErrorMessage("Password must be at least 8 characters with uppercase, lowercase, number, and special character.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      const timestamp = new Date().toISOString();

      // 2. Check if user exists in either users or usersadd collection
      const [userDoc, userAddDoc] = await Promise.all([
        getDoc(doc(db, "users", user.uid)),
        getDoc(doc(db, "usersadd", user.uid))
      ]);

      if (!userDoc.exists() && !userAddDoc.exists()) {
        throw new Error("No registered account found with this email.");
      }

      // 3. Update last login in both collections if they exist
      const updatePromises = [];
      
      if (userDoc.exists()) {
        updatePromises.push(
          setDoc(doc(db, "users", user.uid), {
            lastLogin: timestamp
          }, { merge: true })
        );
      }
      
      if (userAddDoc.exists()) {
        updatePromises.push(
          setDoc(doc(db, "usersadd", user.uid), {
            lastLogin: timestamp
          }, { merge: true })
        );
      }
      
      await Promise.all(updatePromises);

      // 4. Check if admin and redirect accordingly
      const isAdmin = userDoc.data()?.isAdmin || userAddDoc.data()?.role === "Admin";
      if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/landing');
      }

      // 5. Store login activity in Realtime Database
      await set(ref(database, `loginActivities/${user.uid}/${Date.now()}`), {
        email: formData.email,
        loginTime: timestamp,
        ipAddress: "N/A"
      });

    } catch (error) {
      console.error('Login error:', error);
      let errorMsg = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMsg = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMsg = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Too many attempts. Account temporarily locked.';
          break;
        default:
          errorMsg = error.message || 'Login failed. Please try again.';
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <img src="/img/digilexlogo.png" alt="Digilex Logo" />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your account and continue your journey with us</p>
        </div>
        
        <div className="login-form">
          {errorMessage && (
            <div className="error-message">
              <FaExclamationCircle /> <span>{errorMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <span 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaSpinner className="fa-spin" /> Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt /> Login
                </>
              )}
            </button>
          </form>
          
          <div className="register-link">
            Don't have an account? <a href="#" onClick={navigateToRegister}>Create one now</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #005f99;
          --primary-light: #67C3F3;
          --secondary-color: #5a2e8a;
          --error-color: #d32f2f;
          --success-color: #388e3c;
          --text-color: #333;
          --light-gray: #f5f5f5;
          --medium-gray: #ddd;
          --dark-gray: #555;
          --form-bg: rgba(255, 255, 255, 0.95);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          line-height: 1.6;
          position: relative;
          overflow: hidden;
          background: linear-gradient(-45deg, #0a0f3d,rgb(77, 48, 180),rgb(55, 18, 128),rgb(59, 125, 201),rgb(85, 114, 230), #005f99);
          background-size: 600% 600%;
          animation: gradientBG 20s ease infinite;
        }

        .login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(30, 60, 100, 0.3) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(20, 50, 120, 0.3) 0%, transparent 30%),
            radial-gradient(circle at 40% 80%, rgba(10, 40, 100, 0.3) 0%, transparent 40%);
          z-index: 1;
        }

        .login-container {
          width: 100%;
          max-width: 450px;
          background: var(--form-bg);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          animation: fadeIn 0.5s ease;
          position: relative;
          z-index: 2;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-header {
          background: linear-gradient(135deg, var(--primary-color) 0%,rgb(71, 49, 244) 100%);
          color: white;
          padding: 25px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .login-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
          transform: rotate(30deg);
        }

        .login-header h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          position: relative;
        }

        .login-header p {
          font-size: 14px;
          opacity: 0.9;
          position: relative;
          max-width: 80%;
          margin: 0 auto;
        }

        .logo {
          margin-bottom: -5px;
          position: relative;
          z-index: 1;
        }

        .logo img {
          height: 120px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .login-form {
          padding: 30px;
          background: var(--form-bg);
          position: relative;
        }

        .login-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 10px;
          background: linear-gradient(135deg, var(--primary-color) 0%, #1e96fc 100%);
          opacity: 0.1;
        }

        .form-group {
          margin-bottom: 25px;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color);
        }

        .form-group input {
          width: 100%;
          padding: 14px 15px 14px 45px;
          border: 2px solid var(--medium-gray);
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background-color: rgba(95, 145, 220, 0.7);
        }

        .form-group input:focus {
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(103, 195, 243, 0.2);
          outline: none;
          background-color: white;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 55px;
          color: var(--dark-gray);
          transition: all 0.3s;
        }

        .form-group input:focus + .input-icon {
          color: var(--primary-color);
        }

        .btn {
          background: linear-gradient(135deg, var(--primary-color) 0%, #1e96fc 100%);
          color: white;
          border: none;
          padding: 14px;
          width: 100%;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 45%,
            rgba(88, 88, 233, 0.3) 48%,
            rgba(255, 255, 255, 0.3) 52%,
            rgba(255, 255, 255, 0) 55%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          transition: all 0.3s;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .btn:hover::after {
          left: 100%;
        }

        .btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 57px;
          color: var(--dark-gray);
          cursor: pointer;
          transition: all 0.3s;
        }

        .password-toggle:hover {
          color: var(--primary-color);
        }

        .register-link {
          text-align: center;
          margin-top: 25px;
          color: var(--dark-gray);
          font-size: 15px;
        }

        .register-link a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .register-link a:hover {
          color: #1e96fc;
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 0%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }

        @media (max-width: 480px) {
          .login-container { border-radius: 10px; }
          .login-header { padding: 20px 15px; }
          .login-header h1 { font-size: 24px; }
          .login-form { padding: 20px 15px; }
          .logo img { height: 60px; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;