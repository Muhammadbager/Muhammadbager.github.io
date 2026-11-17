import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  Github,
  Linkedin,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { experience, profile, projects, skills } from "./portfolio-data";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import type { Application, JobMatch } from "./types";

const stageOrder = [
  "Applied",
  "Online Assessment",
  "Recruiter Screen",
  "Technical Interview",
  "Final Interview",
  "Offer",
];

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route.startsWith("#dashboard") ? <Dashboard /> : <Portfolio />;
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Home">
          <span>MA</span>
          <strong>Muhammadbager Al-Ali</strong>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="nav-resume" href={profile.resume} download>
            Resume <Download size={15} />
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-kicker reveal">
            <span className="status-dot" /> Available for entry-level roles
          </div>
          <h1 className="reveal reveal-delay-1">
            Software that makes
            <span> complex systems useful.</span>
          </h1>
          <div className="hero-bottom reveal reveal-delay-2">
            <p>
              I’m Muhammadbager, a Seattle-based software engineer building
              dependable backend systems, thoughtful product experiences, and
              applied AI tools.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#projects">
                Explore my work <ArrowDownRight size={18} />
              </a>
              <a className="text-link" href={`mailto:${profile.email}`}>
                Start a conversation <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="hero-grid reveal reveal-delay-3">
            <div>
              <span>Education</span>
              <strong>UW Computer Science</strong>
            </div>
            <div>
              <span>Graduated</span>
              <strong>June 2026</strong>
            </div>
            <div>
              <span>Based in</span>
              <strong>Greater Seattle</strong>
            </div>
            <div>
              <span>Focus</span>
              <strong>Backend + full-stack</strong>
            </div>
          </div>
        </section>

        <section className="statement section-pad" aria-label="Professional statement">
          <p className="eyebrow">How I work</p>
          <p className="statement-copy">
            I like the point where <em>systems thinking</em> meets product
            judgment—turning APIs, data, and models into software people can
            actually rely on.
          </p>
        </section>

        <section id="experience" className="section-pad split-section">
          <div className="section-heading">
            <p className="eyebrow">01 / Experience</p>
            <h2>Building across the stack.</h2>
          </div>
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item" key={`${item.role}-${item.period}`}>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="organization">{item.organization}</p>
                  <p className="timeline-summary">{item.summary}</p>
                  <ul>
                    {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="projects-section section-pad">
          <div className="section-heading projects-heading">
            <div>
              <p className="eyebrow">02 / Selected work</p>
              <h2>Projects with a point of view.</h2>
            </div>
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
              All repositories <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <span className="project-index">{project.index}</span>
                <div className="project-main">
                  <p className="project-type">{project.type}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul className="tool-list">
                    {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                  {project.links.length > 0 && (
                    <div className="project-links" aria-label={`${project.title} links`}>
                      {project.links.map((link) => (
                        <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                          {link.label} <ArrowUpRight size={14} />
                        </a>
                      ))}
                    </div>
                  )}
                  {"availability" in project && project.availability && (
                    <p className="project-availability">{project.availability}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="skills-section section-pad">
          <div className="section-heading">
            <p className="eyebrow">03 / Toolkit</p>
            <h2>Technologies I use to ship.</h2>
          </div>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <span key={skill}><small>{String(index + 1).padStart(2, "0")}</small>{skill}</span>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section section-pad">
          <p className="eyebrow">04 / Let’s talk</p>
          <h2>Looking for an engineer who can move between systems and product?</h2>
          <p>
            I’m pursuing entry-level software engineering opportunities in the
            Greater Seattle area.
          </p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-pad">
        <p>© 2026 Muhammadbager Al-Ali</p>
        <a href="#dashboard"><LockKeyhole size={14} /> Owner dashboard</a>
      </footer>
    </div>
  );
}

function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(profile.email);
  const [message, setMessage] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) return;
    void Promise.all([
      supabase.from("applications").select("*").order("updated_at", { ascending: false }),
      supabase.from("job_matches").select("*").order("discovered_at", { ascending: false }).limit(12),
    ]).then(([applicationResult, matchResult]) => {
      if (applicationResult.data) setApplications(applicationResult.data as Application[]);
      if (matchResult.data) setMatches(matchResult.data as JobMatch[]);
    });
  }, [session]);

  const chartData = useMemo(
    () => stageOrder.map((stage) => ({
      stage: stage.replace(" Interview", ""),
      count: applications.filter((application) => application.stage === stage).length,
    })),
    [applications],
  );

  const activeCount = applications.filter(
    (application) => !["Rejected", "Withdrawn", "Position Closed", "Accepted"].includes(application.stage),
  ).length;
  const interviewCount = applications.filter((application) =>
    ["Recruiter Screen", "Technical Interview", "Final Interview"].includes(application.stage),
  ).length;

  async function sendMagicLink(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setMessage("Sending secure sign-in link…");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}#dashboard` },
    });
    setMessage(error ? error.message : "Check your email for the secure sign-in link.");
  }

  if (loading) return <div className="dashboard-loading">Loading dashboard…</div>;

  if (!isSupabaseConfigured) {
    return (
      <DashboardFrame>
        <div className="setup-state">
          <LockKeyhole size={30} />
          <p className="eyebrow">Private workspace</p>
          <h1>Dashboard connection pending</h1>
          <p>
            The public portfolio is ready to run. The private dashboard will
            activate after its secure database and sign-in settings are connected.
          </p>
          <a className="primary-button" href="#top">Return to portfolio</a>
        </div>
      </DashboardFrame>
    );
  }

  if (!session) {
    return (
      <DashboardFrame>
        <div className="login-card">
          <LockKeyhole size={28} />
          <p className="eyebrow">Owner access</p>
          <h1>Sign in to your career dashboard</h1>
          <p>A one-time link will be sent to your authorized email address.</p>
          <form onSubmit={sendMagicLink}>
            <label htmlFor="dashboard-email">Email address</label>
            <input
              id="dashboard-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="primary-button" type="submit">Send secure link</button>
          </form>
          {message && <p className="form-message" aria-live="polite">{message}</p>}
        </div>
      </DashboardFrame>
    );
  }

  return (
    <DashboardFrame userEmail={session.user.email} onSignOut={() => void supabase?.auth.signOut()}>
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Career command center</p>
          <h1>Applications at a glance</h1>
        </div>
        <div className="dashboard-location"><MapPin size={16} /> Greater Seattle only</div>
      </div>
      <section className="metric-grid" aria-label="Application summary">
        <Metric label="Total applications" value={applications.length} />
        <Metric label="Active" value={activeCount} />
        <Metric label="Interviews" value={interviewCount} />
        <Metric label="New matches" value={matches.length} />
      </section>
      <section className="dashboard-grid">
        <article className="dashboard-panel chart-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Pipeline</p><h2>Current stage</h2></div>
          </div>
          {applications.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dfd8d0" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f2ece5" }} />
                <Bar dataKey="count" fill="#ad667d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState text="Application stages will appear after the tracker import." />}
        </article>
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Discovery</p><h2>Recent matches</h2></div>
            <span>8 AM / 8 PM PT</span>
          </div>
          {matches.length ? (
            <div className="match-list">
              {matches.map((match) => (
                <a href={match.url} target="_blank" rel="noreferrer" key={match.id}>
                  <div><strong>{match.title}</strong><span>{match.company} · {match.location ?? "Location pending"}</span></div>
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </div>
          ) : <EmptyState text="New Greater Seattle matches will appear here." />}
        </article>
      </section>
      <section className="dashboard-panel applications-panel">
        <div className="panel-heading">
          <div><p className="eyebrow">Tracker</p><h2>Applications</h2></div>
          <span>{applications.length} records</span>
        </div>
        {applications.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Company</th><th>Role</th><th>Stage</th><th>Applied</th><th>Next action</th></tr></thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.company}</td>
                    <td>{application.job_url ? <a href={application.job_url} target="_blank" rel="noreferrer">{application.job_title}</a> : application.job_title}</td>
                    <td><span className="stage-pill">{application.stage}</span></td>
                    <td>{application.applied_date ?? "—"}</td>
                    <td>{application.next_action ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState text="Your imported applications will appear here." />}
      </section>
    </DashboardFrame>
  );
}

function DashboardFrame({ children, userEmail, onSignOut }: {
  children: React.ReactNode;
  userEmail?: string;
  onSignOut?: () => void;
}) {
  return (
    <div className="dashboard-shell">
      <header className="dashboard-nav">
        <a className="wordmark" href="#top"><span>MA</span><strong>Career deck</strong></a>
        <div>
          {userEmail && <small>{userEmail}</small>}
          {onSignOut && <button type="button" onClick={onSignOut}><LogOut size={15} /> Sign out</button>}
          <a href="#top">Public portfolio</a>
        </div>
      </header>
      <main className="dashboard-content">{children}</main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong></article>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state"><BriefcaseBusiness size={24} /><p>{text}</p></div>;
}

export default App;

