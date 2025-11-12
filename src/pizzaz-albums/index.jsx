import React from "react";
import { createRoot } from "react-dom/client";
import { createInstance } from "@module-federation/runtime";
import { useWidgetProps } from "../use-widget-props";
import albumsData from "./albums.json";

const mf = createInstance({
  name: "pizzazAlbumsHost",
  remotes: [
    {
      name: "pizzazAlbumsProvider",
      entry: "http://127.0.0.1:3005/mf-manifest.json",
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

const RemoteAlbums = React.lazy(() =>
  mf.loadRemote("pizzazAlbumsProvider")
);

function App() {
  const defaultProps = React.useMemo(
    () => ({
      headline: "Pizza Albums",
      ctaLabel: "View Album",
      albums: albumsData?.albums ?? [],
    }),
    []
  );
  const widgetProps = useWidgetProps(() => defaultProps) ?? defaultProps;

  return (
    <React.Suspense fallback={<div>Loading albums…</div>}>
      <RemoteAlbums {...widgetProps} />
    </React.Suspense>
  );
}

const root = document.getElementById("pizzaz-albums-root");
if (root) {
  createRoot(root).render(<App />);
}
