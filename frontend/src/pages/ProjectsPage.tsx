import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Project } from "../api";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [disease, setDisease] = useState("custom");
  const [desc, setDesc] = useState("");

  const load = () => {
    setErr(null);
    api
      .listProjects()
      .then(setProjects)
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    setErr(null);
    try {
      await api.createProject({
        name: name.trim(),
        disease_key: disease.trim() || "custom",
        description: desc,
      });
      setName("");
      setDesc("");
      load();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div>
      <section className="page-head">
        <p className="eyebrow">Workspace</p>
        <h1>Projects</h1>
        <p className="muted" style={{ maxWidth: 760, marginTop: 4 }}>
          One project per disease or study. Labels are always binary: relevant
          vs not relevant for <em>your</em> task.
        </p>
      </section>

      <div className="card">
        <p className="eyebrow">New</p>
        <h3 style={{ marginTop: 6 }}>Create a project</h3>
        <div className="grid2" style={{ marginTop: "0.6rem" }}>
          <div>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DKD cohort 2024"
            />
          </div>
          <div>
            <label>Disease / domain key</label>
            <input
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              placeholder="dkd, alzheimer, custom, …"
            />
          </div>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label>Description (optional)</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short note for your team"
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button type="button" className="btn btn-primary" onClick={create}>
            Create project
          </button>
        </div>
      </div>

      {err && (
        <div
          className="card"
          style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
        >
          {err}
        </div>
      )}

      <h2 style={{ marginTop: "1.6rem" }}>Your projects</h2>
      {loading && <p className="muted">Loading…</p>}
      {!loading && projects.length === 0 && (
        <p className="muted">No projects yet.</p>
      )}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="card"
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <strong style={{ fontSize: "1.05rem" }}>{p.name}</strong>
              <span className="tag">{p.disease_key}</span>
            </div>
            {p.description && (
              <p style={{ margin: "0.5rem 0 0", color: "var(--ink-soft)" }}>
                {p.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
