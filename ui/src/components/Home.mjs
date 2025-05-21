import Image from "next/image";
import ribbleheadViaduct from "@/public/ribbleheadViaduct.jpg";
import penyghent from "@/public/penyghent.jpg";
import ingleborough from "@/public/ingleborough.jpg";
import cairn from "@/public/cairn.jpg";
import bridge from "@/public/bridge.jpg";
import { Button } from "@mui/material";

// would like to implement a parralax effect

function Home() {
  return (
    <span id="home">
      {/* make className column put it side by side */}
      <div className="column">
        <div>
          <h2>
            26 mile charity walk <br />
            DATE TBD
          </h2>
          <Button id="joinEvent" variant="contained" href="/event/current">
            Join Event Now
          </Button>
        </div>
        <Image alt="Ribblehead Viaduct" src={ribbleheadViaduct} style={{ maxWidth: "100%", height: "auto" }} />
      </div>
      <Image alt="Penyghent" src={penyghent} style={{ maxWidth: "100%", height: "auto" }} />
      <div className="column">
        <Image alt="Cairn" src={cairn} style={{ maxWidth: "100%", height: "auto" }} />
        <div>{/* a little bit about the event - why we run it - if you want to help out */}</div>
      </div>
      {/* want a scroll bar of all the charities that we have donated to */}
    </span>
  );
}

export default Home;
