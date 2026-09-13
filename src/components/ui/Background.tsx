import { BackgroundGrid } from "./BackgroundGrid";
import { GradientBlobs } from "./GradientBlobs";
import { NoiseOverlay } from "./NoiseOverlay";
import { ParticleBackground } from "./ParticleBackground";

export function Background() {
  return (
    <>
      <BackgroundGrid />
      <GradientBlobs />
      <ParticleBackground />
      <NoiseOverlay />
    </>
  );
}
