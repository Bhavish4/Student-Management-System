// Import Firebase modules
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Import Chart.js
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/+esm';
Chart.register(...registerables);

// Initialize Firestore
const db = getFirestore(window.firebaseApp);

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const studentForm = document.getElementById('student-form');
const searchBtn = document.getElementById('search-btn');
const searchResult = document.getElementById('search-result');
const studentsList = document.getElementById('students-list');
const studentModal = document.getElementById('student-modal');
const editModal = document.getElementById('edit-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close');
const closeEditModal = document.querySelector('.close-edit');
const editStudentBtn = document.getElementById('edit-student');
const deleteStudentBtn = document.getElementById('delete-student');
const editForm = document.getElementById('edit-form');

// Attendance functionality
const attendanceDate = document.getElementById('attendance-date');
const attendanceCourse = document.getElementById('attendance-course');
const attendanceBatch = document.getElementById('attendance-batch');
const loadAttendanceBtn = document.getElementById('load-attendance');
const saveAttendanceBtn = document.getElementById('save-attendance');
const markAllPresentBtn = document.getElementById('mark-all-present');
const markAllAbsentBtn = document.getElementById('mark-all-absent');
const attendanceStudents = document.getElementById('attendance-students');
const attendanceCalendar = document.getElementById('attendance-calendar');

// Performance Analytics functionality
const performanceStudent = document.getElementById('performance-student');
const performanceCourse = document.getElementById('performance-course');
const performanceBatch = document.getElementById('performance-batch');
const loadPerformanceBtn = document.getElementById('load-performance');
const averageScore = document.getElementById('average-score');
const highestScore = document.getElementById('highest-score');
const attendanceRate = document.getElementById('attendance-rate');
const studentRank = document.getElementById('student-rank');
const assessmentList = document.getElementById('assessment-list');

let scoreChart = null;
let subjectChart = null;
let courseChart = null;
let batchChart = null;

// ID Card Modal Elements
const idCardModal = document.getElementById('id-card-modal');
const idCardContainer = document.getElementById('id-card-container');
const closeIdCard = document.querySelector('.close-id-card');
const printIdCardBtn = document.getElementById('print-id-card');
const downloadIdCardBtn = document.getElementById('download-id-card');

// Tab functionality
function setupEventListeners() {
    const cleanupFunctions = [];

    // Tab functionality with cleanup
    tabButtons.forEach(button => {
        const clickHandler = () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // If "All Students" tab is clicked, load all students
            if (tabId === 'all-students') {
                loadAllStudents();
            }
        };
        
        button.addEventListener('click', clickHandler);
        cleanupFunctions.push(() => button.removeEventListener('click', clickHandler));
    });

    // Modal close handlers with cleanup
    if (closeModal) {
        const closeModalHandler = () => {
            studentModal.style.display = 'none';
        };
        closeModal.addEventListener('click', closeModalHandler);
        cleanupFunctions.push(() => closeModal.removeEventListener('click', closeModalHandler));
    }

    if (closeEditModal) {
        const closeEditModalHandler = () => {
            editModal.style.display = 'none';
        };
        closeEditModal.addEventListener('click', closeEditModalHandler);
        cleanupFunctions.push(() => closeEditModal.removeEventListener('click', closeEditModalHandler));
    }

    // Window click handler for modals with cleanup
    const windowClickHandler = (e) => {
        if (e.target === studentModal) {
            studentModal.style.display = 'none';
        }
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    };
    window.addEventListener('click', windowClickHandler);
    cleanupFunctions.push(() => window.removeEventListener('click', windowClickHandler));

    // Return cleanup function
    return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
    };
}

// Initialize event listeners when DOM is loaded
let cleanupEventListeners;
document.addEventListener('DOMContentLoaded', () => {
    cleanupEventListeners = setupEventListeners();
    
    // Check for URL hash and activate the corresponding tab
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tabToActivate = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
        if (tabToActivate) {
            tabToActivate.click();
        }
    } else {
        // No hash in URL, use the default active tab
        if (document.getElementById('all-students').classList.contains('active')) {
            loadAllStudents();
        }
        
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboardData();
        }
    }
    
    // Display user info
    displayUserInfo();
});

// Cleanup event listeners when page is unloaded
window.addEventListener('beforeunload', () => {
    if (cleanupEventListeners) {
        cleanupEventListeners();
    }
});

// Generate Student ID based on batch, course, and date of birth
function generateStudentId() {
    const batch = document.getElementById('batch').value;
    const course = document.getElementById('course').value;
    const dob = document.getElementById('dob').value;

    if (!batch || !course || !dob) {
        alert("Please fill in Batch, Course, and Date of Birth to generate Student ID");
        return "";
    }

    // Get first letter of course
    const courseFirstLetter = course.charAt(0);
    
    // Format date of birth (remove hyphens from yyyy-mm-dd)
    const formattedDob = dob.replace(/-/g, '').slice(2); // Remove year prefix (21st century is implied)
    
    // Generate ID in format: Batch-CourseFirstLetter-DateOfBirth
    return `${batch}-${courseFirstLetter}-${formattedDob}`;
}

// Add event listener to generate ID button
document.getElementById('generate-id').addEventListener('click', function() {
    const studentId = generateStudentId();
    if (studentId) {
        document.getElementById('student-id').value = studentId;
    }
});

// Auto-generate ID when batch, course, or DOB changes
document.getElementById('batch').addEventListener('change', function() {
    if (document.getElementById('course').value && document.getElementById('dob').value) {
        document.getElementById('student-id').value = generateStudentId();
    }
});

document.getElementById('course').addEventListener('change', function() {
    if (document.getElementById('batch').value && document.getElementById('dob').value) {
        document.getElementById('student-id').value = generateStudentId();
    }
});

document.getElementById('dob').addEventListener('change', function() {
    if (document.getElementById('batch').value && document.getElementById('course').value) {
        document.getElementById('student-id').value = generateStudentId();
    }
});

// Enhanced validation functions
function validateStudentData(data) {
    const errors = [];
    
    // Required fields
    const requiredFields = ['name', 'email', 'mobile', 'course', 'batch', 'studentId'];
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    }
    
    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push('Invalid email format');
    }
    
    // Mobile number format (basic validation)
    const mobileRegex = /^[0-9]{10}$/;
    if (data.mobile && !mobileRegex.test(data.mobile)) {
        errors.push('Mobile number must be 10 digits');
    }
    
    return errors;
}

// Enhanced Firebase operations with validation
async function addStudent(data) {
    try {
        // Validate data
        const errors = validateStudentData(data);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
        
        // Check for duplicates
        const duplicateChecks = [
            { field: 'studentId', message: 'Student ID already exists' },
            { field: 'email', message: 'Email already exists' },
            { field: 'mobile', message: 'Mobile number already exists' }
        ];
        
        for (const check of duplicateChecks) {
            const q = query(collection(db, "students"), where(check.field, "==", data[check.field]));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                throw new Error(check.message);
            }
        }
        
        // Add student with metadata
        const docRef = await addDoc(collection(db, "students"), {
            ...data,
            createdAt: new Date(),
            createdBy: getAuth().currentUser?.email || 'unknown',
            updatedAt: new Date()
        });
        
        return docRef.id;
    } catch (error) {
        console.error("Error adding student:", error);
        throw error;
    }
}

async function updateStudent(id, data) {
    try {
        if (!id) {
            throw new Error("Student ID is required");
        }
        
        // Validate data
        const errors = validateStudentData(data);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
        
        // Get current student data
        const docRef = doc(db, "students", id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error("Student not found");
        }
        
        const currentStudent = docSnap.data();
        
        // Check for duplicates if fields changed
        const duplicateChecks = [
            { field: 'email', message: 'Email already exists' },
            { field: 'mobile', message: 'Mobile number already exists' }
        ];
        
        for (const check of duplicateChecks) {
            if (data[check.field] !== currentStudent[check.field]) {
                const q = query(collection(db, "students"), where(check.field, "==", data[check.field]));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    throw new Error(check.message);
                }
            }
        }
        
        // Update student
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date()
        });
        
        return true;
    } catch (error) {
        console.error("Error updating student:", error);
        throw error;
    }
}

async function deleteStudent(id) {
    try {
        if (!id) {
            throw new Error("Student ID is required");
        }
        
        // Check if student exists
        const docRef = doc(db, "students", id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error("Student not found");
        }
        
        // Delete student
        await deleteDoc(docRef);
        
        return true;
    } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
    }
}

// Update form submission handlers to use enhanced functions
if (studentForm) {
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                dob: document.getElementById('dob').value,
                mobile: document.getElementById('mobile').value.trim(),
                address: document.getElementById('address').value.trim(),
                course: document.getElementById('course').value,
                batch: document.getElementById('batch').value,
                studentId: document.getElementById('student-id').value.trim()
            };
            
            await addStudent(formData);
            alert("Student added successfully!");
            studentForm.reset();
            document.getElementById('student-id').value = '';
            loadAllStudents();
        } catch (error) {
            alert(error.message || "Error adding student");
        }
    });
}

if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                id: document.getElementById('edit-id').value,
                name: document.getElementById('edit-name').value.trim(),
                email: document.getElementById('edit-email').value.trim(),
                dob: document.getElementById('edit-dob').value,
                mobile: document.getElementById('edit-mobile').value.trim(),
                address: document.getElementById('edit-address').value.trim(),
                course: document.getElementById('edit-course').value,
                batch: document.getElementById('edit-batch').value,
                studentId: document.getElementById('edit-student-id').value.trim()
            };
            
            await updateStudent(formData.id, formData);
            alert("Student updated successfully!");
            editModal.style.display = 'none';
            loadAllStudents();
        } catch (error) {
            alert(error.message || "Error updating student");
        }
    });
}

// Update delete function to use enhanced delete operation
window.deleteStudentById = async function(id) {
    if (!id) {
        alert("No student ID provided for deletion");
        return;
    }

    if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
        try {
            await deleteStudent(id);
            alert("Student deleted successfully!");
            loadAllStudents();
            
            // Close any open modals
            if (studentModal) {
                studentModal.style.display = 'none';
            }
            if (editModal) {
                editModal.style.display = 'none';
            }
        } catch (error) {
            alert(error.message || "Failed to delete student");
        }
    }
};

// Enhanced search functionality
searchBtn.addEventListener('click', async () => {
    const searchId = document.getElementById('search-id').value.trim();
    
    if (!searchId) {
        alert("Please enter a student ID");
        return;
    }
    
    try {
        // Create a query against the collection
        const q = query(collection(db, "students"), where("studentId", "==", searchId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            searchResult.innerHTML = `<div class="alert alert-warning">No student found with ID: ${searchId}</div>`;
            return;
        }
        
        // Display the first matching student
        const doc = querySnapshot.docs[0];
        const student = doc.data();
        
        // Format dates
        const createdDate = student.createdAt ? 
            (student.createdAt.toDate ? student.createdAt.toDate().toLocaleString() : new Date(student.createdAt).toLocaleString()) : 
            'N/A';
        const updatedDate = student.updatedAt ? 
            (student.updatedAt.toDate ? student.updatedAt.toDate().toLocaleString() : new Date(student.updatedAt).toLocaleString()) : 
            'N/A';
        
        // Format date of birth
        const dob = student.dob ? student.dob : 'N/A';
        
        searchResult.innerHTML = `
            <div class="student-details">
                <h3>${student.name}</h3>
                <div class="student-info">
                    <p><strong>Student ID:</strong> ${student.studentId}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Date of Birth:</strong> ${dob}</p>
                    <p><strong>Mobile:</strong> ${student.mobile}</p>
                    <p><strong>Address:</strong> ${student.address || 'N/A'}</p>
                    <p><strong>Course:</strong> ${student.course}</p>
                    <p><strong>Batch/Year:</strong> ${student.batch}</p>
                    <p><strong>Added on:</strong> ${createdDate}</p>
                    <p><strong>Last updated:</strong> ${updatedDate}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error searching for student: ", error);
        searchResult.innerHTML = `<div class="alert alert-danger">Error searching for student: ${error.message}</div>`;
    }
});

// Make functions globally available
window.openEditModal = async function(id) {
    try {
        if (!id) {
            throw new Error("No student ID provided for editing");
        }

        const docRef = doc(db, "students", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const student = docSnap.data();
            
            // Populate edit form with null checks
            const elements = {
                'edit-id': id,
                'edit-name': student.name,
                'edit-email': student.email,
                'edit-dob': student.dob || '',
                'edit-mobile': student.mobile,
                'edit-address': student.address || '',
                'edit-course': student.course,
                'edit-batch': student.batch,
                'edit-student-id': student.studentId
            };

            // Update form fields with error handling
            for (const [elementId, value] of Object.entries(elements)) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = value;
                } else {
                    console.error(`Element ${elementId} not found`);
                }
            }
            
            const editModal = document.getElementById('edit-modal');
            if (editModal) {
                editModal.style.display = 'block';
            } else {
                throw new Error("Edit modal element not found");
            }
        } else {
            throw new Error("Student not found!");
        }
    } catch (error) {
        console.error("Error getting student for edit:", error);
        alert(error.message || "Error getting student details");
    }
};

// Edit button in modal
editStudentBtn.addEventListener('click', () => {
    const id = editStudentBtn.getAttribute('data-id');
    studentModal.style.display = 'none';
    openEditModal(id);
});

// Delete button in modal
deleteStudentBtn.addEventListener('click', async () => {
    if (confirm("Are you sure you want to delete this student?")) {
        const id = deleteStudentBtn.getAttribute('data-id');
        await deleteStudentById(id);
        loadAllStudents();
    }
});

// Close modals
closeModal.addEventListener('click', () => {
    studentModal.style.display = 'none';
});

closeEditModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === studentModal) {
        studentModal.style.display = 'none';
    }
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Load all students when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check for URL hash and activate the corresponding tab
    const hash = window.location.hash.substring(1); // Remove the # character
    if (hash) {
        const tabToActivate = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
        if (tabToActivate) {
            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Activate the tab from the URL hash
            tabToActivate.classList.add('active');
            const tabId = tabToActivate.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Load data for the active tab
            if (tabId === 'all-students') {
                loadAllStudents();
            } else if (tabId === 'dashboard') {
                loadDashboardData();
            } else if (tabId === 'attendance') {
                loadAttendanceFilters();
                loadAttendanceCalendar();
            } else if (tabId === 'performance') {
                loadPerformanceFilters();
            }
        }
    } else {
        // No hash in URL, use the default active tab
        if (document.getElementById('all-students').classList.contains('active')) {
            loadAllStudents();
        }
        
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboardData();
        }
    }
    
    // Add tab click listeners for specific functionality
    tabButtons.forEach(button => {
        const tabId = button.getAttribute('data-tab');
        if (tabId === 'dashboard') {
            button.addEventListener('click', loadDashboardData);
        } else if (tabId === 'attendance') {
            button.addEventListener('click', () => {
                loadAttendanceFilters();
                loadAttendanceCalendar();
            });
        } else if (tabId === 'performance') {
            button.addEventListener('click', loadPerformanceFilters);
        }
    });
    
    // Display user info
    displayUserInfo();
    
    // Set up event listener for loadAllStudentsEvent
    document.addEventListener('loadAllStudentsEvent', () => {
        loadAllStudents();
    });
});

// Add this function to display user info
function displayUserInfo() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    const userActions = document.querySelector('.user-actions');
    if (!userActions) {
        console.error("User actions element not found");
        return;
    }
    
    if (user) {
        const userInfoElement = document.createElement('div');
        userInfoElement.className = 'user-info';
        
        // Create user avatar
        const userAvatar = document.createElement('div');
        userAvatar.className = 'user-avatar';
        
        if (user.photoURL) {
            // If user has a profile picture (from Google)
            userAvatar.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName || user.email}">`;
        } else {
            // Create initials avatar
            const initials = user.displayName ? 
                user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : 
                user.email.substring(0, 2).toUpperCase();
            
            userAvatar.innerHTML = `<div class="initials-avatar">${initials}</div>`;
        }
        
        // Create user name/email display
        const userName = document.createElement('div');
        userName.className = 'user-name';
        userName.textContent = user.displayName || user.email;
        
        userInfoElement.appendChild(userAvatar);
        userInfoElement.appendChild(userName);
        
        // Add to the header
        userActions.prepend(userInfoElement);
    }
}

// Dashboard functionality
async function loadDashboardData() {
    try {
        const dashboardElements = {
            totalStudents: document.getElementById('total-students'),
            totalCourses: document.getElementById('total-courses'),
            totalBatches: document.getElementById('total-batches'),
            recentActivity: document.getElementById('recent-activity'),
            recentStudentsList: document.getElementById('recent-students-list')
        };

        // Check if all required elements exist
        for (const [key, element] of Object.entries(dashboardElements)) {
            if (!element) {
                console.error(`Required dashboard element ${key} not found in the DOM`);
                throw new Error(`Required dashboard element ${key} not found`);
            }
        }

        const querySnapshot = await getDocs(collection(db, "students"));
        const students = [];
        const courses = new Set();
        const batches = new Set();

        querySnapshot.forEach(doc => {
            try {
                const student = doc.data();
                if (!student) {
                    console.warn(`Empty student data for document ${doc.id}`);
                    return;
                }
                students.push(student);
                if (student.course) courses.add(student.course);
                if (student.batch) batches.add(student.batch);
            } catch (error) {
                console.error(`Error processing student document ${doc.id}:`, error);
            }
        });

        // Update dashboard stats with null checks
        if (dashboardElements.totalStudents) {
            dashboardElements.totalStudents.textContent = students.length;
        }
        if (dashboardElements.totalCourses) {
            dashboardElements.totalCourses.textContent = courses.size;
        }
        if (dashboardElements.totalBatches) {
            dashboardElements.totalBatches.textContent = batches.size;
        }

        // Sort students by date with error handling
        const sortedByDate = [...students].sort((a, b) => {
            try {
                const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
                return dateB - dateA;
            } catch (error) {
                console.error('Error sorting students by date:', error);
                return 0;
            }
        });

        // Update recent activity with error handling
        const mostRecent = sortedByDate[0];
        if (mostRecent && dashboardElements.recentActivity) {
            try {
                const date = mostRecent.createdAt 
                    ? new Date(mostRecent.createdAt.seconds * 1000).toLocaleDateString()
                    : 'Unknown date';
                dashboardElements.recentActivity.textContent = `${mostRecent.name} added on ${date}`;
            } catch (error) {
                console.error('Error updating recent activity:', error);
                dashboardElements.recentActivity.textContent = 'Error loading recent activity';
            }
        }

        // Create charts with cleanup and error handling
        try {
            if (typeof courseChart !== 'undefined' && courseChart) {
                courseChart.destroy();
            }
            if (typeof batchChart !== 'undefined' && batchChart) {
                batchChart.destroy();
            }

            createCourseChart(students, Array.from(courses));
            createBatchChart(students, Array.from(batches));
        } catch (error) {
            console.error('Error creating charts:', error);
        }

        // Display recent students with error handling
        if (dashboardElements.recentStudentsList) {
            try {
                displayRecentStudents(sortedByDate.slice(0, 6));
            } catch (error) {
                console.error('Error displaying recent students:', error);
                dashboardElements.recentStudentsList.innerHTML = '<p class="error">Error loading recent students</p>';
            }
        }

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        
        // Display error messages in dashboard components with null checks
        const errorMessage = 'Error loading data';
        if (document.getElementById('total-students')) {
            document.getElementById('total-students').textContent = errorMessage;
        }
        if (document.getElementById('total-courses')) {
            document.getElementById('total-courses').textContent = errorMessage;
        }
        if (document.getElementById('total-batches')) {
            document.getElementById('total-batches').textContent = errorMessage;
        }
        if (document.getElementById('recent-activity')) {
            document.getElementById('recent-activity').textContent = errorMessage;
        }
        if (document.getElementById('recent-students-list')) {
            document.getElementById('recent-students-list').innerHTML = 
                `<p class="error">Error loading students: ${error.message}</p>`;
        }

        // Cleanup charts on error
        if (typeof courseChart !== 'undefined' && courseChart) {
            courseChart.destroy();
            courseChart = null;
        }
        if (typeof batchChart !== 'undefined' && batchChart) {
            batchChart.destroy();
            batchChart = null;
        }
    }
}

function createCourseChart(students, courses) {
    // Count students per course
    const courseCounts = {};
    courses.forEach(course => {
        courseCounts[course] = students.filter(student => student.course === course).length;
    });
    
    // Get canvas context
    const ctx = document.getElementById('course-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (courseChart) {
        courseChart.destroy();
    }
    
    // Create new chart
    courseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: courses,
            datasets: [{
                data: Object.values(courseCounts),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function createBatchChart(students, batches) {
    // Count students per batch
    const batchCounts = {};
    batches.forEach(batch => {
        batchCounts[batch] = students.filter(student => student.batch === batch).length;
    });
    
    // Get canvas context
    const ctx = document.getElementById('batch-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (batchChart) {
        batchChart.destroy();
    }
    
    // Create new chart
    batchChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: batches,
            datasets: [{
                label: 'Number of Students',
                data: Object.values(batchCounts),
                backgroundColor: '#3498db',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function displayRecentStudents(recentStudents) {
    const container = document.getElementById('recent-students-list');
    
    if (recentStudents.length === 0) {
        container.innerHTML = '<p>No students found</p>';
        return;
    }
    
    let html = '';
    recentStudents.forEach(student => {
        const date = student.createdAt?.toDate ? 
            student.createdAt.toDate().toLocaleString() : 
            new Date(student.createdAt).toLocaleString();
        
        html += `
            <div class="recent-student-card">
                <h4>${student.name}</h4>
                <p><strong>ID:</strong> ${student.studentId}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Batch:</strong> ${student.batch}</p>
                <p class="timestamp">Added on ${date}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Export functionality
document.getElementById('export-csv').addEventListener('click', exportToCSV);
document.getElementById('export-pdf').addEventListener('click', exportToPDF);
document.getElementById('print-list').addEventListener('click', printStudentList);

function exportToCSV() {
    try {
        getDocs(collection(db, "students")).then(querySnapshot => {
            if (querySnapshot.empty) {
                alert("No students to export");
                return;
            }
            
            const students = [];
            querySnapshot.forEach(doc => {
                const student = doc.data();
                students.push(student);
            });
            
            // Create CSV content
            let csvContent = "Student ID,Name,Email,Mobile,Address,Course,Batch\n";
            
            students.forEach(student => {
                const row = [
                    student.studentId,
                    student.name,
                    student.email,
                    student.mobile,
                    student.address || '',
                    student.course,
                    student.batch
                ].map(cell => `"${cell}"`).join(',');
                
                csvContent += row + '\n';
            });
            
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'students.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } catch (error) {
        console.error("Error exporting to CSV: ", error);
        alert("Error exporting to CSV");
    }
}

function exportToPDF() {
    try {
        getDocs(collection(db, "students")).then(querySnapshot => {
            if (querySnapshot.empty) {
                alert("No students to export");
                return;
            }
            
            const students = [];
            querySnapshot.forEach(doc => {
                const student = doc.data();
                students.push(student);
            });
            
            // Create a new jsPDF instance
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(18);
            doc.text('Student Management System - Student List', 14, 22);
            
            // Add date
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            
            // Create the table
            const tableColumn = ["ID", "Name", "Email", "Mobile", "Course", "Batch"];
            const tableRows = [];
            
            students.forEach(student => {
                const studentData = [
                    student.studentId,
                    student.name,
                    student.email,
                    student.mobile,
                    student.course,
                    student.batch
                ];
                tableRows.push(studentData);
            });
            
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    overflow: 'linebreak'
                },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 50 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 30 },
                    5: { cellWidth: 20 }
                }
            });
            
            // Save the PDF
            doc.save('students.pdf');
        });
    } catch (error) {
        console.error("Error exporting to PDF: ", error);
        alert("Error exporting to PDF");
    }
}

function printStudentList() {
    const printWindow = window.open('', '_blank');
    
    getDocs(collection(db, "students")).then(querySnapshot => {
        if (querySnapshot.empty) {
            alert("No students to print");
            printWindow.close();
            return;
        }
        
        const students = [];
        querySnapshot.forEach(doc => {
            const student = doc.data();
            students.push(student);
        });
        
        // Create HTML content
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student List</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { text-align: center; color: #3498db; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #3498db; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    .print-date { text-align: right; margin-bottom: 20px; }
                    @media print {
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Student Management System - Student List</h1>
                <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
                <button onclick="window.print()">Print</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Course</th>
                            <th>Batch</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        students.forEach(student => {
            htmlContent += `
                <tr>
                    <td>${student.studentId}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.mobile}</td>
                    <td>${student.course}</td>
                    <td>${student.batch}</td>
                </tr>
            `;
        });
        
        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    });
}

// Set default date to today
if (attendanceDate) {
    attendanceDate.valueAsDate = new Date();
}

// Load courses and batches for attendance
async function loadAttendanceFilters() {
    try {
        if (!attendanceCourse || !attendanceBatch) {
            console.error("Attendance filter elements not found");
            return;
        }

        const querySnapshot = await getDocs(collection(db, "students"));
        
        if (querySnapshot.empty) {
            return;
        }
        
        const courses = new Set();
        const batches = new Set();
        
        querySnapshot.forEach(doc => {
            const student = doc.data();
            if (student.course) courses.add(student.course);
            if (student.batch) batches.add(student.batch);
        });
        
        // Populate course dropdown
        attendanceCourse.innerHTML = '<option value="">Select Course</option>';
        Array.from(courses).sort().forEach(course => {
            attendanceCourse.innerHTML += `<option value="${course}">${course}</option>`;
        });
        
        // Populate batch dropdown
        attendanceBatch.innerHTML = '<option value="">Select Batch</option>';
        Array.from(batches).sort().forEach(batch => {
            attendanceBatch.innerHTML += `<option value="${batch}">${batch}</option>`;
        });
        
    } catch (error) {
        console.error("Error loading attendance filters: ", error);
    }
}

// Add event listeners for attendance buttons if they exist
if (loadAttendanceBtn) {
    loadAttendanceBtn.addEventListener('click', async () => {
        if (!attendanceDate || !attendanceCourse || !attendanceBatch || !attendanceStudents) {
            console.error("Attendance elements not found");
            return;
        }

        const date = attendanceDate.value;
        const course = attendanceCourse.value;
        const batch = attendanceBatch.value;
        
        if (!date || !course || !batch) {
            alert("Please select date, course and batch");
            return;
        }
        
        try {
            // Query students by course and batch
            const q = query(
                collection(db, "students"), 
                where("course", "==", course),
                where("batch", "==", batch)
            );
            
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                attendanceStudents.innerHTML = '<tr><td colspan="4">No students found for this course and batch</td></tr>';
                saveAttendanceBtn.disabled = true;
                markAllPresentBtn.disabled = true;
                markAllAbsentBtn.disabled = true;
                return;
            }
            
            // Check if attendance already exists for this date, course and batch
            const attendanceQuery = query(
                collection(db, "attendance"),
                where("date", "==", date),
                where("course", "==", course),
                where("batch", "==", batch)
            );
            
            const attendanceSnapshot = await getDocs(attendanceQuery);
            let existingAttendance = {};
            
            if (!attendanceSnapshot.empty) {
                const attendanceDoc = attendanceSnapshot.docs[0];
                existingAttendance = attendanceDoc.data().students || {};
            }
            
            // Display students
            let html = '';
            querySnapshot.forEach(doc => {
                const student = doc.data();
                const studentId = student.studentId;
                const existingStatus = existingAttendance[studentId]?.status || '';
                const existingNotes = existingAttendance[studentId]?.notes || '';
                
                html += `
                    <tr data-id="${studentId}">
                        <td>${studentId}</td>
                        <td>${student.name}</td>
                        <td>
                            <div class="attendance-status">
                                <input type="radio" name="status-${studentId}" id="present-${studentId}" value="present" class="status-radio" ${existingStatus === 'present' ? 'checked' : ''}>
                                <label for="present-${studentId}" class="status-label present">Present</label>
                                
                                <input type="radio" name="status-${studentId}" id="absent-${studentId}" value="absent" class="status-radio" ${existingStatus === 'absent' ? 'checked' : ''}>
                                <label for="absent-${studentId}" class="status-label absent">Absent</label>
                                
                                <input type="radio" name="status-${studentId}" id="late-${studentId}" value="late" class="status-radio" ${existingStatus === 'late' ? 'checked' : ''}>
                                <label for="late-${studentId}" class="status-label late">Late</label>
                            </div>
                        </td>
                        <td>
                            <input type="text" class="attendance-notes" placeholder="Notes" value="${existingNotes}">
                        </td>
                    </tr>
                `;
            });
            
            attendanceStudents.innerHTML = html;
            saveAttendanceBtn.disabled = false;
            markAllPresentBtn.disabled = false;
            markAllAbsentBtn.disabled = false;
            
        } catch (error) {
            console.error("Error loading students for attendance: ", error);
            attendanceStudents.innerHTML = '<tr><td colspan="4">Error loading students</td></tr>';
        }
    });
}

if (saveAttendanceBtn) {
    saveAttendanceBtn.addEventListener('click', async () => {
        const elements = {
            date: document.getElementById('attendance-date'),
            course: document.getElementById('attendance-course'),
            batch: document.getElementById('attendance-batch'),
            students: document.getElementById('attendance-students')
        };

        // Check if all required elements exist
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Required attendance element ${key} not found`);
                return;
            }
        }

        const date = elements.date.value;
        const course = elements.course.value;
        const batch = elements.batch.value;

        if (!date || !course || !batch) {
            alert("Please select date, course and batch");
            return;
        }

        try {
            const rows = elements.students.querySelectorAll('tr[data-id]');
            if (rows.length === 0) {
                alert("No students to save attendance for");
                return;
            }

            // Collect attendance data
            const students = {};
            let hasIncompleteAttendance = false;
            
            rows.forEach(row => {
                const studentId = row.getAttribute('data-id');
                const statusRadios = row.querySelectorAll('input[type="radio"]');
                const notes = row.querySelector('.attendance-notes').value;
                
                let status = '';
                statusRadios.forEach(radio => {
                    if (radio.checked) {
                        status = radio.value;
                    }
                });
                
                if (!status) {
                    hasIncompleteAttendance = true;
                }
                
                students[studentId] = {
                    status,
                    notes
                };
            });
            
            if (hasIncompleteAttendance) {
                if (!confirm("Some students don't have attendance marked. Continue anyway?")) {
                    return;
                }
            }
            
            // Check if attendance already exists for this date, course and batch
            const attendanceQuery = query(
                collection(db, "attendance"),
                where("date", "==", date),
                where("course", "==", course),
                where("batch", "==", batch)
            );
            
            const attendanceSnapshot = await getDocs(attendanceQuery);
            
            if (!attendanceSnapshot.empty) {
                // Update existing attendance
                const attendanceDoc = attendanceSnapshot.docs[0];
                await updateDoc(doc(db, "attendance", attendanceDoc.id), {
                    students,
                    updatedAt: new Date()
                });
            } else {
                // Create new attendance
                await addDoc(collection(db, "attendance"), {
                    date,
                    course,
                    batch,
                    students,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
            
            alert("Attendance saved successfully!");
            
            // Refresh the calendar
            loadAttendanceCalendar();
            
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Failed to save attendance: " + error.message);
        }
    });
}

if (markAllPresentBtn) {
    markAllPresentBtn.addEventListener('click', () => {
        if (!attendanceStudents) {
            console.error("Attendance students element not found");
            return;
        }

        const rows = attendanceStudents.querySelectorAll('tr[data-id]');
        rows.forEach(row => {
            const studentId = row.getAttribute('data-id');
            const presentRadio = document.getElementById(`present-${studentId}`);
            if (presentRadio) presentRadio.checked = true;
        });
    });
}

if (markAllAbsentBtn) {
    markAllAbsentBtn.addEventListener('click', () => {
        if (!attendanceStudents) {
            console.error("Attendance students element not found");
            return;
        }

        const rows = attendanceStudents.querySelectorAll('tr[data-id]');
        rows.forEach(row => {
            const studentId = row.getAttribute('data-id');
            const absentRadio = document.getElementById(`absent-${studentId}`);
            if (absentRadio) absentRadio.checked = true;
        });
    });
}

// Load attendance calendar
async function loadAttendanceCalendar() {
    try {
        if (!attendanceCalendar) {
            console.error("Attendance calendar element not found");
            return;
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // Get first day of month
        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Get last day of month
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Get attendance data for this month
        const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
        
        const attendanceQuery = query(
            collection(db, "attendance"),
            where("date", ">=", startDate),
            where("date", "<=", endDate)
        );
        
        const attendanceSnapshot = await getDocs(attendanceQuery);
        const attendanceData = {};
        
        attendanceSnapshot.forEach(doc => {
            const data = doc.data();
            const date = data.date;
            
            if (!attendanceData[date]) {
                attendanceData[date] = [];
            }
            
            attendanceData[date].push({
                course: data.course,
                batch: data.batch,
                students: data.students
            });
        });
        
        // Generate calendar
        let html = '';
        
        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            html += `<div class="calendar-header">${day}</div>`;
        });
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < startDay; i++) {
            html += `<div class="calendar-day other-month"></div>`;
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasAttendance = attendanceData[date] && attendanceData[date].length > 0;
            
            let attendanceSummary = '';
            if (hasAttendance) {
                attendanceData[date].forEach(record => {
                    const students = record.students;
                    const presentCount = Object.values(students).filter(s => s.status === 'present').length;
                    const absentCount = Object.values(students).filter(s => s.status === 'absent').length;
                    const lateCount = Object.values(students).filter(s => s.status === 'late').length;
                    
                    attendanceSummary += `
                        <div>
                            ${record.course} (${record.batch}): 
                            ${presentCount} present, 
                            ${absentCount} absent, 
                            ${lateCount} late
                        </div>
                    `;
                });
            }
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasAttendance ? 'has-attendance' : ''}" data-date="${date}">
                    <div class="date">${day}</div>
                    ${hasAttendance ? `<div class="attendance-count">${attendanceData[date].length} classes</div>` : ''}
                    ${hasAttendance ? `<div class="attendance-summary">${attendanceSummary}</div>` : ''}
                </div>
            `;
        }
        
        // Add empty cells for days after last day of month
        const endDay = lastDay.getDay();
        for (let i = endDay; i < 6; i++) {
            html += `<div class="calendar-day other-month"></div>`;
        }
        
        attendanceCalendar.innerHTML = html;
        
        // Add click event to calendar days
        const calendarDays = attendanceCalendar.querySelectorAll('.calendar-day[data-date]');
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                const date = day.getAttribute('data-date');
                if (date && attendanceDate) {
                    attendanceDate.value = date;
                    // Clear course and batch
                    if (attendanceCourse) attendanceCourse.value = '';
                    if (attendanceBatch) attendanceBatch.value = '';
                    // Scroll to attendance controls
                    const controls = document.querySelector('.attendance-controls');
                    if (controls) controls.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
    } catch (error) {
        console.error("Error loading attendance calendar: ", error);
        if (attendanceCalendar) {
            attendanceCalendar.innerHTML = '<div class="error">Error loading calendar</div>';
        }
    }
}

// Load students, courses and batches for performance
async function loadPerformanceFilters() {
    try {
        if (!performanceStudent || !performanceCourse || !performanceBatch) {
            console.error("Performance filter elements not found");
            return;
        }

        const querySnapshot = await getDocs(collection(db, "students"));
        
        if (querySnapshot.empty) {
            return;
        }
        
        const students = [];
        const courses = new Set();
        const batches = new Set();
        
        querySnapshot.forEach(doc => {
            const student = doc.data();
            students.push({
                id: student.studentId,
                name: student.name,
                course: student.course,
                batch: student.batch
            });
            
            if (student.course) courses.add(student.course);
            if (student.batch) batches.add(student.batch);
        });
        
        // Sort students by name
        students.sort((a, b) => a.name.localeCompare(b.name));
        
        // Populate student dropdown
        performanceStudent.innerHTML = '<option value="">Select Student</option>';
        students.forEach(student => {
            performanceStudent.innerHTML += `<option value="${student.id}" data-course="${student.course}" data-batch="${student.batch}">${student.name} (${student.id})</option>`;
        });
        
        // Populate course dropdown
        performanceCourse.innerHTML = '<option value="">Select Course</option>';
        Array.from(courses).sort().forEach(course => {
            performanceCourse.innerHTML += `<option value="${course}">${course}</option>`;
        });
        
        // Populate batch dropdown
        performanceBatch.innerHTML = '<option value="">Select Batch</option>';
        Array.from(batches).sort().forEach(batch => {
            performanceBatch.innerHTML += `<option value="${batch}">${batch}</option>`;
        });
        
    } catch (error) {
        console.error("Error loading performance filters: ", error);
    }
} 

// Add openStudentModal to the global scope
window.openStudentModal = openStudentModal;

// Add generateIdCard function to the global scope
window.generateIdCard = async function(id) {
    const loading = showLoading('Generating ID card...');
    try {
        const docRef = doc(db, "students", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const student = docSnap.data();
            
            // Calculate expiry date (2 years from now)
            const today = new Date();
            const expiryDate = new Date(today);
            expiryDate.setFullYear(expiryDate.getFullYear() + 2);
            
            // Format dates
            const formattedDob = student.dob ? formatDate(student.dob) : 'N/A';
            const formattedExpiry = formatDate(expiryDate.toISOString().split('T')[0]);
            
            // Create a simple JSON object with essential student info for the QR code
            const studentInfoObj = {
                id: student.studentId,
                name: student.name,
                course: student.course,
                batch: student.batch
            };
            
            // Convert to JSON string and encode for URL
            const studentInfoJson = encodeURIComponent(JSON.stringify(studentInfoObj));
            
            // Create QR code URL
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${studentInfoJson}`;
            
            // Create simple ID card HTML
            idCardContainer.innerHTML = `
                <div class="id-card">
                    <div class="id-card-header">
                        <h3>Student ID Card</h3>
                    </div>
                    <div class="id-card-body">
                        <div class="id-card-photo">
                            <div class="avatar">${getInitials(student.name)}</div>
                        </div>
                        <div class="id-card-info">
                            <p><strong>Name:</strong> ${student.name}</p>
                            <p><strong>ID:</strong> ${student.studentId}</p>
                            <p><strong>Course:</strong> ${student.course}</p>
                            <p><strong>Batch:</strong> ${student.batch}</p>
                        </div>
                    </div>
                    <div class="id-card-footer">
                        <div class="qr-code">
                            <img src="${qrCodeUrl}" alt="QR Code">
                        </div>
                        <div class="validity">
                            <p>Valid until: ${formattedExpiry}</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Show modal
            idCardModal.style.display = 'block';
            
        } else {
            alert("Student not found!");
        }
    } catch (error) {
        console.error("Error generating ID card: ", error);
        showMessage('Error generating ID card', 'error');
    } finally {
        hideLoading(loading);
    }
};

// Function to show QR code data preview
function showQrPreview(qrData, studentName) {
    try {
        // Try to parse the JSON data
        const jsonData = JSON.parse(decodeURIComponent(qrData));
        
        // Create a modal to show the data
        const previewModal = document.createElement('div');
        previewModal.className = 'qr-preview-modal';
        previewModal.innerHTML = `
            <div class="qr-preview-content">
                <h3>QR Data for ${studentName}</h3>
                <div class="qr-data-container">
                    <p><strong>ID:</strong> ${jsonData.id}</p>
                    <p><strong>Name:</strong> ${jsonData.name}</p>
                    <p><strong>Course:</strong> ${jsonData.course}</p>
                    <p><strong>Batch:</strong> ${jsonData.batch}</p>
                    <p><strong>Email:</strong> ${jsonData.email}</p>
                    <p><strong>Mobile:</strong> ${jsonData.mobile}</p>
                    <p><strong>DOB:</strong> ${jsonData.dob}</p>
                    <p><strong>Issued On:</strong> ${jsonData.issuedOn}</p>
                    <p><strong>Expires On:</strong> ${jsonData.expiresOn}</p>
                </div>
                <div class="qr-preview-actions">
                    <button class="btn btn-secondary qr-close-btn">Close</button>
                </div>
            </div>
        `;
        
        // Append to body
        document.body.appendChild(previewModal);
        
        // Add close handler
        previewModal.querySelector('.qr-close-btn').addEventListener('click', function() {
            document.body.removeChild(previewModal);
        });
        
        // Also close on click outside
        previewModal.addEventListener('click', function(e) {
            if (e.target === previewModal) {
                document.body.removeChild(previewModal);
            }
        });
    } catch (e) {
        console.error("Error parsing QR data:", e);
        alert("Could not preview QR data");
    }
}

// Initialize signature pad
function initializeSignaturePad() {
    const canvas = document.getElementById('signature-pad');
    const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
    });
    
    // Clear button
    document.getElementById('clear-signature').addEventListener('click', function() {
        signaturePad.clear();
    });
    
    // Save button (just for UI, signature is already captured in the canvas)
    document.getElementById('save-signature').addEventListener('click', function() {
        if (signaturePad.isEmpty()) {
            alert('Please provide a signature first.');
        }
    });
}

// Initialize photo upload
function initializePhotoUpload() {
    const uploadBtn = document.getElementById('upload-photo-btn');
    const fileInput = document.getElementById('photo-upload');
    const photoContainer = document.getElementById('photo-container');
    const initialsAvatar = document.getElementById('initials-avatar');
    
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // Remove existing avatar
                if (initialsAvatar) {
                    initialsAvatar.style.display = 'none';
                }
                
                // Create image element if it doesn't exist
                let img = photoContainer.querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    img.className = 'uploaded-photo';
                    photoContainer.appendChild(img);
                }
                
                // Set image source
                img.src = event.target.result;
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

// Helper function to adjust color brightness
function adjustColor(hex, percent) {
    // Remove # if present
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // Convert 3 digit to 6 digit
    if(hex.length == 3){
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Parse to RGB values
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    
    // Adjust brightness
    const adjustBrightness = (color, percent) => {
        return Math.min(255, Math.max(0, Math.round(color + (percent / 100) * 255)));
    };
    
    // Calculate new RGB values
    const newR = adjustBrightness(r, percent);
    const newG = adjustBrightness(g, percent);
    const newB = adjustBrightness(b, percent);
    
    // Convert back to hex
    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

// Helper function to format date (YYYY-MM-DD to DD/MM/YYYY)
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            // If it's already in YYYY-MM-DD format
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else {
            // If it's in DD-MM-YYYY format
            const parts = dateString.split('-');
            return `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
    } catch (e) {
        return dateString; // Return as is if parsing fails
    }
}

// Helper function to get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Close ID Card modal
closeIdCard.addEventListener('click', () => {
    idCardModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === idCardModal) {
        idCardModal.style.display = 'none';
    }
});

// Print ID Card
printIdCardBtn.addEventListener('click', () => {
    window.print();
});

// Download ID Card as PDF
downloadIdCardBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    
    if (!jsPDF) {
        alert("PDF library not loaded. Please try again later.");
        return;
    }
    
    // Create new PDF with more appropriate dimensions for ID card
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 297] // A4 size
    });
    
    // Get the ID card element
    const idCard = document.querySelector('.id-card');
    
    // Use html2canvas to convert the ID card to an image
    html2canvas(idCard, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow loading of images from other domains (for QR code)
        logging: false, // Disable logging
        backgroundColor: '#ffffff' // White background
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Add image to PDF (centered)
        const imgWidth = 150; // mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const x = (pageWidth - imgWidth) / 2;
        const y = 20;
        
        // Add title
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text("Student ID Card", pageWidth / 2, 10, { align: 'center' });
        
        // Add image
        doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Generated by Student Management System", pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        // Get student name and ID from the card
        const studentName = document.querySelector('.id-card-info p:nth-child(1)').textContent.split(':')[1].trim();
        const studentId = document.querySelector('.id-card-info p:nth-child(2)').textContent.split(':')[1].trim();
        
        // Save the PDF with student name and ID
        doc.save(`ID_Card_${studentName}_${studentId}.pdf`);
    });
});

// Add attractive CSS styles for ID card
const style = document.createElement('style');
style.textContent = `
    .id-card {
        width: 320px;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        padding: 25px;
        margin: 20px auto;
        position: relative;
        overflow: hidden;
    }

    .id-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 8px;
        background: linear-gradient(90deg, #3498db, #2ecc71);
    }

    .id-card-header {
        text-align: center;
        margin-bottom: 25px;
        position: relative;
    }

    .id-card-header h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .id-card-body {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
        position: relative;
    }

    .id-card-photo {
        width: 90px;
        height: 90px;
        background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }

    .avatar {
        font-size: 28px;
        font-weight: bold;
        color: #34495e;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .id-card-info {
        flex: 1;
    }

    .id-card-info p {
        margin: 8px 0;
        font-size: 14px;
        color: #34495e;
        display: flex;
        align-items: center;
    }

    .id-card-info p strong {
        color: #2c3e50;
        margin-right: 8px;
        min-width: 60px;
    }

    .id-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(0,0,0,0.1);
        padding-top: 20px;
        margin-top: 10px;
    }

    .qr-code {
        background: white;
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .qr-code img {
        width: 65px;
        height: 65px;
        display: block;
    }

    .validity {
        font-size: 12px;
        color: #7f8c8d;
        text-align: right;
    }

    .validity p {
        margin: 0;
        line-height: 1.4;
    }

    /* Add hover effect */
    .id-card:hover {
        transform: translateY(-5px);
        transition: transform 0.3s ease;
    }

    /* Add subtle animation */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .id-card {
        animation: fadeIn 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// Loading States Management
function showLoading(message = 'Loading...') {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">${message}</div>
    `;
    document.body.appendChild(loadingOverlay);
    setTimeout(() => loadingOverlay.classList.add('active'), 10);
    return loadingOverlay;
}

function hideLoading(loadingOverlay) {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
        setTimeout(() => loadingOverlay.remove(), 300);
    }
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('btn-loading');
        button.disabled = true;
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
    }
}

function setFormLoading(form, isLoading) {
    if (isLoading) {
        form.classList.add('form-loading');
    } else {
        form.classList.remove('form-loading');
    }
}

function setTableLoading(table, isLoading) {
    const tbody = table.querySelector('tbody');
    if (isLoading) {
        tbody.innerHTML = `
            <tr class="table-row-loading"><td colspan="100%"></td></tr>
            <tr class="table-row-loading"><td colspan="100%"></td></tr>
            <tr class="table-row-loading"><td colspan="100%"></td></tr>
        `;
    }
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} message-animation`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Function to create a student row
function createStudentRow(student, docId) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${student.studentId || 'N/A'}</td>
        <td>${student.name}</td>
        <td>${student.course}</td>
        <td>${student.mobile}</td>
        <td>
            <button class="action-btn view-btn" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit-btn" title="Edit Student">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn id-card-btn" title="Generate ID Card">
                <i class="fas fa-id-card"></i>
            </button>
            <button class="action-btn delete-btn" title="Delete Student">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;

    // Add event listeners for action buttons
    const viewBtn = row.querySelector('.view-btn');
    const editBtn = row.querySelector('.edit-btn');
    const idCardBtn = row.querySelector('.id-card-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    viewBtn.addEventListener('click', () => {
        openStudentModal(student, docId);
    });

    editBtn.addEventListener('click', () => {
        openEditModal(docId);
    });

    idCardBtn.addEventListener('click', () => {
        generateIdCard(docId);
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this student?')) {
            deleteStudentById(docId);
        }
    });

    return row;
}

// Function to open student modal for viewing details
async function openStudentModal(student, docId) {
    try {
        const docRef = doc(db, "students", docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const studentData = docSnap.data();
            
            // Format dates
            const createdDate = studentData.createdAt ? 
                (studentData.createdAt.toDate ? studentData.createdAt.toDate().toLocaleString() : new Date(studentData.createdAt).toLocaleString()) : 
                'N/A';
            const updatedDate = studentData.updatedAt ? 
                (studentData.updatedAt.toDate ? studentData.updatedAt.toDate().toLocaleString() : new Date(studentData.updatedAt).toLocaleString()) : 
                'N/A';
            
            const modalContent = document.getElementById('modal-content');
            if (modalContent) {
                modalContent.innerHTML = `
                    <div class="student-details">
                        <h3>${studentData.name}</h3>
                        <div class="student-info">
                            <p><strong>Student ID:</strong> ${studentData.studentId}</p>
                            <p><strong>Email:</strong> ${studentData.email}</p>
                            <p><strong>Date of Birth:</strong> ${studentData.dob || 'N/A'}</p>
                            <p><strong>Mobile:</strong> ${studentData.mobile}</p>
                            <p><strong>Address:</strong> ${studentData.address || 'N/A'}</p>
                            <p><strong>Course:</strong> ${studentData.course}</p>
                            <p><strong>Batch/Year:</strong> ${studentData.batch}</p>
                            <p><strong>Added on:</strong> ${createdDate}</p>
                            <p><strong>Last updated:</strong> ${updatedDate}</p>
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-primary" onclick="openEditModal('${docId}')">Edit</button>
                            <button class="btn btn-secondary" onclick="generateIdCard('${docId}')">Generate ID Card</button>
                            <button class="btn btn-danger" onclick="deleteStudentById('${docId}')">Delete</button>
                        </div>
                    </div>
                `;
            }
            
            const studentModal = document.getElementById('student-modal');
            if (studentModal) {
                studentModal.style.display = 'block';
            }
        } else {
            showMessage("Student not found!", "error");
        }
    } catch (error) {
        console.error("Error opening student modal:", error);
        showMessage("Error viewing student details", "error");
    }
}

// Add CSS styles for action buttons
const actionStyles = document.createElement('style');
actionStyles.textContent = `
    .action-btn {
        background: none;
        border: none;
        padding: 5px 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 4px;
        margin: 0 2px;
    }

    .action-btn:hover {
        background-color: #f0f0f0;
    }

    .view-btn i {
        color: #3498db;
    }

    .edit-btn i {
        color: #2ecc71;
    }

    .id-card-btn i {
        color: #9b59b6;
    }

    .delete-btn i {
        color: #e74c3c;
    }

    .action-btn:hover i {
        transform: scale(1.1);
    }

    .modal-actions {
        margin-top: 20px;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }

    .student-details {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .student-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
    }

    .student-info p {
        margin: 0;
        padding: 8px;
        background: #f8f9fa;
        border-radius: 4px;
    }

    .student-info strong {
        color: #2c3e50;
    }
`;
document.head.appendChild(actionStyles);

// Function to load and display all students
async function loadAllStudents() {
    const loading = showLoading('Loading students...');
    try {
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (!studentsList) {
            console.error('Students list element not found');
            return;
        }

        studentsList.innerHTML = '';
        
        if (querySnapshot.empty) {
            studentsList.innerHTML = '<tr><td colspan="5" class="no-data">No students found</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const student = doc.data();
            const row = createStudentRow(student, doc.id);
            studentsList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading students:', error);
        showMessage('Error loading students: ' + error.message, 'error');
        studentsList.innerHTML = '<tr><td colspan="5" class="error-message">Error loading students</td></tr>';
    } finally {
        hideLoading(loading);
    }
}

// Function to update filter dropdowns
function updateFilterDropdowns(querySnapshot) {
    const courses = new Set();
    const batches = new Set();

    querySnapshot.forEach(doc => {
        const student = doc.data();
        if (student.course) courses.add(student.course);
        if (student.batch) batches.add(student.batch);
    });

    // Update course filter
    const courseFilter = document.getElementById('filter-course');
    if (courseFilter) {
        courseFilter.innerHTML = '<option value="">All Courses</option>';
        Array.from(courses).sort().forEach(course => {
            courseFilter.innerHTML += `<option value="${course}">${course}</option>`;
        });
    }

    // Update batch filter
    const batchFilter = document.getElementById('filter-batch');
    if (batchFilter) {
        batchFilter.innerHTML = '<option value="">All Batches</option>';
        Array.from(batches).sort().forEach(batch => {
            batchFilter.innerHTML += `<option value="${batch}">${batch}</option>`;
        });
    }
} 