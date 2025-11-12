import React from "react";
import { createRoot } from "react-dom/client";
import { createInstance } from "@module-federation/runtime";
import { useWidgetProps } from "../use-widget-props";
import markers from "../pizzaz/markers.json";

const mf = createInstance({
  name: "pizzazCarouselHost",
  remotes: [
    {
      name: "pizzazCarouselProvider",
      entry: "http://127.0.0.1:3003/mf-manifest.json",
    },
  ],
  shared: {
    react: {
      version: "19.0.0",
      scope: "default",
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: "^19.0.0",
      },
    },
    "react-dom": {
      version: "19.0.0",
      scope: "default",
      shareConfig: {
        singleton: true,
        requiredVersion: "^19.0.0",
      },
    },
  },
});

const RemoteCarousel = React.lazy(() =>
  mf.loadRemote("pizzazCarouselProvider")
);

function App() {
  const defaultProps = React.useMemo(
    () => ({
      title: "Trending Pizzerias",
      ctaLabel: "Save Picks",
      places: markers?.places ?? [],
    }),
    []
  );
  const widgetProps = useWidgetProps(() => defaultProps) ?? defaultProps;

  return (
    <React.Suspense fallback={<div>Loading carousel…</div>}>
      <RemoteCarousel {...widgetProps} />
    </React.Suspense>
  );
}

const root = document.getElementById("pizzaz-carousel-root");
if (root) {
  createRoot(root).render(<App />);
}
