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
1. Open the application
2. Click on "Login" in the navigation menu
3. Use the default admin credentials:
   - Email: admin@admin.com
   - Password: admin@123
4. Change the default password after first login

## User Guide

### Dashboard Navigation
- **Home**: View system overview and statistics
- **Students**: Manage student records
- **ID Cards**: Generate and manage student ID cards
- **Reports**: View and generate reports
- **Settings**: Configure system settings

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

#### ID Card Generation Issues
- Ensure student photo is uploaded
- Check printer connection
- Verify QR code scanner compatibility
- Ensure all required fields are filled

#### Data Loading Issues
- Refresh the page
- Check internet connection
- Clear browser cache
- Contact system administrator

### Contact Support
For technical support:
- Email: bunnylucky0422@gmail.com
- Hours: Monday-Friday, 9 AM - 5 PM

---

*Last Updated: 14-April-2025*
*Version: 1.0* 
