'use client'

import {collection, getDocs} from 'firebase/firestore'
import {useFirestore} from 'reactfire'
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {
  Box,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  InputAdornment,
  Button,
  Stack,
  Modal,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MyCalendar from './Calendar'
import AddSuggestionForm from './Suggestion'

const currentYear = new Date().getFullYear()
export default function Home() {
  const router = useRouter()
  const firestore = useFirestore()

  const [events, setEvents] = useState([]) // Replace with actual data fetching logic
  const [searchTerm, setSearchTerm] = useState('')

  const [openSuggestionModal, setOpenSuggestionModal] = useState(false) // State to control the suggestion modal
  const handleOpenSuggestionModal = () => {
    setOpenSuggestionModal(true)
  }

  const handleCloseSuggestionModal = () => {
    setOpenSuggestionModal(false)
  }

  // Fetch hackathons when the component mounts
  useEffect(() => {
    const fetchHackathons = async () => {
      const hackathonCollectionRef = collection(firestore, 'hackathons')
      const hackathonSnapshot = await getDocs(hackathonCollectionRef)
      const hackathonList = hackathonSnapshot.docs.map((doc) => {
        const data = doc.data()
        const originalStartDate = data.startDate
        const originalEndDate = data.endDate
        const startYear = new Date(originalStartDate).getFullYear()
        const endYear = new Date(originalEndDate).getFullYear()

        // Increment the year by one if the start year is the current year - 1
        const updatedStartDate =
          startYear === currentYear - 1
            ? originalStartDate.replace(
                startYear.toString(),
                (startYear + 1).toString(),
              )
            : originalStartDate
        const updatedEndDate =
          endYear === currentYear - 1
            ? originalEndDate.replace(
                endYear.toString(),
                (endYear + 1).toString(),
              )
            : originalEndDate

        return {
          id: doc.id,
          ...data,
          originalStartDate, // Store original start date
          originalEndDate, // Store original end date
          startDate: updatedStartDate,
          endDate: updatedEndDate,
          yearUpdated:
            startYear === currentYear - 1 || endYear === currentYear - 1,
        }
      })
      setEvents(hackathonList)
    }

    fetchHackathons()
  }, [firestore])

  // Only calculate searchMatch when rendering
  const getHighlightedEvents = () => {
    return events.map((event) => ({
      ...event,
      title: event.name,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      searchMatch: searchTerm
        ? event.college.toLowerCase().includes(searchTerm.toLowerCase())
        : false,
    }))
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            HackathonTracker
          </Typography>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                sx={{boxShadow: 3}}
                onClick={() => router.push('/signin')}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{boxShadow: 3, backgroundColor: 'success.main'}}
                onClick={() => router.push('/signup')}
              >
                Sign Up
              </Button>
            </Stack>
          </SignedOut>
        </Toolbar>
      </AppBar>

      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <TextField
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by college..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{boxShadow: 3, marginLeft: 2}}
          onClick={handleOpenSuggestionModal}
        >
          Suggest
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <MyCalendar events={getHighlightedEvents()} setEvents={setEvents} />
      </Box>

      <Modal
        open={openSuggestionModal}
        onClose={handleCloseSuggestionModal}
        aria-labelledby="suggestion-modal-title"
        aria-describedby="suggestion-modal-description"
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
            width: '100%',
            maxWidth: 600,
          }}
        >
          <Typography
            id="suggestion-modal-title"
            variant="h6"
            component="div"
            sx={{mb: 2}}
          >
            Suggest a Hackathon
          </Typography>
          <AddSuggestionForm />
        </Box>
      </Modal>
    </Box>
  )
}
