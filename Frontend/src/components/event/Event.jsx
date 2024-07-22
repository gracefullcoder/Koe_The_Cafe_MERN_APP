import { memo } from "react";
import EventCard from "./EventCard";

function Event({ events }) {
  console.log("called", events)
  return (
    <section className="section event bg-black-10" aria-label="event" id="events">
      <div className="container">
        <p className="section-subtitle label-2 text-center">Recent Updates</p>
        <h2 className="section-title headline-1 text-center">Events</h2>
        <ul className="grid-list">
          {events && events.map((event, index) => (
            <EventCard key={event._id || index} eventData={event} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default memo(Event);
