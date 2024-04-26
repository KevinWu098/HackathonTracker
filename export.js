const admin = require('firebase-admin')
const yaml = require('yaml')
const fs = require('fs')

// Initialize Firebase Admin with credentials
const serviceAccount = require('./firebase.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

function formatDate(date) {
  if (!date) return null // Handle cases where the date might be undefined

  let dateObj = new Date()

  if (typeof date === 'string') {
    // Parse the ISO string to a Date object
    dateObj = new Date(date)
  } else if (date.seconds) {
    // Convert Firestore Timestamp to Date object
    dateObj = new Date(date.seconds * 1000)
  } else {
    console.error('Unrecognized date format:', date)
    return null
  }

  // Format date to DD-MM-YYYY
  return `${dateObj.getDate().toString().padStart(2, '0')}-${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${dateObj.getFullYear()}`
}

// Function to fetch data from Firestore and save as YAML
async function exportData() {
  try {
    const allHackathons = await db.collection('hackathons').get() // Adjust if your collection name is different
    let hackathonsData = []

    allHackathons.forEach((doc) => {
      // Extract only keys college, name and url
      let data = doc.data()
      hackathonsData.push({
        type: 'hackathon',
        name: data.name,
        college: data.college,
        url: data.url,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
      })
    })

    const allConferences = await db.collection('conferences').get() // Adjust if your collection name is different
    allConferences.forEach((doc) => {
      let data = doc.data()
      hackathonsData.push({
        type: 'conference',
        name: data.name,
        college: data.college,
        url: data.url,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
      })
    })

    // Convert JavaScript object to YAML format
    const yamlStr = yaml.stringify(hackathonsData)
    fs.writeFileSync('hackathons.yaml', yamlStr, 'utf8')
    console.log('Data exported successfully to hackathons.yaml')
  } catch (error) {
    console.error('Error exporting data to YAML:', error)
  }
}

exportData()
