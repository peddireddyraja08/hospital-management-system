# Hospital Operations Dashboard - Floor-Ward-Bed Management Module

## Overview

The **Hospital Operations Dashboard** is a comprehensive real-time monitoring and management system for the Floor-Ward-Bed hierarchy in the Hospital Information System (HIS). It provides interactive visualizations, operational insights, and quick access to critical hospital capacity information.

## Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              HOSPITAL OPERATIONS DASHBOARD                   │
│                  (Real-time Monitoring)                      │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┬─────────────┬────────────────┐
    │                 │             │                │
┌───▼───┐      ┌──────▼──────┐  ┌──▼───────┐  ┌────▼─────┐
│ FLOOR │      │    WARD     │  │   BED    │  │ PATIENT  │
│ MGMT  │◄────►│    MGMT     │◄─┤   MGMT   │◄─┤ ADMISSION│
└───────┘      └─────────────┘  └──────────┘  └──────────┘
     │              │                │              │
     └──────────────┴────────────────┴──────────────┘
                      │
              ┌───────▼────────┐
              │ UNIFIED BACKEND│
              │   SPRING BOOT  │
              └────────────────┘
```

## Features

### 1. **Operations Dashboard** (`/hospital-operations`)

#### **Overview & Analytics Tab**
- **Key Metrics Cards**:
  - Total Floors (building-wide count)
  - Total Wards (department count)
  - Total Beds (capacity)
  - Overall Occupancy Rate (real-time %)
  
- **Visual Analytics**:
  - **Pie Chart**: Bed Status Distribution (Available, Occupied, Maintenance, Cleaning)
  - **Bar Chart**: Floor-wise Occupancy Comparison
  - **Horizontal Bar Chart**: Ward Occupancy Ranking (Top 10)
  
- **Critical Alerts**:
  - High Occupancy Warnings (>85% capacity)
  - Lists wards exceeding critical threshold
  
- **Today's Activity**:
  - Admissions Today
  - Pending Discharges
  - Available Beds Count

#### **Floor View Tab**
- Vertical building-style display of all floors
- Per-floor statistics:
  - Total/Available/Occupied bed counts
  - Occupancy percentage with color-coded progress bars
  - Ward list per floor
  - Maintenance/Cleaning bed counts
  
- **Visual Indicators**:
  - 🔴 Red: >80% occupancy
  - 🟡 Yellow: 60-80% occupancy
  - 🟢 Green: <60% occupancy

#### **Ward View Tab**
- Grid-based card display of all wards
- Per-ward statistics:
  - Total Beds
  - Available Beds
  - Occupied Beds
  - Cleaning Beds
  - Occupancy rate with color-coded badge
  - Floor assignment

### 2. **Floor Management** (`/floors`)

#### **Building-Level Planning**
- **Building Wizard** (3-step process):
  1. **Building Info**: Name, total floors, starting floor number
  2. **Configure Floors**: Table editor to customize all floors at once
     - Floor Number, Name, Type, Capacity, Description
  3. **Review & Create**: Visual preview cards before bulk creation

- **Floor Types**:
  - General, Critical Care, Surgical, Maternity, Pediatric
  - Outpatient, Emergency, Administrative, Mixed

- **Single Floor Creation**:
  - Quick form for individual floor setup
  - Floor number, name, type, capacity

- **Real-Time Floor Display**:
  - Vertical building visualization
  - Live occupancy data from bed management
  - Ward distribution per floor

### 3. **Ward Management** (`/wards`)

#### **Ward Configuration**
- **Add/Edit Ward Dialog**:
  - Ward Name
  - Floor Assignment
  - Ward Capacity
  - Department
  - Description

- **Ward Statistics**:
  - Color-coded occupancy cards
  - Total beds, available beds, occupied beds
  - Occupancy percentage with visual indicators

- **Auto-Detection**:
  - Discovers existing wards from bed data
  - Calculates real-time statistics

### 4. **Bed Creation** (`/beds/create`)

#### **Bulk Bed Creation Wizard** (4 steps)
1. **Ward & Type Selection**:
   - Select existing ward or create custom
   - Choose bed type (ICU, General, Private, Emergency, Isolation)

2. **Bed Number Generation**:
   - Prefix (e.g., ICU, GW, PW)
   - Start and End Range (e.g., 001 to 020)
   - Auto-generates bed numbers

3. **Features & Pricing**:
   - Oxygen Support (Yes/No)
   - Ventilator (Yes/No)
   - Isolation (Yes/No)
   - Daily Charge (currency input)

4. **Review & Create**:
   - Table preview of all beds
   - Remove unwanted beds
   - Bulk creation in single transaction

### 5. **Bed Management** (`/beds`)

#### **Day-to-Day ADT Operations**
- **Bed Actions**:
  - Admit Patient
  - Discharge Patient
  - Transfer Patient
  - Change Bed Status (Available, Occupied, Under Maintenance, Cleaning, Reserved, Blocked)

- **Quick Navigation**:
  - Floor Plan → `/floors`
  - Wards → `/wards`
  - Bulk Create → `/beds/create`
  - Add Bed (single)

- **Bed Filtering**:
  - By Ward, Floor, Status, Type
  - Search by bed number

- **Real-Time Status Display**:
  - Color-coded bed cards
  - Patient assignment info
  - Current occupant details

## Technical Stack

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI v5
- **Charts**: Recharts
- **Routing**: React Router v6
- **State Management**: React Context API (AuthContext)
- **API Client**: Axios with interceptors

### Backend
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security + JWT
- **Database**: JPA/Hibernate with PostgreSQL
- **Architecture**: Controller → Service → Repository → Entity

### Real-Time Updates
- Auto-refresh every 30 seconds
- Manual refresh button available
- Live data from admission and bed APIs

## API Endpoints Used

### Admission APIs
```
GET  /api/admissions           - Get all admissions
GET  /api/admissions/active    - Get active admissions
GET  /api/admissions/{id}      - Get admission by ID
POST /api/admissions           - Create admission
PUT  /api/admissions/{id}/discharge - Discharge patient
```

### Bed APIs
```
GET  /api/beds                 - Get all beds
GET  /api/beds/{id}            - Get bed by ID
GET  /api/beds/ward/{ward}     - Get beds by ward
GET  /api/beds/floor/{floor}   - Get beds by floor
POST /api/beds                 - Create bed(s)
PUT  /api/beds/{id}            - Update bed
PUT  /api/beds/{id}/status     - Change bed status
```

## Data Flow

### Dashboard Data Processing
1. **Fetch Raw Data**:
   - Beds from `bedAPI.getAll()`
   - Admissions from `admissionAPI.getActive()`

2. **Process Hierarchy**:
   ```
   Beds Array → Floor Map → Ward Map → Statistics
   ```

3. **Calculate Metrics**:
   - Floor-level: Aggregate beds by floorNumber
   - Ward-level: Aggregate beds by wardName + floorNumber
   - Occupancy: (Occupied / Total) × 100

4. **Render Views**:
   - Overview: Charts with aggregated data
   - Floor View: Floor cards with nested ward info
   - Ward View: Ward cards with bed statistics

### Real-Time Updates
```javascript
useEffect(() => {
  fetchDashboardData();
  const interval = setInterval(fetchDashboardData, 30000); // 30s refresh
  return () => clearInterval(interval);
}, []);
```

## Bed Status Mapping

| Status             | Color  | Meaning                          |
|--------------------|--------|----------------------------------|
| AVAILABLE          | Green  | Ready for patient assignment     |
| OCCUPIED           | Red    | Currently has patient            |
| UNDER_MAINTENANCE  | Gray   | Undergoing repairs               |
| CLEANING           | Orange | Being cleaned/sanitized          |
| RESERVED           | Blue   | Reserved for specific patient    |
| BLOCKED            | Black  | Administratively blocked         |

## Navigation Structure

```
Dashboard
  └── Inpatient (IPD) Section
      ├── Operations Dashboard ★ (Main Entry Point)
      ├── IPD Dashboard
      ├── Bed Map
      ├── Patient Timeline
      ├── Task Board
      ├── IPD Analytics
      ├── Floor Management
      ├── Ward Management
      ├── Bed Creation
      └── Bed Management
```

## Workflow Examples

### Example 1: New Hospital Setup
1. **Create Building Structure**:
   - Navigate to `/floors`
   - Use Building Wizard
   - Enter: "Main Building", 5 floors, starting from Floor 1
   - Configure each floor (type, capacity, name)
   - Review and create all floors

2. **Create Wards**:
   - Navigate to `/wards`
   - Add ward: "ICU Ward", Floor 3, Capacity 20
   - Add ward: "General Ward A", Floor 2, Capacity 40
   - Add ward: "Private Ward", Floor 4, Capacity 10

3. **Bulk Create Beds**:
   - Navigate to `/beds/create`
   - Select "ICU Ward", type "ICU"
   - Prefix "ICU", Range 001-020
   - Enable Oxygen + Ventilator, Daily charge 5000
   - Review and create 20 ICU beds

4. **Monitor Operations**:
   - Navigate to `/hospital-operations`
   - View real-time occupancy
   - Check floor-wise distribution
   - Monitor ward capacity

### Example 2: Daily Operations
1. **Morning Review**:
   - Check Operations Dashboard
   - Identify high-occupancy wards (>85%)
   - Review pending discharges
   - Check available beds per floor

2. **Admission Process**:
   - Navigate to `/beds`
   - Find available bed in appropriate ward
   - Admit patient to bed (status: OCCUPIED)
   - Dashboard auto-updates occupancy

3. **Discharge Process**:
   - Mark bed status as "CLEANING"
   - After housekeeping, change to "AVAILABLE"
   - Dashboard reflects new capacity

4. **Transfer Process**:
   - Patient needs ICU bed
   - Check ICU ward occupancy on dashboard
   - Transfer from General Ward to ICU
   - Both floors' occupancy updated

## Color Scheme

### Occupancy Rate Colors
- **Green** (<60%): Comfortable capacity
- **Yellow** (60-80%): Moderate load
- **Red** (>80%): High load / Near capacity

### Status Colors
- **Green**: Available, Normal
- **Red**: Occupied, Critical
- **Orange**: Cleaning, Warning
- **Gray**: Maintenance, Neutral
- **Blue**: Reserved, Information

## Performance Optimization

### Data Fetching
- Parallel API calls with `Promise.all()`
- Cached responses for 30 seconds
- Efficient data aggregation with Maps

### Rendering
- Lazy loading for charts
- Responsive container for dynamic sizing
- Conditional rendering based on tab selection

### User Experience
- Loading states during data fetch
- Error boundaries with retry options
- Smooth transitions between tabs
- Mobile-responsive design

## Access Control

### Role-Based Permissions
- **ADMIN**: Full access to all modules
- **DOCTOR**: View-only dashboard, read bed status
- **NURSE**: Dashboard + ADT operations
- **RECEPTIONIST**: Dashboard + admission operations
- **PATIENT**: No access to this module

## Key Benefits

1. **Real-Time Visibility**: 
   - Instant view of hospital capacity
   - Live occupancy tracking
   - Critical alerts for high occupancy

2. **Operational Efficiency**:
   - Quick bed availability checks
   - Floor/Ward performance comparison
   - Pending discharge tracking

3. **Strategic Planning**:
   - Building wizard for expansion planning
   - Bulk bed creation for new wards
   - Historical occupancy trends (with analytics)

4. **Compliance & Reporting**:
   - Bed utilization rates
   - Department-wise capacity reports
   - Audit trail (via BaseEntity timestamps)

## Future Enhancements

1. **Historical Trends**:
   - Line charts showing occupancy over time
   - Peak hours analysis
   - Seasonal trends

2. **Predictive Analytics**:
   - Bed availability forecasting
   - Discharge prediction models
   - Optimal bed allocation suggestions

3. **Mobile App**:
   - Push notifications for critical alerts
   - Quick bed status updates
   - Barcode scanning for bed assignment

4. **Integration**:
   - HL7/FHIR integration for bed census
   - EMR integration for automatic status updates
   - Housekeeping system integration for cleaning status

## Troubleshooting

### Dashboard Not Loading
- Check backend server (port 8080)
- Verify JWT token in localStorage
- Check browser console for API errors

### Occupancy Not Updating
- Click refresh button manually
- Check bed status in Bed Management
- Verify admission records exist

### Charts Not Rendering
- Ensure Recharts library installed
- Check data format in console
- Verify container has defined height

## Access URLs

- **Operations Dashboard**: `http://localhost:3000/dashboard/hospital-operations`
- **Floor Management**: `http://localhost:3000/dashboard/floors`
- **Ward Management**: `http://localhost:3000/dashboard/wards`
- **Bed Creation**: `http://localhost:3000/dashboard/beds/create`
- **Bed Management**: `http://localhost:3000/dashboard/beds`

## Quick Start

1. **Login** to the system (any role with DOCTOR, NURSE, or ADMIN)
2. **Navigate** to "Inpatient" section in sidebar
3. **Click** "Operations Dashboard"
4. **Explore** three tabs:
   - Overview & Analytics
   - Floor View
   - Ward View
5. **Use** quick links to manage floors, wards, and beds

---

**Module Status**: ✅ **Production Ready**  
**Last Updated**: December 6, 2025  
**Version**: 1.0.0
