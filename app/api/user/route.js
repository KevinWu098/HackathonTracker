// pages/api/route.js

import admin from 'firebase-admin'
import {getFirestore} from 'firebase-admin/firestore'
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

// Initialize Firestore
const firestore = getFirestore()

export async function POST(req, res) {
  // Extract userId from the request, e.g., from the session or a token
  const {userId} = await req.json()
  try {
    const userDoc = await firestore.collection('users').doc(userId).get()
    if (!userDoc.data()) {
      await firestore.collection('users').doc(userId).set({
        authorized: false,
      })
    }
    return new Response('User data fetched successfully', {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return new Response('Error fetching user data', {
      status: 500,
    })
  }
}
