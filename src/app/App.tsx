import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, Users, BarChart3,
  Bell, LogOut, ChevronRight, CheckCircle2, Clock, AlertCircle,
  TrendingUp, Star, FileText, UserCheck, Building2, Calendar,
  Award, Eye, EyeOff, ArrowRight, UserCircle,
  Briefcase, Network, Send, ThumbsUp, ThumbsDown, ChevronDown,
  BookOpen, Target, Layers, Edit3, X, Plus
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import companyLogo from "@/imports/image.png";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "staff" | "manager" | "admin";
type Screen = "login" | "dashboard" | "logout";

// ─── Auth Credentials ─────────────────────────────────────────────────────────

const CREDENTIALS: Record<string, { password: string; role: Role }> = {
  "ibeng@gmail.com":  { password: "ibeng123", role: "staff" },
  "pram@gmail.com":   { password: "pram123",  role: "manager" },
  "cici@gmail.com":   { password: "cici123",  role: "admin" },
};

// ─── AKHLAK Core Value Questions ──────────────────────────────────────────────

const AKHLAK_QUESTIONS = [
  {
    value: "Amanah",
    color: "#2563EB",
    desc: "Bertanggung jawab atas kepercayaan yang diberikan",
    questions: [
      "Saya/Beliau selalu menyelesaikan tugas sesuai tenggat waktu yang disepakati.",
      "Saya/Beliau menjaga kerahasiaan informasi perusahaan dengan baik.",
      "Saya/Beliau jujur dalam menyampaikan hasil kerja, termasuk saat menghadapi kesulitan.",
      "Saya/Beliau bertanggung jawab penuh atas setiap keputusan dan tindakan yang diambil.",
    ],
  },
  {
    value: "Kompeten",
    color: "#0EA5E9",
    desc: "Terus belajar dan mengembangkan kapabilitas",
    questions: [
      "Saya/Beliau memiliki pengetahuan teknis yang memadai untuk peran saat ini.",
      "Saya/Beliau aktif mengikuti pelatihan dan pengembangan diri.",
      "Saya/Beliau mampu menyelesaikan masalah kompleks secara mandiri.",
      "Saya/Beliau menghasilkan output berkualitas tinggi secara konsisten.",
    ],
  },
  {
    value: "Harmonis",
    color: "#6366F1",
    desc: "Peduli dan menghargai perbedaan",
    questions: [
      "Saya/Beliau menghargai pendapat dan kontribusi rekan kerja dari latar belakang berbeda.",
      "Saya/Beliau menjaga suasana kerja yang positif dan kondusif.",
      "Saya/Beliau mampu mengelola konflik dengan dewasa dan konstruktif.",
      "Saya/Beliau menunjukkan empati kepada rekan yang membutuhkan dukungan.",
    ],
  },
  {
    value: "Loyal",
    color: "#10B981",
    desc: "Berdedikasi dan mengutamakan kepentingan bangsa dan negara",
    questions: [
      "Saya/Beliau menunjukkan komitmen kuat terhadap visi dan misi perusahaan.",
      "Saya/Beliau bersedia memberikan usaha ekstra saat dibutuhkan.",
      "Saya/Beliau menjaga nama baik perusahaan di dalam maupun luar lingkungan kerja.",
      "Saya/Beliau tidak mudah terpengaruh tawaran yang merugikan perusahaan.",
    ],
  },
  {
    value: "Adaptif",
    color: "#F59E0B",
    desc: "Terus berinovasi dan antusias dalam menggerakkan perubahan",
    questions: [
      "Saya/Beliau cepat beradaptasi terhadap perubahan kebijakan atau prosedur.",
      "Saya/Beliau proaktif mencari cara baru untuk meningkatkan efisiensi kerja.",
      "Saya/Beliau terbuka terhadap kritik dan umpan balik untuk perbaikan.",
      "Saya/Beliau mampu bekerja efektif dalam kondisi yang tidak pasti.",
    ],
  },
  {
    value: "Kolaboratif",
    color: "#EC4899",
    desc: "Membangun kerja sama yang sinergis",
    questions: [
      "Saya/Beliau aktif berbagi pengetahuan dan informasi dengan tim.",
      "Saya/Beliau berkontribusi secara aktif dalam diskusi dan rapat tim.",
      "Saya/Beliau mendukung keberhasilan rekan kerja tanpa pamrih.",
      "Saya/Beliau membangun hubungan kerja yang baik lintas departemen.",
    ],
  },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STAFF_PEERS = [
  { id: "p1", name: "Siti Rahmawati", dept: "Finance", status: "pending" },
  { id: "p2", name: "Ahmad Fauzi",    dept: "Operations", status: "submitted" },
  { id: "p3", name: "Dewi Putri",     dept: "HR", status: "pending" },
];

const MANAGER_STAFF_LIST = [
  { id: "s1", name: "Ibeng Prasetyo",  role: "Senior Analyst",       selfDone: true,  peerDone: true,  managerDone: false, peerApproved: null,   score: null },
  { id: "s2", name: "Siti Rahmawati", role: "Finance Specialist",    selfDone: true,  peerDone: false, managerDone: false, peerApproved: null,   score: null },
  { id: "s3", name: "Ahmad Fauzi",    role: "Operations Lead",       selfDone: false, peerDone: false, managerDone: false, peerApproved: null,   score: null },
  { id: "s4", name: "Dewi Putri",     role: "HR Business Partner",   selfDone: true,  peerDone: true,  managerDone: true,  peerApproved: true,   score: 91 },
  { id: "s5", name: "Rizki Maulana",  role: "IT Analyst",            selfDone: true,  peerDone: true,  managerDone: false, peerApproved: false,  score: null },
];

const RADAR_DATA_IBENG = [
  { subject: "Amanah",      self: 85, peer: 78, manager: 0 },
  { subject: "Kompeten",    self: 90, peer: 85, manager: 0 },
  { subject: "Harmonis",    self: 75, peer: 80, manager: 0 },
  { subject: "Loyal",       self: 88, peer: 84, manager: 0 },
  { subject: "Adaptif",     self: 72, peer: 76, manager: 0 },
  { subject: "Kolaboratif", self: 82, peer: 88, manager: 0 },
];

const ORG_TREND = [
  { month: "Jan", score: 72 }, { month: "Feb", score: 75 },
  { month: "Mar", score: 78 }, { month: "Apr", score: 76 },
  { month: "May", score: 82 }, { month: "Jun", score: 85 },
];

const TALENT_DIST = [
  { name: "High Potential", value: 23, color: "#2563EB" },
  { name: "Core Performer", value: 54, color: "#10B981" },
  { name: "Developing",     value: 18, color: "#F59E0B" },
  { name: "Critical Watch", value:  5, color: "#EF4444" },
];

const IDP_DATA = [
  { name: "Ibeng Prasetyo",  gap: "Adaptif",     action: "Digital Transformation Training",   deadline: "Sep 2025", status: "planned" },
  { name: "Siti Rahmawati", gap: "Kolaboratif",  action: "Cross-functional Project Assignment", deadline: "Aug 2025", status: "in_progress" },
  { name: "Ahmad Fauzi",    gap: "Kompeten",     action: "Technical Certification Program",   deadline: "Dec 2025", status: "planned" },
  { name: "Rizki Maulana",  gap: "Harmonis",     action: "Interpersonal Skills Workshop",     deadline: "Oct 2025", status: "planned" },
];

// ─── Shared UI Components ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    completed:   { label: "Completed",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    submitted:   { label: "Submitted",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    in_progress: { label: "In Progress", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    pending:     { label: "Pending",     cls: "bg-amber-50 text-amber-700 border-amber-200" },
    planned:     { label: "Planned",     cls: "bg-purple-50 text-purple-700 border-purple-200" },
    not_started: { label: "Not Started", cls: "bg-gray-50 text-gray-500 border-gray-200" },
    approved:    { label: "Approved",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected:    { label: "Returned",    cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const s = map[status] ?? map.not_started;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
      {(status === "completed" || status === "submitted" || status === "approved") && <CheckCircle2 size={10} />}
      {(status === "in_progress") && <Clock size={10} />}
      {(status === "pending" || status === "not_started") && <AlertCircle size={10} />}
      {s.label}
    </span>
  );
}

function MetricCard({
  label, value, sub, icon: Icon, color = "text-accent"
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>; color?: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── AKHLAK Rating Form ────────────────────────────────────────────────────────

function AKHLAKForm({
  title, subtitle, rateeLabel, onSubmit, onCancel
}: {
  title: string; subtitle: string; rateeLabel: string;
  onSubmit: (scores: Record<string, number>) => void;
  onCancel: () => void;
}) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState(0);

  const totalQuestions = AKHLAK_QUESTIONS.reduce((a, c) => a + c.questions.length, 0);
  const answered = Object.keys(scores).length;
  const progress = Math.round((answered / totalQuestions) * 100);

  function setScore(key: string, val: number) {
    setScores((prev) => ({ ...prev, [key]: val }));
  }

  function canSubmit() {
    return answered === totalQuestions;
  }

  const ratingLabels = ["", "Sangat Kurang", "Kurang", "Cukup", "Baik", "Sangat Baik"];
  const ratingColors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-emerald-500"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
              <UserCircle size={13} className="text-accent" />
              {rateeLabel}
            </div>
          </div>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition">
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-secondary rounded-full h-2">
            <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-mono font-bold text-accent">{answered}/{totalQuestions}</span>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 flex-wrap">
        {AKHLAK_QUESTIONS.map((section, i) => {
          const sectionAnswered = section.questions.every((_, qi) => scores[`${i}-${qi}`] !== undefined);
          return (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                activeSection === i
                  ? "border-accent bg-accent text-white"
                  : sectionAnswered
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-border bg-card text-muted-foreground hover:border-accent/40"
              }`}
            >
              {sectionAnswered && <CheckCircle2 size={11} />}
              {section.value}
            </button>
          );
        })}
      </div>

      {/* Active section */}
      {AKHLAK_QUESTIONS.map((section, si) =>
        si !== activeSection ? null : (
          <div key={si} className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border" style={{ background: `${section.color}12` }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: section.color }}>
                  {section.value[0]}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{section.value}</h3>
                  <p className="text-xs text-muted-foreground">{section.desc}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {section.questions.map((q, qi) => {
                const key = `${si}-${qi}`;
                const val = scores[key];
                return (
                  <div key={qi} className="px-5 py-4">
                    <p className="text-sm text-foreground mb-3 leading-relaxed">
                      <span className="font-mono text-xs text-muted-foreground mr-2">{qi + 1}.</span>
                      {q}
                    </p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setScore(key, rating)}
                          className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-lg border-2 transition-all text-xs font-semibold ${
                            val === rating
                              ? `border-transparent text-white ${ratingColors[rating]}`
                              : "border-border text-muted-foreground hover:border-accent/40 bg-secondary/40"
                          }`}
                        >
                          <span className="text-base font-bold">{rating}</span>
                          <span className="text-[10px] leading-tight text-center hidden sm:block">{ratingLabels[rating]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t border-border flex justify-between items-center bg-muted/20">
              <button
                disabled={si === 0}
                onClick={() => setActiveSection(si - 1)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
              >
                ← Sebelumnya
              </button>
              {si < AKHLAK_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setActiveSection(si + 1)}
                  className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Berikutnya →
                </button>
              ) : (
                <button
                  disabled={!canSubmit()}
                  onClick={() => onSubmit(scores)}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <Send size={14} /> Submit Penilaian
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ─── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (role: Role, name: string) => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry = CREDENTIALS[email.toLowerCase().trim()];
    if (!entry) {
      setError("Email tidak ditemukan. Periksa kembali email Anda.");
      return;
    }
    if (entry.password !== password) {
      setError("Password salah. Silakan coba lagi.");
      return;
    }
    setError("");
    const nameMap: Record<Role, string> = {
      staff:   "Ibeng Prasetyo",
      manager: "Pram Wijaya",
      admin:   "Cici Kusuma",
    };
    onLogin(entry.role, nameMap[entry.role]);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #052e16 0%, #166534 55%, #16a34a 100%)" }}
    >
      {/* Concentric rings decoration */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="absolute border border-white rounded-full"
            style={{ width: `${(i + 1) * 180}px`, height: `${(i + 1) * 180}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        ))}
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 mb-4">
            <ImageWithFallback src={companyLogo} alt="PT Nusantara Energi Indonesia" className="w-full object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Akhlak Core Value 360</h1>
          <p className="text-green-200 text-sm mt-1">Performance Appraisal System · PT Energi Nusantara</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-foreground mb-0.5">Selamat datang</h2>
          <p className="text-sm text-muted-foreground mb-6">Masuk dengan akun korporat Anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Korporat</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="nama@gmail.com"
                autoComplete="username"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition text-sm pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle size={14} className="flex-shrink-0" /> {error}
              </div>
            )}

            <div className="flex justify-end">
              <button type="button" className="text-sm text-accent hover:text-primary font-medium transition">
                Lupa Password?
              </button>
            </div>

            <button type="submit"
              className="w-full py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md">
              Masuk <ArrowRight size={15} />
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 rounded-lg bg-secondary border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Akun Demo</p>
            <div className="space-y-0.5 font-mono text-xs text-muted-foreground">
              <p><span className="text-foreground font-medium">Staff</span>   · ibeng@gmail.com / ibeng123</p>
              <p><span className="text-foreground font-medium">Manager</span> · pram@gmail.com / pram123</p>
              <p><span className="text-foreground font-medium">HR Admin</span>· cici@gmail.com / cici123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-green-200/50 text-xs mt-6">
          © 2025 Akhlak Core Value 360 · Hak Cipta Dilindungi
        </p>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_BY_ROLE: Record<Role, { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; id: string }[]> = {
  staff: [
    { icon: LayoutDashboard, label: "Dashboard",        id: "overview" },
    { icon: Edit3,           label: "Penilaian Diri",   id: "self_assessment" },
    { icon: Users,           label: "Nilai Rekan",      id: "peer_review" },
    { icon: BarChart3,       label: "Hasil Saya",       id: "my_results" },
    { icon: Bell,            label: "Notifikasi",       id: "notifications" },
  ],
  manager: [
    { icon: LayoutDashboard, label: "Dashboard",        id: "overview" },
    { icon: ClipboardList,   label: "Nilai Staff",      id: "rate_staff" },
    { icon: UserCheck,       label: "Approve Penilaian",id: "approve" },
    { icon: BarChart3,       label: "Rekap Tim",        id: "team_recap" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard",        id: "overview" },
    { icon: FileText,        label: "Form Penilaian",   id: "forms" },
    { icon: BarChart3,       label: "Hasil Penilaian",  id: "results" },
    { icon: Network,         label: "Talent Mapping",   id: "talent" },
    { icon: BookOpen,        label: "IDP",              id: "idp" },
    { icon: Calendar,        label: "Periode",          id: "periods" },
  ],
};

const ROLE_LABELS: Record<Role, { badge: string; color: string }> = {
  staff:   { badge: "Staff",    color: "bg-blue-100 text-blue-700" },
  manager: { badge: "Manager",  color: "bg-purple-100 text-purple-700" },
  admin:   { badge: "HR Admin", color: "bg-emerald-100 text-emerald-700" },
};

function Sidebar({
  role, name, activeNav, onNav, onLogout
}: {
  role: Role; name: string; activeNav: string;
  onNav: (id: string) => void; onLogout: () => void;
}) {
  const nav = NAV_BY_ROLE[role];
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const rl = ROLE_LABELS[role];

  return (
    <aside className="w-60 h-screen flex flex-col flex-shrink-0" style={{ background: "var(--sidebar)" }}>
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <ImageWithFallback src={companyLogo} alt="PT Nusantara Energi Indonesia" className="w-8 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Akhlak Core</p>
            <p className="text-xs leading-tight" style={{ color: "var(--sidebar-foreground)" }}>Value 360</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: "rgba(200,216,238,0.35)" }}>
          {role === "staff" ? "Employee" : role === "manager" ? "Management" : "Administration"}
        </p>
        {nav.map((item) => {
          const active = activeNav === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? "bg-accent text-white shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
              }`}>
              <item.icon size={16} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "var(--sidebar-accent)" }}>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{name}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${rl.color}`}>{rl.badge}</span>
          </div>
          <button onClick={onLogout} className="text-sidebar-foreground hover:text-white transition" title="Keluar">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Page Header ───────────────────────────────────────────────────────────────

function PageHeader({ activeNav, role }: { activeNav: string; role: Role }) {
  const TITLES: Record<string, string> = {
    overview: "Dashboard", self_assessment: "Penilaian Diri", peer_review: "Nilai Rekan Sejawat",
    my_results: "Hasil Penilaian Saya", notifications: "Notifikasi",
    rate_staff: "Nilai Staff", approve: "Approve Penilaian", team_recap: "Rekap Tim",
    forms: "Form Penilaian", results: "Hasil Penilaian", talent: "Talent Mapping",
    idp: "Individual Development Plan", periods: "Periode Penilaian",
  };
  const ROLE_PORTAL: Record<Role, string> = {
    staff: "Staff Portal", manager: "Manager Portal", admin: "HR Admin Portal"
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{ROLE_PORTAL[role]}</span>
        <ChevronRight size={13} className="text-muted-foreground" />
        <span className="font-semibold text-foreground">{TITLES[activeNav] ?? "Dashboard"}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
          <Clock size={12} className="text-amber-600" />
          <span className="text-xs font-medium text-amber-700">Q2 2025 · Tutup 30 Jun</span>
        </div>
        <button className="relative w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition">
          <Bell size={15} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">2</span>
        </button>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAFF VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

function StaffOverview({ onNav, name }: { onNav: (id: string) => void; name: string }) {
  const selfDone = true;
  const peerDone = 1;
  const peerTotal = STAFF_PEERS.length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={{ background: "linear-gradient(135deg,#166534 0%,#16a34a 100%)" }}>
        <p className="text-green-200 text-xs font-medium uppercase tracking-wide">Selamat datang</p>
        <h2 className="text-white font-bold text-xl mt-0.5">{name}</h2>
        <p className="text-green-200 text-sm mt-1">Periode Penilaian Q2 2025 sedang berjalan. Selesaikan semua tugas penilaian Anda.</p>
        <div className="flex items-center gap-6 mt-4">
          <div><p className="text-green-200 text-xs">Penilaian Diri</p>
            <p className="text-white font-bold text-xl">{selfDone ? "✓ Selesai" : "Belum"}</p></div>
          <div><p className="text-green-200 text-xs">Nilai Rekan</p>
            <p className="text-white font-bold text-xl">{peerDone}/{peerTotal}</p></div>
          <div><p className="text-green-200 text-xs">Tenggat</p>
            <p className="text-white font-bold text-xl">30 Jun</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Penilaian Diri"  value="Selesai"  icon={CheckCircle2} color="text-emerald-600" />
        <MetricCard label="Nilai Rekan"     value={`${peerDone}/${peerTotal}`} sub="1 menunggu" icon={Users} color="text-accent" />
        <MetricCard label="Skor Diri (Q1)"  value="84.2"     sub="Nilai rata-rata" icon={Star} color="text-amber-500" />
        <MetricCard label="Form Tersedia"   value="1"        sub="Dari HR Admin"  icon={FileText} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNav("self_assessment")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-accent/40 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Edit3 size={18} className="text-accent" />
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Penilaian Diri</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Isi form AKHLAK Core Value untuk diri sendiri</p>
        </button>
        <button onClick={() => onNav("peer_review")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-accent/40 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Users size={18} className="text-purple-600" />
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Nilai Rekan Sejawat</h3>
          <p className="text-xs text-muted-foreground mt-0.5">2 rekan menunggu penilaian Anda</p>
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Notifikasi Terbaru</h3>
        <div className="space-y-3">
          {[
            { title: "Batas Nilai Rekan", desc: "Selesaikan penilaian rekan sebelum 30 Jun 2025", urgent: true, time: "2j lalu" },
            { title: "Form Baru Tersedia", desc: "HR Admin telah menerbitkan form Q2 2025", urgent: false, time: "1h lalu" },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.urgent ? "bg-red-400" : "bg-blue-300"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StaffSelfAssessment() {
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (submitted) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Penilaian Diri Terkirim</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Penilaian diri Q2 2025 Anda telah berhasil dikirimkan dan menunggu proses verifikasi HR Admin.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          <CheckCircle2 size={14} /> Selesai · Dikumpulkan 17 Jun 2025
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <AKHLAKForm
        title="Form Penilaian Diri — Q2 2025"
        subtitle="Nilai diri Anda sendiri secara jujur pada setiap indikator AKHLAK Core Value"
        rateeLabel="Diri Sendiri: Ibeng Prasetyo"
        onSubmit={() => setSubmitted(true)}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Penilaian Diri</h2>
        <p className="text-sm text-muted-foreground">Form AKHLAK Core Value periode Q2 2025 dari HR Admin</p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-blue-50/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Form AKHLAK Core Value 360 — Q2 2025</h3>
                <p className="text-xs text-muted-foreground">Diterbitkan oleh HR Admin · 1 Jun 2025</p>
              </div>
            </div>
            <StatusBadge status="pending" />
          </div>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Form ini berisi 24 pertanyaan yang mencakup 6 dimensi AKHLAK Core Value. Jawab setiap pertanyaan
            dengan jujur berdasarkan perilaku nyata Anda selama periode Q2 2025 (April—Juni).
          </p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {AKHLAK_QUESTIONS.map((s) => (
              <div key={s.value} className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary text-xs">
                <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: s.color }}>{s.value[0]}</div>
                <span className="font-medium text-foreground">{s.value}</span>
                <span className="text-muted-foreground ml-auto">4 soal</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}
            className="w-full py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <Edit3 size={14} /> Mulai Penilaian Diri
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffPeerReview() {
  const [peers, setPeers] = useState(STAFF_PEERS);
  const [activePeer, setActivePeer] = useState<string | null>(null);

  function handlePeerSubmit(peerId: string) {
    setPeers((prev) => prev.map((p) => p.id === peerId ? { ...p, status: "submitted" } : p));
    setActivePeer(null);
  }

  const activePeerData = peers.find((p) => p.id === activePeer);

  if (activePeer && activePeerData) {
    return (
      <AKHLAKForm
        title={`Penilaian Rekan — ${activePeerData.name}`}
        subtitle="Nilai rekan Anda secara objektif berdasarkan interaksi kerja nyata"
        rateeLabel={`${activePeerData.name} · ${activePeerData.dept}`}
        onSubmit={() => handlePeerSubmit(activePeer)}
        onCancel={() => setActivePeer(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Nilai Rekan Sejawat</h2>
        <p className="text-sm text-muted-foreground">Berikan penilaian AKHLAK Core Value kepada rekan yang ditugaskan</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Nilai rekan sejawat Anda dengan <strong>jujur dan objektif</strong>. Hasil penilaian bersifat anonim
          dan hanya dilihat oleh HR Admin setelah disetujui Manager.
        </p>
      </div>

      <div className="space-y-3">
        {peers.map((peer) => (
          <div key={peer.id} className="bg-card rounded-lg border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary">
                {peer.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{peer.name}</p>
                <p className="text-xs text-muted-foreground">{peer.dept} · Rekan Sejawat</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={peer.status} />
              {peer.status === "pending" ? (
                <button onClick={() => setActivePeer(peer.id)}
                  className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1.5">
                  <Edit3 size={12} /> Nilai Sekarang
                </button>
              ) : (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" /> Terkirim
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffMyResults() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Hasil Penilaian Saya</h2>
        <p className="text-sm text-muted-foreground">Hasil Q1 2025 · Q2 2025 sedang diproses</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Skor Diri" value="84.2" sub="Q1 2025" icon={Star} color="text-accent" />
        <MetricCard label="Skor Rekan" value="82.1" sub="Rata-rata 3 penilai" icon={Users} color="text-purple-600" />
        <MetricCard label="Skor Manager" value="Menunggu" sub="Q2 2025" icon={UserCheck} color="text-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Radar AKHLAK Core Value — Q1 2025</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={RADAR_DATA_IBENG}>
              <PolarGrid stroke="rgba(27,58,107,0.12)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#5A7094" }} />
              <Radar name="Diri Sendiri" dataKey="self" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Rekan" dataKey="peer" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.1} strokeWidth={2} />
              <Legend iconType="circle" iconSize={8} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Skor per Dimensi</h3>
          <div className="space-y-3.5">
            {RADAR_DATA_IBENG.map((d) => (
              <div key={d.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{d.subject}</span>
                  <span className="text-xs font-bold text-accent font-mono">
                    Diri: {d.self} · Rekan: {d.peer}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-accent" style={{ width: `${d.self}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            Skor Manager belum tersedia. Menunggu penilaian dari Pram Wijaya (Manager).
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

function ManagerOverview({ onNav, name }: { onNav: (id: string) => void; name: string }) {
  const pending = MANAGER_STAFF_LIST.filter((s) => !s.managerDone && s.selfDone).length;
  const approvals = MANAGER_STAFF_LIST.filter((s) => s.peerDone && s.peerApproved === null).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={{ background: "linear-gradient(135deg,#166534 0%,#16a34a 100%)" }}>
        <p className="text-green-200 text-xs font-medium uppercase tracking-wide">Manager Portal</p>
        <h2 className="text-white font-bold text-xl mt-0.5">Selamat datang, {name.split(" ")[0]}</h2>
        <p className="text-green-200 text-sm mt-1">Tugas Anda: menilai setiap staff dan menyetujui hasil penilaian rekan sejawat.</p>
        <div className="flex items-center gap-6 mt-4">
          <div><p className="text-green-200 text-xs">Perlu Dinilai</p><p className="text-white font-bold text-2xl">{pending}</p></div>
          <div><p className="text-green-200 text-xs">Menunggu Approval</p><p className="text-white font-bold text-2xl">{approvals}</p></div>
          <div><p className="text-green-200 text-xs">Total Staff</p><p className="text-white font-bold text-2xl">{MANAGER_STAFF_LIST.length}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Staff Selesai" value={MANAGER_STAFF_LIST.filter((s) => s.managerDone).length} sub={`dari ${MANAGER_STAFF_LIST.length}`} icon={CheckCircle2} color="text-emerald-600" />
        <MetricCard label="Perlu Nilai" value={pending} sub="Self-assessment siap" icon={ClipboardList} color="text-accent" />
        <MetricCard label="Approval" value={approvals} sub="Peer review menunggu" icon={UserCheck} color="text-amber-500" />
        <MetricCard label="Skor Tim Avg" value="84.6" sub="Dari yang telah selesai" icon={TrendingUp} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNav("rate_staff")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-accent/40 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClipboardList size={18} className="text-accent" />
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Nilai Staff</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{pending} staff siap untuk dinilai</p>
        </button>
        <button onClick={() => onNav("approve")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-accent/40 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <UserCheck size={18} className="text-amber-600" />
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Approve Penilaian</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{approvals} penilaian rekan menunggu</p>
        </button>
      </div>
    </div>
  );
}

function ManagerRateStaff() {
  const [staffList, setStaffList] = useState(MANAGER_STAFF_LIST);
  const [activeStaff, setActiveStaff] = useState<string | null>(null);

  function handleSubmit(staffId: string) {
    setStaffList((prev) => prev.map((s) => s.id === staffId ? { ...s, managerDone: true, score: 86 } : s));
    setActiveStaff(null);
  }

  const activeStaffData = staffList.find((s) => s.id === activeStaff);

  if (activeStaff && activeStaffData) {
    return (
      <AKHLAKForm
        title={`Penilaian Manager — ${activeStaffData.name}`}
        subtitle="Berikan penilaian objektif berdasarkan observasi kerja langsung selama Q2 2025"
        rateeLabel={`${activeStaffData.name} · ${activeStaffData.role}`}
        onSubmit={() => handleSubmit(activeStaff)}
        onCancel={() => setActiveStaff(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Nilai Staff</h2>
        <p className="text-sm text-muted-foreground">Lakukan penilaian AKHLAK Core Value untuk setiap staff di bawah supervisi Anda</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Anda hanya dapat menilai staff yang telah menyelesaikan self-assessment. Staff yang belum mengisi
          form mandiri tidak dapat dinilai.
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <div className="grid grid-cols-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="col-span-2">Nama Staff</span>
            <span>Self-Asses.</span>
            <span>Peer Review</span>
            <span>Nilai Manager</span>
            <span>Aksi</span>
          </div>
        </div>
        {staffList.map((s) => (
          <div key={s.id}
            className="px-5 py-4 border-b border-border last:border-0 grid grid-cols-6 items-center hover:bg-secondary/20 transition">
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                {s.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.role}</p>
              </div>
            </div>
            <div>{s.selfDone ? <StatusBadge status="completed" /> : <StatusBadge status="pending" />}</div>
            <div>{s.peerDone ? <StatusBadge status="completed" /> : <StatusBadge status="pending" />}</div>
            <div>{s.managerDone
              ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium"><CheckCircle2 size={13} />{s.score}</span>
              : <StatusBadge status="pending" />}
            </div>
            <div>
              {s.managerDone ? (
                <span className="text-xs text-muted-foreground">Selesai</span>
              ) : s.selfDone ? (
                <button onClick={() => setActiveStaff(s.id)}
                  className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-blue-700 transition">
                  Nilai
                </button>
              ) : (
                <span className="text-xs text-muted-foreground italic">Menunggu self</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerApprove() {
  const [items, setItems] = useState(
    MANAGER_STAFF_LIST.filter((s) => s.peerDone).map((s) => ({ ...s, decision: null as null | boolean }))
  );

  function decide(id: string, approved: boolean) {
    setItems((prev) => prev.map((s) => s.id === id ? { ...s, decision: approved } : s));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Approve Penilaian Rekan</h2>
        <p className="text-sm text-muted-foreground">
          Tinjau hasil penilaian rekan sejawat. Approve jika valid, atau kembalikan jika ada kejanggalan.
        </p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
        <ImageWithFallback src={companyLogo} alt="PT Nusantara Energi Indonesia" className="w-5 h-5 object-contain flex-shrink-0 mt-0.5" />
        <p className="text-sm text-purple-800">
          Keputusan approval Anda akan diteruskan ke HR Admin untuk penghitungan nilai akhir dan penyusunan IDP.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary">
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
              </div>
              <div>
                {s.peerApproved === true ? (
                  <StatusBadge status="approved" />
                ) : s.peerApproved === false ? (
                  <StatusBadge status="rejected" />
                ) : (
                  <StatusBadge status="pending" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-secondary text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Penilai</p>
                <p className="text-sm font-bold text-foreground">3 Rekan</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Rata-rata Skor</p>
                <p className="text-sm font-bold text-accent font-mono">82.4</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Dimensi Terendah</p>
                <p className="text-sm font-bold text-foreground">Adaptif</p>
              </div>
            </div>

            {s.decision === null ? (
              <div className="flex items-center gap-2">
                <button onClick={() => decide(s.id, true)}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  <ThumbsUp size={14} /> Approve
                </button>
                <button onClick={() => decide(s.id, false)}
                  className="flex-1 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2">
                  <ThumbsDown size={14} /> Kembalikan
                </button>
              </div>
            ) : (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                s.decision ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}>
                {s.decision ? <><ThumbsUp size={14} /> Approved — diteruskan ke HR Admin</> : <><ThumbsDown size={14} /> Dikembalikan — staff perlu revisi</>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerTeamRecap() {
  const teamBarData = [
    { name: "Ibeng P.", amanah: 85, kompeten: 90, harmonis: 75, loyal: 88 },
    { name: "Siti R.",  amanah: 88, kompeten: 85, harmonis: 84, loyal: 92 },
    { name: "Ahmad F.", amanah: 74, kompeten: 78, harmonis: 80, loyal: 75 },
    { name: "Dewi P.",  amanah: 91, kompeten: 88, harmonis: 90, loyal: 87 },
    { name: "Rizki M.", amanah: 79, kompeten: 82, harmonis: 72, loyal: 84 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Rekap Tim</h2>
        <p className="text-sm text-muted-foreground">Perbandingan skor AKHLAK Core Value antar anggota tim</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Selesai Semua" value={MANAGER_STAFF_LIST.filter((s) => s.managerDone).length} sub={`dari ${MANAGER_STAFF_LIST.length}`} icon={CheckCircle2} color="text-emerald-600" />
        <MetricCard label="Rata-rata Tim" value="84.6" sub="Dari yang telah selesai" icon={TrendingUp} color="text-accent" />
        <MetricCard label="Skor Tertinggi" value="91.0" sub="Dewi Putri" icon={Award} color="text-purple-600" />
      </div>

      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Skor AKHLAK per Anggota Tim</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={teamBarData} barSize={9}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,58,107,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5A7094" }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#5A7094" }} />
            <Tooltip />
            <Legend iconType="circle" iconSize={8} />
            <Bar dataKey="amanah"    name="Amanah"      fill="#2563EB" radius={[3,3,0,0]} />
            <Bar dataKey="kompeten"  name="Kompeten"    fill="#0EA5E9" radius={[3,3,0,0]} />
            <Bar dataKey="harmonis"  name="Harmonis"    fill="#6366F1" radius={[3,3,0,0]} />
            <Bar dataKey="loyal"     name="Loyal"       fill="#10B981" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HR ADMIN VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

function AdminOverview({ onNav, name }: { onNav: (id: string) => void; name: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={{ background: "linear-gradient(135deg,#052e16 0%,#166534 100%)" }}>
        <p className="text-green-200 text-xs font-medium uppercase tracking-wide">HR Admin Portal</p>
        <h2 className="text-white font-bold text-xl mt-0.5">Selamat datang, {name.split(" ")[0]}</h2>
        <p className="text-green-200 text-sm mt-1">
          Kelola form penilaian, tinjau hasil, dan susun IDP berdasarkan skor AKHLAK Core Value.
        </p>
        <div className="flex items-center gap-8 mt-4">
          <div><p className="text-green-200 text-xs">Total Karyawan</p><p className="text-white font-bold text-2xl">5</p></div>
          <div><p className="text-green-200 text-xs">Self-Ass. Selesai</p><p className="text-white font-bold text-2xl">4/5</p></div>
          <div><p className="text-green-200 text-xs">Manager Approve</p><p className="text-white font-bold text-2xl">2/5</p></div>
          <div><p className="text-green-200 text-xs">IDP Tersusun</p><p className="text-white font-bold text-2xl">4</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Form Aktif"    value="1"  sub="Q2 2025"              icon={FileText}   color="text-accent" />
        <MetricCard label="Fully Done"    value="1"  sub="Dewi Putri selesai"   icon={CheckCircle2} color="text-emerald-600" />
        <MetricCard label="Perlu Review"  value="3"  sub="Menunggu approval"    icon={Clock}      color="text-amber-500" />
        <MetricCard label="IDP Disusun"   value="4"  sub="Dari hasil Q1 2025"   icon={BookOpen}   color="text-purple-600" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Form Penilaian", icon: FileText, id: "forms", sub: "Buat & kelola form AKHLAK" },
          { label: "Hasil Penilaian", icon: BarChart3, id: "results", sub: "Tinjau self, rekan & manager" },
          { label: "Talent Mapping", icon: Network, id: "talent", sub: "9-box & distribusi talenta" },
          { label: "IDP", icon: BookOpen, id: "idp", sub: "Susun rencana pengembangan" },
          { label: "Periode", icon: Calendar, id: "periods", sub: "Kelola siklus penilaian" },
        ].map((item) => (
          <button key={item.id} onClick={() => onNav(item.id)}
            className="bg-card border border-border rounded-lg p-5 text-left hover:border-accent/40 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <item.icon size={18} className="text-accent" />
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">{item.label}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminForms() {
  const [showNew, setShowNew] = useState(false);

  const forms = [
    { name: "Form AKHLAK Core Value 360 — Q2 2025", period: "Q2 2025", published: "1 Jun 2025", questions: 24, status: "active", responders: "4/5" },
    { name: "Form AKHLAK Core Value 360 — Q1 2025", period: "Q1 2025", published: "1 Mar 2025", questions: 24, status: "completed", responders: "5/5" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Form Penilaian</h2>
          <p className="text-sm text-muted-foreground">Buat dan kelola form AKHLAK Core Value untuk karyawan</p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <Plus size={14} /> Form Baru
        </button>
      </div>

      {showNew && (
        <div className="bg-card rounded-xl border border-accent/40 p-6 shadow-md">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText size={16} className="text-accent" /> Buat Form Baru — Q3 2025
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nama Form</label>
              <input defaultValue="Form AKHLAK Core Value 360 — Q3 2025"
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Periode</label>
              <input defaultValue="Q3 2025 (Jul — Sep)"
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Dimensi yang disertakan:</p>
            <div className="flex flex-wrap gap-2">
              {AKHLAK_QUESTIONS.map((q) => (
                <span key={q.value} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 size={10} /> {q.value} (4 soal)
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <Send size={13} /> Terbitkan Form
            </button>
            <button onClick={() => setShowNew(false)} className="px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition">
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {forms.map((f, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{f.name}</h3>
                  <p className="text-xs text-muted-foreground">Diterbitkan {f.published} · {f.questions} pertanyaan</p>
                </div>
              </div>
              <StatusBadge status={f.status === "active" ? "in_progress" : "completed"} />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={12} /> Responden: <strong className="text-foreground">{f.responders}</strong></span>
                <span className="flex items-center gap-1"><Layers size={12} /> 6 dimensi AKHLAK</span>
              </div>
              <button className="text-xs text-accent font-semibold hover:text-primary transition">Lihat Detail →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminResults() {
  const [selected, setSelected] = useState<string | null>(null);

  const staffResults = [
    { name: "Ibeng Prasetyo",  selfDone: true,  peerDone: true,  managerDone: false, managerApproved: null,  selfScore: 84.2, peerScore: 82.1, managerScore: null, finalScore: null },
    { name: "Siti Rahmawati", selfDone: true,  peerDone: false, managerDone: false, managerApproved: null,  selfScore: 87.0, peerScore: null, managerScore: null, finalScore: null },
    { name: "Ahmad Fauzi",    selfDone: false, peerDone: false, managerDone: false, managerApproved: null,  selfScore: null, peerScore: null, managerScore: null, finalScore: null },
    { name: "Dewi Putri",     selfDone: true,  peerDone: true,  managerDone: true,  managerApproved: true,  selfScore: 91.0, peerScore: 90.5, managerScore: 92.0, finalScore: 91.1 },
    { name: "Rizki Maulana",  selfDone: true,  peerDone: true,  managerDone: false, managerApproved: false, selfScore: 80.0, peerScore: 78.5, managerScore: null, finalScore: null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Hasil Penilaian</h2>
        <p className="text-sm text-muted-foreground">
          Rekap penilaian diri, rekan sejawat, dan manager per karyawan — Q2 2025
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <div className="grid grid-cols-7 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="col-span-2">Karyawan</span>
            <span>Diri</span>
            <span>Rekan</span>
            <span>Manager</span>
            <span>Mgr Approve</span>
            <span>Nilai Final</span>
          </div>
        </div>
        {staffResults.map((s, i) => (
          <div key={i}
            onClick={() => setSelected(selected === s.name ? null : s.name)}
            className="px-5 py-4 border-b border-border last:border-0 grid grid-cols-7 items-center hover:bg-secondary/20 transition cursor-pointer">
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                {s.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="text-sm font-medium text-foreground">{s.name}</span>
            </div>
            <div>{s.selfScore
              ? <span className="font-mono text-xs font-bold text-foreground">{s.selfScore}</span>
              : <span className="text-xs text-muted-foreground">—</span>}</div>
            <div>{s.peerScore
              ? <span className="font-mono text-xs font-bold text-foreground">{s.peerScore}</span>
              : <span className="text-xs text-muted-foreground">—</span>}</div>
            <div>{s.managerScore
              ? <span className="font-mono text-xs font-bold text-foreground">{s.managerScore}</span>
              : <span className="text-xs text-muted-foreground">—</span>}</div>
            <div>
              {s.managerApproved === true  && <StatusBadge status="approved" />}
              {s.managerApproved === false && <StatusBadge status="rejected" />}
              {s.managerApproved === null  && (s.peerDone ? <StatusBadge status="pending" /> : <span className="text-xs text-muted-foreground">—</span>)}
            </div>
            <div>{s.finalScore
              ? <span className="font-mono text-sm font-bold text-accent">{s.finalScore}</span>
              : <span className="text-xs text-muted-foreground italic">Belum final</span>}</div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Catatan:</strong> Nilai final dihitung setelah semua komponen (diri: 20%, rekan: 40%, manager: 40%)
        tersedia dan disetujui. Nilai final digunakan untuk penyusunan IDP dan Talent Mapping.
      </div>
    </div>
  );
}

function AdminTalent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Talent Mapping</h2>
        <p className="text-sm text-muted-foreground">Pemetaan talenta berdasarkan nilai akhir AKHLAK Core Value — Q1 2025</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Distribusi Talenta</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={TALENT_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {TALENT_DIST.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {TALENT_DIST.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{d.value} karyawan</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Tren Kepatuhan Organisasi</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ORG_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,58,107,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5A7094" }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#5A7094" }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: "#2563EB", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 9-box grid */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">9-Box Grid — Potensi vs. Performa</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Enigma", sub: "Potensi Tinggi, Performa Rendah", color: "bg-amber-50 border-amber-200", names: [] },
            { label: "High Potential", sub: "Potensi Tinggi, Performa Sedang", color: "bg-blue-50 border-blue-200", names: ["Ibeng P."] },
            { label: "Star / Top Talent", sub: "Potensi Tinggi, Performa Tinggi", color: "bg-emerald-50 border-emerald-200", names: ["Dewi P."] },
            { label: "Inconsistent Player", sub: "Potensi Sedang, Performa Rendah", color: "bg-red-50 border-red-200", names: [] },
            { label: "Core Player", sub: "Potensi Sedang, Performa Sedang", color: "bg-blue-50 border-blue-200", names: ["Rizki M.", "Ahmad F."] },
            { label: "High Performer", sub: "Potensi Sedang, Performa Tinggi", color: "bg-emerald-50 border-emerald-200", names: ["Siti R."] },
            { label: "Risk", sub: "Potensi Rendah, Performa Rendah", color: "bg-red-50 border-red-200", names: [] },
            { label: "Reliable", sub: "Potensi Rendah, Performa Sedang", color: "bg-secondary border-border", names: [] },
            { label: "Solid Contributor", sub: "Potensi Rendah, Performa Tinggi", color: "bg-secondary border-border", names: [] },
          ].map((cell, i) => (
            <div key={i} className={`border rounded-lg p-3 ${cell.color}`}>
              <p className="text-xs font-bold text-foreground">{cell.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{cell.sub}</p>
              {cell.names.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                  {cell.names.map((n) => (
                    <span key={n} className="bg-white px-2 py-0.5 rounded-full text-[10px] font-semibold text-foreground border border-border">{n}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type IDPEntry = { name: string; gap: string; action: string; deadline: string; status: string };

const AKHLAK_DIMS = ["Amanah", "Kompeten", "Harmonis", "Loyal", "Adaptif", "Kolaboratif"];
const STAFF_OPTIONS = MANAGER_STAFF_LIST.map((s) => s.name);

const EMPTY_FORM: Omit<IDPEntry, "name"> & { name: string } = {
  name: "", gap: "Amanah", action: "", deadline: "", status: "planned",
};

function AdminIDP() {
  const [idpList, setIdpList] = useState<IDPEntry[]>(IDP_DATA);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [successMsg, setSuccessMsg] = useState("");

  function validate() {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.name) e.name = "Pilih karyawan";
    if (!form.action.trim()) e.action = "Aksi pengembangan wajib diisi";
    if (!form.deadline) e.deadline = "Deadline wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setIdpList((prev) => [...prev, { ...form }]);
    setShowModal(false);
    setForm({ ...EMPTY_FORM });
    setErrors({});
    setSuccessMsg(`IDP untuk ${form.name} berhasil ditambahkan.`);
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  function handleClose() {
    setShowModal(false);
    setForm({ ...EMPTY_FORM });
    setErrors({});
  }

  function set(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Individual Development Plan (IDP)</h2>
          <p className="text-sm text-muted-foreground">Rencana pengembangan individu berdasarkan gap nilai AKHLAK Core Value</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={14} /> Tambah IDP
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Info banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
        <BookOpen size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-800">
          IDP disusun berdasarkan dimensi AKHLAK dengan skor terendah dari nilai final. Setiap karyawan
          mendapat rencana aksi yang spesifik, terukur, dan berjangka waktu.
        </p>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <div className="grid grid-cols-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Karyawan</span>
            <span>Gap Dimensi</span>
            <span className="col-span-2">Aksi Pengembangan</span>
            <span>Status</span>
          </div>
        </div>
        {idpList.length === 0 && (
          <div className="px-5 py-10 text-center text-muted-foreground text-sm">
            Belum ada data IDP. Klik "+ Tambah IDP" untuk memulai.
          </div>
        )}
        {idpList.map((d, i) => (
          <div key={i} className="px-5 py-4 border-b border-border last:border-0 grid grid-cols-5 items-center hover:bg-secondary/20 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {d.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{d.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{d.deadline}</p>
              </div>
            </div>
            <div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                {d.gap}
              </span>
            </div>
            <div className="col-span-2 pr-4">
              <p className="text-sm text-foreground">{d.action}</p>
            </div>
            <StatusBadge status={d.status} />
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,46,22,0.45)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-bold text-foreground text-base">Tambah IDP Baru</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Isi rencana pengembangan individu untuk staff</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Nama Karyawan */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Nama Karyawan <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${errors.name ? "border-red-400 bg-red-50" : "border-border"}`}
                >
                  <option value="">-- Pilih Staff --</option>
                  {STAFF_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Gap Dimensi */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Gap Dimensi AKHLAK <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AKHLAK_DIMS.map((dim) => (
                    <button
                      key={dim}
                      type="button"
                      onClick={() => set("gap", dim)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        form.gap === dim
                          ? "bg-red-50 border-red-400 text-red-700"
                          : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                      }`}
                    >
                      {dim}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aksi Pengembangan */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Aksi Pengembangan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.action}
                  onChange={(e) => set("action", e.target.value)}
                  placeholder="Contoh: Leadership Training Q3 2025"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${errors.action ? "border-red-400 bg-red-50" : "border-border"}`}
                />
                {errors.action && <p className="text-xs text-red-500 mt-1">{errors.action}</p>}
              </div>

              {/* Deadline & Status (side by side) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${errors.deadline ? "border-red-400 bg-red-50" : "border-border"}`}
                  />
                  {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus size={14} /> Simpan IDP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type PeriodEntry = { name: string; range: string; startDate: string; endDate: string; tipe: string; status: string; completion: number; deskripsi: string };

const INIT_PERIODS: PeriodEntry[] = [
  { name: "Q3 2025", range: "Jul 1 — Sep 30, 2025", startDate: "2025-07-01", endDate: "2025-09-30", tipe: "Kuartalan", status: "pending",     completion: 0,   deskripsi: "" },
  { name: "Q2 2025", range: "Apr 1 — Jun 30, 2025", startDate: "2025-04-01", endDate: "2025-06-30", tipe: "Kuartalan", status: "in_progress", completion: 80,  deskripsi: "" },
  { name: "Q1 2025", range: "Jan 1 — Mar 31, 2025", startDate: "2025-01-01", endDate: "2025-03-31", tipe: "Kuartalan", status: "completed",   completion: 100, deskripsi: "" },
  { name: "Q4 2024", range: "Oct 1 — Dec 31, 2024", startDate: "2024-10-01", endDate: "2024-12-31", tipe: "Kuartalan", status: "completed",   completion: 100, deskripsi: "" },
];

const EMPTY_PERIOD = { name: "", startDate: "", endDate: "", tipe: "Kuartalan", deskripsi: "" };

function formatDisplayRange(start: string, end: string) {
  if (!start || !end) return "";
  const fmt = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(start)} — ${fmt(end)}`;
}

function AdminPeriods() {
  const [periods, setPeriods] = useState<PeriodEntry[]>(INIT_PERIODS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_PERIOD });
  const [errors, setErrors] = useState<Partial<typeof EMPTY_PERIOD>>({});
  const [successMsg, setSuccessMsg] = useState("");

  function setField(field: keyof typeof EMPTY_PERIOD, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const e: Partial<typeof EMPTY_PERIOD> = {};
    if (!form.name.trim())    e.name      = "Nama periode wajib diisi";
    if (!form.startDate)      e.startDate = "Tanggal mulai wajib diisi";
    if (!form.endDate)        e.endDate   = "Tanggal selesai wajib diisi";
    if (form.startDate && form.endDate && form.endDate <= form.startDate)
                              e.endDate   = "Tanggal selesai harus setelah tanggal mulai";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const range = formatDisplayRange(form.startDate, form.endDate);
    const newPeriod: PeriodEntry = {
      name: form.name.trim(),
      range,
      startDate: form.startDate,
      endDate: form.endDate,
      tipe: form.tipe,
      status: "pending",
      completion: 0,
      deskripsi: form.deskripsi,
    };
    setPeriods((prev) => [newPeriod, ...prev]);
    setSuccessMsg(`Periode "${form.name.trim()}" berhasil ditambahkan.`);
    setTimeout(() => setSuccessMsg(""), 4000);
    handleClose();
  }

  function handleClose() {
    setShowModal(false);
    setForm({ ...EMPTY_PERIOD });
    setErrors({});
  }

  const statusIcon: Record<string, React.ReactNode> = {
    pending:     <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />,
    in_progress: <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />,
    completed:   <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Periode Penilaian</h2>
          <p className="text-sm text-muted-foreground">Kelola siklus penilaian AKHLAK Core Value</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-2 shadow-sm"
        >
          <Calendar size={14} /> Periode Baru
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Periode list */}
      <div className="space-y-3">
        {periods.map((p, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Calendar size={17} className="text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{p.name} Appraisal Period</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium border border-border">
                      {p.tipe}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    {statusIcon[p.status]}
                    {p.range}
                  </p>
                  {p.deskripsi && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{p.deskripsi}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={p.status} />
                <button className="text-xs text-accent hover:text-primary font-semibold transition">Konfigurasi</button>
              </div>
            </div>
            {p.status !== "pending" && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Penyelesaian</span>
                  <span className="text-xs font-bold font-mono text-foreground">{p.completion}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: `${p.completion}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,46,22,0.45)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-bold text-foreground text-base">Periode Penilaian Baru</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Atur jadwal siklus penilaian AKHLAK Core Value</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Nama Periode */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Nama Periode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Contoh: Q4 2025, Semester I 2026"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${errors.name ? "border-red-400 bg-red-50" : "border-border"}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Tipe Periode */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Tipe Periode</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Kuartalan", "Semesteran", "Tahunan"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setField("tipe", t)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        form.tipe === t
                          ? "bg-accent/10 border-accent text-accent"
                          : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal Mulai & Selesai */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${errors.startDate ? "border-red-400 bg-red-50" : "border-border"}`}
                  />
                  {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                    min={form.startDate || undefined}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${errors.endDate ? "border-red-400 bg-red-50" : "border-border"}`}
                  />
                  {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                </div>
              </div>

              {/* Preview range */}
              {form.startDate && form.endDate && form.endDate > form.startDate && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Calendar size={13} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-800 font-medium">
                    {formatDisplayRange(form.startDate, form.endDate)}
                  </p>
                </div>
              )}

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setField("deskripsi", e.target.value)}
                  placeholder="Catatan atau konteks tambahan untuk periode ini..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition resize-none"
                />
              </div>

              {/* Info note */}
              <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-secondary border border-border">
                <AlertCircle size={13} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Periode baru akan berstatus <strong>Pending</strong> dan dapat diaktifkan melalui menu Konfigurasi.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-2 shadow-sm"
                >
                  <Calendar size={14} /> Simpan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Shell ───────────────────────────────────────────────────────────

function Dashboard({ role, name, onLogout }: { role: Role; name: string; onLogout: () => void }) {
  const [activeNav, setActiveNav] = useState("overview");

  function renderContent() {
    if (role === "staff") {
      if (activeNav === "overview")         return <StaffOverview onNav={setActiveNav} name={name} />;
      if (activeNav === "self_assessment")  return <StaffSelfAssessment />;
      if (activeNav === "peer_review")      return <StaffPeerReview />;
      if (activeNav === "my_results")       return <StaffMyResults />;
      if (activeNav === "notifications")    return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Notifikasi</h2>
          {[
            { title: "Batas Nilai Rekan",    desc: "Selesaikan penilaian rekan sebelum 30 Jun 2025", urgent: true,  time: "2j lalu" },
            { title: "Form Baru Tersedia",   desc: "HR Admin menerbitkan form Q2 2025", urgent: false, time: "1h lalu" },
            { title: "Hasil Q1 Tersedia",    desc: "Hasil penilaian Q1 2025 dapat dilihat", urgent: false, time: "3h lalu" },
          ].map((n, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.urgent ? "bg-red-400" : "bg-blue-300"}`} />
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </div>
          ))}
        </div>
      );
    }
    if (role === "manager") {
      if (activeNav === "overview")    return <ManagerOverview onNav={setActiveNav} name={name} />;
      if (activeNav === "rate_staff")  return <ManagerRateStaff />;
      if (activeNav === "approve")     return <ManagerApprove />;
      if (activeNav === "team_recap")  return <ManagerTeamRecap />;
    }
    if (role === "admin") {
      if (activeNav === "overview") return <AdminOverview onNav={setActiveNav} name={name} />;
      if (activeNav === "forms")    return <AdminForms />;
      if (activeNav === "results")  return <AdminResults />;
      if (activeNav === "talent")   return <AdminTalent />;
      if (activeNav === "idp")      return <AdminIDP />;
      if (activeNav === "periods")  return <AdminPeriods />;
    }
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar role={role} name={name} activeNav={activeNav} onNav={setActiveNav} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PageHeader role={role} activeNav={activeNav} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ─── Logout Overlay ────────────────────────────────────────────────────────────

function LogoutScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,#052e16 0%,#166534 100%)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
          <LogOut size={22} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Sesi Berakhir</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8">
          Anda telah keluar dari Akhlak Core Value 360. Data sesi Anda telah dihapus dengan aman.
        </p>
        <button onClick={onBack}
          className="w-full py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <ArrowRight size={15} /> Kembali ke Login
        </button>
        <p className="text-xs text-muted-foreground mt-4">© 2025 Akhlak Core Value 360</p>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole]     = useState<Role>("staff");
  const [name, setName]     = useState("");

  function handleLogin(r: Role, n: string) {
    setRole(r); setName(n); setScreen("dashboard");
  }

  if (screen === "login")   return <LoginScreen onLogin={handleLogin} />;
  if (screen === "logout")  return <LogoutScreen onBack={() => setScreen("login")} />;
  return <Dashboard role={role} name={name} onLogout={() => setScreen("logout")} />;
}
