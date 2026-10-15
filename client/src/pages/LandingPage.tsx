import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Sparkles,
    Workflow,
    ListChecks,
    ShieldCheck,
} from "lucide-react";
import Reveal from "../components/Reveal";


function LandingPage() {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 150);
        return () => clearTimeout(t);
    }, []);

    const navItems = [
    { id: "features", label: "Platform" },
    { id: "how", label: "How it works" },
    { id: "stats", label: "Results" },
];
const [activeNav, setActiveNav] = useState("features");
const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
const [pill, setPill] = useState({ left: 0, width: 0 });

useEffect(() => {
    const measure = () => {
        const el = navRefs.current[activeNav];
        if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
}, [activeNav]);

    const features = [
        {
            icon: Sparkles,
            title: "Multimodal AI check",
            desc: "Gemini reads each document image like a person — judging clarity, correct type and completeness in one pass.",
        },
        {
            icon: Workflow,
            title: "Three-tier fallback",
            desc: "Gemini first, OpenRouter if it fails, then a safe manual-review state — validation never silently breaks.",
        },
        {
            icon: ListChecks,
            title: "Dynamic checklists",
            desc: "Admins set exactly which documents each scholarship category needs, so students see a personalised list.",
        },
    ];

    const steps = [
        { t: "Register", d: "Sign up under your scholarship category and get a secure session." },
        { t: "Upload", d: "Pick a required document from your checklist and drop a JPG, PNG or PDF." },
        { t: "AI reads", d: "The file streams to Cloudinary and straight to the AI for a verdict." },
        { t: "Admin reviews", d: "An administrator confirms the verdict and approves or rejects." },
        { t: "Decision + email", d: "You're notified by email the moment a decision is made." },
    ];

    const stats = [
        { n: "<5s", l: "to first AI verdict" },
        { n: "3", l: "providers, auto-fallback" },
        { n: "0–100", l: "confidence score" },
        { n: "4", l: "scholarship categories" },
    ];

    const queue = [
        { fi: "PDF", name: "Income Certificate", sub: "Aarav Kapoor · OBC", v: 94, chip: "Valid" },
        { fi: "JPG", name: "Marksheet 2024", sub: "Meera Shah · SC", v: 71, chip: "Review" },
        { fi: "PNG", name: "Bank Passbook", sub: "Rohan Verma · ST", v: 38, chip: "Invalid" },
        { fi: "PDF", name: "Caste Certificate", sub: "Priya Nair · OBC", v: 89, chip: "Valid" },
    ];

    const chipClass = (c: string) =>
        c === "Valid"
            ? "bg-[#fafafa] text-[#0a0a0b]"
            : c === "Review"
            ? "border border-white/[0.2] text-[#9b9ba3]"
            : "bg-white/[0.05] text-[#67676e] line-through decoration-1";

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-[#ededee] font-['Hanken_Grotesk'] selection:bg-[#fafafa] selection:text-black">
            {/* NAV */}
            <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0a0a0b]/70 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between gap-5">
                    <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-md border border-white/[0.14] grid place-items-center font-['JetBrains_Mono'] text-[11px] font-medium">
                            SE
                        </span>
                        <span className="text-[15px] font-semibold tracking-tight">ScholarEase</span>
                    </div>
                   <nav className="hidden md:flex relative items-center rounded-full border border-white/[0.07] bg-[#101012] p-1">
    {/* sliding pill */}
    <span
        className="absolute top-1 bottom-1 rounded-full bg-white/[0.08] border border-white/[0.1] transition-all duration-300 ease-out"
        style={{ left: pill.left, width: pill.width }}
    />
    {navItems.map((it) => (
        <a
            key={it.id}
            href={`#${it.id}`}
            ref={(el) => {
                navRefs.current[it.id] = el;
            }}
            onClick={() => setActiveNav(it.id)}
            className={`relative z-10 px-4 py-1.5 text-[13px] font-medium transition-colors ${
                activeNav === it.id ? "text-[#ededee]" : "text-[#9b9ba3] hover:text-[#ededee]"
            }`}
        >
            {it.label}
        </a>
    ))}
</nav>
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => navigate("/login")}
                            className="hidden sm:inline text-[13.5px] text-[#9b9ba3] hover:text-[#ededee] transition-colors cursor-pointer"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="rounded-lg bg-[#fafafa] px-4 py-2 text-[13px] font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            Get started
                        </button>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_300px_at_20%_0%,rgba(255,255,255,0.05),transparent_70%)]" />
                <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-3 py-1.5 font-['JetBrains_Mono'] text-[11.5px] text-[#9b9ba3]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#fafafa]" />
                            All systems operational
                        </span>
                        <h1 className="mt-5 text-[34px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.02em]">
                            Verify scholarship documents in seconds, not weeks.
                        </h1>
                        <p className="mt-5 text-[15.5px] text-[#9b9ba3] leading-relaxed max-w-md">
                            Students upload once. A multimodal AI reads each document, scores it, and routes it to an administrator — so genuine applicants never lose a deadline to manual checking.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate("/register")}
                                className="group inline-flex items-center gap-2 rounded-lg bg-[#fafafa] px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Start verifying
                                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="rounded-lg border border-white/[0.13] px-5 py-2.5 text-[13.5px] font-semibold text-[#ededee] hover:bg-white/[0.04] transition-colors cursor-pointer"
                            >
                                Sign in
                            </button>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-['JetBrains_Mono'] text-[11.5px] text-[#67676e]">
                            <span className="text-[#9b9ba3]">JWT secured</span>
                            <span className="text-[#9b9ba3]">Cloudinary storage</span>
                            <span className="text-[#9b9ba3]">Gemini 2.5 Flash</span>
                        </div>
                    </div>

                    {/* preview card */}
                    <div className="rounded-2xl border border-white/[0.07] bg-[#101012] overflow-hidden">
                        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.07]">
                            <span className="flex gap-1.5">
                                <i className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                                <i className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                                <i className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                            </span>
                            <span className="font-['JetBrains_Mono'] text-[11.5px] text-[#9b9ba3]">review-queue</span>
                            <span className="ml-auto font-['JetBrains_Mono'] text-[10.5px] text-[#67676e]">14 pending</span>
                        </div>
                        <div>
                            {queue.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07] last:border-0"
                                >
                                    <span className="h-10 w-8 shrink-0 grid place-items-center rounded-md border border-white/[0.12] font-['JetBrains_Mono'] text-[9px] text-[#67676e]">
                                        {r.fi}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[13.5px] font-medium truncate">{r.name}</p>
                                        <p className="font-['JetBrains_Mono'] text-[10.5px] text-[#67676e]">{r.sub}</p>
                                    </div>
                                    <div className="w-[52px] h-1 rounded-full bg-white/[0.1] overflow-hidden">
                                        <div
                                            className="h-full bg-[#fafafa] transition-[width] duration-1000 ease-out"
                                            style={{ width: loaded ? `${r.v}%` : "0%" }}
                                        />
                                    </div>
                                    <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${chipClass(r.chip)}`}>
                                        {r.chip}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="border-t border-white/[0.07]">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-18">
                    <Reveal>
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#67676e]">Platform</span>
                        <h2 className="mt-3 text-[26px] sm:text-[32px] font-semibold tracking-tight max-w-xl">
                            Automation that assists the officer, never replaces them.
                        </h2>
                        <p className="mt-3 text-[15px] text-[#9b9ba3] max-w-lg">
                            Every document gets an instant first read. The final decision always stays with a person.
                        </p>
                    </Reveal>
                    <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <Reveal key={i} delay={i * 120} className="h-full">
                                    <div className="h-full rounded-xl border border-white/[0.07] bg-[#101012] p-6 transition-all duration-200 hover:border-white/[0.16] hover:-translate-y-0.5">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.12] text-[#ededee]">
                                            <Icon size={18} />
                                        </span>
                                        <h3 className="mt-4 text-[16.5px] font-semibold">{f.title}</h3>
                                        <p className="mt-2 text-[13.5px] text-[#9b9ba3] leading-relaxed">{f.desc}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how" className="border-t border-white/[0.07]">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-18">
                    <Reveal>
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#67676e]">The flow</span>
                        <h2 className="mt-3 text-[26px] sm:text-[32px] font-semibold tracking-tight">Five steps, no waiting.</h2>
                    </Reveal>
                    <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {steps.map((s, i) => (
                            <Reveal key={i} delay={i * 80} className="h-full">
                                <div className="h-full rounded-xl border border-white/[0.07] bg-[#101012] p-5 transition-all duration-200 hover:border-white/[0.16] hover:-translate-y-0.5">

                                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#67676e]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <h4 className="mt-3 text-[15px] font-semibold">{s.t}</h4>
                                    <p className="mt-1.5 text-[12.5px] text-[#9b9ba3] leading-relaxed">{s.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section id="stats" className="border-t border-white/[0.07]">
                <Reveal>
                    <div className="max-w-6xl mx-auto px-5 sm:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4">
                            {stats.map((s, i) => (
                                <div
                                    key={i}
                                    className={`py-8 ${i % 2 === 1 ? "border-l border-white/[0.07]" : ""} lg:border-l lg:first:border-l-0 ${i >= 2 ? "border-t border-white/[0.07] lg:border-t-0" : ""} px-5`}
                                >
                                    <div className="text-[30px] sm:text-[36px] font-semibold tracking-tight tabular-nums">{s.n}</div>
                                    <div className="mt-2 text-[13px] text-[#9b9ba3]">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* CTA */}
            <section className="border-t border-white/[0.07]">
                <Reveal>
                    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center flex flex-col items-center gap-5">
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#67676e]">Ready when you are</span>
                        <h2 className="text-[28px] sm:text-[44px] font-semibold tracking-tight max-w-[18ch]">
                            Clear the backlog before the deadline, not after it.
                        </h2>
                        <p className="text-[15px] text-[#9b9ba3] max-w-md">
                            Create your account, upload your documents, and let the queue sort itself.
                        </p>
                        <button
                            onClick={() => navigate("/register")}
                            className="group inline-flex items-center gap-2 rounded-lg bg-[#fafafa] px-6 py-3 text-[14px] font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            Open ScholarEase
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </Reveal>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/[0.07]">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 flex flex-wrap items-center justify-between gap-3 font-['JetBrains_Mono'] text-[11.5px] text-[#67676e]">
                    <span className="flex items-center gap-2">
                        <ShieldCheck size={13} /> © 2026 SCHOLAREASE
                    </span>
                    <span>REACT · EXPRESS · MONGODB · CLOUDINARY</span>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;