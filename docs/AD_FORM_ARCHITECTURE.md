# Ad Create/Edit Component Architecture

## Component Tree

```
AdForm (Reusable Component)
├── Basic Information Section
│   ├── InputField (Title)
│   └── TextAreaField (Description)
│
├── Category Selection Section
│   ├── Parent Category List (useParentCategories)
│   └── Subcategory List (useSubcategories)
│
├── Dynamic Fields Section (useCategoryFields)
│   ├── TEXT → InputField
│   ├── NUMBER → InputField (numeric)
│   ├── TEXTAREA → TextAreaField
│   ├── SELECT/RADIO → Radio Buttons
│   ├── CHECKBOX → Checkboxes
│   └── BOOLEAN → Toggle Switch
│
├── Pricing Section
│   ├── InputField (Price)
│   ├── InputField (Currency)
│   └── Checkbox (Negotiable)
│
├── Condition Section
│   └── Radio Buttons (AdCondition enum)
│
├── Images Section
│   ├── Image Previews with Remove
│   ├── Add Photo Button (ImagePicker)
│   └── Upload Progress (useUploadAdImages)
│
├── Contact Information Section
│   ├── InputField (Address)
│   ├── InputField (Phone)
│   └── InputField (Email)
│
└── Submit Button
    └── PrimaryButton (with loading state)
```

## Page Structure

```
Create Ad Page
└── AdForm
    ├── initialData: undefined
    ├── onSubmit: handleCreate
    ├── submitButtonText: "Create Ad"
    └── isLoading: createMutation.isPending

Edit Ad Page
└── AdForm
    ├── initialData: transformedAdData
    ├── onSubmit: handleUpdate
    ├── submitButtonText: "Update Ad"
    └── isLoading: updateMutation.isPending
```

## Data Flow

### Create Flow

```
User Input
    ↓
AdForm Component
    ↓
AdFormData (local state)
    ↓
handleSubmit (validation)
    ↓
CreateAdRequest (transform)
    ↓
useCreateAd mutation
    ↓
API: POST /api/v1/ads/
    ↓
Success: New Ad Created
    ↓
Toast Notification
    ↓
Navigate to Ad Details
```

### Edit Flow

```
Ad Details Page (as owner)
    ↓
Edit Button Click
    ↓
Edit Ad Page
    ↓
useAd(id) - Fetch current data
    ↓
Transform to AdFormData
    ↓
AdForm (pre-filled)
    ↓
User Updates
    ↓
handleSubmit (validation)
    ↓
UpdateAdRequest (transform)
    ↓
useUpdateAd mutation
    ↓
API: PATCH /api/v1/ads/:id
    ↓
Success: Ad Updated
    ↓
Toast Notification
    ↓
Navigate Back
```

## State Management

### Local State (AdForm)

```typescript
// Form fields
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [currency, setCurrency] = useState("USD");
const [condition, setCondition] = useState<AdCondition>();
const [parentCategoryId, setParentCategoryId] = useState("");
const [categoryId, setCategoryId] = useState("");
const [images, setImages] = useState<string[]>([]);
const [localImages, setLocalImages] = useState<string[]>([]);
const [address, setAddress] = useState("");
const [contactPhone, setContactPhone] = useState("");
const [contactEmail, setContactEmail] = useState("");
const [isNegotiable, setIsNegotiable] = useState(false);
const [fieldValues, setFieldValues] = useState<FieldValue[]>([]);
```

### React Query State

```typescript
// Categories
useParentCategories() → categories[]
useSubcategories(parentId) → subcategories[]
useCategoryFields(categoryId) → fields[]

// Ad Operations
useCreateAd() → mutation
useUpdateAd() → mutation
useAd(id) → ad data

// Upload
useUploadAdImages() → mutation with progress
```

## Hook Dependencies

```
AdForm Component
│
├── useTheme()
│   └── colors, spacing, radius
│
├── useParentCategories()
│   └── Parent categories list
│
├── useSubcategories(parentCategoryId)
│   └── Subcategories for selected parent
│
├── useCategoryFields(categoryId)
│   └── Dynamic fields for selected category
│
└── useUploadAdImages()
    ├── mutateAsync(formData)
    ├── isPending
    └── progress { percentage, loaded, total }

Create/Edit Pages
│
├── useAuth()
│   └── Current user (for ownership check)
│
├── useAd(adId) [Edit only]
│   └── Existing ad data
│
├── useCreateAd() [Create only]
│   └── Create mutation
│
└── useUpdateAd() [Edit only]
    └── Update mutation
```

## Field Type Rendering Logic

```typescript
renderDynamicField(field: CategoryField)
│
├── field.type === TEXT
│   └── <InputField />
│
├── field.type === NUMBER
│   └── <InputField keyboardType="numeric" />
│
├── field.type === TEXTAREA
│   └── <TextAreaField numberOfLines={4} />
│
├── field.type === SELECT || RADIO
│   └── <RadioButtonGroup>
│       └── field.options.map(option =>
│           <RadioButton value={option.value} />
│       )
│
├── field.type === CHECKBOX
│   └── <CheckboxGroup>
│       └── field.options.map(option =>
│           <Checkbox value={option.value} />
│       )
│       Values stored as: "value1,value2,value3"
│
└── field.type === BOOLEAN
    └── <ToggleSwitch>
        Values: "true" or "false"
```

## Image Upload Flow

```
User Clicks "Add Photo"
    ↓
expo-image-picker
    ↓
Image URIs selected
    ↓
setLocalImages([...uris])
    ↓
useEffect triggered
    ↓
uploadImages() called
    ↓
Create FormData
    ↓
uploadMutation.mutateAsync(formData)
    ↓
Progress Updates
    │
    ├── progress.percentage (0-100)
    ├── progress.loaded (bytes)
    └── progress.total (bytes)
    ↓
Upload Complete
    ↓
Response: { urls: string[] }
    ↓
setImages([...existingImages, ...newUrls])
    ↓
setLocalImages([]) // Clear local images
```

## Validation Flow

```
handleSubmit()
    ↓
Check: title.trim()
    ├── Empty → Alert "Enter title"
    └── OK → Continue
    ↓
Check: description.trim()
    ├── Empty → Alert "Enter description"
    └── OK → Continue
    ↓
Check: categoryId
    ├── Empty → Alert "Select category"
    └── OK → Continue
    ↓
Check: price > 0
    ├── Invalid → Alert "Enter valid price"
    └── OK → Continue
    ↓
Check: images.length > 0
    ├── Zero → Alert "Upload at least one image"
    └── OK → Continue
    ↓
Check: Required category fields
    ├── Missing → Alert "Fill {fieldLabel}"
    └── OK → Continue
    ↓
All Valid
    ↓
Transform to API format
    ↓
Submit
```

## Error Handling

```
Try-Catch Structure
│
├── Try Block
│   ├── Transform form data
│   ├── Call mutation
│   ├── Show success toast
│   └── Navigate
│
└── Catch Block
    ├── Log error to console
    ├── Show error toast
    └── Keep form editable
```

## Navigation Paths

```
App Navigation
│
├── Any Screen
│   └── router.push("/ads/create")
│       └── Create Ad Page
│           └── Submit → Ad Details
│
└── Ad Details (as owner)
    └── Edit Button
        └── router.push(`/ads/${id}/edit`)
            └── Edit Ad Page
                └── Submit → router.back()
```

## Category Selection Flow

```
Step 1: Load Parent Categories
    useParentCategories()
        ↓
    Display: Electronics, Vehicles, Real Estate, etc.

Step 2: User Selects Parent
    setParentCategoryId("electronics")
        ↓
    useSubcategories("electronics")
        ↓
    Display: Phones, Laptops, Cameras, etc.

Step 3: User Selects Subcategory
    setCategoryId("phones")
        ↓
    useCategoryFields("phones")
        ↓
    Display: Brand, Model, Storage, Color, etc.

Step 4: Render Dynamic Fields
    fields.map(field => renderDynamicField(field))
        ↓
    User fills dynamic fields
        ↓
    fieldValues updated
```

## Component Communication

```
Parent Pages (Create/Edit)
    │
    ├── Props to AdForm
    │   ├── initialData (edit mode)
    │   ├── onSubmit callback
    │   ├── isLoading state
    │   └── submitButtonText
    │
    └── Callbacks from AdForm
        └── onSubmit(formData: AdFormData)
            ↓
        Parent handles:
            ├── Data transformation
            ├── API call
            ├── Success handling
            └── Error handling
```

## Responsive Design

```
Form Layout
├── ScrollView (vertical)
│   ├── Sections (full width)
│   │   ├── Heading
│   │   └── Fields
│   │
│   ├── Images (horizontal flex-wrap)
│   │   └── 100x100 grid items
│   │
│   └── Submit Button (full width)
│
└── Safe Area Insets
    └── Padding for notch/home indicator
```

## Performance Optimizations

```
Query Management
├── staleTime: 5-10 minutes
├── gcTime: 10-30 minutes
├── enabled flags on conditional queries
└── React Query cache persistence

Image Handling
├── Quality: 0.8 (compressed)
├── Max images: 5 (limited)
└── Immediate upload (better UX)

Form State
├── Controlled components
├── Local state (no global)
└── Validation on submit (not change)
```
