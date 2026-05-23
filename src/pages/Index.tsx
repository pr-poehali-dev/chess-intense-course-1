import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

/* ===== ДАННЫЕ КУРСА ===== */

const WEEKS = [
  {
    week: 1, phase: "СТАРТ",
    title: "Правила и фигуры",
    desc: "Ходы фигур, шах, мат, пат. Базовые правила игры.",
    book: "Шахматы для начинающих — Хосе Р. Капабланка, гл. 1–2",
    task: "Расставить фигуры и сыграть 5 партий против Stockfish (уровень 1)",
    trainer: { name: "Lichess — игра против компьютера", url: "https://lichess.org/play/ai" },
  },
  {
    week: 2, phase: "СТАРТ",
    title: "Ценность фигур и размены",
    desc: "Материальный баланс, правила размена, тактика «выигрыш материала».",
    book: "«Шахматы» — Яков Нейштадт, гл. 1–3",
    task: "Решить 20 задач на выигрыш материала",
    trainer: { name: "Chess.com — тактические задачи", url: "https://www.chess.com/puzzles" },
  },
  {
    week: 3, phase: "СТАРТ",
    title: "Основы дебюта",
    desc: "Три принципа дебюта: центр, развитие, безопасность короля.",
    book: "«Дебютный репертуар новичка» — Колин Коупленд, гл. 1–4",
    task: "Разыграть Итальянскую партию и Испанскую (по 10 раз каждую)",
    trainer: { name: "Lichess — тренажёр дебютов", url: "https://lichess.org/study" },
  },
  {
    week: 4, phase: "РАЗВИТИЕ",
    title: "Тактика: вилка и связка",
    desc: "Двойной удар вилкой, абсолютная и относительная связка.",
    book: "«1001 шахматная задача» — Фред Рейнфельд, задачи 1–100",
    task: "Решить 30 задач на вилку и связку на Lichess",
    trainer: { name: "Lichess — задачи на вилку", url: "https://lichess.org/training/fork" },
  },
  {
    week: 5, phase: "РАЗВИТИЕ",
    title: "Тактика: открытый шах и сквозной удар",
    desc: "Открытые линии, сквозной удар (skewer), двойной шах.",
    book: "«1001 шахматная задача» — Рейнфельд, задачи 101–250",
    task: "Пройти 30-минутный блиц-тренинг по тактике ежедневно",
    trainer: { name: "ChessTempo — тактика", url: "https://chesstempo.com" },
  },
  {
    week: 6, phase: "РАЗВИТИЕ",
    title: "Атака на короля",
    desc: "Атака на нерокировавшегося короля, матовые комбинации.",
    book: "«Атака и защита» — Марк Дворецкий, часть 1",
    task: "Решить 20 задач на мат в 2–3 хода",
    trainer: { name: "Lichess — мат в 2", url: "https://lichess.org/training/mateIn2" },
  },
  {
    week: 7, phase: "УГЛУБЛЕНИЕ",
    title: "Эндшпиль: пешечный",
    desc: "Пешечный эндшпиль, правило квадрата, оппозиция, прорыв.",
    book: "«Фундаментальный шахматный эндшпиль» — Мюллер и Лампрехт, гл. 1",
    task: "Сыграть 10 партий только до пешечного эндшпиля",
    trainer: { name: "Lichess — тренажёр эндшпилей", url: "https://lichess.org/practice" },
  },
  {
    week: 8, phase: "УГЛУБЛЕНИЕ",
    title: "Эндшпиль: ладейный",
    desc: "Позиция Лусены, защита Филидора, активный король.",
    book: "«Фундаментальный шахматный эндшпиль» — гл. 4–5",
    task: "Решить 20 задач на ладейный эндшпиль",
    trainer: { name: "ChessTempo — эндшпили", url: "https://chesstempo.com/endgame-training" },
  },
  {
    week: 9, phase: "УГЛУБЛЕНИЕ",
    title: "Стратегия: пешечная структура",
    desc: "Изолированная, сдвоенная, проходная пешка. Слабые поля.",
    book: "«Моя система» — Арон Нимцович, гл. 1–3",
    task: "Проанализировать 5 своих партий с помощью Stockfish",
    trainer: { name: "Lichess — анализ партий", url: "https://lichess.org/analysis" },
  },
  {
    week: 10, phase: "МАСТЕРСТВО",
    title: "Дебютный репертуар",
    desc: "Построение личного репертуара за белых и за чёрных.",
    book: "«Современные шахматные дебюты» — ДеФирмиан (NCO)",
    task: "Заучить 5 ключевых линий своего репертуара",
    trainer: { name: "Lichess — дебютный тренажёр", url: "https://lichess.org/opening" },
  },
  {
    week: 11, phase: "МАСТЕРСТВО",
    title: "Расчёт и оценка позиции",
    desc: "Метод кандидатов Котова, расчёт вариантов, оценка позиции.",
    book: "«Думай как гроссмейстер» — Александр Котов, часть 1",
    task: "Решить 30 задач без подсказок, фиксируя время решения",
    trainer: { name: "ChessTempo — без подсказок", url: "https://chesstempo.com/chess-problems" },
  },
  {
    week: 12, phase: "МАСТЕРСТВО",
    title: "Финальный турнир",
    desc: "Применить всё изученное в серии соревновательных партий.",
    book: "«Шахматная тактика» — Полугаевский и Шамкович (повторение)",
    task: "Сыграть 10 рейтинговых партий на Lichess и проанализировать каждую",
    trainer: { name: "Lichess — рейтинговые партии", url: "https://lichess.org/tournament" },
  }
];

const PHASES = [
  { name: "СТАРТ", weeks: "1–3", icon: "Rocket", desc: "Правила, фигуры, базовая тактика" },
  { name: "РАЗВИТИЕ", weeks: "4–6", icon: "Zap", desc: "Тактика, атака, комбинации" },
  { name: "УГЛУБЛЕНИЕ", weeks: "7–9", icon: "Brain", desc: "Эндшпиль, стратегия, анализ" },
  { name: "МАСТЕРСТВО", weeks: "10–12", icon: "Trophy", desc: "Дебют, расчёт, турниры" },
];

const TRAINERS = [
  {
    name: "Lichess",
    url: "https://lichess.org",
    desc: "Бесплатная платформа: тактика, анализ, турниры, задачи, обучение",
    icon: "♞",
    features: ["Задачи на тактику", "Анализ партий Stockfish", "Тренировка дебютов", "Эндшпиль практика"]
  },
  {
    name: "Chess.com",
    url: "https://chess.com",
    desc: "Крупнейшая шахматная платформа с уроками и видеокурсами",
    icon: "♜",
    features: ["Интерактивные уроки", "Тактические задачи", "Игра с компьютером", "Видеоуроки GM"]
  },
  {
    name: "ChessTempo",
    url: "https://chesstempo.com",
    desc: "Специализированный тренажёр тактики и эндшпиля с рейтингом",
    icon: "♛",
    features: ["Рейтинговая тактика", "База дебютов", "Эндшпильная БД", "Отслеживание прогресса"]
  },
  {
    name: "Chess King",
    url: "https://chess-king.com",
    desc: "Мобильное обучение шахматам от гроссмейстера Каспарова",
    icon: "♚",
    features: ["Курс Каспарова", "Интерактивные уроки", "Задачи по уровням", "Офлайн режим"]
  },
];

/* ===== ШАХМАТНАЯ ДОСКА ===== */

const INITIAL_POSITIONS: { [key: string]: string } = {
  "a8": "♜", "b8": "♞", "c8": "♝", "d8": "♛", "e8": "♚", "f8": "♝", "g8": "♞", "h8": "♜",
  "a7": "♟", "b7": "♟", "c7": "♟", "d7": "♟", "e7": "♟", "f7": "♟", "g7": "♟", "h7": "♟",
  "a2": "♙", "b2": "♙", "c2": "♙", "d2": "♙", "e2": "♙", "f2": "♙", "g2": "♙", "h2": "♙",
  "a1": "♖", "b1": "♘", "c1": "♗", "d1": "♕", "e1": "♔", "f1": "♗", "g1": "♘", "h1": "♖",
};

const TACTICAL_POSITIONS = [
  {
    name: "Мат в 1",
    desc: "Белые начинают. Мат в 1 ход.",
    hint: "Ферзь на h7 — и мат!",
    solution: "Ферзь → h7#",
    pieces: { "e1": "♔", "g1": "♖", "e2": "♙", "f2": "♙", "g2": "♙", "h2": "♙", "d1": "♕", "e8": "♚", "f8": "♜", "g8": "♞", "h8": "♜", "e7": "♟", "f7": "♟", "h7": "♟", "g6": "♟" } as { [key: string]: string }
  },
  {
    name: "Вилка конём",
    desc: "Белые начинают. Выиграть материал.",
    hint: "Конь на e7 бьёт короля и ферзя!",
    solution: "Конь → e7+, затем берёт ферзя",
    pieces: { "e1": "♔", "h1": "♖", "c3": "♘", "e4": "♙", "e8": "♚", "h8": "♜", "d6": "♛", "f6": "♟" } as { [key: string]: string }
  },
  {
    name: "Связка слоном",
    desc: "Белые начинают. Используй связку.",
    hint: "Слон на b2 создаёт связку коня с королём!",
    solution: "Слон → b2, связывая коня",
    pieces: { "e1": "♔", "f1": "♗", "e4": "♙", "e8": "♚", "f6": "♞", "e7": "♟", "d5": "♟" } as { [key: string]: string }
  }
];

function ChessBoard() {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const [selected, setSelected] = useState<string | null>(null);
  const [positions, setPositions] = useState<{ [key: string]: string }>(INITIAL_POSITIONS);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [mode, setMode] = useState<"free" | "puzzle">("free");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const loadPuzzle = (idx: number) => {
    setCurrentPuzzle(idx);
    setPositions(TACTICAL_POSITIONS[idx].pieces);
    setSelected(null);
    setShowHint(false);
    setMoveHistory([]);
    setMode("puzzle");
  };

  const resetBoard = () => {
    setPositions(INITIAL_POSITIONS);
    setSelected(null);
    setMoveHistory([]);
    setMode("free");
  };

  const handleSquareClick = (square: string) => {
    if (selected === null) {
      if (positions[square]) setSelected(square);
    } else {
      if (selected === square) { setSelected(null); return; }
      const piece = positions[selected];
      const newPos = { ...positions };
      const captured = newPos[square];
      delete newPos[selected];
      newPos[square] = piece;
      setPositions(newPos);
      const move = `${piece} ${selected}→${square}${captured ? " ×" + captured : ""}`;
      setMoveHistory(prev => [move, ...prev].slice(0, 8));
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-shrink-0">
        <div className="flex">
          <div className="flex flex-col justify-around pr-1">
            {ranks.map(r => (
              <div key={r} className="w-5 h-10 flex items-center justify-center text-xs font-ibm sm:h-12" style={{ color: "rgba(255,255,255,0.4)" }}>{r}</div>
            ))}
          </div>
          <div>
            <div className="grid grid-cols-8 border-2" style={{ borderColor: "var(--chess-orange)" }}>
              {ranks.map(rank =>
                files.map(file => {
                  const square = `${file}${rank}`;
                  const isLight = (files.indexOf(file) + rank) % 2 === 0;
                  const piece = positions[square];
                  const isSelected = selected === square;
                  return (
                    <div
                      key={square}
                      onClick={() => handleSquareClick(square)}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer select-none"
                      style={{
                        background: isSelected ? "rgba(255,107,26,0.7)" : isLight ? "var(--chess-light-square)" : "var(--chess-dark-square)",
                        transition: "background 0.15s"
                      }}
                    >
                      {piece && (
                        <span className="text-2xl sm:text-3xl leading-none" style={{
                          filter: piece.charCodeAt(0) < 9820 ? "drop-shadow(0 1px 2px rgba(0,0,0,0.9))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                          userSelect: "none"
                        }}>
                          {piece}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex">
              <div className="w-5" />
              {files.map(f => (
                <div key={f} className="w-10 h-5 sm:w-12 flex items-center justify-center text-xs font-ibm" style={{ color: "rgba(255,255,255,0.4)" }}>{f}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 min-w-0">
        <div>
          <p className="text-xs font-oswald uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Режим игры</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Свободная игра", action: resetBoard, id: "free" },
              { label: "Задачи", action: () => loadPuzzle(currentPuzzle), id: "puzzle" },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={btn.action}
                className="px-4 py-2 text-sm font-oswald uppercase tracking-wider border transition-all"
                style={{
                  borderColor: mode === btn.id ? "var(--chess-orange)" : "var(--chess-border)",
                  color: mode === btn.id ? "var(--chess-orange)" : "rgba(255,255,255,0.45)",
                  background: mode === btn.id ? "rgba(255,107,26,0.1)" : "transparent"
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "puzzle" && (
          <div className="space-y-3">
            <p className="text-xs font-oswald uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Выбери задачу</p>
            {TACTICAL_POSITIONS.map((p, i) => (
              <button
                key={i}
                onClick={() => loadPuzzle(i)}
                className="w-full text-left p-3 border transition-all"
                style={{
                  borderColor: currentPuzzle === i ? "var(--chess-orange)" : "var(--chess-border)",
                  background: currentPuzzle === i ? "rgba(255,107,26,0.08)" : "rgba(255,255,255,0.02)"
                }}
              >
                <p className="font-oswald text-sm font-semibold text-white">{p.name}</p>
                <p className="text-xs font-ibm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
              </button>
            ))}

            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-sm font-oswald uppercase tracking-wider"
              style={{ color: "var(--chess-orange)" }}
            >
              <Icon name="Lightbulb" size={15} />
              {showHint ? "Скрыть подсказку" : "Подсказка"}
            </button>

            {showHint && (
              <div className="p-3 border-l-2" style={{ borderColor: "var(--chess-orange)", background: "rgba(255,107,26,0.05)" }}>
                <p className="text-sm font-ibm" style={{ color: "rgba(255,255,255,0.8)" }}>
                  💡 {TACTICAL_POSITIONS[currentPuzzle].hint}
                </p>
                <p className="text-xs font-ibm mt-1" style={{ color: "var(--chess-orange)" }}>
                  Решение: {TACTICAL_POSITIONS[currentPuzzle].solution}
                </p>
              </div>
            )}
          </div>
        )}

        {moveHistory.length > 0 && (
          <div>
            <p className="text-xs font-oswald uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Ходы</p>
            {moveHistory.map((m, i) => (
              <div key={i} className="text-sm font-ibm px-2 py-1" style={{ color: i === 0 ? "var(--chess-orange)" : "rgba(255,255,255,0.4)", background: i === 0 ? "rgba(255,107,26,0.05)" : "transparent" }}>
                {m}
              </div>
            ))}
          </div>
        )}

        <div className="p-3 border text-xs font-ibm" style={{ borderColor: "var(--chess-border)", color: "rgba(255,255,255,0.35)" }}>
          Нажми на фигуру → выбери клетку — ход сделан
        </div>
      </div>
    </div>
  );
}

/* ===== ПРОГРЕСС ТРЕКЕР ===== */

function ProgressTracker() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggle = (w: number) => setCompleted(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);
  const percent = Math.round((completed.length / 12) * 100);

  return (
    <div className="space-y-6">
      <div className="card-chess p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-oswald text-lg text-white">Общий прогресс курса</span>
          <span className="font-oswald text-3xl font-bold" style={{ color: "var(--chess-orange)" }}>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-sm font-ibm mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>Завершено {completed.length} из 12 недель</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {WEEKS.map(w => {
          const done = completed.includes(w.week);
          return (
            <div
              key={w.week}
              onClick={() => toggle(w.week)}
              className="card-chess p-4 cursor-pointer"
              style={{ borderColor: done ? "var(--chess-orange)" : "var(--chess-border)", background: done ? "rgba(255,107,26,0.08)" : "var(--chess-card)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-oswald font-bold transition-all"
                  style={{
                    background: done ? "var(--chess-orange)" : "transparent",
                    border: `2px solid ${done ? "var(--chess-orange)" : "var(--chess-border)"}`,
                    color: done ? "#000" : "rgba(255,255,255,0.4)"
                  }}
                >
                  {done ? "✓" : w.week}
                </div>
                <span className="text-xs font-oswald uppercase" style={{ color: done ? "var(--chess-orange)" : "rgba(255,255,255,0.35)" }}>Нед. {w.week}</span>
              </div>
              <p className="text-xs font-ibm text-white leading-snug">{w.title}</p>
              <p className="text-xs font-oswald mt-1 uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>{w.phase}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PHASES.map((ph, i) => {
          const phWeeks = WEEKS.filter(w => w.phase === ph.name).map(w => w.week);
          const phDone = phWeeks.filter(w => completed.includes(w)).length;
          return (
            <div key={i} className="card-chess p-4 text-center">
              <p className="font-oswald text-2xl font-bold" style={{ color: "var(--chess-orange)" }}>{phDone}/{phWeeks.length}</p>
              <p className="text-xs font-oswald uppercase mt-1 text-white">{ph.name}</p>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${(phDone / phWeeks.length) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== НАВИГАЦИЯ ===== */

function Navbar({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О курсе" },
    { id: "lessons", label: "Уроки" },
    { id: "tasks", label: "Задания" },
    { id: "trainers", label: "Тренажёры" },
    { id: "progress", label: "Прогресс" },
    { id: "contacts", label: "Контакты" },
  ];

  const go = (id: string) => {
    onNav(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--chess-border)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => go("home")} className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: "var(--chess-orange)" }}>♟</span>
            <span className="font-oswald font-bold text-lg text-white tracking-widest">ШАХ<span style={{ color: "var(--chess-orange)" }}>МАСТЕР</span></span>
          </button>

          <div className="hidden lg:flex items-center gap-6">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)}
                className="nav-link font-oswald uppercase tracking-widest text-sm transition-colors"
                style={{ color: active === l.id ? "var(--chess-orange)" : "rgba(255,255,255,0.55)" }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block">
            <button onClick={() => go("lessons")} className="chess-btn-primary text-sm py-2 px-6">
              <Icon name="Play" size={15} /> Начать курс
            </button>
          </div>

          <button className="lg:hidden" style={{ color: "white" }} onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden" style={{ background: "rgba(10,10,10,0.98)", borderTop: "1px solid var(--chess-border)" }}>
          <div className="px-4 py-4 space-y-1">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)}
                className="block w-full text-left py-3 px-2 font-oswald uppercase tracking-widest text-sm border-b"
                style={{ color: "rgba(255,255,255,0.7)", borderColor: "var(--chess-border)" }}
              >
                {l.label}
              </button>
            ))}
            <div className="pt-4">
              <button onClick={() => go("lessons")} className="chess-btn-primary w-full justify-center text-sm py-3">
                <Icon name="Play" size={15} /> Начать курс
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ===== ГЛАВНАЯ СТРАНИЦА ===== */

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeWeek, setActiveWeek] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.25, rootMargin: "-80px 0px 0px 0px" }
    );
    ["home", "about", "lessons", "tasks", "trainers", "progress", "contacts"].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--chess-dark)", color: "white" }}>
      <Navbar active={activeSection} onNav={setActiveSection} />

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-conic-gradient(rgba(255,107,26,0.5) 0% 25%, transparent 0% 50%)",
          backgroundSize: "80px 80px"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(255,107,26,0.06) 0%, transparent 70%)"
        }} />
        <div className="absolute right-4 top-20 text-[200px] opacity-[0.04] select-none pointer-events-none leading-none animate-float">♚</div>
        <div className="absolute left-0 bottom-20 text-[120px] opacity-[0.04] select-none pointer-events-none leading-none" style={{ animationDelay: "2s" }}>♛</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div className="max-w-4xl">
            <div className="section-tag mb-6 animate-fade-up">Методология «12 недель в году»</div>
            <h1 className="font-oswald font-bold leading-none mb-6 animate-fade-up delay-100" style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)" }}>
              ОСВОЙ ШАХМАТЫ<br />
              <span style={{ color: "var(--chess-orange)", textShadow: "0 0 80px rgba(255,107,26,0.35)" }}>ЗА 12 НЕДЕЛЬ</span>
            </h1>
            <p className="text-lg sm:text-xl font-ibm mb-4 animate-fade-up delay-200" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "580px", lineHeight: 1.75 }}>
              Интенсивный курс с поэтапным усложнением по технологии Брайана Морана —
              за 12 недель ты сделаешь больше, чем другие за год тренировок.
            </p>
            <p className="text-sm font-ibm mb-10 animate-fade-up delay-300" style={{ color: "rgba(255,255,255,0.35)" }}>
              📚 Учебники GM · ♞ Интерактивная доска · 🎯 Онлайн-тренажёры · 📊 Трекер прогресса
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-400">
              <button className="chess-btn-primary" onClick={() => go("lessons")}>
                <Icon name="Play" size={18} /> Начать обучение
              </button>
              <button className="chess-btn-outline" onClick={() => go("about")}>
                <Icon name="BookOpen" size={18} /> О методологии
              </button>
            </div>
            <div className="flex flex-wrap gap-10 mt-14 animate-fade-up delay-500">
              {[
                { v: "12", l: "Недель курса" },
                { v: "84+", l: "Уроков и заданий" },
                { v: "4", l: "Фазы обучения" },
                { v: "∞", l: "Онлайн-тренажёров" }
              ].map((s, i) => (
                <div key={i}>
                  <p className="font-oswald font-bold text-4xl" style={{ color: "var(--chess-orange)" }}>{s.v}</p>
                  <p className="text-xs font-ibm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== О КУРСЕ ===== */}
      <section id="about" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-tag mb-4">Методология</div>
              <h2 className="font-oswald font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
                ТЕХНОЛОГИЯ<br /><span style={{ color: "var(--chess-orange)" }}>«12 НЕДЕЛЬ»</span>
              </h2>
              <div className="space-y-4 font-ibm text-base" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75 }}>
                <p>
                  Брайан Моран и Майкл Леннингтон открыли: <strong className="text-white">12 недель = 1 год результата.</strong> Годовые цели размыты — 12-недельные спринты дают немедленный фокус и действие.
                </p>
                <p>
                  Мы адаптировали эту систему для шахмат: каждая неделя — конкретный навык с измеримым результатом, еженедельные задачи и трекинг прогресса.
                </p>
                <p>
                  Курс построен на учебниках признанных гроссмейстеров: Капабланка, Нимцович, Котов, Дворецкий — только доказанные методики.
                </p>
              </div>
              <a
                href="https://www.mann-ivanov-ferber.ru/books/12-nedel-v-godu/"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm font-oswald uppercase tracking-wider px-5 py-2.5 border transition-all hover:bg-orange-500/10"
                style={{ borderColor: "rgba(255,107,26,0.4)", color: "var(--chess-orange)" }}
              >
                <Icon name="ExternalLink" size={14} /> Купить книгу Морана
              </a>
            </div>

            <div className="space-y-3">
              {PHASES.map((ph, i) => (
                <div key={i} className="card-chess p-5 flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center" style={{ background: "rgba(255,107,26,0.08)", border: "1px solid rgba(255,107,26,0.25)" }}>
                    <Icon name={ph.icon} size={22} fallback="Star" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-oswald font-bold text-white">{ph.name}</span>
                      <span className="text-xs font-ibm px-2 py-0.5" style={{ background: "rgba(255,107,26,0.12)", color: "var(--chess-orange)" }}>Нед. {ph.weeks}</span>
                    </div>
                    <p className="text-sm font-ibm" style={{ color: "rgba(255,255,255,0.5)" }}>{ph.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== УРОКИ ===== */}
      <section id="lessons" className="py-20 sm:py-28" style={{ background: "rgba(255,255,255,0.018)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-tag mb-4">12 недель</div>
            <h2 className="font-oswald font-bold text-4xl sm:text-5xl text-white">ПРОГРАММА КУРСА</h2>
            <p className="font-ibm mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>Каждая неделя — конкретный навык + учебник + тренажёр + задание</p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {WEEKS.map(w => (
              <div
                key={w.week}
                className="card-chess p-5 cursor-pointer"
                onClick={() => setActiveWeek(activeWeek === w.week ? null : w.week)}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="week-badge flex-shrink-0">{w.week}</div>
                  <div>
                    <span className="text-xs font-oswald uppercase tracking-widest" style={{ color: "var(--chess-orange)" }}>{w.phase}</span>
                    <h3 className="font-oswald font-bold text-white text-lg leading-tight mt-0.5">{w.title}</h3>
                  </div>
                </div>
                <p className="text-sm font-ibm mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>{w.desc}</p>

                {activeWeek === w.week && (
                  <div className="space-y-3 pt-3 border-t" style={{ borderColor: "var(--chess-border)" }}>
                    <div>
                      <p className="text-xs font-oswald uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>📚 Учебник</p>
                      <p className="text-xs font-ibm" style={{ color: "rgba(255,255,255,0.65)" }}>{w.book}</p>
                    </div>
                    <div>
                      <p className="text-xs font-oswald uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>🎯 Задание недели</p>
                      <p className="text-xs font-ibm" style={{ color: "rgba(255,255,255,0.65)" }}>{w.task}</p>
                    </div>
                    <a
                      href={w.trainer.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-oswald uppercase tracking-wider px-4 py-2 transition-all"
                      style={{ color: "var(--chess-orange)", border: "1px solid rgba(255,107,26,0.35)", background: "rgba(255,107,26,0.06)" }}
                      onClick={e => e.stopPropagation()}
                    >
                      <Icon name="ExternalLink" size={12} /> {w.trainer.name}
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <a href={w.trainer.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-ibm hover:underline" style={{ color: "rgba(255,107,26,0.65)" }}
                    onClick={e => e.stopPropagation()}
                  >
                    {w.trainer.name} →
                  </a>
                  <Icon name={activeWeek === w.week ? "ChevronUp" : "ChevronDown"} size={16} fallback="ChevronDown" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ЗАДАНИЯ ===== */}
      <section id="tasks" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-tag mb-4">Практика</div>
            <h2 className="font-oswald font-bold text-4xl sm:text-5xl text-white">СИСТЕМА ЗАДАНИЙ</h2>
            <p className="font-ibm mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>Конкретные измеримые задачи — основа системы 12 недель</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-chess p-6">
              <h3 className="font-oswald font-bold text-xl text-white mb-5">
                <span style={{ color: "var(--chess-orange)" }}>Принципы</span> системы
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "Target", t: "Еженедельный спринт", d: "1 главный навык с измеримым результатом в неделю" },
                  { icon: "Calendar", t: "Ежедневная практика", d: "Минимум 30 мин/день: тактика + партия или эндшпиль" },
                  { icon: "BarChart2", t: "Счёт и оценка", d: "80%+ правильных задач = неделя пройдена" },
                  { icon: "RefreshCw", t: "Еженедельный разбор", d: "В воскресенье: анализ 2–3 партий в Lichess" },
                  { icon: "Zap", t: "Боевые раунды", d: "В нед. 4, 8, 12 — рейтинговые партии на платформе" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5" style={{ color: "var(--chess-orange)" }}>
                      <Icon name={item.icon} size={17} fallback="CheckCircle" />
                    </div>
                    <div>
                      <p className="font-oswald font-semibold text-white text-sm">{item.t}</p>
                      <p className="text-xs font-ibm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-chess p-6">
              <h3 className="font-oswald font-bold text-xl text-white mb-5">
                Идеальный <span style={{ color: "var(--chess-orange)" }}>день ученика</span>
              </h3>
              <div className="space-y-2">
                {[
                  { time: "08:00", dur: "15 мин", act: "Тактические задачи", icon: "Brain", hi: true },
                  { time: "12:00", dur: "10 мин", act: "Повторение темы недели", icon: "BookOpen", hi: false },
                  { time: "19:00", dur: "30 мин", act: "Партия на Lichess", icon: "Swords", hi: true },
                  { time: "19:30", dur: "10 мин", act: "Анализ партии (Stockfish)", icon: "BarChart2", hi: false },
                  { time: "ВС", dur: "60 мин", act: "Разбор недели + план следующей", icon: "Calendar", hi: true },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border" style={{ borderColor: "var(--chess-border)" }}>
                    <div className="w-12 text-right shrink-0">
                      <span className="text-xs font-oswald" style={{ color: "rgba(255,255,255,0.35)" }}>{row.time}</span>
                    </div>
                    <div style={{ color: row.hi ? "var(--chess-orange)" : "rgba(255,255,255,0.4)" }}>
                      <Icon name={row.icon} size={15} fallback="Clock" />
                    </div>
                    <p className="flex-1 text-sm font-ibm text-white">{row.act}</p>
                    <span className="text-xs font-oswald shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{row.dur}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-chess p-6 lg:col-span-2">
              <h3 className="font-oswald font-bold text-xl text-white mb-5">
                Задания по неделям — <span style={{ color: "var(--chess-orange)" }}>обзор</span>
              </h3>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {WEEKS.map(w => (
                  <div key={w.week} className="p-3 border" style={{ borderColor: "var(--chess-border)", background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-oswald font-bold text-sm" style={{ color: "var(--chess-orange)" }}>Нед. {w.week}</span>
                      <span className="text-xs font-ibm text-white">{w.title}</span>
                    </div>
                    <p className="text-xs font-ibm" style={{ color: "rgba(255,255,255,0.45)" }}>{w.task}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ТРЕНАЖЁРЫ ===== */}
      <section id="trainers" className="py-20 sm:py-28" style={{ background: "rgba(255,255,255,0.018)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-tag mb-4">Онлайн-тренажёры</div>
            <h2 className="font-oswald font-bold text-4xl sm:text-5xl text-white">ПРАКТИКА В СЕТИ</h2>
            <p className="font-ibm mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>Лучшие бесплатные платформы для тренировки шахмат</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
            {TRAINERS.map((t, i) => (
              <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" className="card-chess p-6 block group">
                <div className="text-5xl mb-4">{t.icon}</div>
                <h3 className="font-oswald font-bold text-xl text-white mb-2 group-hover:text-orange-400 transition-colors">{t.name}</h3>
                <p className="text-xs font-ibm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>{t.desc}</p>
                <ul className="space-y-1 mb-4">
                  {t.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs font-ibm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span style={{ color: "var(--chess-orange)" }}>→</span>{f}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1 text-xs font-oswald uppercase tracking-wider" style={{ color: "var(--chess-orange)" }}>
                  Открыть <Icon name="ExternalLink" size={11} />
                </span>
              </a>
            ))}
          </div>

          <div className="border-t pt-12" style={{ borderColor: "var(--chess-border)" }}>
            <div className="text-center mb-8">
              <div className="section-tag mb-3">Встроенный тренажёр</div>
              <h3 className="font-oswald font-bold text-3xl sm:text-4xl text-white">
                ИНТЕРАКТИВНАЯ <span style={{ color: "var(--chess-orange)" }}>ДОСКА</span>
              </h3>
              <p className="font-ibm mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Двигай фигуры и решай тактические позиции прямо здесь
              </p>
            </div>
            <div className="card-chess p-6 sm:p-8">
              <ChessBoard />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ПРОГРЕСС ===== */}
      <section id="progress" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-tag mb-4">Трекер</div>
            <h2 className="font-oswald font-bold text-4xl sm:text-5xl text-white">ТВОЙ ПРОГРЕСС</h2>
            <p className="font-ibm mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              Отмечай пройденные недели — видь рост в реальном времени
            </p>
          </div>
          <ProgressTracker />
        </div>
      </section>

      {/* ===== КОНТАКТЫ ===== */}
      <section id="contacts" className="py-20 sm:py-28" style={{ background: "rgba(255,255,255,0.018)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="section-tag mb-4">Контакты</div>
          <h2 className="font-oswald font-bold text-4xl sm:text-5xl text-white mb-6">
            ГОТОВ К <span style={{ color: "var(--chess-orange)" }}>СТАРТУ?</span>
          </h2>
          <p className="font-ibm text-lg mb-10 mx-auto" style={{ color: "rgba(255,255,255,0.55)", maxWidth: "480px", lineHeight: 1.7 }}>
            Начни курс прямо сейчас — первая неделя бесплатна. Есть вопросы? Напиши нам.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: "Mail", label: "Email", value: "chess@example.com", href: "mailto:chess@example.com" },
              { icon: "MessageCircle", label: "Telegram", value: "@shahmaster12", href: "https://t.me/shahmaster12" },
              { icon: "Globe", label: "Сообщество", value: "Lichess клуб", href: "https://lichess.org/team" },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="card-chess p-6 block">
                <div className="flex justify-center mb-3" style={{ color: "var(--chess-orange)" }}>
                  <Icon name={c.icon} size={28} fallback="Link" />
                </div>
                <p className="font-oswald font-semibold text-white">{c.label}</p>
                <p className="text-sm font-ibm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{c.value}</p>
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button className="chess-btn-primary" onClick={() => go("lessons")}>
              <Icon name="Play" size={18} /> Начать курс
            </button>
            <button className="chess-btn-outline" onClick={() => go("trainers")}>
              <Icon name="Monitor" size={18} /> Тренажёры
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8" style={{ borderColor: "var(--chess-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl" style={{ color: "var(--chess-orange)" }}>♟</span>
              <span className="font-oswald font-bold text-white tracking-widest">ШАХ<span style={{ color: "var(--chess-orange)" }}>МАСТЕР</span></span>
            </div>
            <p className="text-xs font-ibm text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
              На основе методологии «12 недель в году» — Брайан Моран, Майкл Леннингтон
            </p>
            <div className="flex gap-4">
              {[
                { label: "Lichess", href: "https://lichess.org" },
                { label: "Chess.com", href: "https://chess.com" },
                { label: "ChessTempo", href: "https://chesstempo.com" },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-ibm hover:underline" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}