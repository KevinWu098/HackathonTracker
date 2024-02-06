import React, {useState} from 'react'
import {
  Box,
  Modal,
  Paper,
  TextField,
  Button,
  Snackbar,
  Typography,
  Backdrop,
  Fade,
} from '@mui/material'
import {addDoc, collection} from 'firebase/firestore'
import {useFirestore} from 'reactfire'
import moment from 'moment-timezone'

const Suggest = ({open, handleClose}) => {
  const firestore = useFirestore()
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    url: '',
    startDate: '',
    endDate: '',
  })
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    try {
      await addDoc(collection(firestore, 'suggestions'), newFormData)
      setOpenSnackbar(true)
      handleClose()
    } catch (error) {
      console.error('Error adding hackathon:', error)
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            outline: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 1,
          }}
        >
          <Paper elevation={6} sx={{p: 4, m: 2, minWidth: '300px'}}>
            <Typography
              component="h1"
              variant="h5"
              sx={{mb: 4, textAlign: 'center'}}
            >
              Suggest Hackathon
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Hackathon Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="startDate"
                label="Start Date"
                name="startDate"
                type="datetime-local"
                InputLabelProps={{shrink: true}}
                value={formData.startDate}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="endDate"
                label="End Date"
                name="endDate"
                type="datetime-local"
                InputLabelProps={{shrink: true}}
                value={formData.endDate}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{mt: 3, mb: 2}}
              >
                Add Hackathon
              </Button>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Hackathon added successfully!"
              />
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  )
}

export default Suggest
