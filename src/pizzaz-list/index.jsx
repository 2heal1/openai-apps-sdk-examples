import React from "react";
import { createRoot } from "react-dom/client";
import { createInstance } from '@module-federation/runtime'

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
  const Remote = React.lazy(() => mf.loadRemote('provider'));
  return (
    <div>
      <React.Suspense>
        <Remote />
      </React.Suspense>
    </div>
  );
}

createRoot(document.getElementById("pizzaz-list-root")).render(<App />);
