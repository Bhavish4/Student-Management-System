# Student Management System - User Manual

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Guide](#installation-guide)
3. [Initial Setup](#initial-setup)
4. [User Guide](#user-guide)
5. [Features Guide](#features-guide)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Hardware Requirements
- Processor: 1.6 GHz or higher
- RAM: 4 GB minimum
- Storage: 500 MB free space
- Display: 1366x768 resolution or higher

### Software Requirements
- Web Browser: Chrome (recommended), Firefox, Edge, or Safari
- Internet Connection: Stable broadband connection
- Operating System: Windows 10/11, macOS, or Linux

## Installation Guide

### Step 1: Download the Application
1. Visit the project repository
2. Click on the "Code" button
3. Select "Download ZIP"
4. Extract the downloaded file to your preferred location

### Step 2: Firebase Setup
1. Create a Firebase account at [firebase.google.com](https://firebase.google.com)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Set up Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules

### Step 3: Configure the Application
1. Open `firebase-config.js`
2. Replace the placeholder configuration with your Firebase project details:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### Step 4: Run the Application
1. Open the extracted folder
2. Double-click on `index.html` to open in your web browser
3. The application will show a preloader while initializing
4. After loading, the landing page will be displayed

## Initial Setup

### First-Time Login
1. Open the application by navigating to `index.html`
2. Click on "Login" in the navigation menu
3. Use the default admin credentials:
   - Email: admin@admin.com
   - Password: admin@123
4. After successful login, you will be redirected to `overview.html`
5. Change the default password after first login

### Password Recovery
If you forget your password:
1. Click on "Forgot Password?" link on the login page
2. Enter your registered email address
3. Click "Send Reset Link"
4. Check your email for the password reset link
5. Click the link in the email to reset your password
6. Create a new password following the security requirements:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

## User Guide

### Dashboard Navigation
- **Home**: View system overview and statistics (in `overview.html`)
- **Students**: Manage student records (in `overview.html`)
- **ID Cards**: Generate and manage student ID cards (in `overview.html`)
- **Reports**: View and generate reports (in `overview.html`)
- **Settings**: Configure system settings (in `overview.html`)

> **Note**: All dashboard functionality is now integrated into `overview.html`. After logging in, you will be redirected to `overview.html` where you can access all system features through the navigation menu.

### Managing Students

#### Adding a New Student
1. Click "Students" in the navigation menu
2. Click "Add New Student"
3. Fill in student details:
   - Personal Information (Name, DOB, Gender)
   - Contact Details (Email, Mobile, Address)
   - Academic Information (Course, Year)
4. Upload student photo (optional)
5. Click "Save"
   - System will automatically generate a unique student ID
   - Format: YYYY/COURSE/ROLL (e.g., 2024/CSE/001)
   - System checks for duplicate entries (ID, email, mobile)

#### Viewing Students
1. Go to "Students" section
2. Use the eye icon to toggle student details visibility
3. Use search to filter students
4. Click on student row to view full details
5. The system shows a preloader while loading student data

#### Editing Student Information
1. Go to "Students" section
2. Find the student in the list
3. Click the "Edit" button
4. Modify the required information
5. Click "Save"
   - System validates all inputs
   - Shows success/error messages

#### Deleting Students
1. Go to "Students" section
2. Find the student in the list
3. Click the "Delete" button
4. Confirm deletion
   - System shows confirmation dialog
   - Displays success message after deletion

### ID Card System

#### Generating ID Cards
1. Go to "ID Cards" section
2. Select student(s)
3. Click "Generate ID Card"
4. Preview the ID card with:
   - Student photo
   - Personal information
   - QR code with embedded student data
   - Digital signature area
5. Click "Download" or "Print"

#### QR Code Features
1. Each ID card includes an interactive QR code
2. QR code contains comprehensive student data in JSON format:
   - Student ID
   - Personal information
   - Contact details
   - Emergency contacts
   - Academic information
3. Scan QR code to view student information
4. Preview QR code data before generation

## Features Guide

### Student Management
- Auto-generated student IDs with specific format
- Duplicate entry prevention (ID, email, mobile)
- Search and filter functionality
- Eye icon toggle for details visibility
- Preloader for all data operations

### ID Card System
- Custom ID card generation
- QR code with comprehensive student data
- Photo upload support
- Digital signature integration
- Preview functionality
- Interactive QR codes

### Security Features
- Secure authentication
- Data validation
- Duplicate entry checks
- Role-based access
- Input sanitization

### UI/UX Features
- Preloader for all pages
- Responsive design
- Interactive elements
- Success/error notifications
- Confirmation dialogs

## Troubleshooting

### Common Issues

#### Login Problems
- Check internet connection
- Verify email and password
- Clear browser cache
- Try different browser
- Ensure you're accessing the correct URL (`index.html` for landing page)
- If login fails, check if you're being redirected to the correct page (`overview.html`)
- If you forgot your password, use the "Forgot Password?" link
- If password reset email is not received:
  - Check spam folder
  - Verify email address is correct
  - Wait a few minutes and try again
  - Contact system administrator if issue persists

#### Navigation Issues
- If you're redirected to the wrong page, check the URL
- Landing page should be `index.html`
- Main application interface should be `overview.html` (contains all dashboard features)
- Login page should be `login.html`
- After successful login, you will be redirected to `overview.html`
- If you see a 404 error, ensure all files are in the correct location

#### File Access Issues
- If features are not loading, check if you're in the correct file (`overview.html`)
- Ensure all JavaScript files are properly linked
- Check browser console for any errors
- Verify that all required files are present in the project directory
- If you see "File not found" errors, check the file names and paths

#### ID Card Generation Issues
- Ensure student photo is uploaded
- Check printer connection
- Verify QR code scanner compatibility
- Ensure all required fields are filled
- If ID card preview fails, check browser console for errors

#### Data Loading Issues
- Refresh the page
- Check internet connection
- Clear browser cache
- Contact system administrator
- If data is not loading, verify Firebase connection
- Check if you're in the correct section of `overview.html`

### Contact Support
For technical support:
- Email: bunnylucky0422@gmail.com
- Hours: Monday-Friday, 9 AM - 5 PM
- Include the following in your support request:
  - Browser version
  - Operating system
  - Error messages (if any)
  - Steps to reproduce the issue

## Login Process

### First-time Login
1. Navigate to the login page
2. Enter your registered email address
3. Enter your password
4. Click the "Login" button
5. If you want to stay logged in, check the "Remember me" box
6. For first-time users, you'll be prompted to set up your profile

### Password Recovery
If you've forgotten your password:
1. Click the "Forgot Password?" link on the login page
2. Enter your registered email address in the popup form
3. Click "Send Reset Link"
4. Check your email for a password reset link
5. Click the link in the email to reset your password
6. Create a new password following the security requirements:
   - At least 6 characters long
   - Include a mix of letters, numbers, and special characters
7. Return to the login page and use your new password

### Troubleshooting Login Issues
- If you can't remember your password, use the "Forgot Password?" feature
- If you don't receive the password reset email:
  - Check your spam folder
  - Verify you entered the correct email address
  - Wait a few minutes and try again
  - Contact support if the issue persists
- If you're locked out after multiple failed attempts:
  - Wait for the lockout period to expire (5 minutes)
  - Use the password reset feature
  - Contact support if you need immediate access

---

*Last Updated: 14-April-2024*
*Version: 1.1* 
