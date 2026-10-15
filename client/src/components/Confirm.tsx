import { useEffect, useState } from "react";

type ConfirmPayload = {
    message: string;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    resolve: (value: boolean) => void;
};

// Use instead of window.confirm():  const ok = await confirmDialog("Sure?", { confirmText: "Yes" })
export function confirmDialog(
    message: string,
    opts?: { title?: string; confirmText?: string; cancelText?: string }
): Promise<boolean> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("se-confirm", { detail: { message, resolve, ...(opts || {}) } })
        );
    });
}

export default function ConfirmHost() {
    const [data, setData] = useState<ConfirmPayload | null>(null);

    useEffect(() => {
        const handler = (e: Event) => setData((e as CustomEvent).detail as ConfirmPayload);
        window.addEventListener("se-confirm", handler);
        return () => window.removeEventListener("se-confirm", handler);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!data) return;
            if (e.key === "Escape") close(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (!data) return null;

    const close = (value: boolean) => {
        data.resolve(value);
        setData(null);
    };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-['Hanken_Grotesk']"
            onClick={() => close(false)}
        >
            <div
                className="se-modal-in w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#101012] p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <h3 className="text-base font-semibold text-[#ededee] tracking-tight">
                    {data.title || "Please confirm"}
                </h3>
                <p className="mt-2 text-[13px] text-[#9b9ba3] leading-relaxed">{data.message}</p>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={() => close(false)}
                        className="rounded-lg border border-white/[0.18] px-4 py-2 text-xs font-medium text-[#ededee] hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                        {data.cancelText || "Cancel"}
                    </button>
                    <button
                        onClick={() => close(true)}
                        className="rounded-lg bg-[#fafafa] px-4 py-2 text-xs font-semibold text-[#0a0a0b] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        {data.confirmText || "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}