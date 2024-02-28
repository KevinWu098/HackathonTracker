'use client'

import React, {useEffect, useState} from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Snackbar,
} from '@mui/material'
import {collection, getDocs, deleteDoc, addDoc, doc} from 'firebase/firestore'
import {useFirestore} from 'reactfire'
import moment from 'moment-timezone'

const ManageSuggestions = () => {
  const firestore = useFirestore()
  const [suggestions, setSuggestions] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Fetch hackathon suggestions
      const hackathonsSnapshot = await getDocs(
        collection(firestore, 'hackathos_suggestions'),
      )
      const hackathonSuggestions = hackathonsSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'hackathon',
        ...doc.data(),
      }))

      // Fetch conference suggestions
      const conferencesSnapshot = await getDocs(
        collection(firestore, 'conference_suggestions'),
      )
      const conferenceSuggestions = conferencesSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'conference',
        ...doc.data(),
      }))

      // Combine and set suggestions
      setSuggestions([...hackathonSuggestions, ...conferenceSuggestions])
    }

    fetchSuggestions()
  }, [firestore])

  const handleAddSuggestion = async (suggestion) => {
    const targetCollection =
      suggestion.type === 'hackathon' ? 'hackathon' : 'conference'
    try {
      await addDoc(collection(firestore, targetCollection), suggestion)
      await deleteDoc(
        doc(firestore, `${suggestion.type}_suggestions`, suggestion.id),
      )
      setSuggestions(suggestions.filter((s) => s.id !== suggestion.id))
      setOpenSnackbar(true)
      setSnackbarMessage(
        `${
          suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)
        } added successfully!`,
      )
    } catch (error) {
      console.error(`Error adding ${suggestion.type}:`, error)
      setOpenSnackbar(true)
      setSnackbarMessage(`Error adding ${suggestion.type}!`)
    }
  }

  const handleDeleteSuggestion = async (suggestion) => {
    try {
      await deleteDoc(
        doc(firestore, `${suggestion.type}_suggestions`, suggestion.id),
      )
      setSuggestions(suggestions.filter((s) => s.id !== suggestion.id))
      setOpenSnackbar(true)
      setSnackbarMessage(
        `${
          suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)
        } deleted successfully!`,
      )
    } catch (error) {
      console.error(`Error deleting ${suggestion.type}:`, error)
      setOpenSnackbar(true)
      setSnackbarMessage(`Error deleting ${suggestion.type}!`)
    }
  }

  const handleCloseSnackbar = () => setOpenSnackbar(false)

  return (
    <Box sx={{flexGrow: 1, p: 3}}>
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} sx={{mb: 2}}>
          <CardContent>
            <Typography variant="h5">{suggestion.name}</Typography>
            <Typography color="textSecondary" gutterBottom>
              Type:{' '}
              {suggestion.type.charAt(0).toUpperCase() +
                suggestion.type.slice(1)}
            </Typography>
            <Typography color="textSecondary">{suggestion.college}</Typography>
            <Typography variant="body2">
              Website:{' '}
              <a
                href={suggestion.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {suggestion.url}
              </a>
            </Typography>
            <Typography variant="body2">
              Start Date:{' '}
              {moment(suggestion.startDate).format('YYYY-MM-DD HH:mm')}
            </Typography>
            <Typography variant="body2">
              End Date: {moment(suggestion.endDate).format('YYYY-MM-DD HH:mm')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => handleAddSuggestion(suggestion)}
            >
              Add to{' '}
              {suggestion.type === 'hackathon' ? 'Hackathons' : 'Conferences'}
            </Button>
            <Button
              size="small"
              color="secondary"
              onClick={() => handleDeleteSuggestion(suggestion)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  )
}

export default ManageSuggestions
