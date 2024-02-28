import React, {useState, useEffect} from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment-timezone'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  Modal,
  Box,
  Typography,
  Button,
  Snackbar,
  TextField,
} from '@mui/material'
import {useUser} from '@clerk/nextjs'
import {doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore'
import {useFirestore} from 'reactfire'

const localizer = momentLocalizer(moment)

const MyCalendar = ({events, setEvents}) => {
  const [open, setOpen] = useState(false) // State to control the modal
  const [selectedEvent, setSelectedEvent] = useState(null) // State to hold the selected event
  const [isAuthorized, setIsAuthorized] = useState(false) // State to hold the authentication status
  const {user} = useUser()
  const firestore = useFirestore()
  const [eventDetails, setEventDetails] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleModify = (event) => {
    setEventDetails({
      // Pre-populate the form with the selected event's data
      ...event,
      startDate: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      endDate: moment(event.end).format('YYYY-MM-DDTHH:mm'),
    })
    setIsEditMode(true) // Switch to edit mode
  }

  useEffect(() => {
    const checkAuthorization = async () => {
      if (user) {
        const userEmail = user.primaryEmailAddress?.emailAddress || ''
        const userDocRef = doc(firestore, 'users', userEmail)
        try {
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            setIsAuthorized(userDoc.data().authorized)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    checkAuthorization()
  }, [user, firestore])

  const eventStyleGetter = (event, start, end, isSelected) => {
    // Set the default background color based on the event type
    let backgroundColor = event.type === 'hackathon' ? 'gold' : 'lightblue' // Gold for hackathons, blue for conferences

    if (event.searchMatch) {
      backgroundColor = 'red' // If the event matches the search term
    } else if (event.yearUpdated) {
      backgroundColor = 'grey' // If the year was updated
    }

    let newStyle = {
      backgroundColor: backgroundColor,
      color: 'black',
      borderRadius: '0px',
      border: 'none',
    }

    return {
      style: newStyle,
    }
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event) // Set the clicked event as the selected event
    setIsEditMode(false) // View mode by default
    setOpen(true) // Open the modal
  }

  const handleClose = () => {
    setOpen(false) // Close the modal
    setIsEditMode(false) // Reset edit mode
  }

  const handleDelete = async (event) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event: ${event.name}?`,
      )
    ) {
      try {
        if (event.type === 'hackathon') {
          await deleteDoc(doc(firestore, 'hackathons', event.id))
        } else {
          await deleteDoc(doc(firestore, 'conferences', event.id))
        }
        // Remove the deleted event from the events state
        setEvents(events.filter((e) => e.id !== event.id))
        setOpen(false) // Close the modal
      } catch (error) {
        console.error('Error deleting hackathon:', error)
      }
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setEventDetails((prev) => ({...prev, [name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isEditMode && selectedEvent) {
      try {
        // Format dates as strings
        const startDateInZone = moment
          .tz(eventDetails.startDate, 'YYYY-MM-DDTHH:mm', 'America/Los_Angeles')
          .format()
        const endDateInZone = moment
          .tz(eventDetails.endDate, 'YYYY-MM-DDTHH:mm', 'America/Los_Angeles')
          .format()

        const updatedData = {
          ...eventDetails,
          startDate: startDateInZone,
          endDate: endDateInZone,
        }

        const eventDocRef = doc(firestore, 'hackathons', selectedEvent.id)
        await updateDoc(eventDocRef, updatedData)

        setOpen(false) // Close the modal
        setIsEditMode(false) // Reset edit mode
        setOpenSnackbar(true) // Open the snackbar on successful submission
        // Update the events in the local state
        setEvents(
          events.map((ev) =>
            ev.id === selectedEvent.id ? {...ev, ...updatedData} : ev,
          ),
        )
      } catch (error) {
        console.error('Error updating hackathon:', error)
      }
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{height: 500}}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick} // Handle event click
      />

      {/* Modal for event details */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="event-details-title"
        aria-describedby="event-details-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {!isEditMode ? (
            <>
              <Typography id="event-details-title" variant="h6" component="h2">
                {selectedEvent?.name}
              </Typography>
              <Typography id="event-details-description" sx={{mt: 2}}>
                College: {selectedEvent?.college}
              </Typography>
              <Typography>
                Dates:
                {selectedEvent?.yearUpdated
                  ? ` Original: ${moment(
                      selectedEvent?.originalStartDate,
                    ).format('MMM Do YYYY')} - `
                  : `${moment(selectedEvent?.startDate).format(
                      'MMM Do YYYY',
                    )} - `}
                {selectedEvent?.yearUpdated
                  ? `${moment(selectedEvent?.originalEndDate).format(
                      'MMM Do YYYY',
                    )}`
                  : moment(selectedEvent?.endDate).format('MMM Do YYYY')}
              </Typography>

              <Typography>
                URL:{' '}
                <a
                  href={selectedEvent?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedEvent?.url}
                </a>
              </Typography>
              {isAuthorized && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleModify(selectedEvent)}
                    sx={{mt: 2, mr: 1}}
                  >
                    Modify
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(selectedEvent)}
                    sx={{mt: 2}}
                  >
                    Delete
                  </Button>
                </>
              )}
            </>
          ) : (
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
                value={eventDetails.name}
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
                value={eventDetails.college}
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
                value={eventDetails.url}
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
                InputLabelProps={{
                  shrink: true,
                }}
                value={eventDetails.startDate}
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
                InputLabelProps={{
                  shrink: true,
                }}
                value={eventDetails.endDate}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{mt: 3, mb: 2}}
              >
                Change Hackathon
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Hackathon changed successfully!"
      />
    </>
  )
}

export default MyCalendar
