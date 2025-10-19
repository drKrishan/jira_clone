# Test Step CRUD Implementation 🎯

## ✅ Complete Step Management System

### Features Implemented

#### 1. **Add New Steps**

When a test case is expanded:

- **"Add Step" button** appears in the header (blue button, top-right)
- Click to show the add step form with 3 text areas:
  - **Step Details\*** (required) - Description of what to do
  - **Test Data** (optional) - Input data for the step
  - **Expected Result\*** (required) - What should happen
- Form has 3 columns layout matching your screenshot
- **Add** and **Cancel** buttons at the bottom
- Auto-assigns step numbers (1, 2, 3, etc.)

#### 2. **Empty State**

When a test case has no steps:

- Shows a dashed border box with message:
  - "No test steps added yet"
  - "Click 'Add Step' to create your first test step"
- Encourages users to add their first step

#### 3. **Edit Steps**

For each step in the table:

- Click the **edit icon (✏️)** to enter edit mode
- All three fields become editable textareas
- **Save (💾)** and **Cancel (✖)** buttons appear
- Changes saved to database immediately
- Toast notification confirms success

#### 4. **Delete Steps**

For each step in the table:

- Click the **delete icon (🗑️)** to remove step
- Confirmation dialog: "Are you sure you want to delete this step?"
- After deletion, remaining steps are automatically renumbered
  - Step 1, 2, 4, 5 → becomes → Step 1, 2, 3, 4
- Toast notification confirms deletion

#### 5. **Step Numbering**

- Steps are displayed in circular blue badges (1, 2, 3, ...)
- Numbers are automatically managed
- When adding: New step gets next number
- When deleting: Remaining steps renumber sequentially
- Always starts at 1

### API Endpoints Created

#### `/api/test-cases/[testCaseId]/steps`

- **GET**: Fetch all steps for a test case (ordered by step number)
- **POST**: Create new step with auto-assigned step number

#### `/api/test-cases/[testCaseId]/steps/[stepId]`

- **PATCH**: Update step (summary, testData, expectedResult)
- **DELETE**: Delete step and renumber remaining steps

### UI Components

#### Add Step Form

```
┌─────────────────────────────────────────────────────────────────┐
│ Add New Step                                                     │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐                     │
│ │ Step      │ │ Test     │ │ Expected     │                     │
│ │ Details*  │ │ Data     │ │ Result*      │                     │
│ │          │ │          │ │              │                     │
│ │ [textarea]│ │[textarea]│ │ [textarea]   │                     │
│ └──────────┘ └──────────┘ └──────────────┘                     │
│                                                                  │
│                                         [Cancel] [Add]           │
└─────────────────────────────────────────────────────────────────┘
```

#### Steps Table with Actions

```
┌───┬──────────────────┬─────────────┬──────────────┬─────────┐
│ # │ Step Summary     │ Test Data   │ Expected     │ Actions │
├───┼──────────────────┼─────────────┼──────────────┼─────────┤
│ ① │ Verify login...  │             │ Form shows   │ ✏️ 🗑️  │
│ ② │ Enter invalid... │ blank       │ Error shown  │ ✏️ 🗑️  │
│ ③ │ Simulate slow... │ 3000ms      │ Loading...   │ ✏️ 🗑️  │
└───┴──────────────────┴─────────────┴──────────────┴─────────┘
```

### User Workflows

#### Workflow 1: Add First Step to Empty Test Case

1. Expand test case (click arrow ▶)
2. See "No test steps added yet" message
3. Click "Add Step" button
4. Fill in:
   - Step Details: "Verify login form is displayed"
   - Test Data: (leave blank)
   - Expected Result: "Login form appears with username and password fields"
5. Click "Add" button
6. Step appears as Step #1
7. Toast: "Step added successfully!"

#### Workflow 2: Add Additional Steps

1. Click "Add Step" again
2. Fill in second step details
3. Click "Add"
4. New step appears as Step #2
5. Repeat for more steps

#### Workflow 3: Edit a Step

1. Find step to edit in table
2. Click edit icon (✏️)
3. Text becomes editable textareas
4. Modify any field (summary, test data, expected result)
5. Click save icon (💾)
6. Changes saved immediately
7. Toast: "Step updated successfully!"

#### Workflow 4: Delete a Step

1. Find step to delete
2. Click delete icon (🗑️)
3. Confirm deletion in dialog
4. Step is removed
5. Remaining steps renumber automatically
   - If you delete Step 2 from [1,2,3,4]
   - Result: [1,2,3] (old steps 3,4 become new 2,3)
6. Toast: "Step deleted successfully!"

#### Workflow 5: Cancel Operations

- **Adding**: Click "Cancel" in add form → Form closes, no step created
- **Editing**: Click cancel icon (✖) → Exit edit mode, changes discarded

### Database Schema

```prisma
model TestStep {
  id             String   @id @default(uuid())
  stepNumber     Int
  summary        String   @db.Text()
  testData       String?  @db.Text()
  expectedResult String   @db.Text()
  testCaseId     String
  testCase       TestCase @relation(fields: [testCaseId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([testCaseId])
}
```

### Key Features

✅ **Inline Editing**: Edit steps directly in the table
✅ **Auto-numbering**: Steps automatically numbered 1, 2, 3...
✅ **Renumbering**: Delete any step, others renumber automatically
✅ **Empty State**: Helpful message when no steps exist
✅ **Validation**: Required fields (summary, expected result)
✅ **Responsive Layout**: 3-column grid for add form
✅ **Visual Feedback**: Toast notifications for all actions
✅ **Confirmation**: Delete requires confirmation
✅ **Icon Buttons**: Edit (✏️), Delete (🗑️), Save (💾), Cancel (✖)
✅ **Color Coding**:

- Edit mode: Blue borders
- Save button: Green
- Delete button: Red
- Step numbers: Blue circular badges

### State Management

```typescript
// Adding new step
const [addingStepToTestCase, setAddingStepToTestCase] = useState<string | null>(
  null
);
const [newStep, setNewStep] = useState({
  summary: "",
  testData: "",
  expectedResult: "",
});

// Editing existing step
const [editingStep, setEditingStep] = useState<string | null>(null);
const [editStepForm, setEditStepForm] = useState({
  summary: "",
  testData: "",
  expectedResult: "",
});
```

### Functions Implemented

1. **`addStep(testCaseId)`** - Create new step
2. **`startEditingStep(step)`** - Enter edit mode
3. **`saveStep(testCaseId, stepId)`** - Save edited step
4. **`cancelEditingStep()`** - Exit edit mode
5. **`deleteStep(testCaseId, stepId)`** - Delete and renumber

### Error Handling

- ✅ Required field validation
- ✅ Network error handling
- ✅ User-friendly error messages
- ✅ Confirmation before destructive operations
- ✅ Automatic cleanup on errors

### UI Polish

- Smooth transitions
- Hover effects on buttons
- Proper spacing and alignment
- Consistent color scheme
- Loading states
- Success/error feedback
- Professional typography

### Testing Scenarios

#### Test 1: Create First Step

```
Given: Test case FIT-TC-10 has no steps
When: User expands test case
Then: "No test steps added yet" message is shown
When: User clicks "Add Step"
Then: Add step form appears with 3 text areas
When: User fills in required fields and clicks "Add"
Then: Step is created as Step #1
And: Form closes
And: Success toast appears
```

#### Test 2: Edit Middle Step

```
Given: Test case has steps [1, 2, 3, 4, 5]
When: User clicks edit on Step 3
Then: Step 3 fields become editable
When: User changes summary and clicks save
Then: Step 3 updates with new data
And: Step numbering remains [1, 2, 3, 4, 5]
And: Success toast appears
```

#### Test 3: Delete Middle Step

```
Given: Test case has steps [1, 2, 3, 4, 5]
When: User clicks delete on Step 3
Then: Confirmation dialog appears
When: User confirms
Then: Step 3 is deleted
And: Remaining steps renumber to [1, 2, 3, 4]
And: Old step 4 becomes new step 3
And: Old step 5 becomes new step 4
And: Success toast appears
```

### Integration with Test Cases

- Steps are loaded automatically when test case data is fetched
- Steps update in real-time after any operation
- Expanding/collapsing test case preserves step data
- Version increment on test case still works independently
- Steps survive test case edits

### Next Steps (Future Enhancements)

- [ ] Drag and drop to reorder steps
- [ ] Duplicate step functionality
- [ ] Bulk operations (delete multiple steps)
- [ ] Step templates
- [ ] Import/export steps
- [ ] Rich text editor for steps
- [ ] Attachments per step
- [ ] Step execution tracking
- [ ] Pass/Fail marking per step

## Summary

You now have a **complete CRUD system for test steps** with:

- ✅ Create new steps with 3-field form
- ✅ Read/display steps in organized table
- ✅ Update steps with inline editing
- ✅ Delete steps with auto-renumbering
- ✅ Empty state for tests without steps
- ✅ Professional UI matching JIRA theme
- ✅ Full error handling and validation
- ✅ Toast notifications for all operations

All operations are connected to the database and work seamlessly! 🎉
