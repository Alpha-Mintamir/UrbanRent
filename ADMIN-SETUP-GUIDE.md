# UrbanRent Admin Setup Guide

This guide will walk you through setting up the admin user and accessing the admin dashboard for your UrbanRent application.

## Creating the Admin User

I've implemented a simple web interface to create the admin user. Follow these steps:

1. **Start the API server**:
   ```
   cd api
   npm start
   ```

2. **Access the Admin Setup Page**:
   Open your browser and navigate to:
   ```
   http://localhost:3001/admin-setup.html
   ```

3. **Create the Admin User**:
   Click the "Create Admin User" button on the page. You'll see a confirmation message when the admin user is created successfully.

## Admin User Credentials

The admin user will be created with the following credentials:
- **Email**: admin@123
- **Password**: admin@123
- **Role**: Admin (4)

## Accessing the Admin Dashboard

1. **Start the Client Application** (in a separate terminal):
   ```
   cd client
   npm run dev
   ```

2. **Login to the Admin Dashboard**:
   Open your browser and navigate to:
   ```
   http://localhost:5173/admin/login
   ```

3. **Enter the Admin Credentials**:
   - Email: admin@123
   - Password: admin@123

4. **Explore the Admin Dashboard**:
   After logging in, you'll be redirected to the admin dashboard where you can:
   - View analytics and statistics
   - Generate reports
   - Export data in CSV format

## Admin Dashboard Features

### Analytics Dashboard
- User statistics
- Property listings data
- Booking trends
- Revenue information
- Top locations

### Report Generation
- User reports
- Property reports
- Booking reports
- Revenue reports

## Troubleshooting

If you encounter any issues:

1. **API Server Not Starting**:
   - Check if the required environment variables are set in `.env`
   - Ensure the database connection is working
   - If port 3001 is already in use, edit `index.js` to use a different port

2. **Admin User Creation Fails**:
   - Check the console logs for specific error messages
   - Verify database connectivity

3. **Cannot Access Admin Dashboard**:
   - Ensure both API and client applications are running
   - Check that the admin user was created successfully
   - Verify that you're using the correct credentials

4. **Dashboard Data Not Loading**:
   - Check browser console for errors
   - Verify API connectivity
