import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { auth, db,firestore } from '../firebase'; // Adjust the path as needed
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; // Add this import
import { ref, set } from 'firebase/database';

const RegisterPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  
  const [showRequirements, setShowRequirements] = useState({
    full_name: false,
    email: false,
    password: false,
    confirm_password: false
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate on the fly
    if (name === 'full_name') validateName(value);
    if (name === 'email') validateEmail(value);
    if (name === 'password') {
      validatePassword(value);
      if (formData.confirm_password) validateConfirmPassword(formData.confirm_password, value);
    }
    if (name === 'confirm_password') validateConfirmPassword(value, formData.password);
  };

  // Handle input focus
  const handleFocus = (field) => {
    if (!formData[field]) {
      setShowRequirements(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  // Handle input blur
  const handleBlur = (field) => {
    if (!formData[field]) {
      setShowRequirements(prev => ({
        ...prev,
        [field]: false
      }));
    }
    
    // Validate on blur
    if (field === 'full_name') validateName(formData.full_name);
    if (field === 'email') validateEmail(formData.email);
    if (field === 'password') validatePassword(formData.password);
    if (field === 'confirm_password') validateConfirmPassword(formData.confirm_password, formData.password);
  };

  // Password validation functions
  const hasLength = (value) => value.length >= 8;
  const hasUppercase = (value) => /[A-Z]/.test(value);
  const hasLowercase = (value) => /[a-z]/.test(value);
  const hasNumber = (value) => /[0-9]/.test(value);
  const hasSpecial = (value) => /[@$!%*?#&]/.test(value);
  const isPasswordValid = (value) => hasLength(value) && hasUppercase(value) && hasLowercase(value) && hasNumber(value) && hasSpecial(value);

  // Full Name Validation
  const validateName = (value) => {
    const val = value.trim();
    let error = '';
    
    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    
    if (!val) {
      error = '';
    } else if (val.length < 3) {
      error = 'Name must be at least 3 characters';
    } else if (!namePattern.test(val)) {
      error = 'Only letters, spaces, hyphens (-) and apostrophes (\') allowed';
    } else if (val.startsWith(' ') || val.endsWith(' ')) {
      error = 'No spaces at start/end';
    } else if (val.includes('  ')) {
      error = 'No double spaces';
    }
    
    setErrors(prev => ({ ...prev, full_name: error }));
    return !error;
  };

  // Email Validation
  const validateEmail = (value) => {
    const val = value.trim();
    let error = '';
    
    const usernamePattern = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/;
    const domainPattern = /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    
    if (!val) {
      error = '';
    } else {
      const [username, ...domainParts] = val.split('@');
      const domain = domainParts.join('@');
      
      if (val.split('@').length !== 2) {
        error = 'Must contain exactly one @';
      } else if (!usernamePattern.test(username)) {
        error = 'Invalid username part';
      } else if (username.startsWith('.') || username.startsWith('-') || username.startsWith('_') || 
               username.endsWith('.') || username.endsWith('-') || username.endsWith('_')) {
        error = 'Cannot start/end with .-_';
      } else if (username.includes('..') || username.includes('--') || username.includes('__') ||
               username.includes('.-') || username.includes('._') || username.includes('-.') || 
               username.includes('_-') || username.includes('_-')) {
        error = 'No consecutive special chars';
      } else if (!domainPattern.test(domain)) {
        error = 'Invalid domain (e.g., example.com)';
      } else if (domain.startsWith('-') || domain.endsWith('-')) {
        error = 'Domain cannot start/end with -';
      } else if (domain.split('.').some(part => part.length < 1)) {
        error = 'Domain parts cannot be empty';
      }
    }
    
    setErrors(prev => ({ ...prev, email: error }));
    return !error;
  };

  const validatePassword = (value) => {
    let error = '';
    
    if (value && !isPasswordValid(value)) {
      error = 'Password does not meet all requirements';
    }
    
    setErrors(prev => ({
      ...prev,
      password: error
    }));
    
    return !error;
  };

  const validateConfirmPassword = (value, password) => {
    let error = '';
    
    if (value && value !== password) {
      error = 'Passwords do not match';
    }
    
    setErrors(prev => ({
      ...prev,
      confirm_password: error
    }));
    
    return !error;
  };

  // Form submission with Firebase integration (updated version)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName(formData.full_name);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmValid = validateConfirmPassword(formData.confirm_password, formData.password);
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        const user = userCredential.user;
        const timestamp = new Date().toISOString();
        
        // Save to Realtime Database
        await set(ref(db, 'users/' + user.uid), {
          full_name: formData.full_name,
          email: formData.email,
          createdAt: timestamp
        });
        
        // Save to Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          full_name: formData.full_name,
          email: formData.email,
          isAdmin: false,  // 👈 Add this line
          createdAt: timestamp,
          lastUpdated: timestamp,
          uid: user.uid  // Storing UID in document for easier queries
        });
        
        setSuccessMessage('Registration successful!');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            full_name: '',
            email: '',
            password: '',
            confirm_password: ''
          });
          setSuccessMessage('');
          setShowRequirements({
            full_name: false,
            email: false,
            password: false,
            confirm_password: false
          });
        }, 3000);
        
      } catch (error) {
        console.error('Registration error:', error);
        let errorMsg = 'Registration failed. Please try again.';
        
        // Handle specific Firebase errors
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMsg = 'This email is already registered.';
            break;
          case 'auth/invalid-email':
            errorMsg = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMsg = 'Password should be at least 6 characters.';
            break;
          default:
            errorMsg = error.message || 'Registration failed. Please try again.';
        }
        
        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Please fix the errors in the form before submitting.');
      setSuccessMessage('');
      
      // Show requirements for invalid fields
      setShowRequirements({
        full_name: !isNameValid && !!formData.full_name,
        email: !isEmailValid && !!formData.email,
        password: !isPasswordValid && !!formData.password,
        confirm_password: !isConfirmValid && !!formData.confirm_password
      });
    }
  };

  // Get input class based on validation state
  const getInputClass = (field) => {
    if (!formData[field]) return '';
    return errors[field] ? 'input-error' : 'input-success';
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="logo">
            <img src="/img/digilexlogo.png" alt="Digilex" />
          </div>
          <h1>Create Account</h1>
          <p>Join Digilex to get started</p>
        </div>
        
        <div className="register-form">
          {errorMessage && (
            <div className="error-message">
              <FaExclamationCircle /> <span>{errorMessage}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="success-message">
              <FaCheckCircle /> <span>{successMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <FaUser className="input-icon" />
              <input
                type="text"
                name="full_name"
                id="full_name"
                placeholder="Enter your full name (e.g., John Doe)"
                value={formData.full_name}
                onChange={handleInputChange}
                onFocus={() => handleFocus('full_name')}
                onBlur={() => handleBlur('full_name')}
                className={getInputClass('full_name')}
                required
              />
              {errors.full_name && <div className="field-error">{errors.full_name}</div>}
              {showRequirements.full_name && (
                <div className="requirements">
                  <ul>
                    <li className={formData.full_name.length >= 3 ? 'valid' : 'invalid'}>At least 3 characters</li>
                    <li className={/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(formData.full_name) ? 'valid' : 'invalid'}>
                      Only letters, spaces, hyphens (-) and apostrophes (')
                    </li>
                    <li className={!(formData.full_name.startsWith(' ') || formData.full_name.endsWith(' ')) ? 'valid' : 'invalid'}>
                      No spaces at start/end
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email (e.g., john.doe@example.com)"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={getInputClass('email')}
                required
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
              {showRequirements.email && (
                <div className="requirements">
                  <ul>
                    <li className={formData.email.includes('@') && formData.email.split('@').length === 2 ? 'valid' : 'invalid'}>
                      Must contain exactly one @ symbol
                    </li>
                    <li className={/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/.test(formData.email.split('@')[0]) ? 'valid' : 'invalid'}>
                      Username can contain letters, numbers, dots, underscores, or hyphens
                    </li>
                    <li className={!/^[._-]|[._-]$/.test(formData.email.split('@')[0]) ? 'valid' : 'invalid'}>
                      Cannot start/end with . - _
                    </li>
                    <li className={/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(formData.email.split('@')[1]) ? 'valid' : 'invalid'}>
                      Domain must be valid (e.g., gmail.com)
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className={getInputClass('password')}
                required
              />
              <span 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <div className="field-error">{errors.password}</div>}
              {showRequirements.password && (
                <div className="requirements">
                  <ul>
                    <li className={hasLength(formData.password) ? 'valid' : 'invalid'}>At least 8 characters</li>
                    <li className={hasUppercase(formData.password) ? 'valid' : 'invalid'}>At least one uppercase letter</li>
                    <li className={hasLowercase(formData.password) ? 'valid' : 'invalid'}>At least one lowercase letter</li>
                    <li className={hasNumber(formData.password) ? 'valid' : 'invalid'}>At least one number</li>
                    <li className={hasSpecial(formData.password) ? 'valid' : 'invalid'}>At least one special character (@$!%*?#&)</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password</label>
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                id="confirm_password"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                onFocus={() => handleFocus('confirm_password')}
                onBlur={() => handleBlur('confirm_password')}
                className={getInputClass('confirm_password')}
                required
              />
              <span 
                className="password-toggle" 
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirm_password && <div className="field-error">{errors.confirm_password}</div>}
              {showRequirements.confirm_password && (
                <div className="requirements">Must match the password above</div>
              )}
            </div>
            
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaSpinner className="fa-spin" /> Registering...
                </>
              ) : (
                <>
                  <FaUserPlus /> Register
                </>
              )}
            </button>
          </form>
          
          <div className="login-link">
            Already have an account? <a href="/login">Login here</a>
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

        .register-page {
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

        .register-page::before {
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

        .register-container {
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

        .register-header {
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

        .register-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
          transform: rotate(30deg);
        }

        .register-header h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          position: relative;
        }

        .register-header p {
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

        .register-form {
          padding: 30px;
          background: var(--form-bg);
          position: relative;
        }

        .register-form::before {
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
          background-color: rgba(255, 255, 255, 0.9);
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
          top: 42px;
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

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          background: #ffebee;
          color: var(--error-color);
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 14px;
          text-align: center;
          border-left: 4px solid var(--error-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          animation: shake 0.5s ease;
        }

        .success-message {
          background: #e8f5e9;
          color: var(--success-color);
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 14px;
          text-align: center;
          border-left: 4px solid var(--success-color);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-link {
          text-align: center;
          margin-top: 25px;
          color: var(--dark-gray);
          font-size: 15px;
        }

        .login-link a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .login-link a:hover {
          color: #1e96fc;
          text-decoration: underline;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 42px;
          color: var(--dark-gray);
          cursor: pointer;
          transition: all 0.3s;
        }

        .password-toggle:hover {
          color: var(--primary-color);
        }

        /* Validation styles */
        .input-error {
          border-color: var(--error-color) !important;
          background-color: #fff5f5 !important;
        }

        .input-success {
          border-color: var(--success-color) !important;
          background-color: #f5fff5 !important;
        }

        .field-error {
          color: var(--error-color);
          font-size: 13px;
          margin-top: 5px;
        }

        .requirements {
          font-size: 13px;
          color: var(--dark-gray);
          margin-top: 5px;
          padding-left: 5px;
        }

        .requirements ul {
          margin: 5px 0 0 15px;
          padding: 0;
        }

        .requirements li {
          margin-bottom: 3px;
          list-style-type: none;
          position: relative;
          padding-left: 20px;
        }

        .requirements li:before {
          content: "•";
          position: absolute;
          left: 0;
        }

        .requirements li.valid {
          color: var(--success-color);
        }

        .requirements li.valid:before {
          content: "✓";
        }

        .requirements li.invalid {
          color: var(--error-color);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 0%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }

        @media (max-width: 480px) {
          .register-container { border-radius: 10px; }
          .register-header { padding: 20px 15px; }
          .register-header h1 { font-size: 24px; }
          .register-form { padding: 20px 15px; }
          .logo img { height: 60px; }
        }

        .fa-spin {
          animation: fa-spin 2s infinite linear;
        }

        @keyframes fa-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(359deg); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;