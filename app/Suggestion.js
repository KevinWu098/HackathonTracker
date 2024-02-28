import React, {useState} from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Snackbar,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import {addDoc, collection} from 'firebase/firestore'
import {useFirestore} from 'reactfire'
import moment from 'moment-timezone'

const AddSuggestionForm = () => {
  const firestore = useFirestore()
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    url: '',
    startDate: '',
    endDate: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    college: '',
    url: '',
    startDate: '',
    endDate: '',
  })
  const [suggestionType, setSuggestionType] = useState('hackathon')
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const validateForm = () => {
    let tempErrors = {
      name: formData.name ? '' : 'This field is required',
      college: formData.college ? '' : 'This field is required',
      url: formData.url ? '' : 'This field is required',
      startDate: formData.startDate ? '' : 'This field is required',
      endDate: formData.endDate ? '' : 'This field is required',
    }

    setErrors(tempErrors)
    return Object.values(tempErrors).every((x) => x === '')
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSuggestionType(newType)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      const startDateInZone = moment
        .tz(formData.startDate, 'YYYY-MM-DDTHH:mm', 'America/Los_Angeles')
        .format()
      const endDateInZone = moment
        .tz(formData.endDate, 'YYYY-MM-DDTHH:mm', 'America/Los_Angeles')
        .format()
      const newFormData = {
        ...formData,
        startDate: startDateInZone,
        endDate: endDateInZone,
      }
      const collectionName =
        suggestionType === 'hackathon'
          ? 'hackathon_suggestions'
          : 'conference_suggestions'
      try {
        await addDoc(collection(firestore, collectionName), newFormData)
        setOpenSnackbar(true)
        setFormData({
          name: '',
          college: '',
          url: '',
          startDate: '',
          endDate: '',
        })
      } catch (error) {
        console.error(`Error adding ${suggestionType}:`, error)
      }
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <ToggleButtonGroup
        color="primary"
        value={suggestionType}
        exclusive
        onChange={handleTypeChange}
        fullWidth
        sx={{mb: 2}}
      >
        <ToggleButton value="hackathon">Hackathon</ToggleButton>
        <ToggleButton value="conference">Conference</ToggleButton>
      </ToggleButtonGroup>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label={`${
          suggestionType.charAt(0).toUpperCase() + suggestionType.slice(1)
        } Name`}
        name="name"
        autoComplete="name"
        autoFocus
        value={formData.name}
        onChange={handleChange}
        error={errors.name ? true : false}
        helperText={errors.name}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="college"
        label="College/Organization"
        name="college"
        autoComplete="college"
        value={formData.college}
        onChange={handleChange}
        error={errors.college ? true : false}
        helperText={errors.college}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="url"
        label="Website URL"
        name="url"
        autoComplete="url"
        value={formData.url}
        onChange={handleChange}
        error={errors.url ? true : false}
        helperText={errors.url}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="startDate"
        label="Start Date"
        name="startDate"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
        value={formData.startDate}
        onChange={handleChange}
        error={errors.startDate ? true : false}
        helperText={errors.startDate}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="endDate"
        label="End Date"
        name="endDate"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
        value={formData.endDate}
        onChange={handleChange}
        error={errors.endDate ? true : false}
        helperText={errors.endDate}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{mt: 3, mb: 2}}
      >
        Submit Suggestion
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={`${
          suggestionType.charAt(0).toUpperCase() + suggestionType.slice(1)
        } suggestion added successfully!`}
      />
    </Box>
  )
}

export default AddSuggestionForm
