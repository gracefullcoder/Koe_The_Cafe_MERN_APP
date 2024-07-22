import featureIcon1 from "../../assets/images/features-icon-1.png";
import featureIcon2 from "../../assets/images/features-icon-2.png";
import featureIcon3 from "../../assets/images/features-icon-3.png";
import featureIcon4 from "../../assets/images/features-icon-4.png";
import shape7 from "../../assets/images/shape-7.png";
import shape8 from "../../assets/images/shape-8.png";
import FeatureCard from "./FeatureCard";

export default function Feature() {
  return (
    <section className="section features text-center" aria-label="features">
      <div className="container">
        <p className="section-subtitle label-2">Why Choose Us</p>

        <h2 className="headline-1 section-title">Our Strength</h2>

        <ul className="grid-list">
          <FeatureCard
            icon={featureIcon1}
            title="Hygienic Food"
            description="Indulge in a dining experience with the assurance of utmost hygiene."
          />
          <FeatureCard
            icon={featureIcon2}
            title="Serene Ambience"
            description="The perfect setting for a relaxing and enjoyable time."
          />
          <FeatureCard
            icon={featureIcon3}
            title="Skilled Chefs"
            description="Our culinary team comprises skilled chefs who bring their expertise to every dish."
          />
          <FeatureCard
            icon={featureIcon4}
            title="Event & Party"
            description="Memorable gatherings filled with delicious food."
          />
        </ul>

        <img
          src={shape7}
          width="208"
          height="178"
          loading="lazy"
          alt="shape"
          className="shape shape-1"
        />

        <img
          src={shape8}
          width="120"
          height="115"
          loading="lazy"
          alt="shape"
          className="shape shape-2"
        />
      </div>
    </section>
  );
}
