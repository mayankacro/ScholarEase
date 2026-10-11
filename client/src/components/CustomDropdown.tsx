
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
buttonColorClassName = "border-zinc-800 bg-[#111111] text-white",
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

    
    const selectedOption = options.find(
        (option) => option.value === value
    );

    return (
        <div ref={dropdownRef} className={`relative w-full ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((previous) => !previous)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 ${buttonColorClassName} text-left text-sm outline-none transition-colors ${buttonClassName} ${
                    open
                        ? "border-purple-500"
                        : "border-zinc-800 hover:border-zinc-600"
                } ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                }`}
            >
                <span className={selectedOption ? "text-white" : "text-zinc-400"}>
                    {selectedOption?.label ?? placeholder}
                </span>

                <ChevronDown
                    size={16}
                    className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && !disabled && (
                <div
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-lg border border-zinc-800 bg-[#111111] p-1 shadow-xl shadow-black/40"
                >
                    {options.map((option) => {
                        const selected = option.value === value;

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
                                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                                    selected
                                        ? "bg-purple-600/20 text-purple-300"
                                        : "text-zinc-200 hover:bg-zinc-800"
                                }`}
                            >
                                <span>{option.label}</span>
                                {selected && (
                                    <Check
                                        size={16}
                                        className="text-purple-400"
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
