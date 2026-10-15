import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type CustomDropdownProps = {
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    buttonClassName?: string;
    buttonColorClassName?: string;
};

export default function CustomDropdown({
    value,
    options,
    onChange,
    placeholder = "Select an option",
    className = "",
    disabled = false,
    buttonClassName = "",
    buttonColorClassName = "border-white/[0.1] bg-[#0c0c0e] text-[#ededee]",
}: CustomDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const selectedOption = options.find((option) => option.value === value);

    return (
        <div ref={dropdownRef} className={`relative w-full ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((previous) => !previous)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-3 text-left text-[13px] outline-none transition-colors duration-200 ${buttonColorClassName} ${buttonClassName} ${
                    open ? "border-white/60" : "hover:border-white/[0.2]"
                } ${
                    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
            >
                <span className={selectedOption && selectedOption.value ? "text-[#ededee] font-medium" : "text-[#5a5a60]"}>
                    {selectedOption?.label ?? placeholder}
                </span>

                <ChevronDown
                    size={16}
                    className={`shrink-0 text-[#9b9ba3] transition-transform duration-200 ${
                        open ? "rotate-180 text-[#ededee]" : ""
                    }`}
                />
            </button>

            {open && !disabled && (
                <div
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-white/[0.1] bg-[#0c0c0e]/98 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl"
                >
                    {options.map((option) => {
                        const selected = option.value === value;
                        const isPlaceholder = option.value === "";

                        if (isPlaceholder) return null;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] transition-colors cursor-pointer ${
                                    selected
                                        ? "bg-white/[0.08] text-[#ededee] font-semibold"
                                        : "text-[#9b9ba3] hover:bg-white/[0.05] hover:text-[#ededee]"
                                }`}
                            >
                                <span>{option.label}</span>
                                {selected && (
                                    <Check
                                        size={14}
                                        className="text-[#ededee]"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}