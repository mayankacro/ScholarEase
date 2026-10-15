import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
    { label: "Dashboard", path: "/student" },
    { label: "Upload Docs", path: "/upload" },
    { label: "My Repository", path: "/documents" },
];

// yaad rakhta hai last pill position (remount ke baad bhi) — directional slide ke liye
let lastPill: { left: number; width: number } | null = null;

export default function StudentNav() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const refs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [pill, setPill] = useState(lastPill || { left: 0, width: 0 });

    const activePath = items.find((i) => i.path === pathname)?.path || items[0].path;

    useEffect(() => {
        const measure = () => {
            const el = refs.current[activePath];
            if (el) {
                const next = { left: el.offsetLeft, width: el.offsetWidth };
                setPill(next);
                lastPill = next;
            }
        };
        // paint ke baad measure karo taaki transition pichhli position se chale
        const id = requestAnimationFrame(measure);
        window.addEventListener("resize", measure);
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener("resize", measure);
        };
    }, [activePath]);

    return (
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-white/[0.07] bg-[#101012] p-1">
            <span
                className="absolute top-1 bottom-1 rounded-full bg-white/[0.08] border border-white/[0.1] transition-all duration-300 ease-out"
                style={{ left: pill.left, width: pill.width }}
            />
            {items.map((it) => {
                const active = it.path === activePath;
                return (
                    <button
                        key={it.path}
                        ref={(el) => {
                            refs.current[it.path] = el;
                        }}
                        onClick={() => navigate(it.path)}
                        className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            active ? "text-[#ededee]" : "text-[#9b9ba3] hover:text-[#ededee]"
                        }`}
                    >
                        {it.label}
                    </button>
                );
            })}
        </nav>
    );
}