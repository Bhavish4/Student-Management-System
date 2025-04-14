# Student Management System

A modern web application for managing student information with features like secure authentication, student ID generation, QR code integration, and real-time dashboard analytics. Built with HTML, CSS, JavaScript, and Firebase.

![Student Management System](https://img.shields.io/badge/Status-Active-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Yes-brightgreen?style=for-the-badge)
![License](https://img.shields.io/github/license/Bhavish4/Student-Management-System?style=for-the-badge)



## 🌟 Features

- **User Authentication**
  - Secure login system with email/password
  - Google Sign-in integration
  - Password recovery functionality
  - Remember me option
  - Rate limiting for security
  - CSRF protection

- **Student Management**
  - Add new students with auto-generated IDs
  - View all students with search and filter capabilities
  - Edit student information
  - Delete student records
  - Prevent duplicate entries

- **Dashboard**
  - Real-time statistics and metrics
  - Interactive charts and graphs
  - Quick access to important functions

- **ID Card System**
  - Generate student ID cards
  - QR code integration with student data
  - Photo upload functionality
  - Digital signature support

- **Modern UI/UX**
  - Responsive design
  - Interactive elements
  - Preloader animations
  - Clean and intuitive interface

## 🎮 Demo

You can check out the live demo of the Student Management System at [https://student-management-syste-b7b8e.web.app/](https://student-management-syste-b7b8e.web.app/). The demo showcases all the features mentioned above in a real-world environment.

## Security Features

- **Authentication Security**
  - Password hashing and encryption
  - Rate limiting for login attempts
  - CSRF protection
  - Secure password reset through email verification
  - Session management with remember me option
  - Google Sign-in integration

## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, or Edge)
- Firebase account
- Basic understanding of web development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Bhavish4/Student-Management-System.git
```

2. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Update the Firebase configuration in `firebase-config.js`

3. Configure the application:
   - Update Firebase configuration in `firebase-config.js`
   - Set up authentication rules in Firebase Console
   - Configure Firestore security rules
   - Ensure all file references in the code point to the correct files (`index.html`, `overview.html`, etc.)

4. Run the application:
   - Open `index.html` in your web browser
   - Or use a local development server

## 📁 Project Structure

```
Student_Management_System/
├── index.html          # Landing page
├── overview.html       # Main application interface (contains all dashboard features)
├── login.html          # Login page
├── app.js              # Main application logic
├── firebase-config.js  # Firebase configuration
├── styles.css          # Main stylesheet
├── index.css           # Landing page styles
├── login-styles.css    # Login page styles
└── utils/              # Utility functions and helpers
```

> **Note**: The file structure was updated to improve organization. All dashboard functionality is now integrated into `overview.html`, which serves as the main application interface after login.

## 🔧 Configuration

1. Firebase Setup:
   - Create a new Firebase project
   - Enable Email/Password authentication
   - Set up Firestore database
   - Update security rules

2. Environment Configuration:
   - Update Firebase configuration in `firebase-config.js`
   - Configure authentication providers
   - Set up database rules

## 🛠️ Development

### Adding New Features
1. Create a new branch for your feature
2. Implement the feature
3. Test thoroughly
4. Submit a pull request

### Testing
- Test all CRUD operations
- Verify authentication flows
- Check responsive design
- Validate data integrity

## 📝 Usage

1. **Login**
   - Access the login page
   - Enter credentials
   - Navigate to overview page (contains all dashboard features)

2. **Student Management**
   - Add new students
   - View student list
   - Edit student information
   - Generate ID cards

3. **Overview Page**
   - View statistics and analytics
   - Access all system features
   - Monitor system status
   - Manage student records

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Ponugumatla Bhavish - Initial work - [Profile](https://github.com/Bhavish4)

## 🙏 Acknowledgments

- Firebase for backend services
- Chart.js for data visualization
- QRCode.js for QR code generation
- All contributors and supporters

## 📞 Support

For support, email bunnylucky0422@gmail.com or open an issue in the repository.

---

Made with ❤️ by Bhavish.
