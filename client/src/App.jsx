import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, LayoutDashboard, Plus, BookMarked, ChartNoAxesCombined, UserRound,
  LogOut, Search, Bell, ChevronDown, ArrowRight, Code2, FlaskConical, BrainCircuit,
  Cloud, ShieldCheck, Sparkles, Pencil, Trash2, X, Check, CalendarDays,
  CircleCheck, Clock3, Target, Menu, Eye, EyeOff, LockKeyhole, Mail, User,
  LoaderCircle, GraduationCap
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CATEGORIES = [
  { name: "Mathematics", desc: "Assignments, practice and revision.", icon: FlaskConical, color: "blue" },
  { name: "Computer Science", desc: "Programming, labs and projects.", icon: Code2, color: "green" },
  { name: "Physics", desc: "Concepts, numericals and notes.", icon: BrainCircuit, color: "purple" },
  { name: "Chemistry", desc: "Theory, reactions and revision.", icon: Cloud, color: "orange" },
  { name: "Exam Preparation", desc: "Plan revision and practice tests.", icon: ShieldCheck, color: "red" },
  { name: "Other", desc: "Add any subject or student task.", icon: Sparkles, color: "slate" },
];
const defaultTopics = [
  { _id:"demo1", name:"Complete algebra worksheet", category:"Mathematics", description:"Finish exercises 1–15 and review mistakes.", progress:65 },
  { _id:"demo2", name:"Revise data structures", category:"Mathematics", description:"Review stacks, queues and linked lists.", progress:40 },
  { _id:"demo3", name:"Prepare chemistry notes", category:"Chemistry", description:"Summarize the chapter for the next test.", progress:100 },
];
const initialForm = { name:"", description:"", category:"Mathematics", targetDate:"", progress:0 };

async function apiFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Cannot reach the FLEXI API. Check that the backend is running and its URL is correct.");
    }
    throw error;
  }
}
async function api(path, { token, ...options } = {}) {
  const res = await apiFetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type":"application/json", ...(token ? { Authorization:`Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("The FLEXI API returned an invalid response.");
  }
  if (!res.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}
function Brand({ light=false }) {
  return <div className={`brand ${light ? "brand-light" : ""}`}><span className="brand-mark"><BookOpen size={21}/></span><span>FLEXI</span></div>;
}
function Button({ children, variant="primary", className="", block=false, ...props }) {
  return <button className={`btn btn-${variant} ${block?"block":""} ${className}`} {...props}>{children}</button>;
}
function AuthShell({ children, mode }) {
  return <main className="auth-layout">
    <section className="auth-hero">
      <Brand light />
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> STUDENT TASK & STUDY PLANNER</span>
        <h1>Small steps.<br/><span>Big progress.</span></h1>
        <p>Keep assignments, study sessions, and exam preparation organized. Plan your week, meet deadlines, and track your progress.</p>
        <div className="hero-points"><div><span className="point-icon"><Target size={18}/></span><div><b>Plan your study time</b><small>Break schoolwork into manageable tasks.</small></div></div><div><span className="point-icon"><ChartNoAxesCombined size={18}/></span><div><b>Stay on top of deadlines</b><small>See what is done and what needs attention.</small></div></div></div>
      </div>
      <div className="hero-bottom"><span>PLAN · LEARN · ACHIEVE</span><span>MADE FOR YOUR NEXT CHAPTER ↗</span></div>
      <div className="orb orb-one"/><div className="orb orb-two"/>
    </section>
    <section className="auth-main"><div className="mobile-brand"><Brand/></div><div className="auth-card">{children}<p className="auth-foot">By continuing, you agree to use FLEXI as your personal learning space.</p></div><div className="auth-bottom">© 2026 FLEXI <span>Built around your goals</span></div></section>
  </main>;
}
function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", focus:"Mathematics" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (k,v) => setForm(f=>({...f,[k]:v}));
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const data = await api(`/auth/${mode === "login" ? "login" : "signup"}`, { method:"POST", body:JSON.stringify(form) });
      onAuth(data);
    } catch(err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <AuthShell mode={mode}><div className="auth-heading"><span className="welcome-icon"><GraduationCap size={22}/></span><div className="eyebrow">WELCOME TO FLEXI</div><h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2><p>{mode === "login" ? "Your study plan is ready when you are." : "Organize your workload and make time to revise."}</p></div>
    <div className="auth-tabs"><button className={mode==="login"?"active":""} onClick={()=>{setMode("login");setError("")}}>Log in</button><button className={mode==="signup"?"active":""} onClick={()=>{setMode("signup");setError("")}}>Sign up</button></div>
    <form onSubmit={submit} className="auth-form">
      {mode==="signup" && <label>Full name<div className="input-wrap"><User size={17}/><input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="What should we call you?"/></div></label>}
      <label>Email address<div className="input-wrap"><Mail size={17}/><input required type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com" autoComplete="email"/></div></label>
      <label>Password<div className="input-wrap"><LockKeyhole size={17}/><input required minLength={mode==="signup"?8:1} type={showPassword?"text":"password"} value={form.password} onChange={e=>update("password",e.target.value)} placeholder={mode==="signup"?"At least 8 characters":"Enter your password"} autoComplete={mode==="login"?"current-password":"new-password"}/><button type="button" className="icon-button" onClick={()=>setShowPassword(s=>!s)} aria-label="Toggle password visibility">{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
      {mode==="signup" && <label>Main subject<div className="select-wrap"><select value={form.focus} onChange={e=>update("focus",e.target.value)}>{CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}</select><ChevronDown size={16}/></div></label>}
      {error && <div className="error-message">{error}</div>}
      <Button type="submit" block disabled={busy}>{busy?<><LoaderCircle className="spin" size={17}/> Please wait…</>:mode==="login"?"Log in to FLEXI":"Create my account"}{!busy&&<ArrowRight size={17}/>}</Button>
    </form>
    <div className="auth-switch">{mode==="login"?"New to FLEXI?":"Already have an account?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("")}}>{mode==="login"?"Create an account":"Log in"}</button></div>
  </AuthShell>;
}
function AppShell({ user, page, setPage, logout, children }) {
  const [mobileNav,setMobileNav] = useState(false);
  const nav = [{id:"dashboard",label:"Overview",icon:LayoutDashboard},{id:"topics",label:"My tasks",icon:BookMarked},{id:"add",label:"Add a topic",icon:Plus},{id:"progress",label:"Progress",icon:ChartNoAxesCombined}];
  return <div className="app-layout">
    <aside className={`sidebar ${mobileNav?"sidebar-open":""}`}><div className="side-brand"><Brand/><button className="icon-button close-nav" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="side-label">WORKSPACE</div><nav>{nav.map(n=><button key={n.id} className={`nav-link ${page===n.id?"selected":""}`} onClick={()=>{setPage(n.id);setMobileNav(false)}}><n.icon size={18}/><span>{n.label}</span>{n.id==="add"&&<span className="nav-plus">+</span>}</button>)}</nav>
      <div className="sidebar-spacer"/><div className="weekly-card"><div className="weekly-icon"><Sparkles size={17}/></div><b>Keep your study streak going</b><p>Small study sessions add up. Keep moving toward your goals.</p><button onClick={()=>setPage("add")}>Add a study task <ArrowRight size={14}/></button></div>
      <div className="side-user"><div className="avatar">{(user?.name||"F").slice(0,1).toUpperCase()}</div><div className="side-user-info"><b>{user?.name||"Learner"}</b><span>Student study planner</span></div><button className="icon-button" onClick={logout} title="Log out"><LogOut size={17}/></button></div>
    </aside>
    {mobileNav&&<button className="nav-overlay" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-area"><header className="topbar"><div className="topbar-left"><button className="icon-button menu-toggle" onClick={()=>setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{nav.find(n=>n.id===page)?.label||({detail:"Topic details",edit:"Edit study task"}[page])||"Overview"}</b></div></div><div className="topbar-right"><span className="today-pill"><span/> Your learning space</span><div className="top-avatar">{(user?.name||"F").slice(0,1).toUpperCase()}</div></div></header>
      <div className="page-content">{children}</div><footer className="app-footer"><span>© 2026 FLEXI</span><span>Made for your next chapter <span className="footer-heart">✦</span></span></footer></main>
  </div>;
}
function PageTitle({ eyebrow, title, subtitle, action }) {
  return <div className="page-title-row"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}
function ProgressBar({ value=0, small=false }) {
  return <div className={`progress-track ${small?"progress-small":""}`}><span style={{width:`${value}%`}}/></div>;
}
function TopicCard({ topic, onEdit, onDelete, onOpen, onProgress }) {
  const completed = topic.progress >= 100;
  return <article className="topic-card"><button className={`topic-symbol ${categoryClass(topic.category)}`} onClick={()=>onOpen(topic)} aria-label={`Open ${topic.name}`}><CategoryIcon category={topic.category}/></button><div className="topic-main"><button className="topic-name" onClick={()=>onOpen(topic)}>{topic.name}</button><div className="topic-meta">{topic.category}</div>{topic.description&&<p className="topic-description">{topic.description}</p>}<div className="topic-progress-row"><ProgressBar value={topic.progress} small/><span>{topic.progress}%</span></div></div><div className="topic-side"><span className={`status status-${completed?"done":topic.progress>0?"active":"pending"}`}>{completed?"Completed":topic.progress>0?"In progress":"Not started"}</span><div className="topic-actions"><button className="icon-button" title="Edit study task" onClick={()=>onEdit(topic)}><Pencil size={15}/></button><button className="icon-button danger-icon" title="Delete topic" onClick={()=>onDelete(topic)}><Trash2 size={15}/></button></div></div><label className="quick-progress">Progress <select value={topic.progress} onChange={e=>onProgress(topic,Number(e.target.value))}>{[0,10,20,30,40,50,60,70,80,90,100].map(n=><option key={n} value={n}>{n}%</option>)}</select></label></article>;
}
function categoryClass(category="") { const c=category.toLowerCase(); if(c.includes("data")||c.includes("database"))return "green";if(c.includes("machine"))return "purple";if(c.includes("cloud"))return "orange";if(c.includes("security"))return "red";if(c==="other")return "slate";return "blue"; }
function CategoryIcon({category}) { const cls=categoryClass(category); const Icon=cls==="green"?FlaskConical:cls==="purple"?BrainCircuit:cls==="orange"?Cloud:cls==="red"?ShieldCheck:cls==="slate"?Sparkles:Code2;return <Icon size={20}/>; }
function Dashboard({ user, topics, setPage, onOpen, onEdit, onDelete, onProgress }) {
  const completed=topics.filter(t=>t.progress>=100).length, inProgress=topics.filter(t=>t.progress>0&&t.progress<100).length, pending=topics.filter(t=>t.progress===0).length;
  const average=topics.length?Math.round(topics.reduce((sum,t)=>sum+t.progress,0)/topics.length):0;
  const stats=[{label:"Total topics",value:topics.length,icon:BookMarked,tone:"blue"},{label:"Completed",value:completed,icon:CircleCheck,tone:"green"},{label:"In progress",value:inProgress,icon:Clock3,tone:"purple"},{label:"Not started",value:pending,icon:Target,tone:"orange"}];
  return <><div className="welcome-banner"><div className="welcome-copy"><span className="welcome-kicker"><Sparkles size={14}/> YOUR STUDY PLAN</span><h1>Hey {user?.name?.split(" ")[0]||"there"}, ready to study? <span>✦</span></h1><p>Every expert was once a beginner. Let's make today count.</p><div className="welcome-actions"><Button onClick={()=>setPage("add")}><Plus size={17}/> Add a topic</Button><button className="text-button" onClick={()=>setPage("topics")}>View all topics <ArrowRight size={15}/></button></div></div><div className="welcome-art"><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-book"><BookOpen size={53}/></div><div className="floating-badge badge-one"><Check size={14}/> One step at a time</div><div className="floating-badge badge-two"><Sparkles size={15}/> Keep going!</div></div></div>
    <div className="stats-grid">{stats.map(s=><div className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><s.icon size={19}/></div><div className="stat-info"><span>{s.label}</span><b>{s.value}</b></div><div className={`stat-accent ${s.tone}`}/></div>)}</div>
    <div className="section-heading"><div><div className="eyebrow">YOUR WORKSPACE</div><h2>Your study tasks</h2><p>Assignments, revision, and projects — all in one place.</p></div><button className="text-button" onClick={()=>setPage("topics")}>See all <ArrowRight size={15}/></button></div>
    {topics.length===0?<EmptyState onAdd={()=>setPage("add")}/>:<div className="topic-list">{topics.slice(0,4).map(t=><TopicCard key={t._id} topic={t} onEdit={onEdit} onDelete={onDelete} onOpen={onOpen} onProgress={onProgress}/>)}</div>}
    <div className="quote-strip"><div className="quote-mark">“</div><div><b>Consistency beats intensity.</b><p>You don't need to learn everything today. Just keep showing up.</p></div><div className="quote-progress"><span>Overall progress</span><b>{average}%</b><ProgressBar value={average}/></div></div>
  </>;
}
function EmptyState({onAdd}) { return <div className="empty-state"><div className="empty-illustration"><BookOpen size={29}/></div><h3>Your study plan starts here</h3><p>Add an assignment, revision session, or project and track it until it is done.</p><Button onClick={onAdd}><Plus size={16}/> Add your first task</Button></div>; }
function TopicForm({ initial, onSave, onCancel, busy, error }) {
  const [form,setForm]=useState(initial||initialForm);
  useEffect(()=>setForm(initial||initialForm),[initial]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <form className="form-card" onSubmit={e=>{e.preventDefault();onSave(form)}}><div className="form-section-heading"><div className="form-icon"><BookMarked size={19}/></div><div><h2>{initial?"Update study task":"Create a study task"}</h2><p>Add a deadline and a small, clear next step.</p></div></div>
    <div className="form-grid"><label className="field full">Task title <span>*</span><input required maxLength={100} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Finish chapter 3 exercises"/></label>
    <label className="field full">Task notes <textarea rows="4" maxLength={1000} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Add instructions, chapters to revise, or what needs to be completed."/></label>
    <label className="field">Subject <div className="select-wrap"><select value={form.category} onChange={e=>set("category",e.target.value)}>{CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}<option>Chemistry</option><option>Programming</option></select><ChevronDown size={16}/></div></label>
    <label className="field">Due date <div className="input-wrap"><CalendarDays size={17}/><input type="date" value={form.targetDate?String(form.targetDate).slice(0,10):""} onChange={e=>set("targetDate",e.target.value)} min={new Date().toISOString().slice(0,10)}/></div></label>
    {initial&&<label className="field full">Progress <div className="range-row"><input type="range" min="0" max="100" step="5" value={form.progress} onChange={e=>set("progress",Number(e.target.value))}/><b>{form.progress}%</b></div></label>}
    </div>{error&&<div className="error-message">{error}</div>}<div className="form-actions"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={busy}>{busy?<LoaderCircle size={16} className="spin"/>:initial?<Check size={16}/>:<Plus size={17}/>} {initial?"Save changes":"Save task"}</Button></div>
  </form>;
}
function TopicsPage({ topics, setPage, onOpen, onEdit, onDelete, onProgress }) {
  const [search,setSearch]=useState("");const [filter,setFilter]=useState("All");
  const shown=topics.filter(t=>(t.name+" "+t.category+" "+t.description).toLowerCase().includes(search.toLowerCase())&&(filter==="All"||(filter==="Completed"?t.progress>=100:filter==="In progress"?t.progress>0&&t.progress<100:t.progress===0)));
  return <><PageTitle eyebrow="YOUR STUDY PLANNER" title="My tasks" subtitle="Keep assignments, revision, and projects organized in one place." action={<Button onClick={()=>setPage("add")}><Plus size={17}/> New task</Button>}/><div className="list-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks or subjects…"/>{search&&<button className="icon-button" onClick={()=>setSearch("")}><X size={15}/></button>}</div><div className="filter-tabs">{["All","In progress","Completed","Not started"].map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div></div>
    {shown.length?<div className="topic-list">{shown.map(t=><TopicCard key={t._id} topic={t} onEdit={onEdit} onDelete={onDelete} onOpen={onOpen} onProgress={onProgress}/>)}</div>:<div className="empty-state"><div className="empty-illustration"><Search size={27}/></div><h3>No matching tasks</h3><p>Try another search or add a new study task.</p><Button onClick={()=>setPage("add")}><Plus size={16}/> Add a topic</Button></div>}</>;
}
function ProgressPage({ topics }) {
  const average=topics.length?Math.round(topics.reduce((a,t)=>a+t.progress,0)/topics.length):0;
  const completed=topics.filter(t=>t.progress===100).length, active=topics.filter(t=>t.progress>0&&t.progress<100).length, pending=topics.filter(t=>t.progress===0).length;
  return <><PageTitle eyebrow="LOOK HOW FAR YOU'VE COME" title="Your progress" subtitle="See how much of your study plan you have completed."/><div className="progress-overview"><div className="progress-ring" style={{"--progress":`${average*3.6}deg`}}><div><b>{average}%</b><span>overall progress</span></div></div><div className="progress-summary"><span className="eyebrow">YOUR MOMENTUM</span><h2>{average>=75?"You're on a roll!":average>=35?"You're building momentum.":"Your journey is underway."}</h2><p>{topics.length?`You've added ${topics.length} learning ${topics.length===1?"topic":"topics"}. Keep going, and take a moment to notice every small win.`:"Your progress dashboard will come alive when you add your first topic."}</p><div className="legend"><span><i className="dot green-dot"/>Completed <b>{completed}</b></span><span><i className="dot blue-dot"/>In progress <b>{active}</b></span><span><i className="dot orange-dot"/>Not started <b>{pending}</b></span></div></div></div>
    <div className="section-heading"><div><div className="eyebrow">TOPIC BY TOPIC</div><h2>Study progress</h2><p>Know what to work on next.</p></div></div>
    {topics.length?<div className="breakdown-card">{topics.map(t=><div className="breakdown-row" key={t._id}><div className={`mini-topic-icon ${categoryClass(t.category)}`}><CategoryIcon category={t.category}/></div><div className="breakdown-name"><b>{t.name}</b><span>{t.category}</span></div><ProgressBar value={t.progress}/><b className="breakdown-percent">{t.progress}%</b></div>)}</div>:<EmptyState onAdd={()=>{window.dispatchEvent(new CustomEvent("flexi-add-topic"))}}/>}
    <div className="encouragement"><Sparkles size={21}/><div><b>Study at your own pace</b><p>Balance deadlines with breaks. Consistent study beats last-minute cramming.</p></div></div></>;
}
function TopicDetail({ topic, onBack, onEdit, onDelete, onProgress }) {
  if(!topic)return null;
  return <><button className="back-link" onClick={onBack}>← Back to topics</button><div className="detail-card"><div className={`detail-icon ${categoryClass(topic.category)}`}><CategoryIcon category={topic.category}/></div><div className="detail-top"><div><span className={`status status-${topic.progress>=100?"done":topic.progress>0?"active":"pending"}`}>{topic.progress>=100?"Completed":topic.progress>0?"In progress":"Not started"}</span><h1>{topic.name}</h1><p>{topic.category}</p></div><div className="detail-actions"><Button variant="secondary" onClick={()=>onEdit(topic)}><Pencil size={15}/> Edit</Button><Button variant="danger" onClick={()=>onDelete(topic)}><Trash2 size={15}/> Delete</Button></div></div><div className="detail-description"><h3>About this goal</h3><p>{topic.description||"No description yet. Edit this topic to add a few notes about what you want to learn."}</p></div><div className="detail-progress"><div><h3>Your progress</h3><b>{topic.progress}%</b></div><ProgressBar value={topic.progress}/><label className="field">Update progress <div className="range-row"><input type="range" min="0" max="100" step="5" value={topic.progress} onChange={e=>onProgress(topic,Number(e.target.value))}/><b>{topic.progress}%</b></div></label></div>{topic.targetDate&&<div className="target-date"><CalendarDays size={18}/><div><span>Due date</span><b>{new Date(topic.targetDate).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})}</b></div></div>}</div></>;
}
function DeleteModal({ topic, onCancel, onConfirm, busy }) {
  if(!topic)return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onCancel()}><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><button className="modal-close icon-button" onClick={onCancel}><X size={18}/></button><div className="delete-symbol"><Trash2 size={22}/></div><h2 id="delete-title">Delete this task?</h2><p><b>{topic.name}</b> will be permanently removed from your study plan. This action can't be undone.</p><div className="modal-actions"><Button variant="secondary" onClick={onCancel}>Keep topic</Button><Button variant="danger" onClick={onConfirm} disabled={busy}>{busy?<LoaderCircle size={16} className="spin"/>:<Trash2 size={16}/>} Delete topic</Button></div></div></div>;
}
export default function App() {
  const [session,setSession]=useState(()=>({token:localStorage.getItem("flexi_token"),user:JSON.parse(localStorage.getItem("flexi_user")||"null")}));
  const [page,setPage]=useState("dashboard"),[topics,setTopics]=useState([]),[loading,setLoading]=useState(false),[toast,setToast]=useState("");
  const [editing,setEditing]=useState(null),[deleting,setDeleting]=useState(null),[detail,setDetail]=useState(null),[formBusy,setFormBusy]=useState(false),[formError,setFormError]=useState("");
  const token=session.token,user=session.user;
  function authenticated(data){localStorage.setItem("flexi_token",data.token);localStorage.setItem("flexi_user",JSON.stringify(data.user));setSession({token:data.token,user:data.user});setPage("dashboard");}
  function logout(){localStorage.removeItem("flexi_token");localStorage.removeItem("flexi_user");setSession({token:null,user:null});setTopics([]);setPage("dashboard");setToast("You've logged out safely.");}
  async function loadTopics(){if(!token)return;setLoading(true);try{const d=await api("/topics",{token});setTopics(d.topics);}catch(e){if(e.message.toLowerCase().includes("session")||e.message.toLowerCase().includes("log in"))logout();else setToast(e.message);}finally{setLoading(false);}}
  useEffect(()=>{if(token)loadTopics();},[token]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(""),3200);return()=>clearTimeout(id);},[toast]);
  useEffect(()=>{const fn=()=>setPage("add");window.addEventListener("flexi-add-topic",fn);return()=>window.removeEventListener("flexi-add-topic",fn);},[]);
  async function saveTopic(form){setFormBusy(true);setFormError("");try{const body={...form,progress:Number(form.progress)||0,targetDate:form.targetDate||null};if(editing){const d=await api(`/topics/${editing._id}`,{token,method:"PATCH",body:JSON.stringify(body)});setTopics(ts=>ts.map(t=>t._id===d.topic._id?d.topic:t));setDetail(d.topic);setPage("detail");setToast("Task updated successfully.");}else{const d=await api("/topics",{token,method:"POST",body:JSON.stringify(body)});setTopics(ts=>[d.topic,...ts]);setPage("topics");setToast("Your study task has been added.");}setEditing(null);}catch(e){setFormError(e.message);}finally{setFormBusy(false);}}
  async function updateProgress(topic,progress){try{const d=await api(`/topics/${topic._id}`,{token,method:"PATCH",body:JSON.stringify({progress})});setTopics(ts=>ts.map(t=>t._id===topic._id?d.topic:t));if(detail?._id===topic._id)setDetail(d.topic);setToast("Study progress saved.");}catch(e){setToast(e.message);}}
  async function confirmDelete(){if(!deleting)return;setFormBusy(true);try{await api(`/topics/${deleting._id}`,{token,method:"DELETE"});setTopics(ts=>ts.filter(t=>t._id!==deleting._id));if(detail?._id===deleting._id)setDetail(null);setDeleting(null);setPage("topics");setToast("Task deleted.");}catch(e){setToast(e.message);}finally{setFormBusy(false);}}
  function startEdit(topic){setEditing({...topic,targetDate:topic.targetDate?String(topic.targetDate).slice(0,10):""});setFormError("");setPage("edit");}
  if(!token||!user)return <Auth onAuth={authenticated}/>;
  const activeTopic=detail||topics.find(t=>t._id===detail?._id);
  return <AppShell user={user} page={page} setPage={p=>{setPage(p);if(p!=="edit")setEditing(null);if(p!=="detail")setDetail(null);}} logout={logout}>
    {loading?<div className="loading-state"><LoaderCircle className="spin" size={28}/><span>Getting your learning space ready…</span></div>:<>
      {page==="dashboard"&&<Dashboard user={user} topics={topics} setPage={setPage} onOpen={t=>{setDetail(t);setPage("detail")}} onEdit={startEdit} onDelete={setDeleting} onProgress={updateProgress}/>}
      {page==="topics"&&<TopicsPage topics={topics} setPage={setPage} onOpen={t=>{setDetail(t);setPage("detail")}} onEdit={startEdit} onDelete={setDeleting} onProgress={updateProgress}/>}
      {page==="add"&&<><PageTitle eyebrow="PLAN YOUR STUDY" title="Add a study task" subtitle="Record an assignment, revision session, or project."/><TopicForm key="new" onSave={saveTopic} onCancel={()=>setPage("dashboard")} busy={formBusy} error={formError}/></>}
      {page==="edit"&&<><PageTitle eyebrow="REFINE YOUR GOAL" title="Edit study task" subtitle="Update the task details and keep your plan realistic."/><TopicForm key={editing?editing._id:"edit"} initial={editing} onSave={saveTopic} onCancel={()=>{setEditing(null);setPage("topics")}} busy={formBusy} error={formError}/></>}
      {page==="progress"&&<ProgressPage topics={topics}/>}
      {page==="detail"&&<TopicDetail topic={activeTopic} onBack={()=>{setDetail(null);setPage("topics")}} onEdit={startEdit} onDelete={setDeleting} onProgress={updateProgress}/>}
    </>}
    <DeleteModal topic={deleting} onCancel={()=>setDeleting(null)} onConfirm={confirmDelete} busy={formBusy}/>
    {toast&&<div className="toast"><span><Check size={16}/></span>{toast}<button className="icon-button" onClick={()=>setToast("")}><X size={15}/></button></div>}
  </AppShell>;
}
