import React, { useState } from 'react';
import { useTheme } from '../UserDashboard.jsx'; // Import the theme hook

const AddProperty = () => {
  const { darkMode, colors } = useTheme(); // Get theme from context
  
  const [properties] = useState([
    {
      id: 1,
      name: 'Property 1',
      address: 'Gurgaon',
      tenants: 4,
      type: 'Other',
      status: 'Active',
      avatar: '🏢'
    },
    {
      id: 2,
      name: 'Property 2',
      address: 'Mumbai',
      tenants: 0,
      type: 'Personal Property',
      status: 'Active',
      avatar: '🏠'
    },
    {
      id: 3,
      name: 'Property 3',
      address: 'Delhi',
      tenants: 2,
      type: 'Other',
      status: 'Deactive',
      avatar: '🏢'
    },
    {
      id: 4,
      name: 'Property 4',
      address: 'Bangalore',
      tenants: 0,
      type: 'Personal Property',
      status: 'Active',
      avatar: '🏠'
    },
    {
      id: 5,
      name: 'Property 5',
      address: 'Pune',
      tenants: 3,
      type: 'Other',
      status: 'Active',
      avatar: '🏢'
    },
    {
      id: 6,
      name: 'Property 6',
      address: 'Chennai',
      tenants: 1,
      type: 'Other',
      status: 'Deactive',
      avatar: '🏢'
    },
    {
      id: 7,
      name: 'Property 7',
      address: 'Hyderabad',
      tenants: 5,
      type: 'Other',
      status: 'Active',
      avatar: '🏢'
    },
    {
      id: 8,
      name: 'Property 8',
      address: 'Kolkata',
      tenants: 0,
      type: 'Personal Property',
      status: 'Active',
      avatar: '🏠'
    },
    {
      id: 9,
      name: 'Property 9',
      address: 'Jaipur',
      tenants: 2,
      type: 'Other',
      status: 'Active',
      avatar: '🏢'
    },
    {
      id: 10,
      name: 'Property 10',
      address: 'Ahmedabad',
      tenants: 0,
      type: 'Personal Property',
      status: 'Deactive',
      avatar: '🏠'
    },
    {
      id: 11,
      name: 'Property 11',
      address: 'Surat',
      tenants: 4,
      type: 'Other',
      status: 'Active',
      avatar: '🏢'
    },
    {
      id: 12,
      name: 'Property 12',
      address: 'Lucknow',
      tenants: 1,
      type: 'Other',
      status: 'Active',
      avatar: '🏢'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleEdit = (property) => {
    console.log('Edit property:', property);
  };

  const handleDelete = (property) => {
    console.log('Delete property:', property);
  };

  const handleView = (property) => {
    console.log('View property:', property);
  };

  // Enhanced theme colors using the centralized theme
  const theme = {
    background: colors.baseColor,
    cardBackground: colors.cardBg,
    textPrimary: colors.textColor,
    textSecondary: darkMode ? '#b0b0b0' : '#374151',
    textMuted: colors.mutedText,
    border: colors.borderColor,
    borderLight: darkMode ? '#404040' : '#e5e7eb',
    tableHeaderBg: darkMode ? '#333344' : '#fafbff',
    hoverBg: colors.hoverBg,
    buttonBg: colors.primaryBg,
    buttonHoverBg: darkMode ? '#4a4a6a' : '#5855eb',
    searchBg: colors.cardBg,
    shadowColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(75, 0, 130, 0.08)'
  };

  const styles = {
    container: {
      padding: '0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: theme.background,
      minHeight: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '15px',
      flexShrink: 0
    },
    backButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '20px',
      color: theme.textPrimary,
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background-color 0.2s ease'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: theme.textPrimary,
      margin: '0',
      letterSpacing: '-0.3px'
    },
    searchContainer: {
      marginLeft: 'auto',
      position: 'relative'
    },
    searchInput: {
      width: '280px',
      padding: '10px 18px 10px 40px',
      border: `2px solid ${theme.borderLight}`,
      borderRadius: '20px',
      fontSize: '14px',
      backgroundColor: theme.searchBg,
      color: theme.textSecondary,
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: theme.textMuted,
      fontSize: '16px'
    },
    scrollContainer: {
      flex: 1,
      overflow: 'hidden'
    },
    tableSection: {
      backgroundColor: theme.cardBackground,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: `0 4px 20px ${theme.shadowColor}`,
      border: `1px solid ${theme.border}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 25px',
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: theme.cardBackground,
      flexShrink: 0
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: theme.textPrimary,
      margin: '0'
    },
    addButton: {
      backgroundColor: theme.buttonBg,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      boxShadow: `0 2px 8px ${darkMode ? 'rgba(90, 90, 122, 0.3)' : 'rgba(99, 102, 241, 0.25)'}`
    },
    tableContainer: {
      flex: 1,
      overflow: 'auto',
      maxHeight: 'calc(100vh - 200px)',
      scrollbarWidth: 'thin',
      scrollbarColor: `${theme.textMuted} transparent`
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: theme.tableHeaderBg,
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    th: {
      padding: '16px 25px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: `1px solid ${theme.border}`
    },
    tbody: {
      backgroundColor: theme.cardBackground
    },
    tr: {
      borderBottom: `1px solid ${theme.border}`,
      transition: 'background-color 0.15s ease'
    },
    td: {
      padding: '18px 25px',
      fontSize: '14px',
      color: theme.textSecondary,
      verticalAlign: 'middle'
    },
    propertyCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: darkMode ? '#404040' : '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      flexShrink: 0
    },
    propertyName: {
      fontWeight: '600',
      color: theme.textPrimary,
      fontSize: '14px'
    },
    statusBadge: {
      padding: '5px 12px',
      borderRadius: '16px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'capitalize',
      letterSpacing: '0.025em'
    },
    activeStatus: {
      backgroundColor: darkMode ? '#1f4e3d' : '#dcfce7',
      color: darkMode ? '#4ade80' : '#15803d'
    },
    deactiveStatus: {
      backgroundColor: darkMode ? '#4c1d1d' : '#fee2e2',
      color: darkMode ? '#f87171' : '#dc2626'
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative'
    },
    editButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '4px',
      color: theme.textMuted,
      transition: 'all 0.2s ease',
      fontSize: '14px'
    },
    dropdownButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '4px',
      color: theme.textMuted,
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
      transform: 'rotate(90deg)'
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: theme.cardBackground,
      border: `1px solid ${theme.borderLight}`,
      borderRadius: '10px',
      boxShadow: `0 8px 20px ${darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'}`,
      zIndex: 1000,
      minWidth: '130px',
      overflow: 'hidden',
      marginTop: '4px'
    },
    dropdownItem: {
      display: 'block',
      width: '100%',
      padding: '10px 14px',
      backgroundColor: 'transparent',
      border: 'none',
      textAlign: 'left',
      fontSize: '13px',
      color: theme.textSecondary,
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#3a3a4d' : '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ◀
        </button>
        <h1 style={styles.title}>Add Property</h1>
        <div style={styles.searchContainer}>
          <div style={{ position: 'relative' }}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                ...styles.searchInput,
                borderColor: searchTerm ? theme.buttonBg : theme.borderLight,
                boxShadow: searchTerm ? `0 0 0 3px ${darkMode ? 'rgba(90, 90, 122, 0.2)' : 'rgba(99, 102, 241, 0.1)'}` : 'none'
              }}
            />
          </div>
        </div>
      </div>

      <div style={styles.scrollContainer}>
        <div style={styles.tableSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Properties List</h2>
            <button 
              style={styles.addButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.buttonHoverBg;
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme.buttonBg;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+</span>
              Add New Property
            </button>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Property Name</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>No. of Tenants</th>
                  <th style={styles.th}>Property Type</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {filteredProperties.map((property) => (
                  <tr 
                    key={property.id} 
                    style={styles.tr}
                    onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <td style={styles.td}>
                      <div style={styles.propertyCell}>
                        <div style={styles.avatar}>
                          {property.avatar}
                        </div>
                        <div style={styles.propertyName}>{property.name}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {property.address}
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: '500' }}>{property.tenants}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: '500' }}>{property.type}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionContainer}>
                        <button 
                          style={styles.editButton}
                          onClick={() => handleEdit(property)}
                          onMouseEnter={(e) => {
                            e.target.style.color = theme.buttonBg;
                            e.target.style.backgroundColor = darkMode ? '#3a3a4d' : '#f0f9ff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = theme.textMuted;
                            e.target.style.backgroundColor = 'transparent';
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          style={styles.dropdownButton}
                          onClick={() => toggleDropdown(property.id)}
                          onMouseEnter={(e) => {
                            e.target.style.color = theme.buttonBg;
                            e.target.style.backgroundColor = darkMode ? '#3a3a4d' : '#f0f9ff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = theme.textMuted;
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          ⋯
                        </button>
                        {dropdownOpen === property.id && (
                          <div style={styles.dropdownMenu}>
                            <button 
                              style={styles.dropdownItem}
                              onClick={() => {
                                handleView(property);
                                setDropdownOpen(null);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              View Details
                            </button>
                            <button 
                              style={styles.dropdownItem}
                              onClick={() => {
                                handleDelete(property);
                                setDropdownOpen(null);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;