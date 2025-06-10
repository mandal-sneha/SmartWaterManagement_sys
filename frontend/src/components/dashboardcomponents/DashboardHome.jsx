import React from 'react';
import {
  FiDroplet,
  FiFileText,
  FiTruck,
  FiCreditCard
} from 'react-icons/fi';

const DashboardHome = () => {
  const styles = {
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '40px',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '200px',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    cardIcon: {
      fontSize: '28px',
      marginRight: '12px',
      color: '#6e8efb',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 600,
    },
    cardText: {
      fontSize: '16px',
      marginTop: '10px',
      lineHeight: '1.5',
    },
    payButton: {
      marginTop: '25px',
      padding: '12px 20px',
      backgroundImage: 'linear-gradient(to right, #6e8efb, #a777e3)',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '15px',
      alignSelf: 'flex-start',
    },
  };

  return (
    <div>
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FiDroplet style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Current Usage</h3>
          </div>
          <p style={styles.cardText}>Water used this week: 1200L</p>
          <p style={styles.cardText}>Daily average: 170L</p>
          <p style={styles.cardText}>Remaining quota: 300L</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FiFileText style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Outstanding Bill</h3>
          </div>
          <p style={styles.cardText}>Due Amount: ₹650</p>
          <p style={styles.cardText}>Due Date: 15th June</p>
          <p style={styles.cardText}>Status: Unpaid</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FiTruck style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Upcoming Supply</h3>
          </div>
          <p style={styles.cardText}>Next: 12th June</p>
          <p style={styles.cardText}>Slot: 10 AM - 12 PM</p>
          <p style={styles.cardText}>Note: Bring container</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FiCreditCard style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Payment</h3>
          </div>
          <button style={styles.payButton}>Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;