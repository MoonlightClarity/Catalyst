import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import type { WorkspaceState } from "./domain/types";
import { createWorkspaceRepository } from "./persistence/createRepository";
import type { WorkspaceRepository } from "./persistence/repository";
import { withRecoveryRetryBaseline } from "./persistence/recoveryRetryRepository";
import {
  clearRecoveryJournal,
  readRecoveryJournal,
} from "./persistence/recoveryJournal";
import "./styles.css";
import "./styles/index.css";

function BootstrapError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <main className="bootstrap-error">
      <div>
        <span className="eyebrow">Catalyst could not start</span>
        <h1>Local workspace initialization failed.</h1>
        <p>{message}</p>
        <p>
          Catalyst could not complete startup. Check the console diagnostic and browser
          storage availability, then reload.
        </p>
      </div>
    </main>
  );
}
type RuntimeErrorBoundaryState = {
  error: Error | null;
  componentStack: string;
};

class RuntimeErrorBoundary extends Component<
  { children: ReactNode },
  RuntimeErrorBoundaryState
> {
  state: RuntimeErrorBoundaryState = { error: null, componentStack: "" };

  static getDerivedStateFromError(error: Error): RuntimeErrorBoundaryState {
    return { error, componentStack: "" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Catalyst render failed", error, info);
    this.setState({ componentStack: info.componentStack ?? "" });
  }

  render() {
    if (!this.state.error) return this.props.children;

    const error = this.state.error;
    const diagnostic = [
      `${error.name}: ${error.message}`,
      error.stack ?? "",
      this.state.componentStack,
    ]
      .filter(Boolean)
      .join("\n\n");

    return (
      <main
        role="alert"
        style={{
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: "32px",
          background: "#111417",
          color: "#f4f6f8",
          fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ margin: "0 0 8px", color: "#b7c0c8", fontSize: "12px" }}>
            CATALYST RUNTIME DIAGNOSTIC
          </p>
          <h1 style={{ margin: "0 0 12px", fontSize: "24px" }}>
            Catalyst hit a render error instead of going blank.
          </h1>
          <p style={{ margin: "0 0 20px", color: "#d6dbe0" }}>
            The workspace was left intact. The diagnostic below identifies the failing render path.
          </p>
          <pre
            style={{
              margin: 0,
              padding: "18px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              border: "1px solid #4b535a",
              background: "#090b0d",
              color: "#f4f6f8",
              lineHeight: 1.45,
            }}
          >
            {diagnostic}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "18px",
              padding: "8px 12px",
              border: "1px solid #737d86",
              background: "#1c2227",
              color: "#f4f6f8",
              cursor: "pointer",
            }}
          >
            Reload Catalyst
          </button>
        </div>
      </main>
    );
  }
}

async function bootstrap() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Catalyst bootstrap failed: #root mount element is missing");
    document.body.textContent = "Catalyst could not start: application root element is missing.";
    return;
  }

  let root: ReturnType<typeof createRoot> | null = null;
  try {
    root = createRoot(rootElement);
    const durableRepository = await createWorkspaceRepository();
    let repository: WorkspaceRepository = durableRepository;
    const persistedWorkspace = await durableRepository.loadWorkspace();
    const recoveryWorkspace = readRecoveryJournal();
    let initialWorkspace: WorkspaceState = persistedWorkspace;

    if (recoveryWorkspace) {
      initialWorkspace = recoveryWorkspace;
      try {
        await durableRepository.sync(persistedWorkspace, recoveryWorkspace);
        clearRecoveryJournal();
      } catch (error) {
        repository = withRecoveryRetryBaseline(durableRepository, persistedWorkspace);
        console.error("Catalyst recovered unsaved state but could not checkpoint it", error);
      }
    }
    root.render(
      <StrictMode>
        <RuntimeErrorBoundary>
          <App initialWorkspace={initialWorkspace} repository={repository} />
        </RuntimeErrorBoundary>
      </StrictMode>,
    );
  } catch (error) {
    console.error("Catalyst bootstrap failed", error);
    if (root) {
      root.render(<BootstrapError error={error} />);
    } else {
      const message = error instanceof Error ? error.message : String(error);
      rootElement.textContent = `Catalyst could not start: ${message}`;
    }
  }
}

void bootstrap();
