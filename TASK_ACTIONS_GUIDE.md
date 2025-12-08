# Nurse Task Actions Guide

## How to Complete, Cancel, or Manage Tasks

After creating a nurse task, you have several actions available to manage it:

---

## 📋 **Accessing Task Actions**

### Method 1: Click on Any Task Card
1. Navigate to **Task Board** (`/dashboard/task-board`)
2. Find your task in one of the columns (Pending, Due Now, Overdue, Completed)
3. Click on the task card
4. A **Task Details Dialog** will open

### Method 2: View Details Button
1. Click the **checkmark icon** (✓) on the bottom-left of any task card
2. The Task Details Dialog opens automatically

---

## ✅ **Complete a Task**

**When to use:** Task has been successfully finished

**Steps:**
1. Open Task Details Dialog (click on task)
2. Go to **"Actions"** tab
3. Click **"Mark as Complete"** button (green)
4. Optionally add completion notes:
   - What was done
   - Any observations
   - Results or outcomes
5. Click **"Complete Task"** button
6. ✓ Success message appears: "Task marked as completed"
7. Task moves to **Completed** column

**Result:** 
- Status changes to COMPLETED
- Task appears in Completed column with green success indicator
- Completion timestamp recorded
- Task cannot be edited further (read-only)

---

## 🕐 **Defer a Task**

**When to use:** Task needs to be postponed to a later time

**Steps:**
1. Open Task Details Dialog
2. Go to **"Actions"** tab
3. Click **"Defer Task"** button (orange/warning color)
4. Select a **new due date and time**
5. Enter **reason for deferral** (required):
   - "Patient unavailable"
   - "Waiting for doctor's order"
   - "Equipment not available"
   - etc.
6. Click **"Defer Task"** button
7. ✓ Success message: "Task deferred successfully"

**Result:**
- Due date/time updated to new value
- Reason appended to task notes
- Task remains in Pending/Due columns based on new time
- Can still be completed or cancelled later

---

## ❌ **Cancel a Task**

**When to use:** Task is no longer needed or applicable

**Steps:**
1. Open Task Details Dialog
2. Go to **"Actions"** tab
3. Click **"Cancel Task"** button (red)
4. Enter **reason for cancellation** (required):
   - "Patient discharged"
   - "Order discontinued by doctor"
   - "Task no longer relevant"
   - "Duplicate task"
   - etc.
5. Click **"Cancel Task"** button (red)
6. ✓ Success message: "Task cancelled successfully"

**Result:**
- Task is marked as skipped/cancelled
- Reason recorded in system
- Task removed from active workflow
- Audit trail maintained for reporting

---

## 🏥 **Supported Nursing Workflows**

The task system supports all essential nursing activities:

### **1. 💊 Medication Administration**
- Scheduled medication rounds
- PRN medications
- IV medication monitoring
- Medication reconciliation

### **2. 🌡️ Vitals Monitoring**
- Temperature, Pulse, BP, SpO2
- Scheduled vital checks (Q4H, Q6H, etc.)
- Post-procedure vital monitoring
- Critical vitals tracking

### **3. 📊 Intake/Output Recording**
- Fluid intake documentation
- Urine output measurement
- Drainage monitoring
- Daily I/O balance

### **4. 🩹 Wound Dressing**
- Surgical wound care
- Pressure ulcer management
- Dressing changes
- Wound assessment

### **5. 💨 Nebulization**
- Scheduled nebulizer treatments
- Respiratory therapy
- Bronchodilator administration
- Post-treatment assessment

### **6. 🔄 Turning Schedule (Bedridden Patients)**
- Q2H turning reminders
- Position changes
- Pressure ulcer prevention
- Skin integrity checks

### **7. 😣 Pain Assessment**
- Pain scale evaluation
- Pre/post-medication assessment
- Chronic pain monitoring
- Comfort measures

### **8. 👁️ Nursing Observations**
- General patient monitoring
- Behavioral changes
- Clinical deterioration signs
- Shift assessments

### **9. 🔧 Procedure Preparation**
- Pre-operative preparation
- Test/procedure setup
- Equipment readiness
- Patient preparation

### **10. Additional Tasks**
- General Assessment
- Hygiene Care
- Nutrition/Feeding
- Mobility Assistance
- Documentation

---

## 🔄 **Drag and Drop Status Change**

**Quick status updates without opening dialog:**

1. **Grab a task card** (click and hold)
2. **Drag** to another column:
   - Move to **Due Now** if urgent
   - Move to **Completed** if finished quickly
3. **Drop** the card
4. ✓ Success message: "Task moved to [STATUS]"

**Note:** This is a quick method for status changes but doesn't allow notes

---

## 📊 **Task Status Flow**

```
PENDING → [Due Now] → [Overdue]
   ↓           ↓          ↓
COMPLETED  or  DEFERRED  or  CANCELLED
```

### Status Meanings:
- **PENDING**: Task scheduled, waiting to be done
- **DUE NOW**: Task due within 2 hours
- **OVERDUE**: Task past due date
- **COMPLETED**: Task successfully finished ✓
- **DEFERRED**: Task postponed to later time 🕐
- **CANCELLED**: Task skipped/no longer needed ❌

---

## 🎯 **Best Practices**

### ✅ Complete Tasks:
- Add completion notes for complex tasks
- Document any unusual findings
- Record exact time for time-sensitive tasks (medications, vitals)

### 🕐 Defer Tasks:
- Always provide a clear reason
- Set realistic new due dates
- Communicate deferrals to team

### ❌ Cancel Tasks:
- Document why task is no longer needed
- Verify with supervisor if unsure
- Don't cancel without valid reason

---

## 🔔 **Visual Indicators**

### Priority Colors (Left border):
- 🔴 **STAT** (Red): Immediate/Emergency
- 🟠 **URGENT** (Deep Orange): Very urgent
- 🟠 **HIGH** (Orange): High priority
- 🟡 **MEDIUM** (Yellow): Medium priority
- 🟢 **ROUTINE** (Light Green): Normal routine
- 🟢 **LOW** (Green): Low priority
- 🔵 **PRN** (Blue): As needed

### Column Colors:
- 🔵 **Pending** (Blue): Normal tasks
- 🟠 **Due Now** (Orange): Urgent attention
- 🔴 **Overdue** (Red): Critical action needed
- 🟢 **Completed** (Green): Finished tasks

---

## 📱 **Quick Actions Summary**

| Action | Button Color | Required Info | Result |
|--------|--------------|---------------|--------|
| **Complete** | Green | Optional notes | Task finished ✓ |
| **Defer** | Orange | New date + reason | Postponed 🕐 |
| **Cancel** | Red | Reason required | Skipped ❌ |

---

## 🆘 **Troubleshooting**

**Task details not opening?**
- Refresh the page
- Check if task was deleted
- Verify network connection

**Cannot complete task?**
- Check if you have NURSE or ADMIN role
- Verify task isn't already completed
- Clear browser cache

**Success message not showing?**
- Message appears bottom-right corner
- Auto-hides after 6 seconds
- Check if popup blockers are active

---

## 💡 **Tips**

1. **Review tasks regularly** - Check task board every 30 minutes
2. **Use priority filters** - Focus on STAT and URGENT tasks first
3. **Add detailed notes** - Helps with patient care continuity
4. **Defer proactively** - If you know you'll be delayed, defer early
5. **Cancel invalid tasks** - Don't let cancelled tasks clutter the board

---

## 📞 **Need Help?**

Contact IT Support or your Nurse Manager for assistance with:
- Task board access issues
- Permission problems
- System errors
- Training on task management

---

**Last Updated:** December 6, 2025
