"use client";
import { useEffect, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import yaml from "js-yaml";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyCalendar from "@/components/calendar";
import { EventYaml, HackathonEvent } from "@/types/Event";

export default function Home() {
    // const events = readYaml('events.yaml')
    const [events, setEvents] = useState<EventYaml[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Get events from public/events.yaml
        fetch("/events.yaml")
            .then((response) => response.text())
            .then((text) => {
                const events = yaml.load(text) as EventYaml[];

                events.forEach((event: EventYaml) => {
                    const startYear = new Date(event.start).getFullYear();
                    const endYear = new Date(event.end).getFullYear();
                    const currentYear = new Date().getFullYear();

                    // Determine if the event's year needs updating
                    const updatedStartDate =
                        startYear === currentYear - 1
                            ? event.start.replace(
                                  startYear.toString(),
                                  (startYear + 1).toString()
                              )
                            : event.start;
                    const updatedEndDate =
                        endYear === currentYear - 1
                            ? event.end.replace(
                                  endYear.toString(),
                                  (endYear + 1).toString()
                              )
                            : event.end;

                    event.originalStartDate = event.start;
                    event.originalEndDate = event.end;
                    event.yearUpdated =
                        startYear === currentYear - 1 ||
                        endYear === currentYear - 1;
                    event.start = updatedStartDate;
                    event.end = updatedEndDate;
                    event.searchMatch = false;
                });

                setEvents(events);
            });
    }, []);

    const getHighlightedEvents = (): HackathonEvent[] => {
        return events.map((event: EventYaml) => ({
            ...event,
            title: event.name,
            start: new Date(event.start),
            end: new Date(event.end),
            searchMatch: searchTerm
                ? event.college.toLowerCase().includes(searchTerm.toLowerCase())
                : false,
        }));
    };

    return (
        <div>
            <AuroraBackground>
                <div className="flex flex-col items-center justify-between p-24 bg-black w-screen h-screen">
                    <MyCalendar events={getHighlightedEvents()} />
                </div>
            </AuroraBackground>
        </div>
    );
}
