import { Button } from "@mui/material";

function Route() {
  return (
    <>
      <span className="margin-top--quarter" />
      <iframe
        src="https://www.komoot.com/tour/2347618454/embed?share_token=abRobDn8xesN8Jj3RtC5P68U3jYw6FMGjzt8vofOolEUQTaL32&profile=1"
        width="90%"
        height="850"
        loading="lazy"
      ></iframe>
      <span className="margin-bottom--2">
        <Button href="/documents/Yorkshire3PeaksRoute.gpx" variant="contained" size="large">
          Download GPX file
        </Button>
      </span>
    </>
  );
}

export default Route;
