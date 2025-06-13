import React, { useState, useEffect, useRef } from 'react';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const homeRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);

  const handleNavigation = (section) => {
    if (section === "Home") {
      setTimeout(() => {
        homeRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSignIn = () => {
    setIsLoggedIn(true);
    console.log("User signed in");
  };

  useEffect(() => {
    const newBubbles = [];
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 60 + 20;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 15;
      
      newBubbles.push(
        <div 
          key={i}
          style={{
            position: "absolute",
            bottom: "-100px",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animation: `rise ${duration}s infinite ease-in`,
            animationDelay: `${delay}s`,
            zIndex: 0,
          }}
        />
      );
    }
    setBubbles(newBubbles);
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#006d77",
      overflowX: "hidden",
      background: "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
      position: "relative",
    },
    bubbles: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: 0,
    },
    content: {
      position: "relative",
      zIndex: 1,
    },
    navBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "8px",
      position: "sticky",
      top: "0",
      zIndex: "100",
      borderBottom: "1px solid rgba(0, 109, 119, 0.1)",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    logo: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #006d77, #00a8b5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "20px",
      boxShadow: "0 2px 5px rgba(0, 109, 119, 0.3)",
    },
    navLinks: {
      display: "flex",
      gap: "25px",
      fontSize: "16px",
    },
    navLink: {
      cursor: "pointer",
      padding: "5px 10px",
      borderRadius: "4px",
      transition: "all 0.3s ease",
      fontWeight: "500",
      border: "none",
      background: "none",
      color: "#006d77",
      ":hover": {
        color: "#00a8b5",
        textDecoration: "underline",
      },
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    authButton: {
      padding: "8px 16px",
      borderRadius: "5px",
      border: "none",
      background: "linear-gradient(135deg, #006d77, #00a8b5)",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 5px rgba(0, 109, 119, 0.3)",
      ":hover": {
        background: "linear-gradient(135deg, #00a8b5, #006d77)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0, 109, 119, 0.4)",
      },
    },
    homeSection: {
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      zIndex: 1,
    },
    centerContent: {
      textAlign: "center",
      padding: "40px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "12px",
      maxWidth: "800px",
      margin: "0 auto",
      boxShadow: "0 5px 25px rgba(0, 109, 119, 0.1)",
      border: "1px solid rgba(0, 109, 119, 0.1)",
    },
    siteTitle: {
      fontSize: "48px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#006d77",
      fontFamily: "'Poppins', sans-serif",
      textShadow: "1px 1px 3px rgba(0, 109, 119, 0.1)",
    },
    tagline: {
      fontSize: "20px",
      marginTop: "10px",
      color: "#457b9d",
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: "1.6",
      fontFamily: "'Poppins', sans-serif",
    },
    "@media (max-width: 768px)": {
      navBar: {
        flexDirection: "column",
        padding: "15px",
        gap: "15px",
      },
      navLinks: {
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      },
      centerContent: {
        padding: "20px",
      },
      siteTitle: {
        fontSize: "36px",
      },
      tagline: {
        fontSize: "16px",
      },
    },
  };

  const bubbleAnimation = `
    @keyframes rise {
      0% {
        bottom: -100px;
        transform: translateX(0);
      }
      50% {
        transform: translateX(100px);
      }
      100% {
        bottom: 100%;
        transform: translateX(-100px);
      }
    }
  `;

  return (
    <div style={styles.container}>
      {/* Bubble animation */}
      <style>{bubbleAnimation}</style>
      <div style={styles.bubbles}>
        {bubbles}
      </div>
      
      <div style={styles.content}>
        <div style={styles.navBar}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>HO</div>
          </div>
          <div style={styles.navLinks}>
            {["Home", "Service", "Community Impact", "News & Updates", "FAQ", "Contact"].map((item) => (
              <button 
                key={item} 
                style={styles.navLink}
                onClick={() => handleNavigation(item)}
                aria-label={`Navigate to ${item}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div style={styles.rightSection}>
            {!isLoggedIn && (
              <button style={styles.authButton} onClick={handleSignIn}>
                Sign In
              </button>
            )}
          </div>
        </div>

        <div ref={homeRef} style={styles.homeSection}>
          <div style={styles.centerContent}>
            <h1 style={styles.siteTitle}>HydraOne</h1>
            <p style={styles.tagline}>
              One-stop solution for all your water resource needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;