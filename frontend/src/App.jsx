import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UserDashboard, { ThemeProvider } from './components/UserDashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProtectedRoute from './ProtectedRoute';
import DashboardHome from './components/dashboardcomponents/DashboardHome.jsx';
import WaterRegistration from './components/dashboardcomponents/WaterRegistration.jsx';
import AddProperty from './components/dashboardcomponents/AddProperty.jsx';
import AddPropertyForm from './components/dashboardcomponents/addpropertycomponents/AddPropertyForm.jsx';
import PropertyTenants from './components/dashboardcomponents/addpropertycomponents/PropertyTenants.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/u/:userid"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <UserDashboard />
              </ThemeProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="water-registration" element={<WaterRegistration />} />
          <Route path="add-property" element={<AddProperty />} />
          
          <Route path="add-property-form" element={<AddPropertyForm />} />
          <Route path="property-tenants" element={<PropertyTenants/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;