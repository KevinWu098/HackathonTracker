'use client'
import {useEffect, useState} from 'react'
import {AuroraBackground} from '@/components/ui/aurora-background'
import yaml from 'js-yaml'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import MyCalender from '@/components/calender'

export default function Home() {
  // const events = readYaml('events.yaml')
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Get events from public/events.yaml
    fetch('/events.yaml')
      .then((response) => response.text())
      .then((text) => {
        const events = yaml.load(text)
        events.forEach((event) => {
          const startYear = new Date(event.startDate).getFullYear()
          const endYear = new Date(event.endDate).getFullYear()
          const currentYear = new Date().getFullYear()

          // Determine if the event's year needs updating
          const updatedStartDate =
            startYear === currentYear - 1
              ? event.startDate.replace(
                  startYear.toString(),
                  (startYear + 1).toString(),
                )
              : event.startDate
          const updatedEndDate =
            endYear === currentYear - 1
              ? event.endDate.replace(
                  endYear.toString(),
                  (endYear + 1).toString(),
                )
              : event.endDate

          event.originalStartDate = event.startDate
          event.originalEndDate = event.endDate
          event.yearUpdated =
            startYear === currentYear - 1 || endYear === currentYear - 1
          event.startDate = updatedStartDate
          event.endDate = updatedEndDate
        })
        console.log(events)
        setEvents(events)
      })
  }, [])

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

  return (
    <div>
      <AuroraBackground>
        <div className="flex flex-col items-center justify-between p-24 bg-black w-screen h-screen">
          <MyCalender events={getHighlightedEvents()} />
        </div>
      </AuroraBackground>
    </div>
  )
}
