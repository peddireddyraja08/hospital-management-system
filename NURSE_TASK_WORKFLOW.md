# Nurse Task Workflow Documentation

## 🔄 Complete Task Lifecycle

```
[Task Created] → PENDING → DUE → IN_PROGRESS → COMPLETED
                    ↓       ↓          ↓
                  (time)  (start)   MISSED
                                       ↓
                                    REFUSED
                                       ↓
                                  (if recurring)
                                       ↓
                               Generate Next Task
```

---

## 📊 Status States Explained

### **PENDING** (Initial State)
- **Description**: Task created and scheduled, but due time has not arrived yet
- **Color**: Blue
- **Actions Available**: 
  - ✅ Start Task (moves to IN_PROGRESS)
  - 🕐 Defer
  - ❌ Cancel
- **Auto-Transition**: When `dueTime` is reached → moves to DUE

---

### **DUE** (Ready for Action)
- **Description**: Task has reached its due time and needs immediate attention
- **Color**: Orange
- **Actions Available**:
  - ▶️ Start Task (moves to IN_PROGRESS)
  - ✅ Complete (if done quickly)
  - ⚠️ Mark as Missed (if window passed)
  - 🕐 Defer
  - ❌ Cancel
- **Visual**: Appears in "Due Now" column

---

### **IN_PROGRESS** (Being Performed)
- **Description**: Nurse has started working on the task
- **Color**: Yellow/Amber
- **Timestamp**: `startedAt` recorded
- **Actions Available**:
  - ✅ Complete
  - ⚠️ Mark as Missed
  - 🚫 Patient Refused
  - ❌ Cancel
- **Note**: No defer option once started

---

### **COMPLETED** ✓ (Success)
- **Description**: Task successfully completed
- **Color**: Green
- **Timestamps**: 
  - `completedTime` recorded
  - `completedBy` recorded
- **Data Captured**:
  - Completion notes
  - Who completed it
  - Completion timestamp
- **Final State**: No further actions
- **Recurring**: If `isRecurring = true`, generates next task

---

### **MISSED** ⚠️ (Not Performed)
- **Description**: Task was not completed within the required timeframe
- **Color**: Orange/Warning
- **Use Cases**:
  - Patient was unavailable
  - Staff shortage prevented completion
  - Emergency situation took priority
  - Patient sleeping/unavailable
- **Data Captured**:
  - `missedReason` (required)
  - `missedBy` (who documented)
  - `missedAt` timestamp
- **Recurring**: If `isRecurring = true`, generates next task
- **Important**: Different from REFUSED - task wasn't attempted

---

### **REFUSED** 🚫 (Patient Declined)
- **Description**: Patient refused the task/treatment
- **Color**: Blue/Info
- **Use Cases**:
  - Patient declined medication
  - Refused vital signs check
  - Declined procedure preparation
  - Patient exercising autonomy
- **Data Captured**:
  - `refusedReason` (required - document patient's reason)
  - `refusedAt` timestamp
- **Important**: Requires proper documentation for legal/medical records
- **Action**: Notify physician if critical task refused

---

### **DEFERRED** 🕐 (Postponed)
- **Description**: Task moved to a later time
- **Color**: Purple
- **Use Cases**:
  - Patient temporarily unavailable
  - Waiting for test results
  - Equipment not available
  - Doctor's orders pending
- **Data Captured**:
  - New `dueTime`
  - Defer reason in notes
- **Behavior**: Task returns to PENDING with new schedule

---

### **CANCELLED** ❌ (Not Needed)
- **Description**: Task no longer needed or applicable
- **Color**: Red
- **Use Cases**:
  - Patient discharged
  - Order discontinued by doctor
  - Duplicate task
  - No longer medically necessary
- **Data Captured**:
  - `skipReason` (required)
  - `skippedBy`
  - `skippedAt` timestamp
- **Final State**: No further actions

---

## 🔄 Recurring Tasks

### How Recurring Tasks Work

1. **Task Creation with Recurrence**:
   - Set `isRecurring = true`
   - Specify `recurrencePattern` (e.g., "Q4H", "Q6H", "DAILY")
   
2. **Task Completion**:
   - When COMPLETED or MISSED
   - System automatically generates next occurrence
   
3. **Next Task Generation**:
   - New task created with same parameters
   - New `scheduledTime` calculated based on pattern
   - Status set to PENDING
   - Linked to same admission and orders

### Supported Recurrence Patterns

| Pattern | Description | Next Scheduled Time |
|---------|-------------|---------------------|
| **Q2H** | Every 2 hours | +2 hours |
| **Q4H** | Every 4 hours | +4 hours |
| **Q6H** | Every 6 hours | +6 hours |
| **Q8H** | Every 8 hours | +8 hours |
| **Q12H** | Every 12 hours | +12 hours |
| **BID** | Twice daily | +12 hours |
| **TID** | Three times daily | +8 hours |
| **QID** | Four times daily | +6 hours |
| **DAILY/QD** | Once daily | +24 hours |

### Example: Vital Signs Q4H

```
09:00 - Task Created (PENDING)
09:00 - Auto-move to DUE
09:05 - Nurse starts task (IN_PROGRESS)
09:10 - Nurse completes (COMPLETED)
       ↓
13:00 - New task auto-generated (PENDING)
13:00 - Auto-move to DUE
... cycle continues
```

---

## 🎯 Workflow Decision Tree

### When Task Becomes DUE:

```
Is nurse available?
  ├─ YES → Start Task (IN_PROGRESS)
  │         ├─ Completed successfully? → COMPLETED ✓
  │         ├─ Patient refused? → REFUSED 🚫
  │         └─ Couldn't finish? → MISSED ⚠️
  │
  └─ NO → 
      ├─ Can defer? → DEFERRED 🕐
      ├─ No longer needed? → CANCELLED ❌
      └─ Window passed? → MISSED ⚠️
```

---

## 📱 User Interface Actions

### In Task Board:

#### PENDING Tasks Column:
- 🔵 Blue cards
- Click to view details
- Drag to other columns
- **Quick Actions**: Start, Defer, Cancel

#### DUE Tasks Column:
- 🟠 Orange cards
- Urgent attention indicator
- **Quick Actions**: Start, Complete, Missed

#### IN_PROGRESS Column:
- 🟡 Yellow cards
- Shows who's working on it
- **Quick Actions**: Complete, Missed, Refused

#### COMPLETED Column:
- 🟢 Green cards
- Read-only
- Shows completion details

---

## 🔔 Best Practices

### ✅ Completing Tasks
1. **Start the task** when you begin
2. **Document thoroughly** in completion notes
3. **Record actual time** performed
4. **Note any deviations** from standard procedure

### ⚠️ Missing Tasks
1. **Document immediately** when task is missed
2. **Provide specific reason** (not vague)
3. **Notify charge nurse** for critical tasks
4. **Follow facility protocol** for missed medications

### 🚫 Refused Tasks
1. **Document exact patient statement**
2. **Explain risks** explained to patient
3. **Notify physician** immediately for critical refusals
4. **Complete incident report** if required
5. **Respect patient autonomy**

### 🕐 Deferring Tasks
1. **Only defer with valid reason**
2. **Set realistic new time**
3. **Communicate** to next shift if needed
4. **Don't defer critical tasks** without approval

### ❌ Cancelling Tasks
1. **Verify with physician** if order-based
2. **Document reason clearly**
3. **Check for dependencies** (linked tasks)
4. **Notify team members**

---

## 🔒 Status Transition Rules

### Valid Transitions:

```
PENDING → DUE ✓ (automatic)
PENDING → IN_PROGRESS ✓ (nurse starts)
PENDING → DEFERRED ✓
PENDING → CANCELLED ✓

DUE → IN_PROGRESS ✓ (nurse starts)
DUE → COMPLETED ✓ (quick completion)
DUE → MISSED ✓
DUE → DEFERRED ✓
DUE → CANCELLED ✓

IN_PROGRESS → COMPLETED ✓
IN_PROGRESS → MISSED ✓
IN_PROGRESS → REFUSED ✓
IN_PROGRESS → CANCELLED ✓

DEFERRED → PENDING ✓ (automatic when new time arrives)
```

### Invalid Transitions:

```
COMPLETED → any other status ✗ (final state)
MISSED → IN_PROGRESS ✗ (can't retroactively start)
REFUSED → COMPLETED ✗ (can't complete if refused)
CANCELLED → any status ✗ (final state)
```

---

## 📊 Reporting & Analytics

### Metrics Tracked:

1. **Completion Rate**: (COMPLETED / Total Tasks) × 100
2. **Missed Rate**: (MISSED / Total Tasks) × 100
3. **Refusal Rate**: (REFUSED / Total Tasks) × 100
4. **Average Completion Time**: Time from DUE to COMPLETED
5. **Defer Rate**: (DEFERRED / Total Tasks) × 100

### Quality Indicators:

- ✅ **Green**: >95% completion rate
- 🟡 **Yellow**: 90-95% completion rate
- 🔴 **Red**: <90% completion rate

---

## 🆘 Common Scenarios

### Scenario 1: Medication Administration (Q6H)

```
08:00 - PENDING (Scheduled for 09:00)
09:00 - DUE (Nurse notified)
09:05 - IN_PROGRESS (Nurse preparing meds)
09:10 - COMPLETED (Administered, documented)
       → System generates next task for 15:00
15:00 - Next cycle begins
```

### Scenario 2: Patient Refuses Medication

```
09:00 - DUE
09:05 - IN_PROGRESS (Nurse at bedside)
09:07 - REFUSED (Patient declines)
       → Nurse documents: "Patient refused due to nausea"
       → Physician notified
       → Next occurrence still generated (patient may accept later)
```

### Scenario 3: Emergency Interrupts Task

```
09:00 - DUE (Vital signs check)
09:05 - IN_PROGRESS (Starting vitals)
09:06 - Emergency in next room
09:30 - Task window passed
       → MISSED (Documented: "Emergency code in room 302")
       → Next occurrence generated
```

### Scenario 4: Patient Sleeping

```
09:00 - DUE (Non-urgent assessment)
09:05 - DEFERRED to 10:00 (Reason: "Patient sleeping, comfortable")
10:00 - Task becomes DUE again
10:05 - IN_PROGRESS
10:15 - COMPLETED
```

---

## 🔧 Technical Implementation

### Database Fields:

```sql
status VARCHAR(20) -- PENDING, DUE, IN_PROGRESS, COMPLETED, MISSED, REFUSED, DEFERRED, CANCELLED
scheduled_time TIMESTAMP
due_time TIMESTAMP
started_at TIMESTAMP
completed_time TIMESTAMP
missed_at TIMESTAMP
missed_by VARCHAR(100)
missed_reason VARCHAR(500)
refused_at TIMESTAMP
refused_reason VARCHAR(500)
is_recurring BOOLEAN
recurrence_pattern VARCHAR(50)
```

### API Endpoints:

- `PUT /nurse-tasks/{id}/start` - Start task
- `PUT /nurse-tasks/{id}/complete?completedBy=X&notes=Y` - Complete
- `PUT /nurse-tasks/{id}/missed?missedBy=X&reason=Y` - Mark missed
- `PUT /nurse-tasks/{id}/refused?reason=X` - Mark refused
- `PUT /nurse-tasks/{id}/defer?newDueDate=X&reason=Y` - Defer
- `PUT /nurse-tasks/{id}/skip?skippedBy=X&reason=Y` - Cancel

---

## 📞 Support

For questions about task workflow:
- **Clinical**: Contact Charge Nurse or Nurse Manager
- **Technical**: Contact IT Support
- **Policy**: Refer to facility nursing policy manual

---

**Last Updated**: December 6, 2025  
**Version**: 2.0 - Enhanced Workflow with MISSED and REFUSED states
