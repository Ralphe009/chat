const mongoose = require('mongoose');
const School = require('./models/school'); // Adjust the path as needed

// Connect to MongoDB
//Mongoose Connection
mongoose.connect("mongodb+srv://eberson501:eberson501@cluster0-re0hi.mongodb.net/classAI?retryWrites=true&w=majority",)
	.then(() => {
        console.log("Database Connected")
    })
    .catch(err => {
        console.log("Trouble connecting to Database")
        console.log(err)
    });
// Sample school data
// const schools = [
//   {
//     name: 'Beta Academy',
//     address: '123 Main Street',
//     zipcode: '02136',
//     contactEmail: 'school1@example.com',
//     contactPhone: '123-456-7890',
//     website: 'http://www.school1.com',
//     teachers: [], // Array of teacher IDs if you have them
//     students: [], // Array of student IDs if you have them
//     admins: [],   // Array of admin IDs if you have them
//   },
//   {
//     name: 'Academy of the Pacific Rim',
//     address: '1 Westinghouse Pl',
//     zipcode: '02136',
//     contactEmail: 'frontoffice2pacrim.org',
//     contactPhone: '6173610050',
//     website: 'https://www.pacrim.org',
//     teachers: [],
//     students: [],
//     admins: [],
//   },
//   // Add more schools as needed
// ];

// Seed school data
async function seedSchoolData() {
  try {
    // Clear existing data (optional)
    await School.deleteMany({});

    // Insert new school data
    const insertedSchools = await School.insertMany(schools);

    console.log('School data seeded:', insertedSchools);
  } catch (error) {
    console.error('Error seeding school data:', error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Call the seed function to start seeding data
seedSchoolData();
