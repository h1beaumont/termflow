import { createRoot } from "react-dom/client";
import { onLCP, onINP, onCLS } from 'web-vitals';
import App from "./App";
import "./index.css";

// Web Vitals Real User Monitoring (RUM)
// Track Core Web Vitals and warn if they exceed thresholds
onLCP((metric) => {
  if (metric.value > 2500) {
    console.warn('LCP slow:', metric.value.toFixed(2), 'ms -', metric);
  }
}, { reportAllChanges: false });

onINP((metric) => {
  if (metric.value > 200) {
    console.warn('INP slow:', metric.value.toFixed(2), 'ms -', metric);
  }
}, { reportAllChanges: false });

onCLS((metric) => {
  if (metric.value > 0.1) {
    console.warn('CLS high:', metric.value.toFixed(3), '-', metric);
  }
}, { reportAllChanges: false });

createRoot(document.getElementById("root")!).render(<App />);
