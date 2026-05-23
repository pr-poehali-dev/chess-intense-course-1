import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

/* ══════════════════════════════════════════
   ДАННЫЕ
══════════════════════════════════════════ */

const WEEKS = [
  { week: 1,  phase: "I",   title: "Правила и фигуры",                 desc: "Ходы фигур, шах, мат, пат. Базовые правила игры.",                              book: "Капабланка — «Шахматы для начинающих», гл. 1–2",                            task: "Сыграть 5 партий против Stockfish (уровень 1)",                              trainer: { name: "Lichess — игра с компьютером", url: "https://lichess.org/play/ai" } },
  { week: 2,  phase: "I",   title: "Ценность фигур",                   desc: "Материальный баланс, правила размена, выигрыш материала.",                        book: "Нейштадт — «Шахматы», гл. 1–3",                                            task: "Решить 20 задач на выигрыш материала",                                       trainer: { name: "Chess.com — тактика",              url: "https://www.chess.com/puzzles" } },
  { week: 3,  phase: "I",   title: "Основы дебюта",                    desc: "Три принципа: контроль центра, развитие, безопасность короля.",                   book: "Коупленд — «Дебютный репертуар новичка», гл. 1–4",                          task: "Сыграть Итальянскую и Испанскую партии по 10 раз",                            trainer: { name: "Lichess — дебюты",                 url: "https://lichess.org/study" } },
  { week: 4,  phase: "II",  title: "Вилка и связка",                   desc: "Двойной удар, абсолютная и относительная связка.",                               book: "Рейнфельд — «1001 шахматная задача», задачи 1–100",                         task: "Решить 30 задач на вилку и связку",                                          trainer: { name: "Lichess — вилка",                  url: "https://lichess.org/training/fork" } },
  { week: 5,  phase: "II",  title: "Открытый шах, сквозной удар",      desc: "Открытые линии, skewer, двойной шах.",                                          book: "Рейнфельд — «1001 шахматная задача», задачи 101–250",                       task: "30-минутный блиц по тактике ежедневно",                                      trainer: { name: "ChessTempo — тактика",             url: "https://chesstempo.com" } },
  { week: 6,  phase: "II",  title: "Атака на короля",                  desc: "Атака на нерокировавшегося короля, матовые комбинации.",                         book: "Дворецкий — «Атака и защита», часть 1",                                     task: "Решить 20 задач на мат в 2–3 хода",                                          trainer: { name: "Lichess — мат в 2",                url: "https://lichess.org/training/mateIn2" } },
  { week: 7,  phase: "III", title: "Пешечный эндшпиль",                desc: "Правило квадрата, оппозиция, прорыв пешки.",                                    book: "Мюллер & Лампрехт — «Фундаментальный эндшпиль», гл. 1",                    task: "Сыграть 10 партий до пешечного эндшпиля",                                    trainer: { name: "Lichess — практика эндшпиля",      url: "https://lichess.org/practice" } },
  { week: 8,  phase: "III", title: "Ладейный эндшпиль",                desc: "Позиция Лусены, защита Филидора, активный король.",                              book: "Мюллер & Лампрехт — «Фундаментальный эндшпиль», гл. 4–5",                  task: "Решить 20 задач на ладейный эндшпиль",                                       trainer: { name: "ChessTempo — эндшпиль",            url: "https://chesstempo.com/endgame-training" } },
  { week: 9,  phase: "III", title: "Стратегия и пешечная структура",   desc: "Изолированная, сдвоенная и проходная пешка. Слабые поля.",                      book: "Нимцович — «Моя система», гл. 1–3",                                         task: "Проанализировать 5 своих партий в Stockfish",                                trainer: { name: "Lichess — анализ",                 url: "https://lichess.org/analysis" } },
  { week: 10, phase: "IV",  title: "Дебютный репертуар",               desc: "Построение персонального репертуара за белых и чёрных.",                        book: "ДеФирмиан (NCO) — «Современные шахматные дебюты»",                          task: "Заучить 5 ключевых линий своего репертуара",                                 trainer: { name: "Lichess — дебютный тренажёр",     url: "https://lichess.org/opening" } },
  { week: 11, phase: "IV",  title: "Расчёт и оценка позиции",          desc: "Метод кандидатов Котова, расчёт вариантов, оценка позиции.",                    book: "Котов — «Думай как гроссмейстер», часть 1",                                 task: "Решить 30 задач без подсказок, записывая время",                             trainer: { name: "ChessTempo — без подсказок",       url: "https://chesstempo.com/chess-problems" } },
  { week: 12, phase: "IV",  title: "Финальный турнир",                 desc: "Применить все навыки в серии рейтинговых партий.",                               book: "Полугаевский & Шамкович — «Шахматная тактика» (повторение)",               task: "Сыграть 10 рейтинговых партий и разобрать каждую",                           trainer: { name: "Lichess — турнир",                 url: "https://lichess.org/tournament" } },
];

const PHASES = [
  { num: "I",   title: "Старт",       weeks: "1–3",   desc: "Правила, фигуры, первые принципы" },
  { num: "II",  title: "Развитие",    weeks: "4–6",   desc: "Тактика, атака, комбинации" },
  { num: "III", title: "Углубление",  weeks: "7–9",   desc: "Эндшпиль, стратегия, анализ" },
  { num: "IV",  title: "Мастерство",  weeks: "10–12", desc: "Дебют, расчёт, соревнования" },
];

const TRAINER_GROUPS = [
  {
    label: "Основные платформы",
    items: [
      { name: "Lichess",           url: "https://lichess.org",                          desc: "Открытая бесплатная платформа — тактика, дебюты, эндшпиль, Stockfish",      free: true,  tags: ["Тактика","Анализ","Дебюты","Эндшпиль"] },
      { name: "Chess.com",         url: "https://chess.com",                            desc: "Крупнейшая платформа — уроки, задачи, видео гроссмейстеров",               free: false, tags: ["Уроки","Задачи","Видео GM"] },
    ]
  },
  {
    label: "Тактика и задачи",
    items: [
      { name: "ChessTempo",        url: "https://chesstempo.com",                       desc: "Рейтинговые тактические задачи, база дебютов и эндшпилей",                 free: true,  tags: ["Рейтинг","Эндшпиль БД","Дебюты"] },
      { name: "Puzzle Rush",       url: "https://www.chess.com/puzzles/rush",           desc: "Скоростные задачи — режим на время или на выживание",                      free: false, tags: ["Блиц","На время","Выживание"] },
      { name: "Chessable",         url: "https://www.chessable.com",                   desc: "Интервальные повторения для запоминания дебютных линий",                   free: false, tags: ["Повторения","Дебюты","Книги GM"] },
    ]
  },
  {
    label: "Дебюты и стратегия",
    items: [
      { name: "Opening Tree",      url: "https://lichess.org/opening",                 desc: "Интерактивное дерево дебютов с базой миллионов партий",                    free: true,  tags: ["Дерево дебютов","Статистика"] },
      { name: "365Chess",          url: "https://www.365chess.com/opening.php",        desc: "Полная база дебютных вариантов с историческими партиями",                  free: true,  tags: ["База дебютов","Варианты"] },
    ]
  },
  {
    label: "Эндшпиль и анализ",
    items: [
      { name: "Lichess Practice",  url: "https://lichess.org/practice",                desc: "Структурированные уроки эндшпиля с интерактивными упражнениями",           free: true,  tags: ["Пешечный","Ладейный","Урок+практика"] },
      { name: "Syzygy Tablebase",  url: "https://syzygy-tables.info",                  desc: "Идеальная база до 7 фигур — точный результат любой позиции",               free: true,  tags: ["7-фигур","Идеальная игра"] },
    ]
  },
  {
    label: "Видео и контент",
    items: [
      { name: "GothamChess",       url: "https://www.youtube.com/@GothamChess",        desc: "Леви Розман — разборы партий, дебютов и тактики для всех уровней",         free: true,  tags: ["YouTube","Разборы","Дебюты"] },
      { name: "Chess King",        url: "https://chess-king.com",                       desc: "Курс Каспарова: мобильное обучение с задачами по уровням",                  free: false, tags: ["Каспаров","Мобильный","Уровни"] },
    ]
  },
];

/* ══════════════════════════════════════════
   ШАХМАТНАЯ ДОСКА
══════════════════════════════════════════ */

const INIT_POS: Record<string, string> = {
  a8:"♜",b8:"♞",c8:"♝",d8:"♛",e8:"♚",f8:"♝",g8:"♞",h8:"♜",
  a7:"♟",b7:"♟",c7:"♟",d7:"♟",e7:"♟",f7:"♟",g7:"♟",h7:"♟",
  a2:"♙",b2:"♙",c2:"♙",d2:"♙",e2:"♙",f2:"♙",g2:"♙",h2:"♙",
  a1:"♖",b1:"♘",c1:"♗",d1:"♕",e1:"♔",f1:"♗",g1:"♘",h1:"♖",
};

const PUZZLES = [
  {
    name: "Мат в 1 ход",
    desc: "Белые начинают и дают мат в 1 ход.",
    hint: "Ферзь на h7 — мат!",
    solution: "Фh7#",
    pos: { e1:"♔",g1:"♖",e2:"♙",f2:"♙",g2:"♙",h2:"♙",d1:"♕",e8:"♚",f8:"♜",g8:"♞",h8:"♜",e7:"♟",f7:"♟",h7:"♟",g6:"♟" } as Record<string,string>
  },
  {
    name: "Вилка конём",
    desc: "Белые выигрывают материал.",
    hint: "Конь на e7 — одновременный удар по королю и ферзю!",
    solution: "Кe7+",
    pos: { e1:"♔",h1:"♖",c3:"♘",e4:"♙",e8:"♚",h8:"♜",d6:"♛",f6:"♟" } as Record<string,string>
  },
  {
    name: "Связка слоном",
    desc: "Белые создают связку и выигрывают фигуру.",
    hint: "Слон на b2 связывает коня с королём!",
    solution: "Сb2",
    pos: { e1:"♔",f1:"♗",e4:"♙",e8:"♚",f6:"♞",e7:"♟",d5:"♟" } as Record<string,string>
  },
];

function ChessBoard() {
  const FILES = ["a","b","c","d","e","f","g","h"];
  const RANKS = [8,7,6,5,4,3,2,1];
  const [pos, setPos] = useState<Record<string,string>>(INIT_POS);
  const [sel, setSel] = useState<string|null>(null);
  const [mode, setMode] = useState<"free"|"puzzle">("free");
  const [pIdx, setPIdx] = useState(0);
  const [hint, setHint] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const loadPuzzle = (i: number) => {
    setPIdx(i); setPos(PUZZLES[i].pos);
    setSel(null); setHint(false); setLog([]); setMode("puzzle");
  };

  const reset = () => {
    setPos(INIT_POS); setSel(null); setLog([]); setMode("free");
  };

  const click = (sq: string) => {
    if (!sel) { if (pos[sq]) setSel(sq); return; }
    if (sel === sq) { setSel(null); return; }
    const piece = pos[sel];
    const np = { ...pos };
    const cap = np[sq];
    delete np[sel];
    np[sq] = piece;
    setPos(np);
    setLog(prev => [`${piece} ${sel}→${sq}${cap?" ×"+cap:""}`, ...prev].slice(0,6));
    setSel(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Доска */}
      <div className="flex-shrink-0">
        <div className="flex">
          <div className="flex flex-col mr-1">
            {RANKS.map(r => (
              <div key={r} className="w-4 flex items-center justify-center font-body text-xs" style={{ height:"44px", color:"var(--text-3)" }}>{r}</div>
            ))}
          </div>
          <div>
            <div className="grid grid-cols-8" style={{ border:"1px solid var(--gold-line)" }}>
              {RANKS.map(rank => FILES.map(file => {
                const sq = `${file}${rank}`;
                const light = (FILES.indexOf(file) + rank) % 2 === 0;
                const piece = pos[sq];
                const isSel = sel === sq;
                return (
                  <div
                    key={sq} onClick={() => click(sq)}
                    className={`flex items-center justify-center cursor-pointer select-none ${isSel ? "sq-sel" : light ? "sq-l" : "sq-d"}`}
                    style={{ width:44, height:44, transition:"background 0.12s" }}
                  >
                    {piece && (
                      <span className="text-2xl leading-none" style={{
                        userSelect:"none",
                        filter: piece.charCodeAt(0) < 9820
                          ? "drop-shadow(0 1px 3px rgba(0,0,0,0.95))"
                          : "drop-shadow(0 1px 2px rgba(0,0,0,0.4))"
                      }}>
                        {piece}
                      </span>
                    )}
                  </div>
                );
              }))}
            </div>
            <div className="flex ml-4">
              {FILES.map(f => (
                <div key={f} className="flex items-center justify-center font-body text-xs" style={{ width:44, height:18, color:"var(--text-3)" }}>{f}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Панель */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Режим */}
        <div className="flex gap-2">
          {[
            { id:"free", label:"Свободная игра", fn: reset },
            { id:"puzzle", label:"Задачи", fn: () => loadPuzzle(pIdx) },
          ].map(b => (
            <button key={b.id} onClick={b.fn}
              className="px-4 py-2 font-label text-xs tracking-widest uppercase transition-all"
              style={{
                border: `1px solid ${mode===b.id ? "var(--gold)" : "var(--line-strong)"}`,
                color: mode===b.id ? "var(--gold)" : "var(--text-3)",
                background: mode===b.id ? "rgba(201,168,76,0.06)" : "transparent"
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Задачи */}
        {mode === "puzzle" && (
          <div className="space-y-2">
            {PUZZLES.map((p, i) => (
              <button key={i} onClick={() => loadPuzzle(i)}
                className="w-full text-left px-4 py-3 transition-all"
                style={{
                  border: `1px solid ${pIdx===i ? "var(--gold-line)" : "var(--line)"}`,
                  background: pIdx===i ? "rgba(201,168,76,0.04)" : "transparent"
                }}
              >
                <p className="font-label text-xs font-semibold tracking-wider" style={{ color: pIdx===i ? "var(--gold)" : "var(--text-2)" }}>{p.name}</p>
                <p className="font-body text-xs mt-0.5" style={{ color:"var(--text-3)" }}>{p.desc}</p>
              </button>
            ))}

            <button onClick={() => setHint(!hint)}
              className="flex items-center gap-2 font-label text-xs tracking-wider uppercase mt-1"
              style={{ color:"var(--gold)", opacity:0.7 }}
            >
              <Icon name="Lightbulb" size={13} />
              {hint ? "Скрыть подсказку" : "Подсказка"}
            </button>
            {hint && (
              <div className="px-4 py-3" style={{ borderLeft:"1px solid var(--gold-line)", background:"rgba(201,168,76,0.04)" }}>
                <p className="font-body text-xs" style={{ color:"var(--text-2)" }}>
                  {PUZZLES[pIdx].hint}
                </p>
                <p className="font-label text-xs font-semibold mt-1.5" style={{ color:"var(--gold)" }}>
                  Решение: {PUZZLES[pIdx].solution}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Лог ходов */}
        {log.length > 0 && (
          <div>
            <p className="font-label text-xs tracking-widest uppercase mb-2" style={{ color:"var(--text-3)" }}>Ходы</p>
            {log.map((m, i) => (
              <div key={i} className="font-body text-xs py-1 px-2" style={{ color: i===0 ? "var(--gold)" : "var(--text-3)", background: i===0 ? "rgba(201,168,76,0.04)" : "transparent" }}>
                {m}
              </div>
            ))}
          </div>
        )}

        <p className="font-body text-xs" style={{ color:"var(--text-3)" }}>
          Кликни по фигуре → кликни по клетке назначения
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ПРОГРЕСС
══════════════════════════════════════════ */

function Progress() {
  const [done, setDone] = useState<number[]>([]);
  const toggle = (w: number) => setDone(prev => prev.includes(w) ? prev.filter(x=>x!==w) : [...prev,w]);
  const pct = Math.round((done.length/12)*100);

  return (
    <div className="space-y-8">
      {/* Общая шкала */}
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <span className="font-label text-xs tracking-widest uppercase" style={{ color:"var(--text-3)" }}>Общий прогресс</span>
          <span className="font-display text-3xl font-light" style={{ color:"var(--gold)" }}>{pct}<span className="text-base">%</span></span>
        </div>
        <div className="prog-track"><div className="prog-fill" style={{ width:`${pct}%` }} /></div>
        <p className="font-body text-xs mt-2" style={{ color:"var(--text-3)" }}>{done.length} из 12 недель завершено</p>
      </div>

      {/* Фазы */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background:"var(--line)" }}>
        {PHASES.map((ph) => {
          const phWeeks = WEEKS.filter(w => w.phase === ph.num).map(w => w.week);
          const phDone = phWeeks.filter(w => done.includes(w)).length;
          const phPct = Math.round((phDone/phWeeks.length)*100);
          return (
            <div key={ph.num} className="p-5" style={{ background:"var(--surface-1)" }}>
              <p className="font-display text-3xl font-light" style={{ color:"var(--gold)" }}>{phPct}<span className="text-lg">%</span></p>
              <p className="font-label text-xs tracking-widest uppercase mt-1" style={{ color:"var(--text-3)" }}>Фаза {ph.num}</p>
              <p className="font-body text-xs mt-1" style={{ color:"var(--text-3)" }}>{ph.title}</p>
              <div className="prog-track mt-3"><div className="prog-fill" style={{ width:`${phPct}%` }} /></div>
            </div>
          );
        })}
      </div>

      {/* Недели */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px" style={{ background:"var(--line)" }}>
        {WEEKS.map(w => {
          const isDone = done.includes(w.week);
          return (
            <div
              key={w.week} onClick={() => toggle(w.week)}
              className="p-4 cursor-pointer transition-all"
              style={{
                background: isDone ? "rgba(201,168,76,0.06)" : "var(--surface-1)",
                borderBottom: isDone ? "1px solid var(--gold-line)" : "1px solid transparent"
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="week-badge" style={{
                  background: isDone ? "var(--gold)" : "transparent",
                  color: isDone ? "#080808" : "var(--gold)",
                }}>
                  {isDone ? "✓" : w.week}
                </div>
                <span className="font-label text-xs tracking-wider uppercase" style={{ color:"var(--text-3)" }}>Фаза {w.phase}</span>
              </div>
              <p className="font-body text-xs leading-snug" style={{ color: isDone ? "var(--text-1)" : "var(--text-2)" }}>{w.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   НАВИГАЦИЯ
══════════════════════════════════════════ */

function Nav({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { id:"home",     label:"Главная" },
    { id:"about",    label:"О курсе" },
    { id:"lessons",  label:"Уроки" },
    { id:"tasks",    label:"Задания" },
    { id:"trainers", label:"Тренажёры" },
    { id:"progress", label:"Прогресс" },
    { id:"contacts", label:"Контакты" },
  ];

  const go = (id: string) => {
    onNav(id); setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,7,7,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--line)" : "none",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => go("home")} className="flex items-center gap-3">
            <span className="font-display text-xl font-light tracking-widest" style={{ color:"var(--text-1)" }}>
              ШАХМАСТЕР
            </span>
            <span className="font-display italic text-sm" style={{ color:"var(--gold)", opacity:0.7 }}>
              XII
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)}
                className={`nav-item ${active===l.id ? "active" : ""}`}>
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <button onClick={() => go("lessons")} className="btn-gold" style={{ padding:"10px 28px", fontSize:"0.62rem" }}>
              Начать
            </button>
          </div>

          {/* Burger */}
          <button className="lg:hidden" style={{ color:"var(--text-2)" }} onClick={() => setOpen(!open)}>
            <Icon name={open ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div style={{ background:"rgba(7,7,7,0.99)", borderTop:"1px solid var(--line)" }}>
          <div className="px-6 py-5 space-y-0">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)}
                className="block w-full text-left py-3.5 nav-item text-xs"
                style={{ borderBottom:"1px solid var(--line)" }}>
                {l.label}
              </button>
            ))}
            <div className="pt-5">
              <button onClick={() => go("lessons")} className="btn-gold w-full justify-center">
                Начать обучение
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════
   ГЛАВНАЯ СТРАНИЦА
══════════════════════════════════════════ */

export default function Index() {
  const [active, setActive] = useState("home");
  const [openWeek, setOpenWeek] = useState<number|null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.2, rootMargin:"-80px 0px 0px 0px" }
    );
    ["home","about","lessons","tasks","trainers","progress","contacts"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <div style={{ background:"var(--black)", color:"var(--text-1)", minHeight:"100vh" }}>
      <Nav active={active} onNav={setActive} />

      {/* ══ HERO ══════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">

        {/* Фоновая шахматная сетка */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:"repeating-conic-gradient(rgba(201,168,76,0.025) 0% 25%, transparent 0% 50%)",
          backgroundSize:"72px 72px",
          opacity:1
        }} />
        {/* Радиальный градиент поверх */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse 60% 80% at 50% 50%, transparent 30%, var(--black) 80%)"
        }} />

        {/* Декоративная фигура */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none"
          style={{ paddingRight:"4vw" }}>
          <span className="font-display anim-float" style={{
            fontSize:"clamp(180px,22vw,320px)",
            color:"transparent",
            WebkitTextStroke:"1px rgba(201,168,76,0.1)",
            lineHeight:1,
          }}>♚</span>
        </div>

        <div className="relative max-w-screen-xl mx-auto px-6 sm:px-10 pt-28 pb-20">
          <div style={{ maxWidth:"680px" }}>

            <div className="label-tag mb-8 anim-up">Методология «12 недель в году»</div>

            <h1 className="font-display font-light anim-up d-1"
              style={{ fontSize:"clamp(3rem,7.5vw,6rem)", lineHeight:1.05, letterSpacing:"-0.01em" }}>
              Освой шахматы<br />
              <em style={{ color:"var(--gold)", fontStyle:"italic" }}>за 12 недель</em>
            </h1>

            <p className="font-body text-base mt-7 mb-10 anim-up d-2"
              style={{ color:"var(--text-2)", maxWidth:"500px", lineHeight:1.8 }}>
              Интенсивный курс по технологии Брайана Морана. Учебники гроссмейстеров,
              онлайн-тренажёры и трекер прогресса — всё в одном месте.
            </p>

            <div className="flex flex-wrap gap-3 anim-up d-3">
              <button className="btn-gold" onClick={() => go("lessons")}>
                <Icon name="Play" size={14} /> Начать обучение
              </button>
              <button className="btn-ghost" onClick={() => go("about")}>
                <Icon name="BookOpen" size={14} /> О методологии
              </button>
            </div>

            {/* Метрики */}
            <div className="flex flex-wrap gap-10 mt-16 anim-up d-4">
              {[
                { v:"12", l:"Недель" },
                { v:"84+", l:"Упражнений" },
                { v:"IV", l:"Фазы" },
                { v:"10", l:"Тренажёров" },
              ].map((s,i) => (
                <div key={i}>
                  <p className="font-display text-4xl font-light" style={{ color:"var(--gold)" }}>{s.v}</p>
                  <p className="font-label text-xs tracking-widest uppercase mt-1" style={{ color:"var(--text-3)" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ О КУРСЕ ═══════════════════════════ */}
      <section id="about" className="py-24 sm:py-32">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
          <div className="gold-rule mb-20" />

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="label-tag mb-6">Методология</div>
              <h2 className="font-display font-light" style={{ fontSize:"clamp(2.2rem,4.5vw,3.5rem)", lineHeight:1.1 }}>
                Технология<br /><em style={{ color:"var(--gold)" }}>«12 недель в году»</em>
              </h2>
              <div className="space-y-5 mt-8 font-body text-sm" style={{ color:"var(--text-2)", lineHeight:1.85 }}>
                <p>
                  Брайан Моран и Майкл Леннингтон доказали: <strong style={{ color:"var(--text-1)" }}>12-недельный спринт
                  эффективнее годового плана.</strong> Годовые цели слишком далеки — 12-недельные
                  создают немедленный фокус и действие.
                </p>
                <p>
                  Курс разбит на четыре фазы с конкретными целями, еженедельными заданиями
                  и измеримыми результатами. Никаких расплывчатых «улучшить игру».
                </p>
                <p>
                  Учебная база: Капабланка, Нимцович, Котов, Дворецкий —
                  только проверенные временем методики.
                </p>
              </div>
              <a href="https://www.mann-ivanov-ferber.ru/books/12-nedel-v-godu/"
                target="_blank" rel="noopener noreferrer"
                className="btn-ghost mt-8 inline-flex" style={{ fontSize:"0.62rem" }}>
                <Icon name="ExternalLink" size={12} /> Книга Морана — МИФ
              </a>
            </div>

            {/* Фазы */}
            <div className="space-y-px" style={{ background:"var(--line)" }}>
              {PHASES.map((ph) => (
                <div key={ph.num} className="flex items-start gap-6 p-6" style={{ background:"var(--surface-1)" }}>
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border"
                    style={{ borderColor:"var(--gold-line)" }}>
                    <span className="font-display text-lg font-light" style={{ color:"var(--gold)" }}>{ph.num}</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-label text-sm font-semibold tracking-wider" style={{ color:"var(--text-1)" }}>{ph.title}</span>
                      <span className="font-body text-xs" style={{ color:"var(--text-3)" }}>Нед. {ph.weeks}</span>
                    </div>
                    <p className="font-body text-xs mt-1.5" style={{ color:"var(--text-3)" }}>{ph.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ УРОКИ ═════════════════════════════ */}
      <section id="lessons" style={{ background:"var(--surface-1)", paddingTop:"6rem", paddingBottom:"6rem" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="label-tag mb-5">12 недель</div>
              <h2 className="font-display font-light" style={{ fontSize:"clamp(2rem,4vw,3rem)" }}>
                Программа курса
              </h2>
            </div>
            <p className="font-body text-xs" style={{ color:"var(--text-3)" }}>
              Нажмите на неделю, чтобы раскрыть детали
            </p>
          </div>

          {/* Заголовок таблицы */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-3 mb-1"
            style={{ borderBottom:"1px solid var(--line)" }}>
            <div className="col-span-1 font-label text-xs tracking-widest uppercase" style={{ color:"var(--text-3)" }}>№</div>
            <div className="col-span-2 font-label text-xs tracking-widest uppercase" style={{ color:"var(--text-3)" }}>Фаза</div>
            <div className="col-span-4 font-label text-xs tracking-widest uppercase" style={{ color:"var(--text-3)" }}>Тема</div>
            <div className="col-span-5 font-label text-xs tracking-widest uppercase" style={{ color:"var(--text-3)" }}>Описание</div>
          </div>

          <div>
            {WEEKS.map(w => (
              <div key={w.week}>
                <div
                  onClick={() => setOpenWeek(openWeek === w.week ? null : w.week)}
                  className="group md:grid md:grid-cols-12 md:gap-4 flex items-start gap-4 py-5 cursor-pointer transition-all"
                  style={{
                    borderBottom:"1px solid var(--line)",
                    background: openWeek === w.week ? "rgba(201,168,76,0.03)" : "transparent"
                  }}
                >
                  <div className="col-span-1 week-badge">{w.week}</div>
                  <div className="col-span-2">
                    <span className="font-label text-xs tracking-widest" style={{ color:"var(--gold)", opacity:0.7 }}>Фаза {w.phase}</span>
                  </div>
                  <div className="col-span-4 flex-1">
                    <span className="font-body text-sm" style={{ color:"var(--text-1)" }}>{w.title}</span>
                  </div>
                  <div className="col-span-4 hidden md:block">
                    <span className="font-body text-xs" style={{ color:"var(--text-3)" }}>{w.desc}</span>
                  </div>
                  <div className="col-span-1 flex justify-end pt-0.5">
                    <Icon
                      name={openWeek === w.week ? "ChevronUp" : "ChevronDown"}
                      size={14}
                      fallback="ChevronDown"
                    />
                  </div>
                </div>

                {/* Раскрытая деталь */}
                {openWeek === w.week && (
                  <div className="py-5 px-0 md:pl-16 grid sm:grid-cols-3 gap-6 mb-2"
                    style={{ borderBottom:"1px solid var(--line)", background:"rgba(201,168,76,0.02)" }}>
                    <div>
                      <p className="label-tag mb-2" style={{ fontSize:"0.58rem" }}>Учебник</p>
                      <p className="font-body text-xs" style={{ color:"var(--text-2)", lineHeight:1.7 }}>{w.book}</p>
                    </div>
                    <div>
                      <p className="label-tag mb-2" style={{ fontSize:"0.58rem" }}>Задание недели</p>
                      <p className="font-body text-xs" style={{ color:"var(--text-2)", lineHeight:1.7 }}>{w.task}</p>
                    </div>
                    <div>
                      <p className="label-tag mb-2" style={{ fontSize:"0.58rem" }}>Тренажёр</p>
                      <a href={w.trainer.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-body text-xs"
                        style={{ color:"var(--gold)" }}
                        onClick={e => e.stopPropagation()}
                      >
                        {w.trainer.name} <Icon name="ExternalLink" size={11} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ЗАДАНИЯ ═══════════════════════════ */}
      <section id="tasks" className="py-24 sm:py-32">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
          <div className="gold-rule mb-20" />

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="label-tag mb-6">Практика</div>
              <h2 className="font-display font-light" style={{ fontSize:"clamp(2rem,4vw,3rem)" }}>
                Система заданий
              </h2>
              <p className="font-body text-sm mt-5" style={{ color:"var(--text-2)", lineHeight:1.8 }}>
                Ключевой принцип «12 недель»: каждый период завершается
                конкретным результатом, который можно измерить.
              </p>

              <div className="mt-8 space-y-0" style={{ borderTop:"1px solid var(--line)" }}>
                {[
                  { n:"01", t:"Еженедельный спринт",  d:"Один навык с измеримым результатом в неделю" },
                  { n:"02", t:"Ежедневная практика",  d:"30 мин/день: тактика + партия или эндшпиль" },
                  { n:"03", t:"Счёт результатов",     d:"80%+ правильных задач = неделя закрыта" },
                  { n:"04", t:"Воскресный разбор",    d:"Анализ 2–3 своих партий с Stockfish" },
                  { n:"05", t:"Боевые раунды",        d:"В нед. 4, 8, 12 — рейтинговые партии" },
                ].map(item => (
                  <div key={item.n} className="flex gap-5 py-4" style={{ borderBottom:"1px solid var(--line)" }}>
                    <span className="font-display text-lg font-light flex-shrink-0 w-8 pt-0.5" style={{ color:"var(--gold)", opacity:0.5 }}>{item.n}</span>
                    <div>
                      <p className="font-label text-xs font-semibold tracking-wider" style={{ color:"var(--text-1)" }}>{item.t}</p>
                      <p className="font-body text-xs mt-1" style={{ color:"var(--text-3)" }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Расписание дня */}
            <div>
              <div className="label-tag mb-6">Расписание</div>
              <h3 className="font-display font-light text-2xl">Идеальный день ученика</h3>

              <div className="mt-8 space-y-px" style={{ background:"var(--line)" }}>
                {[
                  { t:"08:00", d:"15 мин", a:"Тактические задачи",           hi:true },
                  { t:"12:00", d:"10 мин", a:"Повторение темы недели",        hi:false },
                  { t:"19:00", d:"30 мин", a:"Партия на Lichess",             hi:true },
                  { t:"19:30", d:"10 мин", a:"Анализ партии (Stockfish)",     hi:false },
                  { t:"Вс",    d:"60 мин", a:"Итоги недели + план следующей", hi:true },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-5 px-5 py-4" style={{ background:"var(--surface-1)" }}>
                    <span className="font-display text-base font-light w-12 text-right flex-shrink-0" style={{ color: row.hi ? "var(--gold)" : "var(--text-3)" }}>{row.t}</span>
                    <span className="font-body text-sm flex-1" style={{ color:"var(--text-1)" }}>{row.a}</span>
                    <span className="font-label text-xs tracking-widest" style={{ color:"var(--text-3)" }}>{row.d}</span>
                  </div>
                ))}
              </div>

              {/* Быстрый список задач */}
              <div className="mt-10">
                <div className="label-tag mb-5">Все задания</div>
                <div className="space-y-0" style={{ borderTop:"1px solid var(--line)" }}>
                  {WEEKS.map(w => (
                    <div key={w.week} className="flex gap-4 py-3" style={{ borderBottom:"1px solid var(--line)" }}>
                      <div className="week-badge flex-shrink-0" style={{ width:"1.6rem", height:"1.6rem", fontSize:"0.7rem" }}>{w.week}</div>
                      <p className="font-body text-xs" style={{ color:"var(--text-2)", lineHeight:1.7 }}>{w.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ТРЕНАЖЁРЫ ═════════════════════════ */}
      <section id="trainers" style={{ background:"var(--surface-1)", paddingTop:"6rem", paddingBottom:"6rem" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="label-tag mb-5">Онлайн-тренажёры</div>
              <h2 className="font-display font-light" style={{ fontSize:"clamp(2rem,4vw,3rem)" }}>
                Практика в сети
              </h2>
            </div>
            <p className="font-body text-xs" style={{ color:"var(--text-3)" }}>10 платформ · бесплатные и платные</p>
          </div>

          {/* Список тренажёров */}
          <div style={{ borderTop:"1px solid var(--line)" }}>
            {TRAINER_GROUPS.map((grp, gi) => (
              <div key={gi}>
                {/* Категория */}
                <div className="flex items-center gap-6 py-4" style={{ borderBottom:"1px solid var(--line)" }}>
                  <span className="font-label text-xs tracking-widest uppercase" style={{ color:"var(--gold)", opacity:0.6 }}>{grp.label}</span>
                  <div className="flex-1 gold-rule-left" />
                </div>

                {/* Строки */}
                {grp.items.map((t, ti) => (
                  <a key={ti} href={t.url} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-4 sm:gap-8 py-4 transition-all"
                    style={{ borderBottom:"1px solid var(--line)", textDecoration:"none" }}
                  >
                    <div className="w-40 flex-shrink-0">
                      <span className="font-label text-sm font-semibold tracking-wide transition-colors"
                        style={{ color:"var(--text-1)" }}>
                        {t.name}
                      </span>
                    </div>
                    <p className="hidden sm:block flex-1 font-body text-xs" style={{ color:"var(--text-3)", lineHeight:1.6 }}>{t.desc}</p>
                    <div className="hidden md:flex items-center gap-1.5 flex-wrap justify-end" style={{ maxWidth:"240px" }}>
                      {t.tags.slice(0,3).map((tag,ti2) => (
                        <span key={ti2} className="font-body text-xs px-2 py-0.5"
                          style={{ border:"1px solid var(--line-strong)", color:"var(--text-3)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="flex-shrink-0 font-label text-xs tracking-widest w-20 text-right"
                      style={{ color: t.free ? "rgba(160,200,120,0.6)" : "var(--text-3)" }}>
                      {t.free ? "Бесплатно" : "Платно"}
                    </span>
                    <div className="flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color:"var(--gold)", opacity:0.5 }}>
                      <Icon name="ArrowRight" size={14} />
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Интерактивная доска */}
          <div className="mt-20 pt-14" style={{ borderTop:"1px solid var(--line)" }}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="label-tag mb-4">Встроенный тренажёр</div>
                <h3 className="font-display font-light text-3xl">Интерактивная доска</h3>
              </div>
              <p className="font-body text-xs" style={{ color:"var(--text-3)" }}>
                Двигайте фигуры · решайте тактические задачи
              </p>
            </div>
            <div className="p-8 sm:p-10" style={{ background:"var(--surface-2)", border:"1px solid var(--line)" }}>
              <ChessBoard />
            </div>
          </div>
        </div>
      </section>

      {/* ══ ПРОГРЕСС ══════════════════════════ */}
      <section id="progress" className="py-24 sm:py-32">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
          <div className="gold-rule mb-20" />
          <div className="label-tag mb-6">Трекер</div>
          <h2 className="font-display font-light mb-14" style={{ fontSize:"clamp(2rem,4vw,3rem)" }}>
            Ваш прогресс
          </h2>
          <Progress />
        </div>
      </section>

      {/* ══ КОНТАКТЫ ══════════════════════════ */}
      <section id="contacts" style={{ background:"var(--surface-1)", paddingTop:"6rem", paddingBottom:"6rem" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="label-tag mb-6">Контакты</div>
              <h2 className="font-display font-light" style={{ fontSize:"clamp(2rem,4.5vw,3.5rem)", lineHeight:1.1 }}>
                Готовы<br /><em style={{ color:"var(--gold)" }}>начать?</em>
              </h2>
              <p className="font-body text-sm mt-6" style={{ color:"var(--text-2)", lineHeight:1.85, maxWidth:"400px" }}>
                Начните с первой недели прямо сейчас. Все материалы доступны бесплатно —
                нужны только время и желание.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <button className="btn-gold" onClick={() => go("lessons")}>
                  <Icon name="Play" size={14} /> Начать курс
                </button>
                <button className="btn-ghost" onClick={() => go("trainers")}>
                  <Icon name="Monitor" size={14} /> Тренажёры
                </button>
              </div>
            </div>

            <div className="space-y-px" style={{ background:"var(--line)" }}>
              {[
                { icon:"Mail",          label:"Email",      value:"chess@example.com",  href:"mailto:chess@example.com" },
                { icon:"MessageCircle", label:"Telegram",   value:"@shahmaster12",       href:"https://t.me/shahmaster12" },
                { icon:"Globe",         label:"Сообщество", value:"Lichess клуб",        href:"https://lichess.org/team" },
              ].map((c,i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-5 px-6 py-5 group transition-all"
                  style={{ background:"var(--surface-2)", textDecoration:"none" }}>
                  <div style={{ color:"var(--gold)", opacity:0.6 }}>
                    <Icon name={c.icon} size={18} fallback="Link" />
                  </div>
                  <div className="flex-1">
                    <p className="font-label text-xs tracking-widest uppercase" style={{ color:"var(--text-3)" }}>{c.label}</p>
                    <p className="font-body text-sm mt-0.5" style={{ color:"var(--text-1)" }}>{c.value}</p>
                  </div>
                  <div className="transition-transform group-hover:translate-x-1" style={{ color:"var(--gold)", opacity:0.4 }}>
                    <Icon name="ArrowRight" size={14} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════ */}
      <footer style={{ borderTop:"1px solid var(--line)", paddingTop:"2rem", paddingBottom:"2rem" }}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display text-base font-light tracking-widest" style={{ color:"var(--text-3)" }}>
              ШАХМАСТЕР <em style={{ color:"var(--gold)", opacity:0.5 }}>XII</em>
            </span>
            <p className="font-body text-xs text-center" style={{ color:"var(--text-3)" }}>
              По методологии «12 недель в году» — Брайан Моран, Майкл Леннингтон
            </p>
            <div className="flex gap-6">
              {[
                { l:"Lichess", h:"https://lichess.org" },
                { l:"Chess.com", h:"https://chess.com" },
                { l:"ChessTempo", h:"https://chesstempo.com" },
              ].map(x => (
                <a key={x.l} href={x.h} target="_blank" rel="noopener noreferrer"
                  className="font-body text-xs hover:underline" style={{ color:"var(--text-3)" }}>
                  {x.l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
