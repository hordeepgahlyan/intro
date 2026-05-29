"use client";
import { useEffect, useState } from "react";

const ART = `
██╗███╗   ██╗████████╗██████╗  ██████╗ 
██║████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗
██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║
██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║
██║██║ ╚████║   ██║   ██║  ██║╚██████╔╝
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝
`;

export default function AsciiSplash({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 100);
    const done = setTimeout(onDone, 1800);
    return () => {
      clearTimeout(show);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[50vh] transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <pre
        className="glow text-[#00ff41] leading-tight tracking-tight font-mono"
        style={{ fontSize: "clamp(6px, 1.8vw, 14px)" }}
      >
        {ART}
      </pre>
      <p className="text-[#007722] text-xs tracking-[0.4em] mt-2 animate-pulse">
        LOADING PORTFOLIO...
      </p>
    </div>
  );
}
