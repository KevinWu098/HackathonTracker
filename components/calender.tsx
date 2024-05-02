'use client'
import {useEffect, useState, FC} from 'react'
import {AuroraBackground} from '@/components/ui/aurora-background'
import moment from 'moment-timezone'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import {Button} from '@/components/ui/button'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Separator} from '@/components/ui/separator'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const localizer = momentLocalizer(moment)

const MyCalender: FC<{events: EventsData}> = ({events}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null) // Selected event
  const [open, setOpen] = useState(false) // Modal open state

  const eventStyleGetter = (event: Event, start, end, isSelected) => {
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

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event) // Set the clicked event as the selected event
    setOpen(true) // Open the modal
  }

  return (
    <div className="flex flex-col z-50 justify-center gap-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-white">
        Calendar
      </h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{height: 500, backgroundColor: 'white'}}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick} // Handle event click
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>
              <div className="flex flex-row">
                <div className="flex flex-col w-full">
                  College: {selectedEvent?.college}
                  <Separator />
                  Dates:{' '}
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
                    : moment(selectedEvent?.endDate).format('MMM Do YYYY')}{' '}
                </div>
                <div className="flex flex-col align-center justify-center h-full w-full mx-auto">
                  <Button
                    onClick={() => {
                      window.open(selectedEvent?.url)
                    }}
                    className="mx-auto"
                  >
                    Link
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyCalender

// Type definitions
type Event = {
  name: string
  startDate: string
  endDate: string
  college: string
  url: string
  type: string
  yearUpdated: boolean
  originalStartDate: string
  originalEndDate: string
  searchMatch: boolean
}

type EventsData = [Event]
