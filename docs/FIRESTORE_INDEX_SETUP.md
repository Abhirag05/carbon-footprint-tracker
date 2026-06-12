# Firestore Index Setup

## Required Composite Index

The Carbon Footprint Tracker app requires a composite index in Firestore to efficiently query activities. This is a one-time setup required when you first run the app.

## Why is this needed?

Firestore requires composite indexes when you:
- Filter by multiple fields (e.g., `userId` and `type`)
- Combine filtering with ordering (e.g., filter by `userId` and order by `date`)

## How to Create the Index

### Option 1: Automatic (Recommended)

1. Run the app and try to view activities
2. You'll see an error in the console with a link like:
   ```
   https://console.firebase.google.com/v1/r/project/YOUR_PROJECT/firestore/indexes?create_composite=...
   ```
3. Click the link (or copy-paste it into your browser)
4. Firebase Console will open with the index pre-configured
5. Click "Create Index"
6. Wait 1-2 minutes for the index to build
7. Restart your app

### Option 2: Manual

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`mariantrack`)
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Configure the index:
   - **Collection ID**: `activities`
   - **Fields to index**:
     - `userId` - Ascending
     - `date` - Descending
   - **Query scope**: Collection
6. Click **Create**
7. Wait for the index to build (status will change from "Building" to "Enabled")
8. Restart your app

## Index Configuration

```
Collection: activities
Fields:
  - userId (Ascending)
  - date (Descending)
Query scope: Collection
```

## Additional Indexes (Optional)

If you plan to filter by activity type, you may also want to create:

```
Collection: activities
Fields:
  - userId (Ascending)
  - type (Ascending)
  - date (Descending)
Query scope: Collection
```

## Troubleshooting

### Index is still not working after creation
- Wait a few minutes - indexes can take time to build
- Check the Indexes tab to ensure status is "Enabled"
- Restart your app completely

### Multiple index errors
- Each unique query combination needs its own index
- Follow the link in each error message to create the required index
- Common combinations are already handled in the code

### Index creation fails
- Ensure you have Owner or Editor permissions on the Firebase project
- Check that Firestore is properly initialized
- Verify you're logged into the correct Google account

## Performance Notes

- Indexes improve query performance significantly
- They use additional storage (minimal for most apps)
- Firestore automatically maintains indexes as data changes
- No ongoing maintenance required after initial setup
