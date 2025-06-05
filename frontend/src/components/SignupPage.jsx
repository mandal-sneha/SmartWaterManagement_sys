import React, { useState, useEffect } from 'react';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [userID, setuserID] = useState('');
  const [email, setEmail] = useState('');
  const [aadharId, setAadharId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    if (!username || !userID || !email || !aadharId || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (aadharId.length !== 12 || !/^\d+$/.test(aadharId)) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    // alert(`Signing up with\nUsername: ${username}\nuserID: ${userID}\nEmail: ${email}\nAadhar ID: ${aadharId}\nPassword: ${password}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Load Google Font dynamically
  useEffect(() => {
    const link = document.createElement('link');
    
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      flexDirection: 'column',
    },
    title: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '32px',
      fontWeight: '700',
      color: '#4b0082',
      marginBottom: '8px',
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '16px',
      color: '#555',
      marginBottom: '30px',
      textAlign: 'center',
    },
    formBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      padding: '30px 25px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '390px',
      boxSizing: 'border-box',
    },
    heading: {
      marginBottom: '10px',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif",
      fontSize: '28px',
      fontWeight: '500',
      color: '#4b0082',
      letterSpacing: '1px',
    },
    subheading: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '20px',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif",
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    passwordBox: {
      position: 'relative',
    },
    eyeButton: {
      position: 'absolute',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
    },
    label: {
      display: 'block',
      textAlign: 'left',
      fontSize: '14px',
      marginBottom: '5px',
      fontFamily: "'Poppins', sans-serif",
    },
    signupBtn: {
      width: '100%',
      padding: '12px',
      backgroundImage: 'linear-gradient(to right, #6e8efb, #a777e3)',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
      fontFamily: "'Poppins', sans-serif",
      cursor: 'pointer',
      marginTop: '10px',
    },
    loginText: {
      marginTop: '25px',
      fontSize: '14px',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif",
    },
    loginLink: {
      color: '#1230AE',
      textDecoration: 'underline',
      marginLeft: '4px',
      fontFamily: "'Poppins', sans-serif",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to HydraOne</h1>
      <p style={styles.subtitle}>One-stop water resource</p>
      
      <div style={styles.formBox}>
        <div style={styles.heading}>SIGN UP</div>
        <div style={styles.subheading}>
          Create your account to get started
        </div>

        <label style={styles.label}>Username</label>
        <input
          type="text"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={styles.label}>userID</label>
        <input
          type="userID"
          style={styles.input}
          value={userID}
          onChange={(e) => setuserID(e.target.value)}
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>Aadhar ID</label>
        <input
          type="text"
          style={styles.input}
          value={aadharId}
          onChange={(e) => setAadharId(e.target.value)}
          maxLength="12"
          pattern="\d{12}"
          title="Please enter a 12-digit Aadhaar number"
        />

        <label style={styles.label}>Password</label>
        <div style={styles.passwordBox}>
          <input
            type={showPassword ? 'text' : 'password'}
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" style={styles.eyeButton} onClick={togglePasswordVisibility}>
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <label style={styles.label}>Confirm Password</label>
        <div style={styles.passwordBox}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="button" style={styles.eyeButton} onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button style={styles.signupBtn} onClick={handleSignUp}>
          Sign Up
        </button>

        <div style={styles.loginText}>
          Already a member?
          <a href="/login" style={styles.loginLink}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;