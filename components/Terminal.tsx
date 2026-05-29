"use client";
import { ReactNode, useState, useEffect } from "react";

const THEMES = ["green", "amber", "white"] as const;
type Theme = (typeof THEMES)[number];

interface TerminalProps {
  children: ReactNode;
  activeCmd?: string;
  onTerminalClick?: () => void;
  isKonami?: boolean;
  soundOn: boolean;
  onSoundToggle: () => void;
  onShortcut: (cmd: string) => void;
  onExit: () => void;
}

const SHORTCUTS = ["about", "projects", "skills", "contact", "help"];

export default function Terminal({
  children,
  activeCmd,
  onTerminalClick,
  isKonami,
  soundOn,
  onSoundToggle,
  onShortcut,
  onExit,
}: TerminalProps) {
  const [theme, setTheme] = useState<Theme>("green");
  const [crt, setCrt] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [minimizing, setMinimizing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [sessionId] = useState(() =>
    Math.random().toString(36).slice(2, 10).toUpperCase(),
  );
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle("no-crt", !crt);
  }, [crt]);

  // ESC closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowExitModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const cycleTheme = () =>
    setTheme((t) => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);

  const handleMinimize = () => {
    setMinimizing(true);
    setTimeout(() => {
      setMinimized(true);
      setMinimizing(false);
    }, 240);
  };

  const handleRestore = () => {
    setMinimized(false);
    setRestoring(true);
    setTimeout(() => setRestoring(false), 240);
  };

  const handleMaximize = () => setMaximized((v) => !v);

  const handleCloseConfirm = () => {
    setShowExitModal(false);
    setExiting(true);
    onExit();
  };

  const windowClass = [
    "crt-flicker border rounded terminal-window",
    isKonami ? "konami-glitch" : "",
    minimizing ? "minimizing" : "",
    restoring ? "restoring" : "",
    exiting ? "terminal-exit" : "",
    maximized ? "w-full max-w-full mx-0" : "w-full max-w-3xl",
  ]
    .filter(Boolean)
    .join(" ");

  // Minimized dock bar
  if (minimized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-end p-4">
        <button
          onClick={handleRestore}
          className="flex items-center gap-3 px-6 py-2 border rounded font-mono text-xs tracking-widest transition-all"
          style={{
            borderColor: "var(--crt-color)",
            color: "var(--crt-color)",
            background: "#001100",
            boxShadow: "var(--crt-glow)",
          }}
        >
          <span>▬</span>
          <span>hordeep@portfolio:~ [minimized]</span>
          <span>▬</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Exit confirmation modal */}
      {showExitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setShowExitModal(false)}
        >
          <div
            className="modal-in border rounded p-6 font-mono max-w-sm w-full mx-4"
            style={{
              background: "#020d02",
              borderColor: "var(--crt-color)",
              boxShadow:
                "0 0 40px color-mix(in srgb, var(--crt-color) 30%, transparent)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="glow text-sm font-bold mb-1"
              style={{ color: "var(--crt-color)" }}
            >
              ⚠ TERMINATE SESSION?
            </p>
            <p
              className="text-xs mb-4"
              style={{ color: "var(--crt-color-dim)" }}
            >
              connection to terminal will be closed.
              <br />
              all unsaved output will be lost.
            </p>
            <div
              className="border-t pt-3 mt-2 text-xs mb-4"
              style={{
                borderColor: "var(--crt-color-dark)",
                color: "var(--crt-color-dark)",
              }}
            >
              session_id: {sessionId}
              <br />
              uptime: {uptime}s
            </div>
            <div className="flex gap-3">
              <button
                autoFocus
                onClick={handleCloseConfirm}
                className="flex-1 py-2 text-xs font-mono border rounded-sm transition-all"
                style={{
                  background: "#001a00",
                  borderColor: "var(--crt-color)",
                  color: "var(--crt-color)",
                }}
              >
                [ TERMINATE ]
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2 text-xs font-mono border rounded-sm transition-all"
                style={{
                  borderColor: "var(--crt-color-dark)",
                  color: "var(--crt-color-dim)",
                }}
              >
                [ CANCEL ]
              </button>
            </div>
            <p
              className="text-[10px] mt-3 text-center"
              style={{ color: "var(--crt-color-dark)" }}
            >
              ESC or click outside to cancel
            </p>
          </div>
        </div>
      )}

      {/* Terminal window */}
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 ${maximized ? "p-0" : ""}`}
      >
        <div
          className={windowClass}
          style={{
            borderColor: "var(--crt-color)",
            boxShadow:
              "0 0 30px color-mix(in srgb, var(--crt-color) 20%, transparent)",
            WebkitTapHighlightColor: "transparent",
          }}
          onClick={onTerminalClick}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-b flex-wrap"
            style={{ borderColor: "var(--crt-color)", background: "#001100" }}
          >
            {/* Window controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                title="close"
                onClick={(e) => {
                  e.stopPropagation();
                  setUptime(Math.floor(performance.now() / 1000));
                  setShowExitModal(true);
                }}
                className="w-3 h-3 rounded-full bg-red-500 opacity-70 hover:opacity-100 transition-opacity"
              />
              <button
                title="minimize"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMinimize();
                }}
                className="w-3 h-3 rounded-full bg-yellow-500 opacity-70 hover:opacity-100 transition-opacity"
              />
              <button
                title="maximize"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMaximize();
                }}
                className="w-3 h-3 rounded-full bg-green-500 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Title */}
            <span
              className="text-xs tracking-widest mx-2 shrink-0"
              style={{ color: "var(--crt-color-dim)" }}
            >
              hordeep@portfolio:~
            </span>

            {/* Theme + CRT controls — wrap on small screens */}
            <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cycleTheme();
                }}
                className="text-[10px] font-mono px-2 py-0.5 border rounded-sm whitespace-nowrap"
                style={{
                  color: "var(--crt-color-dim)",
                  borderColor: "var(--crt-color-dark)",
                }}
              >
                {theme}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCrt((v) => !v);
                }}
                className="text-[10px] font-mono px-2 py-0.5 border rounded-sm whitespace-nowrap"
                style={{
                  color: "var(--crt-color-dim)",
                  borderColor: "var(--crt-color-dark)",
                }}
              >
                crt:{crt ? "on" : "off"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className={`p-6 text-sm leading-7 relative overflow-hidden ${maximized ? "min-h-[85vh]" : "min-h-[70vh]"}`}
          >
            {children}
            {/* Mobile keyboard hint */}
            <p
              className="sm:hidden text-center font-mono text-[10px] mt-4 animate-pulse"
              style={{ color: "var(--crt-color-dark)" }}
            >
              [ tap here to type ]
            </p>
          </div>

          {/* Bottom bar — shortcuts + sound */}
          <div
            className="flex flex-wrap items-center gap-2 px-6 py-3 border-t"
            style={{ borderColor: "var(--crt-color-dark)" }}
          >
            {SHORTCUTS.map((cmd) => {
              const isActive = activeCmd === cmd;
              return (
                <button
                  key={cmd}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShortcut(cmd);
                  }}
                  className="px-3 py-1 text-xs font-mono border rounded-sm transition-all duration-150"
                  style={{
                    color: isActive
                      ? "var(--crt-color)"
                      : "var(--crt-color-dim)",
                    borderColor: isActive
                      ? "var(--crt-color)"
                      : "var(--crt-color-dark)",
                    boxShadow: isActive
                      ? "0 0 8px color-mix(in srgb, var(--crt-color) 40%, transparent)"
                      : "none",
                  }}
                >
                  {cmd}
                </button>
              );
            })}

            {/* Sound button — lives here, flush right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSoundToggle();
              }}
              className="ml-auto px-3 py-1 text-xs font-mono border rounded-sm transition-all duration-150"
              style={{
                color: soundOn
                  ? "var(--crt-color-dim)"
                  : "var(--crt-color-dark)",
                borderColor: soundOn
                  ? "var(--crt-color-dark)"
                  : "var(--crt-color-dark)",
              }}
            >
              sound:{soundOn ? "on" : "off"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
