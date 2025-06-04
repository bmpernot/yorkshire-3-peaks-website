function Home() {
  return (
    <div className="page-container">
      {/* Hero Section with Parallax */}
      <section className="hero-section">
        <div className="hero-image" />
        <div className="hero-content">
          <h1 className="hero-title">Yorkshire Three Peaks</h1>
          <p className="hero-subtitle">Conquer Pen-y-ghent, Whernside & Ingleborough in one epic day</p>
          <div className="hero-buttons">
            <button className="btn-primary">Register Now</button>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="details-section">
        <div
          className="details-background"
          style={{
            transform: `translateY(20px)`,
          }}
        />
        <div className="details-container">
          <h2 className="section-title">Next Event: TBD</h2>

          <div className="details-grid">
            <div className="details-text">
              <h3 className="details-heading">The Challenge</h3>
              <p className="details-description">
                Take on Yorkshire's three highest peaks in a single day: Pen-y-ghent (694m), Whernside (736m), and
                Ingleborough (723m). This 24-mile circular route through the stunning Yorkshire Dales is both
                challenging and rewarding.
              </p>
              <ul className="details-list">
                <li className="details-item">
                  <span className="bullet"></span>
                  24.5 miles total distance
                </li>
                <li className="details-item">
                  <span className="bullet"></span>
                  1,585m total ascent
                </li>
                <li className="details-item">
                  <span className="bullet"></span>
                  Target time: 12 hours
                </li>
                <li className="details-item">
                  <span className="bullet"></span>
                  All fitness levels welcome
                </li>
              </ul>
            </div>
            <div className="included-section">
              <div className="included-card">
                <h4 className="included-title">What's Included</h4>
                <div className="included-grid">
                  <div className="included-item">
                    <span className="emoji">🏕️</span>
                    Camping Area
                  </div>
                  <div className="included-item">
                    <span className="emoji">🚿</span>
                    Hot Showers
                  </div>
                  <div className="included-item">
                    <span className="emoji">🚽</span>
                    Clean Toilets
                  </div>
                  <div className="included-item">
                    <span className="emoji">💧</span>
                    Hot Water
                  </div>
                  <div className="included-item">
                    <span className="emoji">🚑</span>
                    Safety Team
                  </div>
                  <div className="included-item">
                    <span className="emoji">📻</span>
                    Radio Support
                  </div>
                  <div className="included-item">
                    <span className="emoji">🥪</span>
                    Refreshments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charities Carousel */}
      <section className="charities-section">
        <div className="charities-container">
          <h2 className="section-title">Charities We've Supported</h2>
          <p className="charities-subtitle">Over £50,000 raised for amazing causes across Yorkshire and beyond</p>

          <div className="carousel-container">
            <div className="carousel-track">
              {[...charities, ...charities].map((charity, index) => (
                <div key={index} className="charity-card">
                  <span className="charity-name">{charity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready for the Challenge?</h2>
          <p className="cta-subtitle">
            Join hundreds of adventurers taking on Yorkshire's most iconic peaks while raising money for charity
          </p>

          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Participants</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">£50k+</div>
                <div className="stat-label">Raised</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Charities</div>
              </div>
            </div>
          </div>

          <button className="btn-primary">Register Now</button>
          <p className="cta-note">Early bird pricing until August 1st</p>
        </div>
      </section>
    </div>
  );
}

export default Home;

const charities = [
  "Mind Yorkshire",
  "Yorkshire Air Ambulance",
  "Macmillan Cancer Support",
  "Marie Curie",
  "British Heart Foundation",
  "Cancer Research UK",
  "RSPCA Yorkshire",
  "Save the Children",
  "Alzheimer's Society",
  "Diabetes UK",
  "The Prince's Trust",
  "Help for Heroes",
];
