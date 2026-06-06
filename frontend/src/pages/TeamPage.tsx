import yousof from "../assets/team/yousof-gheisari.jpg";
import farnoush from "../assets/team/farnoush-kiyanpour.jpg";
import mahdi from "../assets/team/mahdi-kalani.jpg";
import amir from "../assets/team/amir-sepehr-saffari.png";
import fatemeh from "../assets/team/fatemeh-moieni.jpg";

type Member = {
  photo: string;
  name: string;
  role: string;
  pi?: boolean;
  affiliation: string;
};

const pi: Member = {
  photo: yousof,
  name: "Yousof Gheisari",
  role: "MD, PhD",
  pi: true,
  affiliation:
    "Regenerative Medicine Research Center, Isfahan University of Medical Sciences, Isfahan, Iran",
};

const core: Member[] = [
  {
    photo: farnoush,
    name: "Farnoush Kiyanpour",
    role: "PhD",
    affiliation:
      "Department of Advanced Medical Technology & Regenerative Medicine Research Center, Isfahan University of Medical Sciences, Isfahan, Iran",
  },
  {
    photo: mahdi,
    name: "Mahdi Kalani",
    role: "MD",
    affiliation:
      "Regenerative Medicine Research Center, Isfahan University of Medical Sciences, Iran",
  },
];

const contributors: Member[] = [
  {
    photo: amir,
    name: "Amir Sepehr Saffari",
    role: "MD",
    affiliation:
      "Regenerative Medicine Research Center, Isfahan University of Medical Sciences, Iran",
  },
  {
    photo: fatemeh,
    name: "Fatemeh Moieni",
    role: "MSc",
    affiliation:
      "Regenerative Medicine Research Center, Isfahan University of Medical Sciences, Iran",
  },
];

function TeamCard({ m }: { m: Member }) {
  return (
    <article className="team-card">
      <span className="photo">
        <img src={m.photo} alt={m.name} />
      </span>
      <div>
        <div className="name">{m.name}</div>
        <div className="role">
          <span>{m.role}</span>
          {m.pi && <span className="tag tag-pi">PI</span>}
        </div>
        <p className="aff">{m.affiliation}</p>
      </div>
    </article>
  );
}

export function TeamPage() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">About</p>
        <h1>Team</h1>
        <p className="muted" style={{ maxWidth: 760, marginTop: 4 }}>
          L2G is developed at the Regenerative Medicine Research Center,
          Isfahan University of Medical Sciences.
        </p>
      </section>

      <section style={{ paddingTop: 6, paddingBottom: 0 }}>
        <h2 className="team-section-title" style={{ marginTop: 8 }}>
          Principal Investigator &amp; Core Developers
        </h2>
        <div className="team-grid">
          <TeamCard m={pi} />
          {core.map((m) => (
            <TeamCard key={m.name} m={m} />
          ))}
        </div>

        <h2 className="team-section-title">Contributors</h2>
        <div className="team-grid">
          {contributors.map((m) => (
            <TeamCard key={m.name} m={m} />
          ))}
        </div>
      </section>
    </>
  );
}
