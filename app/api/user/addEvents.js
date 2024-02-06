const admin = require('firebase-admin')
const serviceAccount = require('@/firebase.json')
const moment = require('moment-timezone')

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Your events data
const events = [
  {
    college: 'CalTech',
    name: 'HackTech',
    startDate: '2023-03-03',
    endDate: '2023-03-05',
    url: 'https://hacktech.app/',
  },
  {
    college: 'Santa Clara U',
    name: 'HackForHumanity',
    startDate: '2024-02-17',
    endDate: '2024-02-19',
    url: 'https://hackforhumanity.io/',
  },
  {
    college: 'Princeton',
    name: 'HackPrinceton',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    url: 'https://www.hackprinceton.com/',
  },
  {
    college: 'Harvard',
    name: 'HackHarvard 2023',
    startDate: '2023-10-20',
    endDate: '2023-10-23',
    url: 'https://hackharvard.io/',
  },
  {
    college: 'Yale',
    name: 'YHack 2024 🚀',
    startDate: '2024-03-29',
    endDate: '2024-03-31',
    url: 'https://yhack.org/',
  },
  {
    college: 'UPenn',
    name: 'PennApps XXIV',
    startDate: '2023-09-08',
    endDate: '2023-09-11',
    url: 'https://2023f.pennapps.com/',
  },
  {
    college: 'Dartmouth',
    name: 'HACKDARTMOUTH',
    startDate: '2023-04-15',
    endDate: '2023-04-17',
    url: 'https://www.hackdartmouth.org/',
  },
  {
    college: 'Brown',
    name: 'Hack@Brown 2024 (hackatbrown.org)',
    startDate: '2024-02-03',
    endDate: '2024-02-05',
    url: 'https://2024.hackatbrown.org/',
  },
  {
    college: 'Cornell',
    name: 'BigRed//Hacks (bigredhacks.com)',
    startDate: '2024-03-09',
    endDate: '2024-03-11',
    url: 'https://www.bigredhacks.com/',
  },
  {
    college: 'MIT',
    name: 'HackMIT 2023 🎈',
    startDate: '2023-09-16',
    endDate: '2023-09-18',
    url: 'https://hackmit.org/',
  },
  {
    college: 'Carnegie',
    name: 'TartanHacks 2024 | Feb 2-3, 2024',
    startDate: '2024-02-02',
    endDate: '2024-02-04',
    url: 'https://tartanhacks.com/',
  },
  {
    college: 'Duke',
    name: '2023.hackduke.org',
    startDate: '2023-09-08',
    endDate: '2023-09-10',
    url: 'https://2023.hackduke.org/',
  },
  {
    college: 'UW',
    name: 'DubHacks',
    startDate: '2023-10-14',
    endDate: '2023-10-16',
    url: 'https://dh23.dubhacks.co/',
  },
  {
    college: 'Columbia',
    name: 'DivHacks 2023 (columbiadivhacks.com)',
    startDate: '2023-09-23',
    endDate: '2023-09-25',
    url: 'https://columbiadivhacks.com/',
  },
  {
    college: 'GTHacks',
    name: 'HackGT X: A journal of memories',
    startDate: '2023-10-13',
    endDate: '2023-10-15',
    url: 'https://hack.gt/',
  },
  {
    college: 'HackUTD',
    name: 'HackUTD X',
    startDate: '2023-11-04',
    endDate: '2023-11-06',
    url: 'https://x.hackutd.co/',
  },
  {
    college: 'UC Berkeley',
    name: 'Cal Hacks',
    startDate: '2023-10-27',
    endDate: '2023-10-29',
    url: 'https://www.calhacks.io/',
  },
  {
    college: 'UC Davis',
    name: 'HackDavis',
    startDate: '2023-05-20',
    endDate: '2023-05-22',
    url: 'https://hackdavis.io/',
  },
  {
    college: 'UC Irvine',
    name: 'IrvineHacks',
    startDate: '2023-01-26',
    endDate: '2023-01-28',
    url: 'https://irvinehacks.com/',
  },
  {
    college: 'UCLA',
    name: 'LAHacks',
    startDate: '2024-04-19',
    endDate: '2024-04-21',
    url: 'https://lahacks.com/home',
  },
  {
    college: 'UC Merced',
    name: 'Hack Merced',
    startDate: '2024-03-08',
    endDate: '2024-03-10',
    url: 'https://hackmerced.com/',
  },
  {
    college: 'UC Riverside',
    name: 'Citrus Hacks',
    startDate: '2023-04-29',
    endDate: '2023-04-30',
    url: 'https://www.citrushack.com/',
  },
  {
    college: 'UC San Diego',
    name: 'SD Hacks',
    startDate: '2023-12-08',
    endDate: '2023-12-10',
    url: 'https://www.sdhacks.org/',
  },
  {
    college: 'UC Santa Barbara',
    name: 'SB Hacks',
    startDate: '2023-05-13',
    endDate: '2023-05-15',
    url: 'https://sbhacks.com/',
  },
  {
    college: 'UC Santa Cruz',
    name: 'Cruzhacks',
    startDate: '2023-02-03',
    endDate: '2023-02-05',
    url: 'https://cruzhacks.com/',
  },
  {
    college: 'USC',
    name: 'HackSC',
    startDate: '2023-02-03',
    endDate: '2023-02-05',
    url: 'https://www.hacksc.com/',
  },
  {
    college: 'Stanford',
    name: 'Treehacks',
    startDate: '2023-02-17',
    endDate: '2023-02-19',
    url: 'https://www.treehacks.com/',
  },
  {
    college: 'UCSF',
    name: 'SFHacks',
    startDate: '2024-04-05',
    endDate: '2024-04-07',
    url: 'https://sfhacks.io/',
  },
  {
    college: 'UIUC',
    name: 'HackIllinois',
    startDate: '2024-02-23',
    endDate: '2024-02-25',
    url: 'https://hackillinois.org/',
  },
  {
    college: 'UCLA',
    name: 'QWER Hacks',
    startDate: '2024-02-02',
    endDate: '2024-02-04',
    url: 'https://qwerhacks.com/',
  },
]

const addEventsToFirestore = async () => {
  for (const event of events) {
    // Assuming you want to use moment to parse and format your dates
    const startDate = moment
      .tz(event.startDate, 'America/Los_Angeles')
      .set({hour: 17, minute: 0})
      .format()
    const endDate = moment
      .tz(event.endDate, 'America/Los_Angeles')
      .set({hour: 9, minute: 0})
      .add(1, 'days')
      .format()

    const newEvent = {
      college: event.college,
      name: event.name,
      startDate: startDate,
      endDate: endDate,
      url: event.url,
    }

    try {
      const docRef = await db.collection('hackathons').add(newEvent)
      console.log('Document written with ID: ', docRef.id)
    } catch (error) {
      console.error('Error adding document: ', error)
    }
  }
}

addEventsToFirestore()
