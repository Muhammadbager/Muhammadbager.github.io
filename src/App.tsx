import { Fragment, useEffect, useMemo, useState } from "react";
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
  Plus,
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
import type { Application, ApplicationStage, JobMatch } from "./types";

const applicationStages: ApplicationStage[] = [
  "Discovered",
  "Saved",
  "Ready",
  "Applied",
  "Online Assessment",
  "Recruiter Screen",
  "Technical Interview",
  "Final Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Position Closed",
  "Accepted",
];

const chartStages: ApplicationStage[] = [
  "Applied",
  "Online Assessment",
  "Recruiter Screen",
  "Technical Interview",
  "Final Interview",
  "Offer",
  "Rejected",
  "Accepted",
];

const applicationMethods = [
  "Company Website",
  "Job Board",
  "LinkedIn",
  "Email from Recruiter",
  "Referral",
  "Conference / Career Fair",
];

const jobSources = [
  "Simplify GitHub",
  "LILO Discord",
  "Company Website",
  "LinkedIn",
  "Google",
];

interface ApplicationDraft {
  company: string;
  job_title: string;
  job_url: string;
  location: string;
  listing_date: string;
  applied_date: string;
  stage: ApplicationStage;
  resume_name: string;
  application_method: string;
  source: string;
  next_action: string;
  notes: string;
}

const createApplicationDraft = (): ApplicationDraft => ({
  company: "",
  job_title: "",
  job_url: "",
  location: "Greater Seattle Area",
  listing_date: "",
  applied_date: new Date().toISOString().slice(0, 10),
  stage: "Applied",
  resume_name: "Muhammadbager_Al-Ali_Resume.pdf",
  application_method: "Job Board",
  source: "LinkedIn",
  next_action: "",
  notes: "",
});

function daysToApply(listingDate: string | null, appliedDate: string | null) {
  if (!listingDate || !appliedDate) return "—";
  const listed = Date.parse(`${listingDate}T00:00:00Z`);
  const applied = Date.parse(`${appliedDate}T00:00:00Z`);
  if (Number.isNaN(listed) || Number.isNaN(applied)) return "—";
  const days = Math.round((applied - listed) / 86_400_000);
  return `${days} ${Math.abs(days) === 1 ? "day" : "days"}`;
}

function App() {
  const isDashboardRoute = () =>
    window.location.hash.startsWith("#dashboard") ||
    new URLSearchParams(window.location.search).get("auth") === "dashboard";
  const [showDashboard, setShowDashboard] = useState(isDashboardRoute);

  useEffect(() => {
    const onLocationChange = () => setShowDashboard(isDashboardRoute());
    window.addEventListener("hashchange", onLocationChange);
    window.addEventListener("popstate", onLocationChange);
    return () => {
      window.removeEventListener("hashchange", onLocationChange);
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  return showDashboard ? <Dashboard /> : <Portfolio />;
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApplicationId, setEditingApplicationId] = useState<string | null>(null);
  const [editApplication, setEditApplication] = useState<ApplicationDraft | null>(null);
  const [savingApplicationId, setSavingApplicationId] = useState<string | null>(null);
  const [trackerMessage, setTrackerMessage] = useState("");
  const [newApplication, setNewApplication] = useState<ApplicationDraft>(createApplicationDraft);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const finishAuthCallback = () => {
      if (new URLSearchParams(window.location.search).get("auth") === "dashboard") {
        window.history.replaceState(null, "", `${window.location.pathname}#dashboard`);
      }
    };
    const callbackError = new URLSearchParams(window.location.hash.slice(1)).get("error_description");
    if (callbackError) setMessage(callbackError);

    void supabase.auth.getSession().then(({ data, error }) => {
      setSession(data.session);
      if (error) setMessage(error.message);
      if (data.session) finishAuthCallback();
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) finishAuthCallback();
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
    () => chartStages.map((stage) => ({
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
    if (email.trim().toLowerCase() !== profile.email.toLowerCase()) {
      setMessage("This dashboard is restricted to the owner email address.");
      return;
    }
    setMessage("Sending secure sign-in link…");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}?auth=dashboard`,
      },
    });
    setMessage(error ? error.message : "Check your email for the secure sign-in link.");
  }

  async function addApplication(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !session) return;
    setSavingApplicationId("new");
    setTrackerMessage("");
    const payload = {
      owner_id: session.user.id,
      company: newApplication.company.trim(),
      job_title: newApplication.job_title.trim(),
      job_url: newApplication.job_url.trim() || null,
      location: newApplication.location.trim() || null,
      listing_date: newApplication.listing_date || null,
      applied_date: newApplication.applied_date || null,
      stage: newApplication.stage,
      source: newApplication.source || null,
      application_method: newApplication.application_method || null,
      resume_name: newApplication.resume_name.trim() || null,
      next_action: newApplication.next_action.trim() || null,
      notes: newApplication.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("applications")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) {
      setTrackerMessage(error?.message ?? "The application could not be saved.");
      setSavingApplicationId(null);
      return;
    }

    await supabase.from("stage_history").insert({
      owner_id: session.user.id,
      application_id: data.id,
      stage: data.stage,
    });
    setApplications((current) => [data as Application, ...current]);
    setNewApplication(createApplicationDraft());
    setShowAddForm(false);
    setSavingApplicationId(null);
    setTrackerMessage("Application added.");
  }

  async function updateApplicationStage(application: Application, stage: ApplicationStage) {
    if (!supabase || !session || stage === application.stage) return;
    setSavingApplicationId(application.id);
    setTrackerMessage("");
    const updatedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("applications")
      .update({ stage, updated_at: updatedAt })
      .eq("id", application.id)
      .select("*")
      .single();

    if (error || !data) {
      setTrackerMessage(error?.message ?? "The stage could not be updated.");
      setSavingApplicationId(null);
      return;
    }

    await supabase.from("stage_history").insert({
      owner_id: session.user.id,
      application_id: application.id,
      stage,
    });
    setApplications((current) => current.map((item) => (
      item.id === application.id ? data as Application : item
    )));
    setSavingApplicationId(null);
    setTrackerMessage(`${application.company} moved to ${stage}.`);
  }

  function beginEditingApplication(application: Application) {
    if (editingApplicationId === application.id) {
      setEditingApplicationId(null);
      setEditApplication(null);
      return;
    }
    setEditingApplicationId(application.id);
    setEditApplication({
      company: application.company,
      job_title: application.job_title,
      job_url: application.job_url ?? "",
      location: application.location ?? "",
      listing_date: application.listing_date ?? "",
      applied_date: application.applied_date ?? "",
      stage: application.stage,
      resume_name: application.resume_name ?? "",
      application_method: application.application_method ?? "",
      source: application.source ?? "",
      next_action: application.next_action ?? "",
      notes: application.notes ?? "",
    });
  }

  async function saveApplicationDetails(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !editingApplicationId || !editApplication) return;
    setSavingApplicationId(editingApplicationId);
    setTrackerMessage("");
    const { data, error } = await supabase
      .from("applications")
      .update({
        company: editApplication.company.trim(),
        job_title: editApplication.job_title.trim(),
        job_url: editApplication.job_url.trim() || null,
        location: editApplication.location.trim() || null,
        listing_date: editApplication.listing_date || null,
        applied_date: editApplication.applied_date || null,
        resume_name: editApplication.resume_name.trim() || null,
        application_method: editApplication.application_method || null,
        source: editApplication.source || null,
        next_action: editApplication.next_action.trim() || null,
        notes: editApplication.notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingApplicationId)
      .select("*")
      .single();

    if (error || !data) {
      setTrackerMessage(error?.message ?? "The application details could not be saved.");
      setSavingApplicationId(null);
      return;
    }

    setApplications((current) => current.map((item) => (
      item.id === editingApplicationId ? data as Application : item
    )));
    setEditingApplicationId(null);
    setEditApplication(null);
    setSavingApplicationId(null);
    setTrackerMessage(`${data.company} details saved.`);
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
          <div className="panel-heading-actions">
            <span>{applications.length} records</span>
            <button className="secondary-button" type="button" onClick={() => setShowAddForm((value) => !value)}>
              {showAddForm ? <X size={15} /> : <Plus size={15} />}
              {showAddForm ? "Close" : "Add application"}
            </button>
          </div>
        </div>
        {showAddForm && (
          <form className="application-form" onSubmit={addApplication}>
            <label>
              Company
              <input required value={newApplication.company} onChange={(event) => setNewApplication((value) => ({ ...value, company: event.target.value }))} />
            </label>
            <label>
              Job title
              <input required value={newApplication.job_title} onChange={(event) => setNewApplication((value) => ({ ...value, job_title: event.target.value }))} />
            </label>
            <label className="form-span-2">
              Job URL
              <input type="url" value={newApplication.job_url} onChange={(event) => setNewApplication((value) => ({ ...value, job_url: event.target.value }))} />
            </label>
            <label>
              Location
              <input value={newApplication.location} onChange={(event) => setNewApplication((value) => ({ ...value, location: event.target.value }))} />
            </label>
            <label>
              Date published
              <input type="date" value={newApplication.listing_date} onChange={(event) => setNewApplication((value) => ({ ...value, listing_date: event.target.value }))} />
            </label>
            <label>
              Date applied
              <input type="date" value={newApplication.applied_date} onChange={(event) => setNewApplication((value) => ({ ...value, applied_date: event.target.value }))} />
            </label>
            <label>
              Stage
              <select value={newApplication.stage} onChange={(event) => setNewApplication((value) => ({ ...value, stage: event.target.value as ApplicationStage }))}>
                {applicationStages.map((stage) => <option value={stage} key={stage}>{stage}</option>)}
              </select>
            </label>
            <label>
              Resume used
              <input list="resume-options" value={newApplication.resume_name} onChange={(event) => setNewApplication((value) => ({ ...value, resume_name: event.target.value }))} />
            </label>
            <label>
              Application method
              <select value={newApplication.application_method} onChange={(event) => setNewApplication((value) => ({ ...value, application_method: event.target.value }))}>
                <option value="">Not recorded</option>
                {applicationMethods.map((method) => <option value={method} key={method}>{method}</option>)}
              </select>
            </label>
            <label>
              Where job was found
              <select value={newApplication.source} onChange={(event) => setNewApplication((value) => ({ ...value, source: event.target.value }))}>
                <option value="">Not recorded</option>
                {jobSources.map((source) => <option value={source} key={source}>{source}</option>)}
              </select>
            </label>
            <label>
              Next action
              <input value={newApplication.next_action} onChange={(event) => setNewApplication((value) => ({ ...value, next_action: event.target.value }))} placeholder="Follow up, prepare for OA…" />
            </label>
            <label className="form-span-2">
              Additional notes
              <textarea rows={3} value={newApplication.notes} onChange={(event) => setNewApplication((value) => ({ ...value, notes: event.target.value }))} />
            </label>
            <button className="primary-button application-submit" type="submit" disabled={savingApplicationId === "new"}>
              {savingApplicationId === "new" ? "Saving…" : "Save application"}
            </button>
            <datalist id="resume-options">
              <option value="Muhammadbager_Al-Ali_Resume.pdf" />
              <option value="Muhammad_s_Resume-2.pdf" />
              <option value="Custom resume" />
            </datalist>
          </form>
        )}
        {trackerMessage && <p className="tracker-message" aria-live="polite">{trackerMessage}</p>}
        {applications.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Company</th><th>Role</th><th>Stage</th><th>Published</th><th>Applied</th><th>Days to apply</th><th>Method</th><th>Found via</th><th>Next action</th><th>Details</th></tr></thead>
              <tbody>
                {applications.map((application) => (
                  <Fragment key={application.id}>
                    <tr>
                      <td>{application.company}</td>
                      <td>{application.job_url ? <a href={application.job_url} target="_blank" rel="noreferrer">{application.job_title}</a> : application.job_title}</td>
                      <td>
                        <select
                          className="stage-select"
                          value={application.stage}
                          disabled={savingApplicationId === application.id}
                          aria-label={`Stage for ${application.company} ${application.job_title}`}
                          onChange={(event) => void updateApplicationStage(application, event.target.value as ApplicationStage)}
                        >
                          {applicationStages.map((stage) => <option value={stage} key={stage}>{stage}</option>)}
                        </select>
                      </td>
                      <td>{application.listing_date ?? "—"}</td>
                      <td>{application.applied_date ?? "—"}</td>
                      <td>{daysToApply(application.listing_date, application.applied_date)}</td>
                      <td>{application.application_method ?? "—"}</td>
                      <td>{application.source ?? "—"}</td>
                      <td>{application.next_action ?? "—"}</td>
                      <td><button className="table-action" type="button" onClick={() => beginEditingApplication(application)}>{editingApplicationId === application.id ? "Close" : "Edit"}</button></td>
                    </tr>
                    {editingApplicationId === application.id && editApplication && (
                      <tr className="application-edit-row">
                        <td colSpan={10}>
                          <form className="application-form" onSubmit={saveApplicationDetails}>
                            <label>Company<input required value={editApplication.company} onChange={(event) => setEditApplication((value) => value && ({ ...value, company: event.target.value }))} /></label>
                            <label>Job title<input required value={editApplication.job_title} onChange={(event) => setEditApplication((value) => value && ({ ...value, job_title: event.target.value }))} /></label>
                            <label className="form-span-2">Job URL<input type="url" value={editApplication.job_url} onChange={(event) => setEditApplication((value) => value && ({ ...value, job_url: event.target.value }))} /></label>
                            <label>Location<input value={editApplication.location} onChange={(event) => setEditApplication((value) => value && ({ ...value, location: event.target.value }))} /></label>
                            <label>Date published<input type="date" value={editApplication.listing_date} onChange={(event) => setEditApplication((value) => value && ({ ...value, listing_date: event.target.value }))} /></label>
                            <label>Date applied<input type="date" value={editApplication.applied_date} onChange={(event) => setEditApplication((value) => value && ({ ...value, applied_date: event.target.value }))} /></label>
                            <label>Resume used<input list="edit-resume-options" value={editApplication.resume_name} onChange={(event) => setEditApplication((value) => value && ({ ...value, resume_name: event.target.value }))} /></label>
                            <label>Application method<select value={editApplication.application_method} onChange={(event) => setEditApplication((value) => value && ({ ...value, application_method: event.target.value }))}><option value="">Not recorded</option>{applicationMethods.map((method) => <option value={method} key={method}>{method}</option>)}</select></label>
                            <label>Where job was found<select value={editApplication.source} onChange={(event) => setEditApplication((value) => value && ({ ...value, source: event.target.value }))}><option value="">Not recorded</option>{jobSources.map((source) => <option value={source} key={source}>{source}</option>)}</select></label>
                            <label>Next action<input value={editApplication.next_action} onChange={(event) => setEditApplication((value) => value && ({ ...value, next_action: event.target.value }))} /></label>
                            <label className="form-span-2">Additional notes<textarea rows={3} value={editApplication.notes} onChange={(event) => setEditApplication((value) => value && ({ ...value, notes: event.target.value }))} /></label>
                            <div className="form-actions form-span-2">
                              <button className="primary-button" type="submit" disabled={savingApplicationId === application.id}>{savingApplicationId === application.id ? "Saving…" : "Save details"}</button>
                              <button className="secondary-button" type="button" onClick={() => beginEditingApplication(application)}>Cancel</button>
                            </div>
                            <datalist id="edit-resume-options"><option value="Muhammadbager_Al-Ali_Resume.pdf" /><option value="Muhammad_s_Resume-2.pdf" /><option value="Custom resume" /></datalist>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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

