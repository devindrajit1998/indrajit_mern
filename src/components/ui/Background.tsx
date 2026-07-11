import { BackgroundGrid } from "./BackgroundGrid";
import { GradientBlobs } from "./GradientBlobs";
import { NoiseOverlay } from "./NoiseOverlay";

export function Background() {
  return (
    <>
      <BackgroundGrid />
      <GradientBlobs />
      <NoiseOverlay />
    </>
  );
}
