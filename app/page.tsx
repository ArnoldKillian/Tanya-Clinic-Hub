"use client";

import { useEffect, useMemo, useState } from "react";

const tools = [
  { name: "TELUS CHR", note: "Patient charts & tasks", url: "https://app.inputhealth.com/", color: "#5b4ae8", icon: "✚" },
  { name: "Outlook", note: "Clinic email", url: "https://outlook.office.com/mail/", color: "#1473e6", icon: "✉" },
  { name: "Teams", note: "Messages & meetings", url: "https://teams.microsoft.com/v2/", color: "#6857d8", icon: "T" },
  { name: "GoHighLevel", note: "Leads & follow-up", url: "https://app.gohighlevel.com/", color: "#ef6a4b", icon: "↗" },
];

const tasks = [
  { id: "tabs", time: "MORNING", title: "Open your clinic tabs", detail: "TELUS CHR, Outlook, Teams and GoHighLevel", action: "Open all tabs" },
  { id: "chr", time: "MIDDAY", title: "Finish your CHR tasks", detail: "Clear today’s assigned and outstanding items", action: "Open TELUS CHR" },
  { id: "calls", time: "MIDDAY", title: "Check missed calls", detail: "Return calls and record the follow-up", action: "Open GoHighLevel" },
];

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const saved = localStorage.getItem(`tanya-hub-${new Date().toDateString()}`);
    if (saved) setDone(JSON.parse(saved));
    setNotifications(Notification.permission === "granted");
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!now) return;
    localStorage.setItem(`tanya-hub-${now.toDateString()}`, JSON.stringify(done));
  }, [done, now]);

  useEffect(() => {
    if (!notifications || !now) return;
    const hour = now.getHours();
    const key = `tanya-notified-${now.toDateString()}-${hour < 11 ? "morning" : "midday"}`;
    if (localStorage.getItem(key)) return;
    if (hour >= 7 && hour < 11 && !done.includes("tabs")) {
      new Notification("Good morning, Tanya", { body: "Open TELUS CHR, Outlook, Teams and GoHighLevel." });
      localStorage.setItem(key, "yes");
    } else if (hour >= 12 && hour < 16 && (!done.includes("chr") || !done.includes("calls"))) {
      new Notification("Tanya’s midday check-in", { body: "Finish CHR tasks and follow up on missed calls." });
      localStorage.setItem(key, "yes");
    }
  }, [now, notifications, done]);

  const greeting = !now ? "Welcome" : now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const date = now ? new Intl.DateTimeFormat("en-CA", { weekday: "long", month: "long", day: "numeric" }).format(now) : "Today";
  const focus = useMemo(() => !now || now.getHours() < 12 ? tasks[0] : tasks.find(t => !done.includes(t.id)) ?? tasks[1], [now, done]);

  function complete(id: string) {
    setDone((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function openAll() {
    tools.forEach((tool) => window.open(tool.url, "_blank", "noopener,noreferrer"));
    if (!done.includes("tabs")) complete("tabs");
  }

  function runTask(id: string) {
    if (id === "tabs") return openAll();
    window.open(id === "chr" ? tools[0].url : tools[3].url, "_blank", "noopener,noreferrer");
  }

  async function enableNotifications() {
    const result = await Notification.requestPermission();
    setNotifications(result === "granted");
  }

  return (
    <main className="hub-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <section className="phone" aria-label="Tanya's clinic hub">
        <header className="topbar">
          <div className="brand-mark"><span>m</span></div>
          <div className="brand-copy"><strong>THE MENOPAUSE CLINIC</strong><span>STAFF HUB</span></div>
          <button className={`notify ${notifications ? "enabled" : ""}`} onClick={enableNotifications} aria-label="Enable reminders">{notifications ? "●" : "○"}</button>
        </header>
        <section className="welcome"><p>{date.toUpperCase()}</p><h1>{greeting}, <em>Tanya.</em></h1><span>Everything you need for a smooth clinic day.</span></section>
        <section className="focus-card">
          <div className="focus-label"><span>✦</span> TODAY’S FOCUS</div><h2>{focus.title}</h2><p>{focus.detail}</p>
          <button onClick={() => runTask(focus.id)}>{focus.action}<span>→</span></button>
        </section>
        <section className="section-block">
          <div className="section-title"><h2>Your clinic apps</h2><button onClick={openAll}>Open all</button></div>
          <div className="app-grid">{tools.map((tool) => <a href={tool.url} target="_blank" rel="noreferrer" className="app-card" key={tool.name}><span className="app-icon" style={{ background: tool.color }}>{tool.icon}</span><strong>{tool.name}</strong><small>{tool.note}</small><i>↗</i></a>)}</div>
          <article className="scanner-card">
            <div className="scanner-copy"><span className="scanner-icon">▤</span><div><strong>1 or 2 sided scanning</strong><small>Open the scanner controls on this iMac</small></div></div>
            <a className="scanner-button" href="http://10.11.12.4" target="_blank" rel="noreferrer">Open scanner <span>→</span></a>
            <p className="scanner-pin">PIN <strong>71276912</strong></p>
            <details className="scan-help">
              <summary>Steps</summary>
              <div className="steps-popover" role="tooltip">
                <strong>Scanner setup</strong>
                <ol>
                  <li>PIN: <b>71276912</b></li>
                  <li>When the computer says “unsecure,” click <b>Advanced</b>, then select <b>Open anyway</b>.</li>
                  <li>On the left, find <b>Quick Sets</b>.</li>
                  <li>Check the box next to <b>Front desk Scans</b>.</li>
                  <li>Click <b>Edit</b>.</li>
                  <li>On screen 1, click <b>Next</b>.</li>
                  <li>On screen 2, click <b>Next</b>.</li>
                  <li>On screen 3, select <b>1 or 2 sided</b>.</li>
                  <li>Click <b>Finish</b>.</li>
                </ol>
              </div>
            </details>
          </article>
        </section>
        <section className="section-block routine">
          <div className="section-title"><h2>Daily rhythm</h2><span>{done.length}/{tasks.length} done</span></div>
          <div className="task-list">{tasks.map((task) => <article className={done.includes(task.id) ? "task done" : "task"} key={task.id}>
            <button className="check" onClick={() => complete(task.id)} aria-label={`Mark ${task.title} ${done.includes(task.id) ? "incomplete" : "complete"}`}>{done.includes(task.id) ? "✓" : ""}</button>
            <div><small>{task.time}</small><strong>{task.title}</strong><span>{task.detail}</span></div><button className="task-open" onClick={() => runTask(task.id)}>→</button>
          </article>)}</div>
        </section>
        <footer><span>{now ? `Clinic day · ${new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit" }).format(now)}` : "Clinic day"}</span><span className="secure">● Secure workspace</span></footer>
      </section>
    </main>
  );
}
