export function NeuroCoreStory() {
  return (
    <>
      <p>
        Kids with cerebral palsy see a physical therapist once or twice a week. The rest of the
        time nobody can tell whether they&rsquo;re practicing well or drilling a bad pattern, and
        in CP, practicing wrong is worse than not practicing.
      </p>
      <p>
        NeuroCore is a lightweight belt with three inertial sensors at the left hip, right hip,
        and lower back. I built the hardware and the model. An Isolation Forest learns what each
        child&rsquo;s own stable movement looks like, and when a window drifts from that baseline
        the belt gives a short vibration so the child self-corrects. The therapist sees the same
        data on a dashboard. The toy on the right is that loop, with your cursor as the trunk.
      </p>
      <p>
        We were the only high school team in Georgia Tech&rsquo;s CREATE-X Startup Launch in
        summer 2026, one of five teams out of 250 at MIT Solve&rsquo;s Day of AI, and we&rsquo;ve
        raised $160K in funding and services. Five pediatric PT clinics in Georgia have agreed to
        pilot the belt.{" "}
        <a
          className="lnk"
          href="https://nique.net/news/annual-create-x-demo-day-unveils-entrepreneurial-spirit-at-tech-1789106783461"
          rel="noreferrer"
        >
          The Technique covered Demo Day.
        </a>
      </p>
    </>
  );
}

export function GraceStory() {
  return (
    <>
      <p>
        The GRACE satellites weigh the Earth. As groundwater, soil moisture, and snow move around,
        the pull on the satellites changes, which gives a monthly map of how much water is stored
        on land. The data arrives two to three months late, which is a long time if you&rsquo;re
        trying to warn someone about a drought.
      </p>
      <p>
        I spent two weeks of summer 2026 at the UT Austin Center for Space Research as a NASA
        SEES intern, after a spring of remote work with a project scientist, building machine
        learning forecasts to bridge that gap across 234 river basins. The work is going to the
        AGU Fall Meeting.
      </p>
      <p>
        While reading forecasting papers I noticed that none of the ten data-driven studies I
        checked scores itself against the record it starts from. So I built that baseline: a
        Kalman filter fit per basin. It cuts error by 5.0% at one month and 8.8% at two months
        over damped persistence, and it has lower error than the published GRACE-FCast forecast at
        one month. I&rsquo;m preparing the paper for Hydrology and Earth System Sciences. The
        filter you&rsquo;re playing against is the one from the paper.
      </p>
    </>
  );
}

export function BioDockStory() {
  return (
    <>
      <p>
        BioDock AI is a web app for early drug screening. You give it a protein target. It pulls
        every compound tested against that target from ChEMBL, computes PaDEL fingerprints, trains
        a model to predict pIC50 for new molecules, and docks the strongest candidates in 3D with
        NVIDIA&rsquo;s DiffDock so you can look at the pose.
      </p>
      <p>
        I screened more than 17,000 molecules against breast and lung cancer targets, with advice
        from Prof. Jeff Skolnick at Georgia Tech. It won the 2024 Congressional App Challenge for
        Georgia&rsquo;s 7th District and I presented it at the U.S. Capitol in April 2025.{" "}
        <a className="lnk" href="https://www.congressionalappchallenge.us/24-ga07/" rel="noreferrer">
          The write-up.
        </a>
      </p>
    </>
  );
}

export function ChaiStory() {
  return (
    <>
      <p>
        The Coalition for Health AI is about 3,000 health systems, companies, and universities
        writing the shared rules for how AI gets tested before it&rsquo;s used on patients. I got
        there by cold-emailing its CEO after hearing him talk about health AI on my way to school,
        then talking with him roughly once a month for a year. When I was in the Bay Area visiting
        my sister I stayed an extra day to meet him, and he offered me the job.
      </p>
      <p>
        Since July 2025 I&rsquo;ve read more than 60 studies and turned them into evaluation
        metrics, documentation, and notebooks for CHAI&rsquo;s assurance work, across EHR
        retrieval, agentic AI, clinical decision support, clinical trials, ambient scribes,
        general health advice, and post-deployment monitoring. Lately I&rsquo;ve been in the
        cybersecurity group with people from NVIDIA, Johns Hopkins, and UnitedHealth Group,
        working on playbooks for AI-driven attacks on health systems.{" "}
        <a
          className="lnk"
          href="https://github.com/coalition-for-health-ai/responsible-ai-content"
          rel="noreferrer"
        >
          Some of it is public.
        </a>
      </p>
    </>
  );
}
