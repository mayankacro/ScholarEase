import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };

// Call this anywhere instead of alert():  toast("Saved!", "success")
export function toast(message: string, type: ToastType = "info") {
    window.dispatchEvent(new CustomEvent("se-toast", { detail: { message, type } }));
}

export default function Toaster() {
    const [items, setItems] = useState<ToastItem[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const { message, type } = (e as CustomEvent).detail as { message: string; type: ToastType };
            const id = Date.now() + Math.random();
            setItems((prev) => [...prev, { id, message, type }]);
            setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3800);
        };
        window.addEventListener("se-toast", handler);
        return () => window.removeEventListener("se-toast", handler);
    }, []);

    const dismiss = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

    return (
        <div className="pointer-events-none fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2.5 font-['Hanken_Grotesk']">
            {items.map((t) => (
                <div
                    key={t.id}
                    className="se-toast-in pointer-events-auto flex items-start gap-3 min-w-[260px] max-w-[360px] rounded-lg border border-white/[0.12] bg-[#101012] px-4 py-3 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)]"
                >
                    {t.type === "success" ? (
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fafafa] text-[#0a0a0b]">
                            <Check size={13} />
                        </span>
                    ) : (
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.35] text-[#ededee] font-['JetBrains_Mono'] text-[11px]">
                            !
                        </span>
                    )}

                    <p className="flex-1 text-[13px] leading-snug text-[#ededee]">{t.message}</p>

                    <button
                        onClick={() => dismiss(t.id)}
                        className="mt-0.5 text-[#67676e] hover:text-[#ededee] transition-colors cursor-pointer"
                        aria-label="Dismiss"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}