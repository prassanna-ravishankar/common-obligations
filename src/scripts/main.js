import { initSurveillance } from "./surveillance.js";
import { initRelease } from "./release.js";
import { initCoordination } from "./coordination.js";
import { initMotion } from "./motion.js";
import { initNavigation } from "./navigation.js";
import { initTransitions } from "./transitions.js";
export function initPage() {
  initSurveillance();
  initRelease();
  initCoordination();
  initMotion();
  initNavigation();
  initTransitions();
}
