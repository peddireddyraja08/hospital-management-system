import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: (refreshToken) => api.post('/auth/refresh', null, { params: { refreshToken } }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profile) => api.put('/auth/me', profile),
  changePassword: (payload) => api.post('/auth/change-password', payload),
};

// Patient API
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  getByPatientId: (patientId) => api.get(`/patients/patient-id/${patientId}`),
  create: (patient) => api.post('/patients', patient),
  update: (id, patient) => api.put(`/patients/${id}`, patient),
  delete: (id) => api.delete(`/patients/${id}`),
  searchByEmail: (email) => api.get('/patients/search', { params: { email } }),
};

// Medical Record API
export const medicalRecordAPI = {
  getAll: () => api.get('/medical-records'),
  getById: (id) => api.get(`/medical-records/${id}`),
  getByPatientId: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  getByDoctorId: (doctorId) => api.get(`/medical-records/doctor/${doctorId}`),
  create: (record) => api.post('/medical-records', record),
  update: (id, record) => api.put(`/medical-records/${id}`, record),
  delete: (id) => api.delete(`/medical-records/${id}`),
};

// Vital Signs API
export const vitalSignAPI = {
  getById: (id) => api.get(`/vital-signs/${id}`),
  getByPatientId: (patientId) => api.get(`/vital-signs/patient/${patientId}`),
  create: (vitalSign) => api.post('/vital-signs', vitalSign),
  update: (id, vitalSign) => api.put(`/vital-signs/${id}`, vitalSign),
  delete: (id) => api.delete(`/vital-signs/${id}`),
};

// Physician Order API
export const physicianOrderAPI = {
  getAll: () => api.get('/physician-orders'),
  getById: (id) => api.get(`/physician-orders/${id}`),
  getByPatientId: (patientId) => api.get(`/physician-orders/patient/${patientId}`),
  getByDoctorId: (doctorId) => api.get(`/physician-orders/doctor/${doctorId}`),
  getByStatus: (status) => api.get(`/physician-orders/status/${status}`),
  create: (order) => api.post('/physician-orders', order),
  update: (id, order) => api.put(`/physician-orders/${id}`, order),
  updateStatus: (id, status) => api.patch(`/physician-orders/${id}/status`, null, { params: { status } }),
  cancel: (id) => api.delete(`/physician-orders/${id}/cancel`),
};

// Doctor API
export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getByDoctorId: (doctorId) => api.get(`/doctors/doctorId/${doctorId}`),
  getBySpecialization: (specialization) => api.get(`/doctors/specialization/${specialization}`),
  searchByEmail: (email) => api.get(`/doctors/email/${email}`),
  create: (doctor) => api.post('/doctors', doctor),
  update: (id, doctor) => api.put(`/doctors/${id}`, doctor),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id) => api.get(`/staff/${id}`),
  getByStaffId: (staffId) => api.get(`/staff/staffId/${staffId}`),
  getByDepartment: (department) => api.get(`/staff/department/${department}`),
  getByDesignation: (designation) => api.get(`/staff/designation/${designation}`),
  searchByEmail: (email) => api.get(`/staff/email/${email}`),
  create: (staff) => api.post('/staff', staff),
  update: (id, staff) => api.put(`/staff/${id}`, staff),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Appointment API
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getByStatus: (status) => api.get(`/appointments/status/${status}`),
  getByDateRange: (start, end) => api.get('/appointments/date-range', { params: { start, end } }),
  getDoctorAppointmentsByDate: (doctorId, start, end) => 
    api.get(`/appointments/doctor/${doctorId}/date-range`, { params: { start, end } }),
  create: (appointment) => api.post('/appointments', appointment),
  update: (id, appointment) => api.put(`/appointments/${id}`, appointment),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, null, { params: { status } }),
  cancel: (id) => api.post(`/appointments/${id}/cancel`),
  complete: (id) => api.post(`/appointments/${id}/complete`),
};

// Bed API
export const bedAPI = {
  getAll: () => api.get('/beds'),
  getById: (id) => api.get(`/beds/${id}`),
  getByBedNumber: (bedNumber) => api.get(`/beds/bedNumber/${bedNumber}`),
  getByStatus: (status) => api.get(`/beds/status/${status}`),
  getAvailable: () => api.get('/beds/available'),
  getByWard: (wardName) => api.get(`/beds/ward/${wardName}`),
  getByType: (bedType) => api.get(`/beds/type/${bedType}`),
  getAvailableByWard: (wardName) => api.get(`/beds/ward/${wardName}/available`),
  getAvailableInWard: (ward) => api.get(`/beds/available/ward/${ward}`),
  getAvailableByType: (bedType) => api.get(`/beds/available/type/${bedType}`),
  getAvailableIsolationBeds: () => api.get('/beds/available/isolation'),
  getAvailableWithVentilator: () => api.get('/beds/available/ventilator'),
  getRealtimeBedMap: () => api.get('/beds/analytics/real-time-map'),
  getOccupancyAnalytics: () => api.get('/beds/analytics/occupancy'),
  getPredictedDischarges: (daysAhead = 7) => api.get('/beds/predicted-discharge', { params: { daysAhead } }),
  getOverstayAlerts: () => api.get('/beds/overstay-alerts'),
  calculateALOS: (ward, startDate, endDate) => api.get('/beds/analytics/alos', { params: { ward, startDate, endDate } }),
  getICUUtilization: () => api.get('/beds/analytics/icu-utilization'),
  getBedsRequiringMaintenance: () => api.get('/beds/maintenance/required'),
  create: (bed) => api.post('/beds', bed),
  update: (id, bed) => api.put(`/beds/${id}`, bed),
  delete: (id) => api.delete(`/beds/${id}`),
  admitPatient: (bedId, patientId) => api.post(`/beds/${bedId}/admit/${patientId}`),
  dischargePatient: (bedId) => api.post(`/beds/${bedId}/discharge`),
  transferPatient: (fromBedId, toBedId) => api.post('/beds/transfer', null, { params: { fromBedId, toBedId } }),
  markForMaintenance: (bedId) => api.post(`/beds/${bedId}/maintenance`),
  markAsAvailable: (bedId) => api.post(`/beds/${bedId}/available`),
  blockBed: (bedId, reason, blockedBy, blockedUntil) => 
    api.post(`/beds/${bedId}/block`, null, { params: { reason, blockedBy, blockedUntil } }),
  unblockBed: (bedId) => api.post(`/beds/${bedId}/unblock`),
  markBedCleaned: (bedId, cleanedBy) => api.post(`/beds/${bedId}/mark-cleaned`, null, { params: { cleanedBy } }),
  scheduleMaintenance: (bedId, notes, nextMaintenanceDate) => 
    api.post(`/beds/${bedId}/schedule-maintenance`, null, { params: { notes, nextMaintenanceDate } }),
  completeMaintenance: (bedId) => api.post(`/beds/${bedId}/complete-maintenance`),
};

// Lab Test API
export const labTestAPI = {
  getAll: () => api.get('/lab-tests'),
  getById: (id) => api.get(`/lab-tests/${id}`),
  getByTestCode: (testCode) => api.get(`/lab-tests/code/${testCode}`),

  getByCategory: (category) => api.get(`/lab-tests/category/${category}`),
  getByDepartment: (department) => api.get(`/lab-tests/department/${department}`),
  getProfiles: () => api.get('/lab-tests/profiles'),
  search: (testName) => api.get('/lab-tests/search', { params: { testName } }),
  create: (labTest) => api.post('/lab-tests', labTest),
  update: (id, labTest) => api.put(`/lab-tests/${id}`, labTest),
  delete: (id) => api.delete(`/lab-tests/${id}`),
};

// Sample API
export const sampleAPI = {
  getAll: () => api.get('/samples'),
  getById: (id) => api.get(`/samples/${id}`),
  getByAccession: (accessionNumber) => api.get(`/samples/accession/${accessionNumber}`),
  getByPatient: (patientId) => api.get(`/samples/patient/${patientId}`),
  getByStatus: (status) => api.get(`/samples/status/${status}`),
  getByCollectedBy: (collectedBy) => api.get(`/samples/collected-by/${collectedBy}`),
  getByDateRange: (startDate, endDate) => 
    api.get('/samples/date-range', { params: { startDate, endDate } }),
  generateAccessionNumber: () => api.get('/samples/generate-accession-number'),
  create: (sample) => api.post('/samples', sample),
  update: (id, sample) => api.put(`/samples/${id}`, sample),
  updateStatus: (id, statusData) => api.put(`/samples/${id}/status`, statusData),
  receiveSample: (id, receiveData) => api.put(`/samples/${id}/receive`, receiveData),
  rejectSample: (id, rejectData) => api.put(`/samples/${id}/reject`, rejectData),
  startProcessing: (id) => api.put(`/samples/${id}/start-processing`),
  completeSample: (id, completeData) => api.put(`/samples/${id}/complete`, completeData),
  delete: (id) => api.delete(`/samples/${id}`),
  countByStatus: (status) => api.get(`/samples/statistics/count-by-status/${status}`),
};

// Lab Test Request API
export const labTestRequestAPI = {
  getAll: () => api.get('/lab-test-requests'),
  getById: (id) => api.get(`/lab-test-requests/${id}`),
  getByPatient: (patientId) => api.get(`/lab-test-requests/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/lab-test-requests/doctor/${doctorId}`),
  getByStatus: (status) => api.get(`/lab-test-requests/status/${status}`),
  create: (request) => api.post('/lab-test-requests', request),
  update: (id, request) => api.put(`/lab-test-requests/${id}`, request),
  updateStatus: (id, status) => api.patch(`/lab-test-requests/${id}/status`, null, { params: { status } }),
  addResult: (id, result) => api.post(`/lab-test-requests/${id}/result`, result),
  verifyResult: (id) => api.post(`/lab-test-requests/${id}/verify`),
};

// Medication API
export const medicationAPI = {
  getAll: () => api.get('/medications'),
  getById: (id) => api.get(`/medications/${id}`),
  getByMedicationCode: (code) => api.get(`/medications/code/${code}`),
  getByCategory: (category) => api.get(`/medications/category/${category}`),
  getLowStock: () => api.get('/medications/low-stock'),
  create: (medication) => api.post('/medications', medication),
  update: (id, medication) => api.put(`/medications/${id}`, medication),
  updateStock: (id, quantity) => api.patch(`/medications/${id}/stock`, null, { params: { quantity } }),
  delete: (id) => api.delete(`/medications/${id}`),
};

// Pharmacy API (new)
export const pharmacyAPI = {
  listMedicines: () => api.get('/pharmacy/medicines'),
  getMedicine: (id) => api.get(`/pharmacy/medicines/${id}`),
  createMedicine: (payload) => api.post('/pharmacy/medicines', payload),
  updateMedicine: (id, payload) => api.put(`/pharmacy/medicines/${id}`, payload),
  deleteMedicine: (id) => api.delete(`/pharmacy/medicines/${id}`),
  addBatch: (id, batch) => api.post(`/pharmacy/medicines/${id}/batches`, batch),
  getBatches: (id) => api.get(`/pharmacy/medicines/${id}/batches`),
  expiringSoon: (days = 7) => api.get('/pharmacy/reports/expiring', { params: { days } }),
  lowStockReport: () => api.get('/pharmacy/reports/low-stock'),
  dispense: (id, qty) => api.post(`/pharmacy/medicines/${id}/dispense`, null, { params: { qty } }),
};

// Pharmacy billing & prescription dispense
export const pharmacyBillingAPI = {
  dispensePrescription: (prescriptionId, dispensedBy, admissionId, visitId) => api.post(
    `/pharmacy/prescriptions/${prescriptionId}/dispense`,
    null,
    { params: { dispensedBy, admissionId, visitId } }
  ),
  getBillsByPrescription: (prescriptionId) => api.get(`/pharmacy/bills/prescription/${prescriptionId}`),
  getBillsByPatient: (patientId) => api.get(`/pharmacy/bills/patient/${patientId}`),
  createBill: (payload) => api.post('/pharmacy/bills', payload),
};

// Simple pharmacy dispense APIs (no billing)
export const pharmacyDispenseAPI = {
  dispensePrescriptionSimple: (prescriptionId, dispensedBy = 'pharmacist') => api.post(
    `/pharmacy/prescriptions/${prescriptionId}/dispense-simple`,
    null,
    { params: { dispensedBy } }
  ),
  partialDispenseSimple: (prescriptionId, quantity, dispensedBy = 'pharmacist') => api.post(
    `/pharmacy/prescriptions/${prescriptionId}/partial-dispense-simple`,
    null,
    { params: { dispensedQuantity: quantity, dispensedBy } }
  ),
};

// Prescription API
export const prescriptionAPI = {
  getAll: () => api.get('/prescriptions'),
  getById: (id) => api.get(`/prescriptions/${id}`),
  getByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
  getByStatus: (status) => api.get(`/prescriptions/status/${status}`),
  create: (prescription) => api.post('/prescriptions', prescription),
  update: (id, prescription) => api.put(`/prescriptions/${id}`, prescription),
  dispense: (id, dispensedBy = 'pharmacist') => api.patch(`/prescriptions/${id}/dispense`, null, { params: { dispensedBy } }),
  partialDispense: (id, quantity, dispensedBy = 'pharmacist', admissionId = null, visitId = null) => api.patch(
    `/prescriptions/${id}/partial-dispense`,
    null,
    { params: { dispensedQuantity: quantity, dispensedBy, admissionId, visitId } }
  ),
};

// Bill API
export const billAPI = {
  getAll: () => api.get('/bills'),
  getById: (id) => api.get(`/bills/${id}`),
  getByBillNumber: (billNumber) => api.get(`/bills/bill-number/${billNumber}`),
  getByPatient: (patientId) => api.get(`/bills/patient/${patientId}`),
  getByStatus: (status) => api.get(`/bills/status/${status}`),
  create: (bill) => api.post('/bills', bill),
  update: (id, bill) => api.put(`/bills/${id}`, bill),
  addPayment: (id, payment) => api.post(`/bills/${id}/payment`, payment),
  processInsuranceClaim: (id) => api.post(`/bills/${id}/insurance/claim`),
  approveInsuranceClaim: (id, approvedAmount) => 
    api.post(`/bills/${id}/insurance/approve`, null, { params: { approvedAmount } }),
  rejectInsuranceClaim: (id, reason) => 
    api.post(`/bills/${id}/insurance/reject`, null, { params: { reason } }),
};

// QC Material API
export const qcMaterialAPI = {
  getAll: () => api.get('/qc-materials'),
  getById: (id) => api.get(`/qc-materials/${id}`),
  getByLabTest: (labTestId) => api.get(`/qc-materials/lab-test/${labTestId}`),
  getByLevel: (level) => api.get(`/qc-materials/level/${level}`),
  getExpired: () => api.get('/qc-materials/expired'),
  getExpiringSoon: (days = 30) => api.get('/qc-materials/expiring-soon', { params: { days } }),
  create: (material) => api.post('/qc-materials', material),
  update: (id, material) => api.put(`/qc-materials/${id}`, material),
  delete: (id) => api.delete(`/qc-materials/${id}`),
};

// QC Run API
export const qcRunAPI = {
  getAll: () => api.get('/qc-runs'),
  getById: (id) => api.get(`/qc-runs/${id}`),
  getByMaterial: (materialId) => api.get(`/qc-runs/material/${materialId}`),
  getByStatus: (status) => api.get(`/qc-runs/status/${status}`),
  getByDateRange: (startDate, endDate) => 
    api.get('/qc-runs/date-range', { params: { startDate, endDate } }),
  getByMaterialAndDateRange: (materialId, startDate, endDate) => 
    api.get(`/qc-runs/material/${materialId}/date-range`, { params: { startDate, endDate } }),
  getMaterialStatistics: (materialId, startDate, endDate) =>
    api.get(`/qc-runs/material/${materialId}/statistics`, { params: { startDate, endDate } }),
  create: (run) => api.post('/qc-runs', run),
  update: (id, run) => api.put(`/qc-runs/${id}`, run),
  delete: (id) => api.delete(`/qc-runs/${id}`),
};

// Critical Alert API
export const criticalAlertAPI = {
  getAll: () => api.get('/critical-alerts'),
  getById: (id) => api.get(`/critical-alerts/${id}`),
  getActive: () => api.get('/critical-alerts/active'),
  getUnacknowledged: () => api.get('/critical-alerts/unacknowledged'),
  getCount: () => api.get('/critical-alerts/count'),
  getByPatient: (patientId) => api.get(`/critical-alerts/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/critical-alerts/doctor/${doctorId}`),
  acknowledge: (id, data) => api.put(`/critical-alerts/${id}/acknowledge`, data),
  escalate: (id, data) => api.put(`/critical-alerts/${id}/escalate`, data),
  resolve: (id, data) => api.put(`/critical-alerts/${id}/resolve`, data),
  cancel: (id, data) => api.put(`/critical-alerts/${id}/cancel`, data),
};

// IPD/Admission API
export const admissionAPI = {
  getAll: () => api.get('/admissions'),
  getById: (id) => api.get(`/admissions/${id}`),
  getByPatientId: (patientId) => api.get(`/admissions/patient/${patientId}`),
  getActive: () => api.get('/admissions/active'),
  getByAdmissionNumber: (admissionNumber) => api.get(`/admissions/admission-number/${admissionNumber}`),
  getByDoctorId: (doctorId) => api.get(`/admissions/doctor/${doctorId}`),
  getByDepartment: (department) => api.get(`/admissions/department/${department}`),
  getByStatus: (status) => api.get(`/admissions/status/${status}`),
  admit: (data) => api.post('/admissions', data),
  update: (id, data) => api.put(`/admissions/${id}`, data),
  transfer: (id, bedId) => api.put(`/admissions/${id}/transfer/${bedId}`),
  discharge: (id) => api.put(`/admissions/${id}/discharge`),
};

// Bed Management API merged - see earlier definition

// Care Pathway API
export const carePathwayAPI = {
  getById: (id) => api.get(`/care-pathways/${id}`),
  getByAdmissionId: (admissionId) => api.get(`/care-pathways/admission/${admissionId}`),
  create: (data) => api.post('/care-pathways', data),
  update: (id, data) => api.put(`/care-pathways/${id}`, data),
  complete: (id) => api.put(`/care-pathways/${id}/complete`),
};

// Nurse Task API
export const nurseTaskAPI = {
  getAll: () => api.get('/nurse-tasks'),
  getById: (id) => api.get(`/nurse-tasks/${id}`),
  getByAdmissionId: (admissionId) => api.get(`/nurse-tasks/admission/${admissionId}`),
  getByAssignedNurse: (nurseId) => api.get(`/nurse-tasks/nurse/${nurseId}`),
  getByStatus: (status) => api.get(`/nurse-tasks/status/${status}`),
  getTaskBoard: () => api.get('/nurse-tasks/task-board'),
  create: (task) => api.post('/nurse-tasks', task),
  update: (id, task) => api.put(`/nurse-tasks/${id}`, task),
  start: (id) => api.put(`/nurse-tasks/${id}/start`),
  complete: (id, completedBy, notes) => api.put(`/nurse-tasks/${id}/complete`, null, { params: { completedBy, notes } }),
  markMissed: (id, missedBy, reason) => api.put(`/nurse-tasks/${id}/missed`, null, { params: { missedBy, reason } }),
  markRefused: (id, reason) => api.put(`/nurse-tasks/${id}/refused`, null, { params: { reason } }),
  defer: (id, newDueDate, reason) => api.put(`/nurse-tasks/${id}/defer`, null, { params: { newDueDate, reason } }),
  skip: (id, skippedBy, reason) => api.put(`/nurse-tasks/${id}/skip`, null, { params: { skippedBy, reason } }),
  delete: (id) => api.delete(`/nurse-tasks/${id}`),
};

// Clinical Score API
export const clinicalScoreAPI = {
  getById: (id) => api.get(`/clinical-scores/${id}`),
  getByAdmissionId: (admissionId) => api.get(`/clinical-scores/admission/${admissionId}`),
  getLatestByAdmissionId: (admissionId) => api.get(`/clinical-scores/admission/${admissionId}/latest`),
  calculateNEWS: (admissionId, vitalSignId, recordedBy) => 
    api.post(`/clinical-scores/calculate/NEWS/${admissionId}`, null, { params: { vitalSignId, recordedBy } }),
  calculateMEWS: (admissionId, vitalSignId, recordedBy) => 
    api.post(`/clinical-scores/calculate/MEWS/${admissionId}`, null, { params: { vitalSignId, recordedBy } }),
};

export default api;
