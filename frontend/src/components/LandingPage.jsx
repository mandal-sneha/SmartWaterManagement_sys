import React, { useState, useEffect, useRef } from 'react';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [typing, setTyping] = useState(false);
  const servicesRef = useRef(null);
  const homeRef = useRef(null);

  const services = [
    "Smart Water Allocation",
    "Fraud Detection",
    "Real Time Water Usage Monitoring",
    "Fine System",
    "Municipal Water Supply"
  ];

  const serviceDescriptions = [
    "This is service for number one",
    "This is service for number two",
    "This is service for number three",
    "This is service for number four",
    "This is service for number five"
  ];

  // Calculate positions along the half-circle curve
  const getNumberPosition = (index, total) => {
    const angle = (index / (total - 1)) * Math.PI; // 0 to π radians
    const radius = 280; // Radius of the half-circle
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  // Typewriter effect
  useEffect(() => {
    if (showServices && currentServiceIndex < serviceDescriptions.length) {
      setTyping(true);
      let i = 0;
      const currentDescription = serviceDescriptions[currentServiceIndex];
      setDisplayText(''); // Reset text before typing
      
      const typingInterval = setInterval(() => {
        if (i <= currentDescription.length) {
          setDisplayText(currentDescription.substring(0, i));
          i++;
        } else {
          clearInterval(typingInterval);
          setTyping(false);
        }
      }, 100); // Typing speed

      return () => clearInterval(typingInterval);
    }
  }, [currentServiceIndex, showServices]);

  const handleNavigation = (section) => {
    console.log(`Navigating to ${section}`);
    if (section === "Service") {
      setShowServices(true);
      setCurrentServiceIndex(0); // Reset to first service
      setTimeout(() => {
        servicesRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (section === "Home") {
      setShowServices(false);
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
    let interval;
    if (showServices) {
      interval = setInterval(() => {
        setCurrentServiceIndex((prevIndex) => 
          prevIndex === services.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change service every 3 seconds
    }
    return () => clearInterval(interval);
  }, [showServices]);

  const styles = {
    container: {
      backgroundSize: "cover",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
      color: "#003049",
      overflowX: "hidden",
    },
    navBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "8px",
      position: "sticky",
      top: "0",
      zIndex: "100",
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
      backgroundColor: "#006064",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "20px",
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
      ":hover": {
        color: "#00838f",
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
      backgroundColor: "#006064",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      ":hover": {
        backgroundColor: "#00838f",
        transform: "translateY(-2px)",
      },
    },
    homeSection: {
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    centerContent: {
      textAlign: "center",
      padding: "40px",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderRadius: "8px",
      maxWidth: "800px",
      margin: "0 auto",
      transition: "all 0.5s ease",
    },
    servicesWrapper: {
      position: "relative",
      minHeight: "80vh",
      width: "100vw",
      marginLeft: "-20px",
      background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(224,247,250,0.9) 100%)",
    },
    servicesContainer: {
      display: "flex",
      minHeight: "80vh",
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "20px",
      position: "relative",
    },
    halfCircle: {
      width: "600px",
      height: "300px",
      position: "relative",
      marginRight: "40px",
    },
    halfCircleCurve: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderBottom: "2px dashed rgba(0, 96, 100, 0.3)",
      borderRadius: "300px 300px 0 0",
    },
    numberContainer: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
    },
    serviceNumber: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#006064",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      zIndex: 2,
    },
    activeNumber: {
      backgroundColor: "#00838f",
      transform: "scale(1.2)",
    },
    serviceText: {
      marginLeft: "15px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#006064",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    activeText: {
      opacity: 1,
    },
    serviceContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingLeft: "200px"
    },
    serviceTitle: {
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "30px",
      color: "#006064",
    },
    serviceDescription: {
      fontSize: "24px",
      minHeight: "60px",
      borderRight: typing ? "2px solid #006064" : "none",
      paddingRight: "5px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "fit-content",
    },
    siteTitle: {
      fontSize: "48px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#006064",
    },
    tagline: {
      fontSize: "20px",
      marginTop: "10px",
      color: "#006064",
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: "1.6",
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
      servicesContainer: {
        flexDirection: "column",
      },
      halfCircle: {
        width: "100%",
        height: "200px",
        marginRight: "0",
        marginBottom: "40px",
      },
      serviceText: {
        fontSize: "16px",
      },
      serviceTitle: {
        fontSize: "28px",
      },
      serviceDescription: {
        fontSize: "18px",
      },
      siteTitle: {
        fontSize: "36px",
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>AQ</div>
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
          <h1 style={styles.siteTitle}>AquaPure</h1>
          <p style={styles.tagline}>
            Experience the purest water delivered straight to your doorstep. 
          </p>
        </div>
      </div>

      <div ref={servicesRef} style={styles.servicesWrapper}>
        {showServices && (
          <div style={styles.servicesContainer}>
            <div style={styles.halfCircle}>
              <div style={styles.halfCircleCurve}></div>
              {services.map((service, index) => {
                const position = getNumberPosition(index, services.length);
                return (
                  <div 
                    key={index}
                    style={{
                      ...styles.numberContainer,
                      left: `${300 + position.x}px`,
                      top: `${300 - position.y}px`,
                    }}
                  >
                    <div 
                      style={{
                        ...styles.serviceNumber,
                        ...(index === currentServiceIndex && styles.activeNumber),
                      }}
                    >
                      {index + 1}
                    </div>
                    <div 
                      style={{
                        ...styles.serviceText,
                        ...(index === currentServiceIndex && styles.activeText),
                      }}
                    >
                      {service}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={styles.serviceContent}>
              <h2 style={styles.serviceTitle}>Our Services</h2>
              <div style={styles.serviceDescription}>
                {displayText}
                {typing && <span style={{ opacity: 0.5 }}>|</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;