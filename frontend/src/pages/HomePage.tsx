import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  api,
  type DeviceInfo,
  apiBaseDidChange,
  getApiBase,
  isColabCandidate,
  pingBackend,
  setApiBase,
} from "../api";

type StepStatus = "pending" | "running" | "done" | "error";

function statusLabel(status: StepStatus): string {
  if (status === "done") return "Done";
  if (status === "running") return "Running";
  if (status === "error") return "Needs attention";
  return "Not started";
}

function statusColor(status: StepStatus): string {
  if (status === "done") return "var(--success)";
  if (status === "running") return "var(--warning)";
  if (status === "error") return "var(--danger)";
  return "var(--muted)";
}

const COLAB_NOTEBOOK_PATH = "colab_l2g_backend.ipynb";

function getColabNotebookUrl(): string {
  const githubUser = (import.meta.env.VITE_COLAB_GITHUB_USERNAME || "Lit2G").trim() || "Lit2G";
  const githubRepo = (import.meta.env.VITE_COLAB_GITHUB_REPO || "L2G").trim() || "L2G";
  const githubBranch = (import.meta.env.VITE_COLAB_GITHUB_BRANCH || "main").trim() || "main";

  return `https://colab.research.google.com/github/${githubUser}/${githubRepo}/blob/${githubBranch}/${COLAB_NOTEBOOK_PATH}`;
}

function StepBullet({
  status,
  label,
  details,
}: {
  status: StepStatus;
  label: string;
  details: string;
}) {
  const marker =
    status === "done" ? "✓" : status === "running" ? "◷" : status === "error" ? "!" : "•";
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: "0.75rem 0.9rem",
        background: status === "done" ? "rgba(95, 169, 90, 0.07)" : "var(--paper-2)",
      }}
    >
      <p style={{ margin: 0, color: "var(--ink)", fontSize: "0.92rem" }}>
        <strong style={{ color: statusColor(status), marginRight: 6 }}>{marker}</strong>
        <strong>{label}</strong>{" "}
        <span style={{ color: statusColor(status), fontFamily: "var(--font-mono)", fontSize: ".82rem" }}>
          ({statusLabel(status)})
        </span>
      </p>
      <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "0.88rem" }}>
        {details}
      </p>
    </div>
  );
}

export function HomePage() {
  const [backendUrl, setBackendUrl] = useState(getApiBase());
  const [connectionStatus, setConnectionStatus] = useState<StepStatus>("pending");
  const [devicesStatus, setDevicesStatus] = useState<StepStatus>("pending");
  const [devicesInfo, setDevicesInfo] = useState<DeviceInfo | null>(null);
  const [message, setMessage] = useState("Run each step in order to enable a guided path.");
  const [copyHint, setCopyHint] = useState("");

  useEffect(() => {
    const sync = () => setBackendUrl(getApiBase());
    const stop = apiBaseDidChange(sync);
    sync();
    return stop;
  }, []);

  const runConnectionCheck = async () => {
    setConnectionStatus("running");
    setMessage("Pinging backend health...");
    try {
      const normalized = setApiBase(backendUrl);
      setBackendUrl(normalized);
      await pingBackend(normalized);
      setDevicesStatus("pending");
      setConnectionStatus("done");
      setMessage("Backend connected. You can now run the system check.");
    } catch (err) {
      setConnectionStatus("error");
      setMessage((err as Error).message || "Could not connect to backend.");
    }
  };

  const runDeviceCheck = async () => {
    setDevicesStatus("running");
    setMessage("Reading backend device capabilities...");
    try {
      const d = await api.devices();
      setDevicesInfo(d);
      setDevicesStatus("done");
      setMessage("System check passed. Your project setup is ready.");
    } catch (err) {
      setDevicesStatus("error");
      setMessage((err as Error).message || "Device check failed.");
    }
  };

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText("https://xxxxxx-1234-5678.ngrok-free.app/api");
      setCopyHint("Copied example ngrok endpoint.");
      setTimeout(() => setCopyHint(""), 1500);
    } catch {
      setCopyHint("Clipboard not available.");
      setTimeout(() => setCopyHint(""), 1500);
    }
  };

  const colabHint = isColabCandidate(backendUrl)
    ? "Detected ngrok style URL. Keep /api only if your service exposes routes from that path."
    : "Use /api for local Docker, or a public Colab ngrok endpoint for remote backends.";

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <p className="eyebrow">Literature to Gene</p>
        <h1>Literature mining for any disease domain</h1>
        <p className="hero-lead">
          L2G helps researchers train a relevance classifier on <em>their own</em>{" "}
          labeled abstracts, run gene/protein NER, and normalize symbols — on GPU,
          Apple&nbsp;Silicon Metal, or CPU.
        </p>

        <div className="steps">
          <span className="step-pill active">1 · Train</span>
          <span className="step-pill active">2 · Extract</span>
          <span className="step-pill active">3 · Normalize</span>
          <span className="step-pill active">4 · Review</span>
        </div>

        <div className="tag-row" style={{ marginTop: "1rem" }}>
          <Link className="btn btn-primary btn-sm" to="/projects">
            Open Workspace →
          </Link>
          <Link className="btn btn-ghost btn-sm" to="/about">
            What is L2G?
          </Link>
        </div>
      </section>

      {/* ---------- FEATURE GRID ---------- */}
      <section style={{ marginTop: "1.5rem" }}>
        <div className="grid-2">
          <div className="card">
            <p className="eyebrow">Designed for researchers</p>
            <h3 style={{ marginTop: 6 }}>Bring your own labeled corpus</h3>
            <ul style={{ margin: "0.6rem 0 0", paddingLeft: "1.2rem", color: "var(--ink-soft)" }}>
              <li>Create a project per disease or study — not only DKD.</li>
              <li>Upload labeled abstracts (0 = not relevant, 1 = relevant).</li>
              <li>Choose processor and fine-tuning parameters.</li>
              <li>Run each pipeline step alone, or the full workflow end-to-end.</li>
            </ul>
          </div>

          <div className="card">
            <p className="eyebrow">Pipeline</p>
            <h3 style={{ marginTop: 6 }}>Four reproducible stages</h3>
            <ul style={{ margin: "0.6rem 0 0", paddingLeft: "1.2rem", color: "var(--ink-soft)" }}>
              <li><strong>Train</strong> a relevance classifier on labeled abstracts.</li>
              <li><strong>Extract</strong> genes and proteins via biomedical NER.</li>
              <li><strong>Normalize</strong> recognized entities to canonical symbols.</li>
              <li><strong>Review</strong> outputs with per-job logs and metrics.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- COLAB GUIDE ---------- */}
      <section style={{ marginTop: "1.5rem" }}>
        <div className="card">
          <p className="eyebrow">Quick start</p>
          <h3 style={{ marginTop: 6 }}>Start with Colab in 6 researcher-friendly steps</h3>
          <ol
            style={{
              margin: "0.8rem 0 0",
              paddingLeft: "1.2rem",
              color: "var(--ink-soft)",
              display: "grid",
              gap: "0.55rem",
            }}
          >
            <li>Open the Colab notebook with the button below and run the environment setup cells.</li>
            <li>Run the cell that starts the API server + ngrok tunnel.</li>
            <li>
              Copy the public ngrok URL exactly as shown (example:{" "}
              <code className="mono">https://xxx.ngrok-free.app</code>).
            </li>
            <li>
              Paste that URL into the <strong>Backend selector</strong> on the Workspace or Jobs page.
              <ul style={{ marginTop: "0.4rem" }}>
                <li>
                  Add <code className="mono">/api</code> if your server exposes routes from{" "}
                  <code className="mono">/api</code>.
                </li>
              </ul>
            </li>
            <li>Click <strong>Save &amp; test</strong> and confirm a green <strong>Connected</strong> status.</li>
            <li>Create or open a project and continue with Train → Run pipeline.</li>
          </ol>
        </div>
      </section>

      {/* ---------- QUICK START ASSISTANT ---------- */}
      <section style={{ marginTop: "1.5rem" }}>
        <div className="card">
          <p className="eyebrow">Assistant</p>
          <h3 style={{ marginTop: 6 }}>Quick start assistant</h3>
          <p style={{ margin: "0.6rem 0 0.9rem", color: "var(--ink-soft)" }}>{message}</p>

          <div style={{ display: "grid", gap: "0.6rem", marginBottom: "0.9rem" }}>
            <StepBullet
              status="done"
              label="Step 1 · Open platform"
              details="You are already on Home. Use this page to finish setup."
            />
            <StepBullet status="pending" label="Step 2 · Paste backend URL" details={colabHint} />
            <StepBullet
              status={connectionStatus}
              label="Step 3 · Connect"
              details="Test /health with the selected backend."
            />
            <StepBullet
              status={devicesStatus}
              label="Step 4 · Run system check"
              details="Check CUDA / MPS / CPU and recommended processor."
            />
            <StepBullet
              status={connectionStatus === "done" ? "done" : "pending"}
              label="Step 5 · Start project"
              details="Create or open your project and run training / pipeline from the workspace."
            />
          </div>

          <div className="toolbar" style={{ alignItems: "flex-start" }}>
            <input
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              style={{ maxWidth: "520px", flex: 1 }}
              placeholder="/api or https://....ngrok-free.app/api"
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={runConnectionCheck}
              disabled={connectionStatus === "running"}
            >
              Save &amp; test
            </button>
            <button
              className="btn"
              type="button"
              onClick={runDeviceCheck}
              disabled={connectionStatus !== "done" || devicesStatus === "running"}
            >
              Check system
            </button>
          </div>

          <div className="toolbar">
            <a
              className="btn btn-ghost"
              href={getColabNotebookUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Colab notebook ↗
            </a>
            <button className="btn btn-ghost" type="button" onClick={copyExample}>
              Copy ngrok example
            </button>
            <Link className="btn btn-ghost" to="/jobs">
              Open job center
            </Link>
            <Link className="btn btn-primary" to="/projects">
              Open Workspace
            </Link>
          </div>

          {copyHint && (
            <p style={{ margin: "0.55rem 0 0", color: "var(--success)" }}>{copyHint}</p>
          )}
          {devicesInfo && (
            <p style={{ margin: "0.7rem 0 0", color: "var(--ink-soft)", fontFamily: "var(--font-mono)", fontSize: ".88rem" }}>
              Recommended: <strong>{devicesInfo.recommended.toUpperCase()}</strong> · CUDA:{" "}
              {devicesInfo.available.cuda ? "on" : "off"} · MPS:{" "}
              {devicesInfo.available.mps ? "on" : "off"} · CPU: on
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
