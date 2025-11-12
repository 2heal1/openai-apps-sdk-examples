import React from "react";
import { createRoot } from "react-dom/client";
import { createInstance } from "@module-federation/runtime";
import { useWidgetProps } from "../use-widget-props";

const mf = createInstance({
  name: 'host',
  remotes: [
    {
      name: 'provider',
      entry: 'http://localhost:3002/mf-manifest.json'
    }
  ],
  shared: {
    'react': {
      version: "19.0.0",
      scope: "default",
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: "^19.0.0"
      }
    }
  }

})



function App() {
  const widgetProps = useWidgetProps(() => ({
    pizzaTopping: "Mozzarella",
    headline: "Fresh pies incoming!",
  }));
  const Remote = React.lazy(() => mf.loadRemote('provider'));
  return (
    <div>
      <h2>{widgetProps?.headline}</h2>
      <p>Favorite topping: {widgetProps?.pizzaTopping}</p>
      <React.Suspense fallback={<div>Loading remote list…</div>}>
        <Remote {...widgetProps} />
      </React.Suspense>
    </div>
  );
}

createRoot(document.getElementById("pizzaz-list-root")).render(<App />);
