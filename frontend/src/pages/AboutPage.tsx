import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">About</p>
        <h1>What is L2G?</h1>
      </section>

      <section className="prose" style={{ paddingBottom: "2rem" }}>
        <p>
          <strong>L2G — Literature&nbsp;to&nbsp;Gene</strong> is an open NLP
          pipeline that helps researchers turn biomedical literature into
          structured, gene-level evidence. It was originally developed in the
          context of the{" "}
          <a href="https://dkd-map.github.io" target="_blank" rel="noopener noreferrer">
            Diabetic Kidney Disease Map (DKDM)
          </a>{" "}
          project, but it is designed to work for{" "}
          <em>any disease domain</em> for which you can supply a small set of
          labeled abstracts.
        </p>

        <h3>Aim</h3>
        <p>
          A central challenge in systems-biology and disease-map projects is
          identifying the genes and proteins implicated in a disease from the
          rapidly growing primary literature. Manual curation does not scale;
          generic gene mentions in PubMed are far too noisy to use directly. L2G
          addresses this gap by combining two ideas:
        </p>
        <ul>
          <li>
            <strong>Domain-specific relevance.</strong> You fine-tune a binary
            relevance classifier on a small set of abstracts <em>you</em>{" "}
            have labeled (1 = relevant to your disease/study, 0 = not relevant).
            The classifier learns what counts as “relevant” for your project,
            not a generic biomedical notion.
          </li>
          <li>
            <strong>Gene/protein extraction and normalization.</strong>{" "}
            Relevant abstracts are passed through biomedical named-entity
            recognition and a normalization step that maps recognized strings
            to canonical gene symbols, ready for downstream network and pathway
            analyses.
          </li>
        </ul>

        <h3>Pipeline at a glance</h3>
        <ul>
          <li>
            <strong>Train</strong> — fine-tune a transformer-based relevance
            classifier on your labeled abstracts (CSV upload).
          </li>
          <li>
            <strong>Extract</strong> — run gene / protein NER on the abstracts
            classified as relevant.
          </li>
          <li>
            <strong>Normalize</strong> — map extracted mentions to canonical
            gene symbols.
          </li>
          <li>
            <strong>Review</strong> — inspect per-job logs, metrics and outputs
            in the Jobs centre, and download the resulting gene table.
          </li>
        </ul>

        <h3>For whom?</h3>
        <p>
          L2G is built for biomedical researchers, systems-biology groups,
          curators of disease maps, and anyone who wants a reproducible,
          self-hostable way to mine the literature for a specific condition. It
          runs locally with Docker, on Apple Silicon via Metal, on CUDA GPUs,
          or fully from a free Google Colab notebook (an{" "}
          <code className="mono">ngrok</code> tunnel exposes the Colab backend
          to this web UI).
        </p>

        <h3>Relationship to DKDM</h3>
        <p>
          L2G was first developed as the literature-mining component of the
          DKDM resource (831 high-confidence biomolecules mapped onto 24 renal
          cell types). It has since been generalized into a stand-alone tool so
          that any group can apply the same methodology to a different disease
          context — pick a disease, label a few hundred abstracts, and L2G will
          do the rest.
        </p>

        <div className="callout">
          <strong>Open and reproducible.</strong> All code is published under
          the <a href="https://github.com/Lit2G" target="_blank" rel="noopener noreferrer">Lit2G</a>{" "}
          organisation on GitHub. The pipeline is implemented as a small{" "}
          <code className="mono">l2g_core</code> Python library, a FastAPI
          backend, and this React front-end — each component can be reused
          independently.
        </div>

        <h3>Citing L2G</h3>
        <p>
          A manuscript describing L2G is in preparation. Until it appears,
          please cite the project as: <em>L2G — Literature&nbsp;to&nbsp;Gene,
          Regenerative Medicine Research Centre, Isfahan University of Medical
          Sciences (2026).</em>
        </p>

        <div className="tag-row" style={{ marginTop: "1.4rem" }}>
          <Link className="btn btn-primary btn-sm" to="/projects">
            Try L2G → open Workspace
          </Link>
          <Link className="btn btn-ghost btn-sm" to="/team">
            Meet the team
          </Link>
          <a
            className="btn btn-ghost btn-sm"
            href="https://github.com/Lit2G"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub ↗
          </a>
        </div>
      </section>
    </>
  );
}
