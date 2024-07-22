import { IKImage } from "imagekitio-react";
import { actionPerformed, monitorActivity } from "../../helperfunction";
import { memo } from "react";

function EventCard({ eventData }) {
  return (
    <li>
      <a className="event-instagram-link"
        href={eventData.detailsLink || 'https://www.instagram.com/koethekafe/'}
        onClick={() => actionPerformed("eventLookup", `Visited Event Post of ${eventData.subtitle}`)}
        target="_blank"
      >
        <div className="event-card has-before hover:shine">
          <div className="card-banner img-holder">
            <IKImage
              urlEndpoint='https://ik.imagekit.io/vaibhav11'
              src={eventData.image}
              className="img-cover"
              alt="Event-image"
              transformation={[{
                // quality: 100,
                height: 500,
                width: 500
              }]}
              loading="lazy"
            />

            <time className="publish-date label-2">{eventData.date}</time>
          </div>

          <div className="card-content">
            <p className="card-subtitle label-2 text-center">{eventData.subtitle}</p>

            <h3 className="card-title title-2 text-center">{eventData.title}</h3>
          </div>
        </div>
      </a>
    </li>
  );
}

export default memo(EventCard);
