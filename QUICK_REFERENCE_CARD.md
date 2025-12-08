# 🏥 Floor-Ward-Bed Management - Quick Reference Card

## 🚀 Quick Start

### Access URLs
```
Main Dashboard:  /dashboard/hospital-operations
Floor Management: /dashboard/floors
Ward Management:  /dashboard/wards
Bed Creation:     /dashboard/beds/create
Bed Management:   /dashboard/beds
```

---

## 📊 Operations Dashboard (3 Tabs)

### Tab 1: Overview & Analytics
**What you see:**
- 4 metric cards: Floors, Wards, Beds, Occupancy%
- Bed status pie chart
- Floor occupancy bar chart
- Ward ranking bar chart
- Today's activity: Admissions, Discharges, Available beds

**When to use:**
- Morning shift start
- Quick capacity check
- Critical alert review

### Tab 2: Floor View
**What you see:**
- Vertical list of all floors
- Per-floor stats (total/available/occupied beds)
- Occupancy progress bars
- Ward list per floor

**When to use:**
- Floor-wise planning
- Multi-floor overview
- Capacity distribution check

### Tab 3: Ward View
**What you see:**
- Grid of ward cards
- Per-ward statistics
- Occupancy percentages
- Color-coded alerts

**When to use:**
- Ward-specific monitoring
- Identifying critical wards
- Ward comparison

---

## 🏗️ Building Setup (One-Time)

### Create Complete Hospital
```
1. Floor Management → Building Wizard
2. Enter: Building name, Total floors, Starting floor
3. Configure all floors in table
4. Review → Create

Result: Entire building structure in 3 steps
```

### Create Individual Floor
```
1. Floor Management → "Add Floor"
2. Fill: Floor number, Name, Type, Capacity
3. Save

Result: Single floor added
```

---

## 🏢 Ward Management

### Create Ward
```
1. Ward Management → "Add Ward"
2. Fill: Ward name, Floor, Capacity, Department
3. Save

Result: New ward created
```

### View Ward Stats
```
1. Ward Management → View all ward cards
2. Check occupancy percentages
3. Identify high-occupancy wards (>85%)

Color codes:
🟢 Green (<60%) = Normal
🟡 Yellow (60-80%) = Moderate
🔴 Red (>80%) = Critical
```

---

## 🛏️ Bed Creation

### Bulk Create Beds (Recommended)
```
Step 1: Select ward and bed type
Step 2: Set prefix and range (e.g., ICU-001 to ICU-020)
Step 3: Configure features (Oxygen, Ventilator, Isolation)
Step 4: Review and create

Result: Multiple beds created at once
Example: 20 ICU beds in one click
```

---

## 🔄 Daily Operations

### Morning Routine
```
1. Login → Operations Dashboard
2. Check:
   - Overall occupancy
   - Critical alerts (>85%)
   - Today's admissions
   - Available beds
3. Review Floor View for floor distribution
4. Review Ward View for ward-specific issues
```

### Admit Patient
```
1. Bed Management → Filter by ward/status
2. Find available bed
3. Click "Admit Patient"
4. Select patient → Confirm

Result: Bed status = OCCUPIED
```

### Discharge Patient
```
1. Bed Management → Find occupied bed
2. Click "Discharge"
3. Bed status → CLEANING

After housekeeping:
4. Change status → AVAILABLE

Result: Bed ready for next patient
```

### Transfer Patient
```
1. Bed Management → Source bed → "Transfer"
2. Select destination bed
3. Confirm

Result: Old bed available, new bed occupied
```

---

## 🎨 Status & Color Guide

### Bed Status
| Status | Color | Meaning | Action |
|--------|-------|---------|--------|
| AVAILABLE | 🟢 Green | Ready | Admit patient |
| OCCUPIED | 🔴 Red | Patient in bed | Monitor |
| CLEANING | 🟠 Orange | Being cleaned | Wait |
| UNDER_MAINTENANCE | ⚫ Gray | Repair | Repair |
| RESERVED | 🔵 Blue | Reserved | Hold |
| BLOCKED | ⚫ Black | Admin block | Unblock |

### Occupancy Alerts
| Range | Color | Status | Action |
|-------|-------|--------|--------|
| 0-60% | 🟢 Green | Comfortable | Normal ops |
| 60-80% | 🟡 Yellow | Moderate | Monitor |
| 80-95% | 🔴 Red | High | Plan discharge |
| 95-100% | 🔴 Red | Critical | Urgent action |

---

## 🔍 Quick Searches

### Find Available ICU Bed
```
Bed Management → Filter:
- Ward: ICU
- Status: AVAILABLE
→ Results show all free ICU beds
```

### Check Specific Floor
```
Operations Dashboard → Floor View Tab
→ Find your floor
→ See occupancy and ward list
```

### Find Ward Capacity
```
Operations Dashboard → Ward View Tab
→ Find your ward card
→ See available/occupied counts
```

---

## ⚡ Keyboard Shortcuts

| Action | Shortcut | Description |
|--------|----------|-------------|
| Refresh | F5 | Manual refresh |
| Search | Ctrl+F | Find on page |
| Navigate Tabs | ← → | Switch tabs |

---

## 🆘 Common Issues

### Dashboard Not Loading
**Problem:** Blank screen or loading forever  
**Solution:**
1. Check internet connection
2. Verify backend is running (port 8080)
3. Clear browser cache
4. Hard refresh (Ctrl+F5)

### Occupancy Not Updating
**Problem:** Numbers seem incorrect  
**Solution:**
1. Click refresh button (🔄)
2. Check bed status in Bed Management
3. Verify admission records exist
4. Wait 30 seconds for auto-refresh

### Can't Create Bed
**Problem:** Error when creating bed  
**Solution:**
1. Check all required fields filled
2. Verify bed number is unique
3. Ensure ward exists
4. Check permissions (need ADMIN role)

---

## 📱 Mobile Tips

### Portrait Mode
- Scroll vertically for all content
- Tap cards to expand details
- Use bottom navigation
- Swipe between tabs

### Landscape Mode
- Better chart visibility
- Side-by-side comparison
- Rotate device for optimal view

---

## 🎯 Best Practices

### For Nurses
✅ Check dashboard at every shift start  
✅ Update bed status immediately after cleaning  
✅ Report maintenance issues promptly  
✅ Use filters to find beds quickly  

### For Administrators
✅ Review occupancy trends weekly  
✅ Use Building Wizard for new facilities  
✅ Bulk create beds for efficiency  
✅ Plan maintenance during low occupancy  

### For Operations Team
✅ Monitor critical alerts twice daily  
✅ Track pending discharges  
✅ Coordinate with housekeeping  
✅ Update capacity plans regularly  

---

## 📞 Support

### Quick Help
- **Documentation:** See FLOOR_WARD_BED_MANAGEMENT.md
- **Visual Guide:** See FLOOR_WARD_BED_VISUAL_GUIDE.md
- **Full Details:** See IMPLEMENTATION_SUMMARY.md

### Training
- **Nursing Staff:** 1-hour session
- **Administrators:** 2-hour session
- **Operations Team:** 1.5-hour session

---

## 🎓 Training Videos (Coming Soon)

1. **Dashboard Overview** (5 min)
2. **Building Setup** (10 min)
3. **Daily Operations** (8 min)
4. **Troubleshooting** (5 min)

---

## 📊 Key Metrics to Track

### Daily
- [ ] Overall occupancy percentage
- [ ] Critical wards (>85%)
- [ ] Available beds count
- [ ] Today's admissions
- [ ] Pending discharges

### Weekly
- [ ] Average occupancy per floor
- [ ] Average occupancy per ward
- [ ] Bed turnover rate
- [ ] Maintenance backlog

### Monthly
- [ ] Occupancy trends
- [ ] Capacity utilization
- [ ] Peak hours analysis
- [ ] Cost per bed day

---

## ⭐ Pro Tips

💡 **Tip 1:** Use auto-refresh (30s) for real-time monitoring  
💡 **Tip 2:** Bookmark Operations Dashboard for quick access  
💡 **Tip 3:** Check critical alerts first thing in morning  
💡 **Tip 4:** Use Building Wizard for faster setup  
💡 **Tip 5:** Bulk create beds to save time  
💡 **Tip 6:** Color codes tell the story at a glance  
💡 **Tip 7:** Cross-page navigation saves clicks  

---

## 🚨 Emergency Protocols

### High Occupancy (>90%)
1. Check Operations Dashboard for alert
2. Review pending discharges
3. Identify patients ready for discharge
4. Coordinate with doctors for discharge orders
5. Contact housekeeping for quick turnaround

### No Available Beds in Ward
1. Check Ward View for alternatives
2. Review Floor View for nearby wards
3. Consider patient transfer to similar ward
4. Use Bed Management to check all statuses
5. Prioritize cleaning/maintenance completion

### System Down
1. Document bed status manually
2. Use backup paper forms
3. Contact IT support
4. Update system when back online
5. Verify all entries after recovery

---

**Print this card for quick reference at nurse stations!**

---

**Version:** 1.0  
**Last Updated:** December 6, 2025  
**Module:** Floor-Ward-Bed Management  
**System:** Hospital Management System
