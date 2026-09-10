import { initMotion } from "./motion.js";
import { initNavigation } from "./navigation.js";
import { initScenicReading } from "./scenic-reading.js";
export function initPage() {
  initMotion();
  initNavigation();
  initScenicReading();
}
