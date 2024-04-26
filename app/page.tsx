'use client'
import {useEffect, useState} from 'react'
import {AuroraBackground} from '@/components/ui/aurora-background'
import moment from 'moment-timezone'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import yaml from 'js-yaml'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function Home() {
  // const events = readYaml('events.yaml')
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Get events from public/events.yaml
    fetch('/events.yaml')
      .then((response) => response.text())
      .then((text) => {
        const events = yaml.load(text)
        setEvents(events)
        console.log(events)
      })
  }, [])

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

  return (
    <AuroraBackground>
      <main className="flex flex-col items-center justify-between p-24 bg-black w-screen h-screen">
        <div className="z-50">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{height: 500}}
            eventPropGetter={eventStyleGetter}
            // onSelectEvent={handleEventClick} // Handle event click
          />
        </div>
      </main>
    </AuroraBackground>
  )
}
