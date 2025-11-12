import React from "react";
import { createRoot } from "react-dom/client";
import { createInstance } from "@module-federation/runtime";
import { useWidgetProps } from "../use-widget-props";
import "./orchestrator.css";

const SHARED_DEPENDENCIES = {
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
};

function useModuleFederation(components) {
  const remotes = React.useMemo(() => {
    const entries = new Map();
    for (const component of components) {
      if (component.remoteName && component.remoteEntry) {
        entries.set(component.remoteName, component.remoteEntry);
      }
    }
    return Array.from(entries.entries()).map(([name, entry]) => ({
      name,
      entry,
    }));
  }, [components]);

  const signature = React.useMemo(
    () => JSON.stringify(remotes.map((remote) => `${remote.name}:${remote.entry}`)),
    [remotes]
  );

  return React.useMemo(
    () =>
      createInstance({
        name: "pizzaOrchestratorHost",
        remotes,
        shared: SHARED_DEPENDENCIES,
      }),
    [signature]
  );
}

function RemoteSlot({ component, moduleFederation }) {
  const exposedModule = component.exposedModule || ".";
  const RemoteComponent = React.useMemo(
    () =>
      React.lazy(() =>
        moduleFederation.loadRemote(component.remoteName, exposedModule)
      ),
    [moduleFederation, component.remoteName, exposedModule]
  );

  const fallbackLabel = component.title || component.id;
  const resolvedProps = component.props ?? {};

  return (
    <React.Suspense fallback={<div className="remote-fallback">Loading {fallbackLabel}…</div>}>
      <RemoteComponent {...resolvedProps} />
    </React.Suspense>
  );
}

function ComponentGrid({ components, moduleFederation }) {
  if (!components.length) {
    return (
      <div className="remote-fallback">
        No pizza experiences selected yet—ask for one like “show me the pizza carousel”.
      </div>
    );
  }

  return (
    <div className="component-grid">
      {components.map((component, index) => (
        <div className="component-card" key={`${component.id}-${index}`}>
          {component.title ? (
            <div className="component-header">
              <h3>{component.title}</h3>
              {component.description ? (
                <p className="component-description">{component.description}</p>
              ) : null}
            </div>
          ) : null}
          <RemoteSlot component={component} moduleFederation={moduleFederation} />
        </div>
      ))}
    </div>
  );
}

function App() {
  const defaultState = React.useMemo(
    () => ({
      request: "",
      components: [],
      matchedKeywords: [],
      availableComponents: [],
    }),
    []
  );
  const widgetProps = useWidgetProps(() => defaultState) ?? defaultState;
  console.log('widgetProps: ',widgetProps);
  const components = Array.isArray(widgetProps.components)
    ? widgetProps.components
    : [];
  const moduleFederation = useModuleFederation(components);

  return (
    <div className="orchestrator-root">
      {widgetProps.request ? (
        <header className="request-banner">
          <span>Request:</span>
          <strong>{widgetProps.request}</strong>
        </header>
      ) : null}

      <ComponentGrid
        components={components}
        moduleFederation={moduleFederation}
      />
    </div>
  );
}

createRoot(document.getElementById("pizza-orchestrator-root")).render(<App />);
