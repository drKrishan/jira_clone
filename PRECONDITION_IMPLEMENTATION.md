# PreCondition Field Implementation

## Overview

Added a new `preCondition` field to the TestStep model to capture preconditions that must be met before executing a test step.

## Implementation Date

January 19, 2025

## Database Changes

### Schema Update

**File:** `prisma/schema.prisma`

Added `preCondition` field to TestStep model:

```prisma
model TestStep {
  id             String   @id @default(cuid())
  stepNumber     Int
  summary        String   @db.Text()
  preCondition   String?  @db.Text()  // NEW FIELD
  testData       String?  @db.Text()
  expectedResult String   @db.Text()
  testCaseId     String
  testCase       TestCase @relation(fields: [testCaseId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("test_steps")
}
```

### Migration

**Migration Name:** `20251019075236_add_step_precondition`
**Status:** ✅ Applied successfully

The migration adds the `preCondition` column to the `test_steps` table:

- Type: TEXT
- Nullable: Yes
- Default: NULL

## TypeScript Interface Updates

### 1. components/test-cases/types.ts

Updated the TestStep interface:

```typescript
export interface TestStep {
  id: string;
  stepNumber: number;
  summary: string;
  preCondition?: string; // NEW FIELD
  testData?: string;
  expectedResult: string;
  testCaseId: string;
}
```

### 2. components/test-cases/index.tsx

Updated the TestStep interface and state management:

- Added `preCondition?: string` to TestStep interface
- Updated `newStep` state to include `preCondition: ""`
- Updated `editStepForm` state to include `preCondition: ""`
- Fixed `startEditingStep` to handle preCondition: `step.preCondition || ""`
- Updated all state reset calls to include `preCondition: ""`

## API Route Updates

### 1. Create Step (POST)

**File:** `app/api/test-cases/[id]/steps/route.ts`

Updated to handle preCondition in request body:

```typescript
const { summary, preCondition, testData, expectedResult } = body;

const step = await prisma.testStep.create({
  data: {
    stepNumber: newStepNumber,
    summary,
    preCondition: preCondition || "",
    testData: testData || "",
    expectedResult,
    testCaseId: params.id,
  },
});
```

### 2. Update Step (PATCH)

**File:** `app/api/test-cases/[id]/steps/[stepId]/route.ts`

Updated to handle preCondition in request body:

```typescript
const { summary, preCondition, testData, expectedResult } = body;

const step = await prisma.testStep.update({
  where: { id: params.stepId },
  data: {
    summary: summary,
    preCondition: preCondition || "",
    testData: testData || "",
    expectedResult: expectedResult,
  },
});
```

## UI Changes

### 1. Add Step Form

**File:** `components/test-cases/index.tsx` (lines ~1380-1450)

- Changed grid layout from 3 columns to 4 columns: `grid-cols-4`
- Added PreCondition textarea input between Step Details and Test Data:

```tsx
<div>
  <label className="mb-1 block text-xs font-medium text-gray-700">
    Pre Condition
  </label>
  <textarea
    value={newStep.preCondition}
    onChange={(e) =>
      setNewStep({
        ...newStep,
        preCondition: e.target.value,
      })
    }
    placeholder="Enter Pre Condition"
    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    rows={3}
  />
</div>
```

### 2. Steps Table Display

**File:** `components/test-cases/index.tsx` (lines ~1220-1350)

#### Table Header

Added new column header between "Step Summary" and "Test Data":

```tsx
<th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
  Pre Condition
</th>
```

#### Table Body - View Mode

Added cell to display preCondition value:

```tsx
<td className="px-3 py-3 text-sm text-gray-600">{step.preCondition || "-"}</td>
```

#### Table Body - Edit Mode

Added textarea for inline editing:

```tsx
<td className="px-3 py-3 text-sm text-gray-600">
  {editingStep === step.id ? (
    <textarea
      value={editStepForm.preCondition}
      onChange={(e) =>
        setEditStepForm({
          ...editStepForm,
          preCondition: e.target.value,
        })
      }
      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={2}
    />
  ) : (
    step.preCondition || "-"
  )}
</td>
```

### 3. Table Column Order

The steps table now displays columns in this order:

1. **#** - Step number
2. **Step Summary** - Description of the step
3. **Pre Condition** - NEW! Conditions required before executing step
4. **Test Data** - Data to be used in the step
5. **Expected Result** - Expected outcome
6. **Actions** - Edit/Delete buttons

## Seed Data Updates

### File: prisma/seed-test-cases.ts

Added meaningful preCondition values to all existing test steps:

#### Test Case 1 (FIT-TC-6) - Login Test

- Step 1: "User is on the login page and not logged in"
- Step 2: "Login form is displayed"
- Step 3: "Network throttling tools are available"
- Step 4: "Network can be disconnected"
- Step 5: "Database access is available for verification"
- Step 6: "User is on the login page"

#### Test Case 2 (FIT-TC-7) - Oxygen Monitor

- Step 1: "Device is powered on and sensor port is accessible"
- Step 2: "Sensor is connected and recognized"
- Step 3: "Monitoring is active and threshold is configured"

#### Test Case 3 (FIT-TC-8) - Set Device to Run Mode

- Step 1: "User is logged in and device is accessible"
- Step 2: "Settings page is displayed and Run mode is available"

### Reseeding

Ran `npx prisma db seed` to populate database with updated test data including preCondition values.

## Testing Checklist

✅ Database migration applied successfully
✅ Prisma client regenerated
✅ TypeScript interfaces updated
✅ API routes handle preCondition in POST and PATCH
✅ Add step form includes preCondition input
✅ Steps table displays preCondition column
✅ Edit step form allows inline editing of preCondition
✅ Seed data includes sample preCondition values
✅ Dev server running on http://localhost:3001

## Usage

### Adding a New Step

1. Click "Add Test Step" button
2. Fill in Step Details (required)
3. Fill in Pre Condition (optional)
4. Fill in Test Data (optional)
5. Fill in Expected Result (required)
6. Click "Add" to save

### Editing an Existing Step

1. Click the edit icon (pencil) on any step
2. Modify any fields including Pre Condition
3. Click the save icon (checkmark) to save changes
4. Or click the cancel icon (X) to discard changes

### Viewing Steps

- The Pre Condition column appears between Step Summary and Test Data
- Empty preConditions display as "-"
- All fields are visible in the table view

## Notes

- PreCondition is optional (nullable in database)
- Empty strings are stored as "" in the database
- UI displays "-" when preCondition is null or empty
- All state management properly includes preCondition field
- Form validation does not require preCondition (it's optional)

## Related Files

### Modified Files

1. `prisma/schema.prisma` - Added preCondition field
2. `prisma/migrations/20251019075236_add_step_precondition/migration.sql` - Migration file
3. `components/test-cases/types.ts` - Updated TypeScript interface
4. `components/test-cases/index.tsx` - UI updates and state management
5. `app/api/test-cases/[id]/steps/route.ts` - POST endpoint
6. `app/api/test-cases/[id]/steps/[stepId]/route.ts` - PATCH endpoint
7. `prisma/seed-test-cases.ts` - Seed data with preCondition values

### Generated Files

- `prisma/migrations/20251019075236_add_step_precondition/migration.sql`
- Updated Prisma Client in `node_modules/@prisma/client`

## Future Enhancements

Potential improvements for the preCondition field:

1. Add preCondition templates/suggestions dropdown
2. Implement preCondition validation rules
3. Add ability to link preConditions across steps
4. Create preCondition library for reusable conditions
5. Add preCondition search/filter functionality
6. Generate preCondition reports
7. Support for conditional execution based on preConditions
