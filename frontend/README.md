# Frontend Documentation

## Technology Stack

- **React** 18.2.0 - UI framework
- **Material-UI (MUI)** 5.15.0 - Component library
- **React Router** 6.20.0 - Client-side routing
- **Axios** 1.6.2 - HTTP client
- **Context API** - State management

## Project Structure

```
frontend/src/
├── components/          # Reusable components
│   ├── Layout.js       # Main layout with sidebar navigation
│   └── PrivateRoute.js # Protected route wrapper
├── context/            # React Context providers
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── Login.js        # Login page
│   ├── patients/       # Patient management
│   │   ├── PatientList.js
│   │   ├── PatientForm.js
│   │   └── PatientDetails.js
│   ├── doctors/        # Doctor management
│   │   ├── DoctorList.js
│   │   └── DoctorForm.js
│   ├── staff/          # Staff management
│   │   └── StaffManagement.js
│   ├── appointments/   # Appointment scheduling
│   │   └── AppointmentList.js
│   ├── beds/           # Bed/ADT management
│   │   └── BedManagement.js
│   ├── medical-records/
│   │   └── MedicalRecordsList.js
│   ├── lab/            # Laboratory
│   │   └── LabTestsList.js
│   ├── pharmacy/       # Pharmacy
│   │   └── PharmacyDashboard.js
│   └── billing/        # Billing
│       └── BillingDashboard.js
├── services/           # API services
│   └── api.js          # Axios instance & API modules
├── App.js              # Main app component with routing
└── index.js            # App entry point
```

## Setup & Installation

### Prerequisites

- Node.js 16+ and npm

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Configuration

Create `.env` file in frontend directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

For production:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Run Development Server

```bash
npm start
```

Application runs on http://localhost:3000

### Build for Production

```bash
npm run build
```

Builds optimized production bundle in `build/` directory.

## API Integration

### API Service (`services/api.js`)

Centralized axios instance with:
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)

### Available API Modules

#### Authentication
```javascript
import { authAPI } from './services/api';

authAPI.login(credentials)
authAPI.register(userData)
authAPI.refreshToken(refreshToken)
```

#### Patients
```javascript
import { patientAPI } from './services/api';

patientAPI.getAll()
patientAPI.getById(id)
patientAPI.create(patient)
patientAPI.update(id, patient)
patientAPI.delete(id)
```

#### Doctors
```javascript
import { doctorAPI } from './services/api';

doctorAPI.getAll()
doctorAPI.getBySpecialization(specialization)
doctorAPI.create(doctor)
doctorAPI.update(id, doctor)
```

#### Staff
```javascript
import { staffAPI } from './services/api';

staffAPI.getAll()
staffAPI.getByDepartment(department)
staffAPI.create(staff)
```

#### Appointments
```javascript
import { appointmentAPI } from './services/api';

appointmentAPI.getAll()
appointmentAPI.create(appointment) // Conflict detection
appointmentAPI.cancel(id)
appointmentAPI.complete(id)
appointmentAPI.getDoctorAppointmentsByDate(doctorId, start, end)
```

#### Beds (ADT)
```javascript
import { bedAPI } from './services/api';

bedAPI.getAvailable()
bedAPI.admitPatient(bedId, patientId)
bedAPI.dischargePatient(bedId)
bedAPI.transferPatient(fromBedId, toBedId)
```

#### Lab Tests
```javascript
import { labTestRequestAPI } from './services/api';

labTestRequestAPI.getAll()
labTestRequestAPI.create(request)
labTestRequestAPI.addResult(id, result)
labTestRequestAPI.verifyResult(id)
```

#### Medications
```javascript
import { medicationAPI } from './services/api';

medicationAPI.getAll()
medicationAPI.getLowStock()
medicationAPI.updateStock(id, quantity)
```

#### Prescriptions
```javascript
import { prescriptionAPI } from './services/api';

prescriptionAPI.getAll()
prescriptionAPI.dispense(id)
prescriptionAPI.partialDispense(id, quantity)
```

#### Billing
```javascript
import { billAPI } from './services/api';

billAPI.getAll()
billAPI.create(bill)
billAPI.addPayment(id, payment)
billAPI.processInsuranceClaim(id)
```

## Authentication Flow

1. **Login** - POST `/auth/login` returns JWT token
2. **Token Storage** - Stored in localStorage
3. **Request Interceptor** - Automatically adds token to headers
4. **Response Interceptor** - Redirects to login on 401
5. **Logout** - Removes token and redirects

### Protected Routes

All routes except `/login` require authentication:

```javascript
<Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
  <Route path="patients" element={<PatientList />} />
  {/* ... other protected routes */}
</Route>
```

## Key Features

### Doctor Management
- ✅ List all doctors with specialization filter
- ✅ Create/edit doctor profiles
- ✅ Auto-generated doctor IDs (DOC-XXXXXXXX)
- ✅ View by specialization

### Staff Management
- ✅ View staff by department
- ✅ Filter by designation
- ✅ Staff directory with contact info

### Appointment Scheduling
- ✅ **Conflict detection** - prevents double-booking
- ✅ Book appointments with patient/doctor selection
- ✅ View appointments by date/doctor/patient
- ✅ Cancel/complete appointments
- ✅ Appointment types (Consultation, Follow-up, Emergency)

### Bed Management (ADT)
- ✅ Visual bed status (Available, Occupied, Maintenance)
- ✅ **Admit patient** to bed
- ✅ **Discharge patient** from bed
- ✅ **Transfer patient** between beds
- ✅ Group beds by ward
- ✅ Mark beds for maintenance

### Lab Tests
- ✅ View all test requests
- ✅ Filter by status (Requested, In Progress, Completed)
- ✅ Priority indicators (STAT, URGENT, ROUTINE)
- ✅ Verify test results

### Pharmacy
- ✅ **Low stock alerts** - medications below reorder level
- ✅ Pending prescriptions queue
- ✅ Dispense medications
- ✅ Stock management

### Billing
- ✅ View all bills with status
- ✅ Add payments (Cash, Card, UPI, etc.)
- ✅ Track due amounts
- ✅ Payment method selection
- ✅ Auto-calculate status (Pending → Partially Paid → Paid)

## UI Components

### Layout Navigation
Sidebar menu with icons:
- 📊 Dashboard
- 👥 Patients
- 🩺 Doctors
- 👔 Staff
- 📅 Appointments
- 🛏️ Bed Management
- 📋 Medical Records
- 🔬 Lab Tests
- 💊 Pharmacy
- 💰 Billing

### Common Patterns

#### Data Tables
All list pages use Material-UI Table with:
- Loading state
- Empty state messages
- Action buttons (Edit, Delete, etc.)
- Status chips with color coding

#### Forms
- Material-UI TextField components
- Grid layout for responsive design
- Form validation
- Loading states on submit
- Success/error alerts

#### Dialogs
Modal dialogs for:
- Creating new records
- Confirming actions
- Adding payments
- Admitting patients

## Styling

Uses Material-UI theme:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});
```

Custom styling via `sx` prop:
```javascript
<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
  {/* content */}
</Box>
```

## Error Handling

- API errors displayed via Alert components
- 401 errors auto-redirect to login
- Form validation errors shown inline
- Network errors caught and displayed

## Performance Optimization

- React.lazy() for code splitting (can be added)
- Memoization with React.memo (can be added)
- Debounced search inputs (can be added)
- Pagination for large datasets (can be added)

## Testing

```bash
# Run tests
npm test

# Coverage report
npm run test:coverage
```

## Deployment

### Build & Deploy

```bash
npm run build
```

Deploy `build/` directory to:
- **Netlify**: Drag & drop or CLI
- **Vercel**: `vercel --prod`
- **AWS S3**: Upload to S3 bucket
- **Nginx**: Copy to web root

### Environment Variables

Set in deployment platform:
- `REACT_APP_API_URL` - Backend API URL

### CORS Configuration

Ensure backend allows your frontend origin in `CorsConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://your-frontend-domain.com"
));
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new features:

1. **Create API module** in `services/api.js`
2. **Add page component** in `pages/[module]/`
3. **Update routing** in `App.js`
4. **Add navigation** in `Layout.js`
5. **Test thoroughly** before committing

## Common Issues

### CORS Errors
- Ensure backend CORS config includes frontend URL
- Check browser console for specific error

### 401 Unauthorized
- Token expired - login again
- Backend not running - start backend server

### API Connection Failed
- Check `REACT_APP_API_URL` in `.env`
- Verify backend is running on correct port
- Check network tab in browser DevTools

## Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Advanced search/filtering
- [ ] Data export (PDF, Excel)
- [ ] Charts and analytics
- [ ] Mobile responsive improvements
- [ ] Dark mode theme
- [ ] Multi-language support (i18n)
- [ ] Offline mode (PWA)

## License

Part of Hospital Management System project.
