import React, { useState, useEffect } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    alert(`Logging in with\nEmail: ${email}\nPassword: ${password}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Load Google Font dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Italiana&display=swap';
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
      // background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
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
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent
      padding: '30px 25px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '390px',
      boxSizing: 'border-box',
    },
    heading: {
      // fontSize: '26px',
      // fontWeight: 'bold',
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
    forgotBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      marginTop: '-10px',
      marginBottom: '10px',
    },
    forgotLink: {
      textDecoration: 'none',
      color: '#1230AE',
      fontFamily: "'Poppins', sans-serif",
    },
    loginBtn: {
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
    signupText: {
      marginTop: '25px',
      fontSize: '14px',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif",
    },
    signupLink: {
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
        <div style={styles.heading}>LOG IN</div>
        <div style={styles.subheading}>
          Enter your userID below to login to your account
        </div>

        <label style={styles.label}>userID</label>
        <input
          type="email"
          // placeholder="m@example.com"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={styles.forgotBox}>
          <label style={styles.label}>Password</label>
          <a href="#" style={styles.forgotLink}>
            Forgot password?
          </a>
        </div>

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

        <button style={styles.loginBtn} onClick={handleLogin}>
          Login
        </button>

        <div style={styles.signupText}>
          Don't have an account?
          <a href="/signup" style={styles.signupLink}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;