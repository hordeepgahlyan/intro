"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Terminal from "@/components/Terminal";
import BootSequence from "@/components/BootSequence";
import AsciiSplash from "@/components/AsciiSplash";

const INFO_LINES = [
  { label: "user", value: "hordeep" },
  { label: "role", value: "student · builder · explorer" },
  { label: "based", value: "India" },
  { label: "status", value: "learning everything" },
  { label: "hint", value: "5 secrets hidden here" },
];

const SMALL_ART = [
  "██╗  ██╗ ██████╗ ██████╗ ██████╗ ███████╗███████╗██████╗ ",
  "██║  ██║██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗",
  "███████║██║   ██║██████╔╝██║  ██║█████╗  █████╗  ██████╔╝",
  "██╔══██║██║   ██║██╔══██╗██║  ██║██╔══╝  ██╔══╝  ██╔═══╝ ",
  "██║  ██║╚██████╔╝██║  ██║██████╔╝███████╗███████╗██║     ",
  "╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝     ",
].join("\n");

const JOKES = [
  "why do programmers prefer dark mode? because light attracts bugs.",
  "how do you comfort a javascript bug? you console it.",
  "a sql query walks into a bar and asks two tables... can I join you?",
  "why did the developer go broke? he used up all his cache.",
  "what do you call a developer who doesn't comment their code? a sociopath.",
  "why do java developers wear glasses? because they don't C#.",
  "a programmer's partner: 'get milk. if eggs, get 12.' they came back with 12 milks.",
  "why did the programmer quit? because they didn't get arrays.",
  "what's a computer's favorite snack? microchips.",
  "why was the javascript developer sad? they didn't know how to null their feelings.",
  "how many programmers to change a lightbulb? none, that's a hardware problem.",
  "what do you call a programmer from finland? nerdic.",
  "why did the developer go to therapy? too many unresolved issues.",
  "what's the object-oriented way to become wealthy? inheritance.",
  "why don't programmers like nature? too many bugs and no debugging tool.",
  "why did the function break up with the variable? too many side effects.",
  "a byte walks into a bar looking pale. bartender: 'what's wrong?' byte: 'bit flip.'",
  "how do you know a developer is an extrovert? they look at YOUR shoes when talking.",
  "what did the programmer say on their deathbed? 'finally.'",
  "99 little bugs in the code. 99 little bugs. take one down, patch it around. 127 bugs in the code.",
  "why did the embedded developer cross the road? to initialize the other side.",
  "an arduino walks into a bar. bartender: 'we don't serve your kind.' arduino: 'that's fine, I'll just loop.'",
  "why don't IoT devices tell jokes? too many connectivity issues.",
];

const NOT_FOUND_RESPONSES = [
  (c: string) => `command not found: '${c}' — skill issue.`,
  (c: string) => `'${c}': not a command. not a suggestion either.`,
  (c: string) => `error: '${c}' undefined. unlike your curiosity.`,
  (c: string) => `bash: ${c}: command not found. type 'help' or suffer.`,
  (c: string) => `'${c}'? bold choice. wrong choice. try 'help'.`,
  (c: string) => `404: command '${c}' not found in this dimension.`,
  (c: string) => `nice try with '${c}'. type 'help' for actual options.`,
];

const COMMANDS: Record<string, string[]> = {
  help: [
    "available commands:",
    "  about      → who I am",
    "  projects   → things I've built",
    "  skills     → tech I know",
    "  contact    → reach me",
    "  ls         → list files",
    "  exit       → close terminal",
    "  clear      → clear screen",
    "",
    "  [ psst: not all commands are listed ]",
    "  [ curiosity is rewarded here ]",
    "",
  ],
  about: [
    "╔══════════════════════════════════════╗",
    "║  ABOUT ME                            ║",
    "╚══════════════════════════════════════╝",
    "  name    : Hordeep Gahlyan",
    "  role    : student · builder · explorer",
    "  based   : India",
    "  status  : learning everything in sight",
    "  traits  : fast learner · deeply curious",
    "           jack of all trades,",
    "           master of none —",
    "           but often better than a master of one.",
    "  loves   : programming · iot · robotics",
    "           computers · embedded systems",
    "  warning : will ask 'but how does it actually work?'",
    "",
  ],
  projects: [
    "╔══════════════════════════════════════╗",
    "║  PROJECTS                            ║",
    "╚══════════════════════════════════════╝",
    "  → science exhibition projects",
    "    built hardware projects using microcontrollers",
    "    and sensors for school exhibitions.",
    "    boards : arduino uno · esp32 · esp8266",
    "             arduino nano · ardupilot",
    "",
    "  → intro  (this site)",
    "    retro terminal portfolio built from scratch.",
    "    stack  : next.js · typescript · tailwind css",
    "    link   : github.com/hordeepgahlyan",
    "    note   : yes, I built a terminal to avoid",
    "             building a normal portfolio.",
    "",
    "  → more brewing...",
    "    [ currently: learning full stack dev ]",
    "    [ ETA: when the coffee kicks in ]",
    "",
  ],
  skills: [
    "╔══════════════════════════════════════╗",
    "║  SKILLS                              ║",
    "╚══════════════════════════════════════╝",
    "  languages   : python · java · c++",
    "               javascript (learning)",
    "  hardware    : arduino uno · esp32 · esp8266",
    "               arduino nano · ardupilot",
    "  domains     : embedded systems · iot · robotics",
    "  web         : html · css · next.js (learning)",
    "  other       : communication · english · debate",
    "  superpower  : picking things up dangerously fast",
    "  currently   : full stack web development",
    "",
  ],
  contact: [
    "╔══════════════════════════════════════╗",
    "║  CONTACT                             ║",
    "╚══════════════════════════════════════╝",
    "  email    : hordeepgahlyan1@gmail.com",
    "  github   : github.com/hordeepgahlyan",
    "  linkedin : linkedin.com/in/hordeep-gahlyan-09a834400",
    "",
    "  response time: faster than my compile times.",
    "",
  ],
  ls: [
    "total 5",
    "drwxr-xr-x  about/",
    "drwxr-xr-x  projects/",
    "-rw-r--r--  skills.txt",
    "-rw-r--r--  contact.txt",
    "-rwxr-xr-x  resume.pdf",
    "",
    "  tip: try 'cat skills.txt' or 'cat about.txt'",
    "",
  ],
  sudo: [
    "sudo: permission denied.",
    "this incident has been reported.",
    "just kidding. but seriously, stop. 👀",
    "",
  ],
  "sudo hire-me": [
    "  cannot hire a student via sudo.",
    "  but you can watch the journey unfold.",
    "  github   : github.com/hordeepgahlyan",
    "  linkedin : linkedin.com/in/hordeep-gahlyan-09a834400",
    "  the trajectory is worth watching.",
    "",
  ],
  whoami: [
    "  hordeep gahlyan.",
    "  school student. technology obsessive.",
    "  jack of all trades, master of none —",
    "  but often better than a master of one.",
    "  currently : learning everything in sight",
    "  the rabbit hole has no bottom.",
    "  falling and enjoying the fall.",
    "",
  ],
  coffee: [
    "        ( (         ",
    "         ) )        ",
    "      ._______.     ",
    "      |       |]    ",
    "      |  ☕  |     ",
    "      \\       /     ",
    "       `-----'      ",
    "",
    "  fuel level: always critical.",
    "  debugging speed directly proportional",
    "  to cups consumed.",
    "",
  ],
  lore: [
    "╔══════════════════════════════════════╗",
    "║  TERMINAL LORE                       ║",
    "╚══════════════════════════════════════╝",
    "",
    "  it started with a science exhibition.",
    "  a microcontroller. some sensors. a question:",
    "  'but how does it actually work?'",
    "",
    "  that question never stopped.",
    "",
    "  python led to c++. c++ led to hardware.",
    "  hardware led to iot. iot led to robotics.",
    "  robotics led to web dev somehow.",
    "  web dev led to this terminal at some ungodly hour.",
    "",
    "  the rabbit hole has no bottom.",
    "  still falling.",
    "  still curious. still building.",
    "  enjoying.",
    "",
    "  somewhere in here, 5 secrets wait.",
    "  you've already found one.",
    "",
  ],
  bossfight: [
    "  loading boss fight...",
    "",
    "  ╔══════════════════════════════════╗",
    "  ║   FINAL BOSS: IMPOSTER SYNDROME  ║",
    "  ║   'you're just a school student' ║",
    "  ╚══════════════════════════════════╝",
    "",
    "  BOSS: you're too young for this.",
    "  YOU:  built an iot project in middle school. next.",
    "  BOSS: you're not good enough.",
    "  YOU:  git commit -m 'prove it'",
    "  BOSS: your code has bugs.",
    "  YOU:  git commit -m 'they are features'",
    "  BOSS: you don't have a degree.",
    "  YOU:  git push --force",
    "  BOSS: nobody will take you seriously.",
    "  YOU:  shipped anyway.",
    "",
    "  > BOSS DEFEATED.",
    "  > +100 xp: shipped before graduating.",
    "  > +100 confidence points.",
    "  > achievement unlocked: started early.",
    "",
  ],
  "404": [
    "  ERROR 404: conventional career path not found.",
    "",
    "  this is not a bug.",
    "  this is the build.",
    "  wait, that's a good thing.",
    "  everything else is fine though.",
    "  probably. ;) ",
    "",
  ],
  hacktheplanet: [
    "  ⚡ HACK THE PLANET ⚡",
    "",
    "  step 1: open laptop",
    "  step 2: look focused in a coffee shop",
    "  step 3: type very fast",
    "  step 4: say 'I'm in'",
    "  step 5: npm install",
    "  step 6: wait 4 minutes for node_modules",
    "  step 7: question all life choices",
    "  step 8: ship it anyway",
    "",
    "  planet status: hacked. probably.",
    "",
  ],
  "hire-me": [
    "  running hire-me.exe...",
    "",
    "  ✓ writes code that actually runs",
    "  ✓ can write clean code",
    "  ✓ can write comments",
    "  ✓ knows when not to use regex",
    "  ✓ commits with useful messages (usually)",
    "  ✓ will not rewrite everything in rust",
    "  ✓ brings own coffee",
    "  ✓ debugs hardware AND software",
    "  ✓ learns new things at alarming speed",
    "  ✓ asks the right questions",
    "  ✓ communicates clearly",
    "  ✓ debate champion energy in code reviews",
    "  ✗ not available for full-time (still in school)",
    "  ✓ available for: collaborations · projects",
    "                  internships · cool ideas",
    "",
    "  verdict: worth watching. contact below.",
    "  email  : hordeepgahlyan1@gmail.com",
    "",
  ],
  neofetch: [
    "  hordeep@portfolio",
    "  ─────────────────────",
    "  OS      : Portfolio-OS v1.0",
    "  Host    : school desk with too many tabs open",
    "  Kernel  : curiosity 6.1.0-stable",
    "  Shell   : terminal.tsx",
    "  Theme   : green-on-black (obviously)",
    "  CPU     : brain @ 3am (overclocked)",
    "  RAM     : 70% consumed by 'what if I tried...'",
    "  Disk    : full of half-finished side projects",
    "  Network : connected to every rabbit hole",
    "",
  ],
  uname: [
    "  PORTFOLIO-OS v1.0 hordeep-machine",
    "  #1 SMP built-with-curiosity and too much coffee",
    "  x86_64 GNU/Linux (but make it retro)",
    "",
  ],
  pwd: ["  /home/hordeep/life/chapter-one/just-getting-started", ""],
  ping: [
    "  PING hordeep.dev: 56 bytes of data.",
    "  64 bytes from hordeep.dev: time=1ms  — still building",
    "  64 bytes from hordeep.dev: time=2ms  — still learning",
    "  64 bytes from hordeep.dev: time=1ms  — still curious",
    "  3 packets transmitted. 3 received. 0% packet loss.",
    "",
  ],
  "git log": [
    "  commit a1b2c3d (HEAD -> main)",
    "  author : hordeep <hordeepgahlyan1@gmail.com>",
    "  date   : some tuesday, probably late",
    "  msg    : feat: make it work (don't ask how)",
    "",
    "  commit f4e5d6c",
    "  msg    : fix: fix the fix that broke the fix",
    "",
    "  commit 9g8h7i6",
    "  msg    : WIP: sensor not reading, check wiring??",
    "",
    "  commit 3j2k1l0",
    "  msg    : init: here we go again",
    "",
  ],
  "git status": [
    "  On branch main",
    "  Your branch is ahead of 'origin/main' by 4 commits.",
    "",
    "  Changes not staged for commit:",
    "    modified:   self-doubt.js        (getting smaller)",
    "    modified:   curiosity.py         (always growing)",
    "    modified:   skills.txt           (updating daily)",
    "",
    "  Untracked files:",
    "    next-big-idea/",
    "    half-built-robot/",
    "    things-learned-at-3am.txt",
    "",
  ],
  vim: [
    "  opening vim...",
    "",
    "  congratulations. you are now trapped.",
    "  type ':q!' to escape.",
    "  no? same. google it. we all do.",
    "",
  ],
  "hello world": [
    "  hello, world.",
    "  and hello to you too.",
    "  glad you're here.",
    "",
  ],
  banner: [
    "  ██╗  ██╗ ██████╗ ██████╗ ██████╗ ███████╗███████╗██████╗ ",
    "  ██║  ██║██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗",
    "  ███████║██║   ██║██████╔╝██║  ██║█████╗  █████╗  ██████╔╝",
    "  ██╔══██║██║   ██║██╔══██╗██║  ██║██╔══╝  ██╔══╝  ██╔═══╝ ",
    "  ██║  ██║╚██████╔╝██║  ██║██████╔╝███████╗███████╗██║     ",
    "  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝     ",
    "",
    "  build cool things. break fewer things.",
    "  (ratio: still calibrating)",
    "",
  ],
  resume: [
    "  fetching resume...",
    "",
    "  [ resume coming soon ]",
    "  [ in the meantime: github.com/hordeepgahlyan ]",
    "",
  ],
  rm: [
    "  rm: refusing to remove '/'.",
    "  nice try.",
    "  this incident has also been reported.",
    "",
  ],
  "rm -rf": [
    "  rm -rf /",
    "  ...",
    "  ...",
    "  just kidding. nothing happened.",
    "  but the audacity. respect.",
    "",
  ],
  hack: ["  INITIATING HACK SEQUENCE...", "  routing through 7 proxies...", ""],
  uptime: [],
};

const CAT_FILES: Record<string, string[]> = {
  "about.txt": [
    "╔══════════════════════════════════════╗",
    "║  about.txt                           ║",
    "╚══════════════════════════════════════╝",
    "  name    : Hordeep Gahlyan",
    "  role    : student · builder · explorer",
    "  based   : India",
    "  status  : learning everything in sight",
    "  traits  : fast learner · jack of all trades",
    "  loves   : iot · robotics · programming · computers",
    "  warning : will over-engineer a school project",
    "",
  ],
  "skills.txt": [
    "╔══════════════════════════════════════╗",
    "║  skills.txt                          ║",
    "╚══════════════════════════════════════╝",
    "  languages   : python · java · c++",
    "               javascript (learning)",
    "  hardware    : arduino uno · esp32 · esp8266",
    "               arduino nano · ardupilot",
    "  domains     : embedded systems · iot · robotics",
    "  currently   : full stack web development",
    "  superpower  : learning things dangerously fast",
    "",
  ],
  "contact.txt": [
    "╔══════════════════════════════════════╗",
    "║  contact.txt                         ║",
    "╚══════════════════════════════════════╝",
    "  email    : hordeepgahlyan1@gmail.com",
    "  github   : github.com/hordeepgahlyan",
    "  linkedin : linkedin.com/in/hordeep-gahlyan-09a834400",
    "",
  ],
  "projects.txt": [
    "╔══════════════════════════════════════╗",
    "║  projects.txt                        ║",
    "╚══════════════════════════════════════╝",
    "  → science exhibition projects",
    "    microcontrollers · sensors · real hardware",
    "    boards used: arduino uno · esp32 · esp8266",
    "                 arduino nano · ardupilot",
    "",
    "  → intro (this terminal)",
    "    github.com/hordeepgahlyan",
    "",
  ],
  "resume.pdf": ["  error: cannot cat a PDF.", "  try: resume", ""],
};

const MAN_PAGES: Record<string, string[]> = {
  about: [
    "ABOUT(1)              Portfolio Manual             ABOUT(1)",
    "",
    "NAME",
    "  about - display information about Hordeep Gahlyan",
    "",
    "SYNOPSIS",
    "  about",
    "",
    "DESCRIPTION",
    "  Prints a summary of a school student who got curious",
    "  about microcontrollers and never really stopped.",
    "  Side effects include inspiration and rabbit holes.",
    "",
    "EXIT STATUS",
    "  0  always. optimism is a feature, not a bug.",
    "",
  ],
  projects: [
    "PROJECTS(1)           Portfolio Manual          PROJECTS(1)",
    "",
    "NAME",
    "  projects - hardware and software things built",
    "",
    "DESCRIPTION",
    "  Displays projects. Some blink LEDs. Some run servers.",
    "  One is this terminal. All were built out of curiosity.",
    "  Git histories may contain 'why is it not working'.",
    "",
    "BUGS",
    "  Several. Promoted to features.",
    "",
    "SEE ALSO",
    "  ls(1), cat(1), coffee(1), soldering-iron(8)",
    "",
  ],
  ls: [
    "LS(1)                 Portfolio Manual                LS(1)",
    "",
    "NAME",
    "  ls - list portfolio directory contents",
    "",
    "DESCRIPTION",
    "  Lists all navigable sections in UNIX directory format.",
    "  Unlike real ls, this one never returns ENOENT.",
    "  Would be nice if life worked this way too.",
    "",
    "SEE ALSO",
    "  cat(1), about(1)",
    "",
  ],
  help: [
    "HELP(1)               Portfolio Manual              HELP(1)",
    "",
    "NAME",
    "  help - you clearly need it",
    "",
    "DESCRIPTION",
    "  Lists available commands.",
    "  Reading the man page for help is very meta.",
    "  Respect.",
    "",
    "SEE ALSO",
    "  google(1), stackoverflow(1), lore(6)",
    "",
  ],
  coffee: [
    "COFFEE(1)             Portfolio Manual            COFFEE(1)",
    "",
    "NAME",
    "  coffee - critical system dependency",
    "",
    "SYNOPSIS",
    "  coffee [--hot] [--iced] [--desperate]",
    "",
    "DESCRIPTION",
    "  Core runtime dependency for all debugging sessions.",
    "  Required for: hardware projects, late night coding,",
    "  and convincing yourself the circuit WILL work.",
    "",
    "EXIT STATUS",
    "  1  if cup is empty. refill immediately.",
    "",
  ],
};

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function startMatrix(canvas: HTMLCanvasElement, onDone: () => void) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let frame = 0;
  const iv = setInterval(() => {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff41";
    ctx.font = "14px monospace";
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    frame++;
    if (frame > 120) {
      clearInterval(iv);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onDone();
    }
  }, 33);
}

function playTick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {}
}

function getVisitCount(): number {
  try {
    const count = parseInt(localStorage.getItem("portfolio_visits") || "0", 10);
    return count || 1;
  } catch {
    return 1;
  }
}

function RiceBlock({ visits }: { visits: number }) {
  const lines = [
    ...INFO_LINES,
    { label: "visits", value: visits.toLocaleString() },
  ];
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
      <pre
        className="glow leading-tight shrink-0 overflow-hidden font-mono"
        style={{
          fontSize: "clamp(4px, 1.1vw, 8px)",
          color: "var(--crt-color)",
        }}
      >
        {SMALL_ART}
      </pre>
      <div className="flex flex-col gap-[3px] min-w-0">
        <p
          className="glow font-mono text-sm font-bold mb-1 m-0"
          style={{ color: "var(--crt-color)" }}
        >
          hordeep@portfolio
        </p>
        <hr className="mb-1" style={{ borderColor: "var(--crt-color-dark)" }} />
        {lines.map(({ label, value }) => (
          <p
            key={label}
            className="font-mono text-xs sm:text-sm break-words whitespace-pre-wrap m-0"
          >
            <span
              className="inline-block w-16"
              style={{ color: "var(--crt-color-dark)" }}
            >
              {label}
            </span>
            <span style={{ color: "var(--crt-color-dim)" }}> : {value}</span>
          </p>
        ))}
        <hr
          className="mt-2 mb-1"
          style={{ borderColor: "var(--crt-color-dark)" }}
        />
        <p
          className="font-mono text-xs break-words m-0"
          style={{ color: "var(--crt-color-dark)" }}
        >
          type a command or click a shortcut below
        </p>
      </div>
    </div>
  );
}

function TerminatedScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono">
      <p className="text-[#00ff41] text-sm glow mb-2 tracking-widest">
        CONNECTION TERMINATED
      </p>
      <p className="text-[#007722] text-xs mb-2">session ended by user</p>
      <p className="text-[#007722] text-xs mb-6">
        keep building, hordeep. the rabbit hole awaits.
      </p>
      <p className="text-[#003300] text-xs animate-pulse">
        [ refresh to reconnect ]
      </p>
    </div>
  );
}

type Stage = "boot" | "splash" | "ready";

export default function Home() {
  const [stage, setStage] = useState<Stage>("boot");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [clearing, setClearing] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [soundOn, setSoundOn] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [activeCmd, setActiveCmd] = useState("");
  const [isKonami, setIsKonami] = useState(false);
  const [visits, setVisits] = useState<number>(1);
  const [tabPressCount, setTabPressCount] = useState(0);
  const [lastTabInput, setLastTabInput] = useState("");
  const [terminated, setTerminated] = useState(false);
  const [notFoundIndex, setNotFoundIndex] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const konamiRef = useRef<string[]>([]);

  useEffect(() => {
    fetch("https://api.counterapi.dev/v1/hordeepgahlyan-portfolio/visits/up")
      .then((r) => r.json())
      .then((data) => setVisits(data.count ?? 1))
      .catch(() => setVisits(1));
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleExit = useCallback(() => {
    setTimeout(() => setTerminated(true), 800);
  }, []);

  useEffect(() => {
    if (stage !== "ready") return;
    const handler = (e: KeyboardEvent) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join(",") === KONAMI.join(",")) {
        setIsKonami(true);
        setHistory((h) => [
          ...h,
          ">>> KONAMI CODE DETECTED <<<",
          "  GOD MODE: ACTIVATED",
          "  impostor syndrome: DELETED",
          "  curiosity: ALREADY MAXED OUT",
          "  bugs: still there lol",
          "",
        ]);
        setTimeout(() => setIsKonami(false), 1500);
        konamiRef.current = [];
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stage]);

  const runCommand = useCallback((cmd: string, lines: string[]) => {
    setHistory((h) => [...h, `> ${cmd}`, ...lines]);
    setCmdHistory((h) => [cmd, ...h]);
    setHistoryIndex(-1);
    setActiveCmd(cmd);
    document.title = `hordeep // ${cmd}`;
  }, []);

  const triggerExit = useCallback(() => {
    setHistory((h) => [
      ...h,
      "> exit",
      "  terminating session...",
      "  saving curiosity levels to disk...",
      "  flushing half-finished ideas to /tmp...",
      "  goodbye, traveler. keep building. 👋",
      "",
    ]);
    handleExit();
  }, [handleExit]);

  const handleCommand = useCallback(
    (cmd: string) => {
      const c = cmd.trim().toLowerCase();
      if (c === "") return;

      if (c === "clear") {
        setClearing(true);
        setCmdHistory((h) => [c, ...h]);
        setHistoryIndex(-1);
        setActiveCmd("");
        document.title = "hordeep // terminal";
        setTimeout(() => {
          setHistory([]);
          setClearing(false);
        }, 200);
        return;
      }

      if (c === "exit") {
        triggerExit();
        return;
      }

      if (c === "hack") {
        setMatrixActive(true);
        runCommand(cmd, [
          "  INITIATING HACK SEQUENCE...",
          "  routing through 7 proxies...",
          "",
        ]);
        setTimeout(() => {
          if (canvasRef.current) {
            startMatrix(canvasRef.current, () => {
              setMatrixActive(false);
              setHistory((h) => [
                ...h,
                "  access granted. you were always in.",
                "",
              ]);
            });
          }
        }, 50);
        return;
      }

      if (c === "joke") {
        const line = JOKES[Math.floor(Math.random() * JOKES.length)];
        runCommand(cmd, [line, ""]);
        return;
      }

      if (c === "date") {
        const now = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        runCommand(cmd, [
          `  ${now}  (IST)`,
          "  time is a flat circle. keep building.",
          "",
        ]);
        return;
      }

      if (c === "uptime") {
        const mins = Math.floor(performance.now() / 60000);
        const secs = Math.floor((performance.now() % 60000) / 1000);
        runCommand(cmd, [
          `  up ${mins}m ${secs}s · 1 user · curiosity load: maximum`,
          "",
        ]);
        return;
      }

      if (c.startsWith("cat ")) {
        const file = c.slice(4).trim();
        const content = CAT_FILES[file];
        runCommand(
          cmd,
          content ?? [
            `  cat: ${file}: no such file.`,
            "  try 'ls' to see what actually exists.",
            "",
          ],
        );
        return;
      }

      if (c.startsWith("man ")) {
        const target = c.slice(4).trim();
        const page = MAN_PAGES[target];
        runCommand(
          cmd,
          page ?? [
            `  no manual entry for '${target}'.`,
            "  some things must be learned the hard way.",
            "",
          ],
        );
        return;
      }

      if (COMMANDS[c] !== undefined) {
        runCommand(cmd, COMMANDS[c]);
        return;
      }

      const response =
        NOT_FOUND_RESPONSES[notFoundIndex % NOT_FOUND_RESPONSES.length](c);
      setNotFoundIndex((n) => n + 1);
      runCommand(cmd, [response, ""]);
    },
    [runCommand, triggerExit, notFoundIndex],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const PRINTABLE =
      e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    const BACKSPACE = e.key === "Backspace";

    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
      setTabPressCount(0);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(next);
      setInput(cmdHistory[next] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      if (next < 0) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }
      setHistoryIndex(next);
      setInput(cmdHistory[next] ?? "");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const all = [
        ...Object.keys(COMMANDS).filter((k) => k !== "uptime"),
        "joke",
        "date",
        "exit",
        "uptime",
        "cat about.txt",
        "cat skills.txt",
        "cat contact.txt",
        "cat projects.txt",
        "cat resume.pdf",
        "man about",
        "man projects",
        "man ls",
        "man help",
        "man coffee",
        "git log",
        "git status",
        "sudo hire-me",
        "rm -rf",
      ];
      const matches = all.filter(
        (k) => k.startsWith(input.toLowerCase()) && k !== input.toLowerCase(),
      );
      if (matches.length === 0) return;
      if (input === lastTabInput && tabPressCount > 0) {
        setInput(matches[0]);
        setTabPressCount(0);
      } else if (matches.length === 1) {
        setInput(matches[0]);
      } else {
        setHistory((h) => [...h, `> ${input}`, matches.join("   "), ""]);
        setLastTabInput(input);
        setTabPressCount((n) => n + 1);
      }
      return;
    }

    if (PRINTABLE || BACKSPACE) {
      if (historyIndex !== -1) setHistoryIndex(-1);
      if (soundOn) playTick();
    }
  };

  if (terminated) return <TerminatedScreen />;

  return (
    <Terminal
      activeCmd={activeCmd}
      onTerminalClick={focusInput}
      isKonami={isKonami}
      soundOn={soundOn}
      onSoundToggle={() => setSoundOn((v) => !v)}
      onShortcut={handleCommand}
      onExit={triggerExit}
    >
      <canvas
        ref={canvasRef}
        id="matrix-canvas"
        className={matrixActive ? "block" : "hidden"}
        style={
          matrixActive
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 40,
              }
            : {}
        }
      />

      {stage === "boot" && <BootSequence onDone={() => setStage("splash")} />}
      {stage === "splash" && <AsciiSplash onDone={() => setStage("ready")} />}

      {stage === "ready" && (
        <div className="flex flex-col">
          <RiceBlock visits={visits} />

          <div className={clearing ? "clearing" : ""}>
            {history.map((line, i) => (
              <p
                key={i}
                className="font-mono text-sm leading-6 break-words whitespace-pre-wrap m-0"
                style={{
                  color:
                    line.startsWith(">") ||
                    line.startsWith("╔") ||
                    line.startsWith("║") ||
                    line.startsWith("╚") ||
                    line.startsWith(">>>")
                      ? "var(--crt-color)"
                      : line.includes("error") ||
                          line.includes("denied") ||
                          line.startsWith("  cat:") ||
                          line.startsWith("  no manual")
                        ? "#ff4444"
                        : line.startsWith("  ✓") ||
                            line.includes("DEFEATED") ||
                            line.includes("unlocked") ||
                            line.includes("granted")
                          ? "#00ff41"
                          : line.includes("WIP") ||
                              line.includes("3am") ||
                              line.includes("warning")
                            ? "#ffb000"
                            : "var(--crt-color-dim)",
                  textShadow:
                    line.startsWith(">") || line.startsWith(">>>")
                      ? "var(--crt-glow)"
                      : "none",
                }}
              >
                {line || "\u00A0"}
              </p>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span
              className="glow font-mono text-sm whitespace-nowrap"
              style={{ color: "var(--crt-color)" }}
            >
              hordeep@portfolio:~$
            </span>
            <input
              ref={inputRef}
              autoFocus
              className="flex-1 bg-transparent outline-none font-mono text-sm min-w-0"
              style={{
                color: "var(--crt-color)",
                caretColor: "var(--crt-color)",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="try 'help'..."
            />
          </div>

          <div ref={bottomRef} />
        </div>
      )}
    </Terminal>
  );
}
