import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientForm from './pages/patients/PatientForm';
import PatientDetails from './pages/patients/PatientDetails';
import DoctorList from './pages/doctors/DoctorList';
import DoctorForm from './pages/doctors/DoctorForm';
import AppointmentList from './pages/appointments/AppointmentList';
import MedicalRecordsList from './pages/medical-records/MedicalRecordsList';
import LabTestsList from './pages/lab/LabTestsList';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import BillingDashboard from './pages/billing/BillingDashboard';
import BedManagement from './pages/beds/BedManagement';
import StaffManagement from './pages/staff/StaffManagement';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/new" element={<PatientForm />} />
            <Route path="patients/:id" element={<PatientDetails />} />
            <Route path="patients/:id/edit" element={<PatientForm />} />
            <Route path="doctors" element={<DoctorList />} />
            <Route path="doctors/new" element={<DoctorForm />} />
            <Route path="doctors/edit/:id" element={<DoctorForm />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="appointments" element={<AppointmentList />} />
            <Route path="beds" element={<BedManagement />} />
            <Route path="medical-records" element={<MedicalRecordsList />} />
            <Route path="lab-tests" element={<LabTestsList />} />
            <Route path="pharmacy" element={<PharmacyDashboard />} />
            <Route path="billing" element={<BillingDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
