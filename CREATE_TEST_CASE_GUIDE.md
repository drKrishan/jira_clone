# Create Test Case Feature - Quick Guide

## How to Create a New Test Case

### 1️⃣ Select a Folder

- Click on any folder in the left sidebar
- Or stay on "All Test Cases" (will use first folder as default)

### 2️⃣ Click the "New" Button

- Located in the top toolbar
- Blue button with "+" icon
- Next to "Generate Test Cases" button

### 3️⃣ Fill in the Form

#### Required Field

- **Summary**: Describe what the test case does
  - Example: "Verify user can login with valid credentials"

#### Optional Fields (with defaults)

- **Priority**: Choose importance level

  - Default: Medium
  - Options: Critical, High, Medium, Normal, Low

- **Type**: Select test category

  - Default: Functional
  - Options: Functional, Non-Functional, Performance

- **Review Status**: Set approval state

  - Default: New
  - Options: New, Approved, Rejected

- **Progress**: Current completion state

  - Default: To Do
  - Options: To Do, In Progress, Done, Cancelled

- **Labels**: Add searchable tags
  - Format: comma-separated
  - Example: `login, auth, critical`

### 4️⃣ Create or Cancel

- **Create Test Case**: Saves and generates a test case key (e.g., FIT-TC-14)
- **Cancel**: Closes modal without saving

### 5️⃣ Add Test Steps

After creation:

1. Find your new test case in the list
2. Click the expand arrow (▶) to show steps section
3. Click "Add Test Step" button
4. Fill in step details with the new PreCondition field

## Form Layout

```
┌──────────────────────────────────────────────────────┐
│  Create New Test Case                            [X] │
├──────────────────────────────────────────────────────┤
│  Fill in the details below to create a new test     │
│  case. You can add test steps after creating.       │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐ │
│  │ Creating test case in: Login Tests            │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Summary *                                           │
│  ┌────────────────────────────────────────────────┐ │
│  │ Enter test case summary                        │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Priority              Type                          │
│  ┌──────────────────┐ ┌──────────────────────────┐ │
│  │ Medium         ▼ │ │ Functional             ▼ │ │
│  └──────────────────┘ └──────────────────────────┘ │
│                                                      │
│  Review Status         Progress                      │
│  ┌──────────────────┐ ┌──────────────────────────┐ │
│  │ New            ▼ │ │ To Do                  ▼ │ │
│  └──────────────────┘ └──────────────────────────┘ │
│                                                      │
│  Labels                                              │
│  ┌────────────────────────────────────────────────┐ │
│  │ Enter labels separated by commas               │ │
│  └────────────────────────────────────────────────┘ │
│  Separate multiple labels with commas               │
│                                                      │
│                          ┌────────┐  ┌────────────┐ │
│                          │ Cancel │  │ Create     │ │
│                          └────────┘  └────────────┘ │
└──────────────────────────────────────────────────────┘
```

## What Happens After Creation

### ✅ Success

1. Toast notification appears: "Test case FIT-TC-XX created successfully!"
2. Modal closes automatically
3. Test case list refreshes
4. New test case appears in the selected folder
5. New test case has:
   - Auto-generated key (e.g., FIT-TC-14)
   - Version 1
   - Empty steps array (add steps next)
   - Your specified settings

### ❌ Error

1. Error toast appears with details
2. Modal stays open
3. You can fix the issue and retry
4. Or cancel to close

## Tips & Tricks

### 🎯 Quick Creation

1. Use Tab to navigate between fields
2. Press Enter in Summary field to create quickly
3. Use default values for faster creation
4. Add detailed steps after creation

### 📝 Best Practices

- **Summary**: Be specific and action-oriented

  - ✅ "Verify password reset email is sent"
  - ❌ "Password stuff"

- **Labels**: Use consistent naming

  - ✅ "login, authentication, security"
  - ❌ "Login, Auth, SECURITY!!!"

- **Priority**: Match business impact

  - Critical: System breaking issues
  - High: Important features
  - Medium: Standard functionality
  - Normal: Nice-to-have features
  - Low: Minor improvements

- **Type**: Choose appropriate category
  - Functional: Feature behavior
  - Non-Functional: Performance, security, usability
  - Performance: Speed, load testing

### 🚫 Common Mistakes

1. **Empty Summary**: Form won't submit
2. **All Test Cases + No Folders**: Button disabled
3. **Duplicate Names**: Allowed (key is unique, not summary)
4. **Missing Folder**: Select a specific folder first

## Keyboard Shortcuts

- **Esc**: Close modal (same as Cancel)
- **Tab**: Navigate between fields
- **Shift+Tab**: Navigate backwards
- **Enter**: Submit form (when not in text area)

## Button States

### ✅ Enabled

- Folder is selected
- At least one folder exists

### ⏳ Submitting

- Button shows "Creating..."
- All inputs disabled
- Cannot cancel during submission

### 🚫 Disabled

- "All Test Cases" selected AND no folders exist
- Solution: Create a folder first or select existing folder

## Integration Points

### With Folders

- Test case created in selected folder
- Folder count updates automatically
- Test case visible when folder is selected

### With Test Steps

- New test cases have 0 steps initially
- Add steps by expanding the test case row
- Each step can have:
  - Step Details (required)
  - Pre Condition (optional)
  - Test Data (optional)
  - Expected Result (required)

### With Filters

- New test case respects active type filter
- May not appear if type filter doesn't match
- Example: Created "Functional" test won't show when "Performance" filter is active

## Troubleshooting

### Problem: "New" button is disabled

**Solution**: Select a specific folder or create a folder first

### Problem: Test case doesn't appear after creation

**Possible causes:**

1. Type filter is active and doesn't match
   - Solution: Click "All" in type filter
2. Wrong folder is selected
   - Solution: Click on the folder you created it in
3. List didn't refresh
   - Solution: Click the refresh button

### Problem: "Failed to create test case" error

**Possible causes:**

1. Network connection issue
   - Solution: Check internet and retry
2. Session expired
   - Solution: Refresh page and login again
3. Server error
   - Solution: Contact administrator

### Problem: Labels not showing correctly

**Cause**: Incorrect format
**Solution**: Use comma-separated values without quotes

- ✅ Correct: `login, auth, test`
- ❌ Wrong: `"login" "auth" "test"`
- ❌ Wrong: `login; auth; test`

## Examples

### Example 1: Login Test

```
Summary: Verify user can login with valid email and password
Priority: High
Type: Functional
Review Status: New
Progress: To Do
Labels: login, authentication, critical-path
```

### Example 2: Performance Test

```
Summary: Verify page load time is under 2 seconds
Priority: Medium
Type: Performance
Review Status: New
Progress: To Do
Labels: performance, speed, optimization
```

### Example 3: Security Test

```
Summary: Verify XSS protection in comment fields
Priority: Critical
Type: Non-Functional
Review Status: Approved
Progress: In Progress
Labels: security, xss, validation
```

### Example 4: UI Test

```
Summary: Verify responsive layout on mobile devices
Priority: Normal
Type: Non-Functional
Review Status: New
Progress: To Do
Labels: ui, responsive, mobile
```
