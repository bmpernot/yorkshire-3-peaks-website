import { Button } from "@mui/material";

function Rules() {
  return (
    <main class="content-holder">
      <h1 class="page-title">Rules</h1>

      <section class="rule-section">
        <h2>Team Composition</h2>
        <ul>
          <li>
            Teams must be a size of <strong>3-5 people</strong>.
          </li>
          <li>
            Animals are welcome but must be kept <strong>on leads at all times</strong> and are the owner's
            responsibility.
          </li>
          <li>
            Anyone under 18 must have a <strong>legal guardian</strong> in their team.
          </li>
        </ul>
      </section>

      <section class="rule-section">
        <h2>Race</h2>
        <ul>
          <li>
            Each team is <strong>timed at each checkpoint</strong>.
          </li>
          <li>
            The <strong>overall fastest team wins</strong>.
          </li>
          <li>
            You must pass <strong>all checkpoints in order</strong> with all your members <strong>together</strong>.
          </li>
        </ul>
      </section>

      <section class="rule-section">
        <h2>Event</h2>
        <ul>
          <li>
            <strong>Registration:</strong> 06:00 to 07:30.
          </li>
          <li>
            You will receive a <strong>coloured, numbered tally</strong> for identification.
          </li>
          <li>
            <strong>Do not swap or lose</strong> your tally once issued.
          </li>
        </ul>
      </section>

      <section class="rule-section">
        <h2>Safety</h2>
        <ul>
          <li>
            <strong>No one</strong> may walk alone.
          </li>
        </ul>

        <h3>Retirements</h3>
        <ul>
          <li>If a member cannot continue, the team must help them reach a retirement checkpoint:</li>
          <ul class="nested-list">
            <li>
              <strong>Ribblehead</strong> (before 2nd peak)
            </li>
            <li>
              <strong>Hill Inn</strong> (after 2nd peak)
            </li>
          </ul>
          <li>
            The team may continue only if <strong>at least 3 members remain</strong>.
          </li>
          <li>
            Multiple teams in this situation may form a <strong>makeshift team</strong>, but must get approval from the
            organiser.
          </li>
          <li>
            Teams will be <strong>forced to retire</strong> if they don’t reach:
          </li>
          <ul class="nested-list">
            <li>
              Ribblehead by <strong>12:30</strong>
            </li>
            <li>
              Hill Inn by <strong>15:30</strong>
            </li>
          </ul>
          <li>All retirees will be transported back to HQ.</li>
        </ul>
      </section>

      <section class="rule-section">
        <h2>Conduct</h2>
        <ul>
          <li>
            Follow the <strong>Countryside Code</strong>.
          </li>
          <li>
            Keep noise to an <strong>absolute minimum</strong> when passing through villages.
          </li>
        </ul>
      </section>

      <section class="rule-section">
        <h2>Equipment</h2>

        <h3>Per Person</h3>
        <ul>
          <li>Walking boots (running shoes allowed if running)</li>
          <li>Whistle</li>
          <li>Emergency rations</li>
          <li>500ml+ Bottle/Mug (must handle hot drinks)</li>
          <li>Rucksack</li>
          <li>Food for 12 hours</li>
          <li>Clothing (must pass inspection):</li>
          <ul class="nested-list">
            <li>
              <strong>Hot weather:</strong> Sun hat, T-shirt, Shorts
            </li>
            <li>
              <strong>Cold/Wet weather:</strong> Waterproof jacket, Warm jumper with hood, Trousers, Waterproof trousers
            </li>
          </ul>
        </ul>

        <h3>Per Team</h3>
        <ul>
          <li>1 First aid kit</li>
          <li>2 Ordnance Survey maps</li>
          <li>2 Compasses</li>
          <li>1 Survival bag (plastic or foil)</li>
        </ul>
      </section>

      <section class="rule-section">
        <h2>Generic Rules</h2>
        <ul>
          <li>
            All teams must <strong>pass equipment inspection</strong> before starting.
          </li>
          <li>
            All participants take part <strong>at their own risk</strong>.
          </li>
          <li>Organisers may change rules with due notice.</li>
          <li>
            If you violate the rules, you will be{" "}
            <strong>forced to retire and will no longer be apart of the event</strong>.
          </li>
        </ul>
      </section>
      <Button href="/documents/Yorkshire Three Peaks Rules.pdf" variant="contained" size="large">
        Download Rules
      </Button>
    </main>
  );
}

// TODO - sort out css and make sure the rules are correct - add hover over section with info bubbles for why the rules exist

export default Rules;
