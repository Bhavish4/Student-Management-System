// Import Firebase modules
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// // Sample student data
const sampleStudents = [
    {
        studentId: "ST001",
        name: "John Smith",
        email: "john.smith@example.com",
        mobile: "555-123-4567",
        address: "123 Main Street, New York, NY 10001",
        course: "Computer Science",
        batch: "2023"
    },
    {
        studentId: "ST002",
        name: "Emma Johnson",
        email: "emma.johnson@example.com",
        mobile: "555-234-5678",
        address: "456 Park Avenue, Boston, MA 02108",
        course: "Engineering",
        batch: "2022"
    },
    {
        studentId: "ST003",
        name: "Michael Williams",
        email: "michael.williams@example.com",
        mobile: "555-345-6789",
        address: "789 Oak Drive, Chicago, IL 60601",
        course: "Business",
        batch: "2023"
    },
    {
        studentId: "ST004",
        name: "Sophia Brown",
        email: "sophia.brown@example.com",
        mobile: "555-456-7890",
        address: "101 Pine Street, San Francisco, CA 94101",
        course: "Medicine",
        batch: "2021"
    },
    {
        studentId: "ST005",
        name: "James Davis",
        email: "james.davis@example.com",
        mobile: "555-567-8901",
        address: "202 Maple Avenue, Seattle, WA 98101",
        course: "Arts",
        batch: "2022"
    },
    {
        studentId: "ST006",
        name: "Olivia Miller",
        email: "olivia.miller@example.com",
        mobile: "555-678-9012",
        address: "303 Cedar Boulevard, Austin, TX 78701",
        course: "Computer Science",
        batch: "2023"
    },
    {
        studentId: "ST007",
        name: "William Wilson",
        email: "william.wilson@example.com",
        mobile: "555-789-0123",
        address: "404 Birch Lane, Denver, CO 80201",
        course: "Engineering",
        batch: "2022"
    },
    {
        studentId: "ST008",
        name: "Ava Moore",
        email: "ava.moore@example.com",
        mobile: "555-890-1234",
        address: "505 Elm Street, Miami, FL 33101",
        course: "Business",
        batch: "2021"
    },
    {
        studentId: "ST009",
        name: "Alexander Taylor",
        email: "alexander.taylor@example.com",
        mobile: "555-901-2345",
        address: "606 Spruce Court, Atlanta, GA 30301",
        course: "Medicine",
        batch: "2023"
    },
    {
        studentId: "ST010",
        name: "Isabella Anderson",
        email: "isabella.anderson@example.com",
        mobile: "555-012-3456",
        address: "707 Willow Way, Portland, OR 97201",
        course: "Arts",
        batch: "2022"
    }
];

// Function to add sample data to Firestore
async function addSampleStudents() {
    try {
        // Get Firestore instance
        const db = getFirestore(window.firebaseApp);
        
        // Get current user
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            console.error("No user is logged in. Please log in first.");
            return;
        }
        
        console.log("Starting to add sample students...");
        
        // Add each student to Firestore
        for (const student of sampleStudents) {
            // Add metadata
            const studentWithMetadata = {
                ...student,
                createdAt: new Date(),
                createdBy: user.email,
                updatedAt: new Date()
            };
            
            // Add to Firestore
            const docRef = await addDoc(collection(db, "students"), studentWithMetadata);
            console.log(`Added student ${student.name} with ID: ${docRef.id}`);
        }
        
        console.log("Successfully added all sample students!");
        alert("Successfully added 10 sample students to the database!");
        
    } catch (error) {
        console.error("Error adding sample students:", error);
        alert("Error adding sample students: " + error.message);
    }
}

// Run the function
addSampleStudents(); 