'use client'
import {useEffect, useState} from 'react'
import {AuroraBackground} from '@/components/ui/aurora-background'
import moment from 'moment-timezone'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import yaml from 'js-yaml'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const localizer = momentLocalizer(moment)

const MyCalender = ({events}) => {
  const [selectedEvent, setSelectedEvent] = useState(null) // Selected event
  const [open, setOpen] = useState(false) // Modal open state

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
    setOpen(true) // Open the modal
  }

  return (
    <div className="z-50 ">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{height: 500}}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick} // Handle event click
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent.name}</DialogTitle>
            <DialogDescription>
              College: {selectedEvent?.college}
              <br />
              Dates:
              <br />
              {selectedEvent?.yearUpdated
                ? ` Original: ${moment(selectedEvent?.originalStartDate).format(
                    'MMM Do YYYY',
                  )} - `
                : `${moment(selectedEvent?.startDate).format(
                    'MMM Do YYYY',
                  )} - `}
              {selectedEvent?.yearUpdated
                ? `${moment(selectedEvent?.originalEndDate).format(
                    'MMM Do YYYY',
                  )}`
                : moment(selectedEvent?.endDate).format('MMM Do YYYY')}{' '}
              <br />
              URL:
              <a
                href={selectedEvent?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedEvent?.url}
              </a>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyCalender
