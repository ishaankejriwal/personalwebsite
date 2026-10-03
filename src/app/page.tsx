import { Cabinet } from "@/components/cabinet";
import { ChaiStage } from "@/components/chai-stage";
import { Contact } from "@/components/contact";
import { GameSlot } from "@/components/game-slot";
import { Intro } from "@/components/intro";
import { More } from "@/components/more";
import { BioDockStory, ChaiStory, GraceStory, NeuroCoreStory } from "@/components/stories";
import { palettes } from "@/lib/cabinets";

export default function Home() {
  return (
    <main>
      <Intro />

      <Cabinet
        id="neurocore"
        palette={palettes.neuro}
        kicker="01  NeuroCore, a belt I built for kids with cerebral palsy"
        title="Hold still."
        line="Your cursor is the trunk. Keep the belt inside the band. When you sway too much, it buzzes, the same way the real belt does."
        story={<NeuroCoreStory />}
        stage={<GameSlot game="balance" colors={palettes.neuro} />}
      />

      <Cabinet
        id="grace"
        palette={palettes.grace}
        kicker="02  GRACE, water storage forecasts from satellite gravity"
        title="Beat the filter."
        line="Guess where the next month lands, then see what my Kalman filter guessed. Five rounds. Most published models lose to it too."
        story={<GraceStory />}
        stage={<GameSlot game="forecast" colors={palettes.grace} />}
      />

      <Cabinet
        id="chai"
        palette={palettes.chai}
        kicker="03  Coalition for Health AI, where I work"
        title="Test it first."
        line="Before a hospital uses an AI tool, someone has to write the test it must pass. Since July 2025, that has been part of my job."
        story={<ChaiStory />}
        stage={<ChaiStage />}
      />

      <Cabinet
        id="biodock"
        palette={palettes.bio}
        kicker="04  BioDock AI, drug screening that won the Congressional App Challenge"
        title="Find the fit."
        line="Three molecules, one pocket. Drag and rotate until one of them docks. The real app ranks poses the same way, in 3D."
        story={<BioDockStory />}
        stage={<GameSlot game="dock" colors={palettes.bio} />}
      />

      <More />
      <Contact />
    </main>
  );
}
