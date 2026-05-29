"use client";
import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "BIOS v2.1.4 ........................ OK",
  "checking RAM ........................ 4GB (1GB reserved for regrets)",
  "loading kernel modules .............. OK",
  "mounting filesystem ................. OK",
  "calibrating caffeine levels ......... ▓▓▓▓▓▓▓▓░░ 80%",
  "loading questionable life decisions . OK",
  "rewiring procrastination engine ..... OK",
  "scanning for bugs ................... 12 found, 11 ignored",
  "initializing personality matrix ..... OK",
  "starting portfolio daemon ........... OK",
  "checking impostor syndrome .......... still present",
  "loading easter eggs ................. 5 hidden",
  "warming up CRT display .............. ▓▓▓▓▓▓▓▓▓▓ done",
  "",
  "system ready. welcome, traveler.",
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        return;
      }
      setLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => onDoneRef.current(), 800);
      }
    }, 160);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-[2px]">
      {lines.map((line, idx) => (
        <p
          key={idx}
          className="line-in font-mono text-xs sm:text-sm"
          style={{
            color:
              typeof line === "string" &&
              (line.includes("found") ||
                line.includes("present") ||
                line.includes("ignored"))
                ? "#ffb000"
                : typeof line === "string" && line.includes("welcome")
                  ? "var(--crt-color)"
                  : "var(--crt-color-dim)",
            textShadow:
              typeof line === "string" && line.includes("welcome")
                ? "var(--crt-glow)"
                : "none",
          }}
        >
          {line || "\u00A0"}
        </p>
      ))}
    </div>
  );
}
