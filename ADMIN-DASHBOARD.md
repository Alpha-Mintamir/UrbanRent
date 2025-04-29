# UrbanRent Admin Dashboard

This document provides instructions for setting up and using the UrbanRent Admin Dashboard.

## Features

The Admin Dashboard includes:

- **Analytics Dashboard**: View key metrics and statistics about your UrbanRent platform
- **Report Generation**: Generate and export various reports (users, properties, bookings, revenue)

## Setup Instructions

### 1. Create Admin User

Run the following command to create the admin user:

```powershell
# From the project root directory
.\create-admin.ps1
```

This will create an admin user with the following credentials:
- **Email**: admin@123
- **Password**: admin@123
- **Role**: Admin (4)

### 2. Install Required Packages

Make sure all required packages are installed:

```powershell
# Install API dependencies
cd api
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Start the Application

Run the application using the provided script:

```powershell
# From the project root directory
.\start-app.ps1
```

This will start both the API server and the client application in separate windows.

### 4. Access the Admin Dashboard

1. Open your browser and navigate to: `http://localhost:5173/admin/login`
2. Log in with the admin credentials:
   - Email: admin@123
   - Password: admin@123
3. You will be redirected to the admin dashboard at `http://localhost:5173/admin/dashboard`

## Using the Admin Dashboard

### Analytics Dashboard

The Analytics Dashboard provides:

- Key metrics (users, properties, bookings, reviews)
- Monthly booking statistics
- User role distribution
- Property listing distribution
- Top locations
- Recent bookings

### Report Generation

To generate reports:

1. Navigate to the Reports tab in the sidebar
2. Select the report type (users, properties, bookings, revenue)
3. Choose a date range (optional)
4. Click "Generate Report"
5. Use the "Export CSV" button to download the report

## Security Notes

- The admin user is created with default credentials. In a production environment, you should change these credentials immediately.
- Access to the admin dashboard is restricted to users with the Admin role (role 4).
- All admin actions are logged for security purposes.

## Troubleshooting

If you encounter issues:

1. Make sure both the API and client are running
2. Check the console logs for any error messages
3. Verify that the admin user was created successfully
4. Ensure your database connection is working properly
