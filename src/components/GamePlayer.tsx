import { useEffect, useRef, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

export const PLAYABLE = ['snake', 'tetris', 'pong', 'breakout'];

type Props = {
  gameId: string;
  title: string;
  onClose: () => void;
};

/* ---------------- SNAKE ---------------- */
function Snake({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef({ x: 1, y: 0 });
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [tick, setTick] = useState(0);

  const setDir = useCallback((x: number, y: number) => {
    const d = dirRef.current;
    if (d.x === -x && x !== 0) return;
    if (d.y === -y && y !== 0) return;
    dirRef.current = { x, y };
  }, []);

  useEffect(() => {
    const size = 20;
    const cells = 20;
    const snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let localScore = 0;
    let dead = false;
    dirRef.current = { x: 1, y: 0 };

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp') setDir(0, -1);
      if (e.key === 'ArrowDown') setDir(0, 1);
      if (e.key === 'ArrowLeft') setDir(-1, 0);
      if (e.key === 'ArrowRight') setDir(1, 0);
    };
    window.addEventListener('keydown', onKey);

    const loop = setInterval(() => {
      if (dead) return;
      const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };
      if (head.x < 0 || head.y < 0 || head.x >= cells || head.y >= cells || snake.some((s) => s.x === head.x && s.y === head.y)) {
        dead = true;
        setOver(true);
        onScore(localScore);
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        localScore += 10;
        setScore(localScore);
        food = { x: Math.floor(Math.random() * cells), y: Math.floor(Math.random() * cells) };
      } else {
        snake.pop();
      }
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a';
      ctx.fillRect(0, 0, cells * size, cells * size);
      ctx.fillStyle = '#ff2fb3';
      ctx.fillRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4);
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#22e6ff' : '#0fb8cf';
        ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
      });
    }, 110);

    return () => {
      clearInterval(loop);
      window.removeEventListener('keydown', onKey);
    };
  }, [tick, setDir, onScore]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">GAME OVER</div>
            <button onClick={() => { setOver(false); setScore(0); setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <DPad onDir={setDir} />
    </div>
  );
}

/* ---------------- PONG ---------------- */
function Pong({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paddleRef = useRef(160);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState(0);

  const move = useCallback((dir: number) => {
    paddleRef.current = Math.max(0, Math.min(320, paddleRef.current + dir * 40));
  }, []);

  useEffect(() => {
    const W = 400, H = 400, PH = 80;
    const ball = { x: 200, y: 200, dx: 3, dy: 3 };
    let localScore = 0;
    let dead = false;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    };
    window.addEventListener('keydown', onKey);

    const loop = setInterval(() => {
      if (dead) return;
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.y < 0 || ball.y > H) ball.dy *= -1;
      if (ball.x > W - 12) ball.dx *= -1;
      if (ball.x < 20) {
        if (ball.y > paddleRef.current && ball.y < paddleRef.current + PH) {
          ball.dx *= -1;
          localScore += 10;
          setScore(localScore);
          ball.dx *= 1.03; ball.dy *= 1.03;
        } else {
          dead = true; setOver(true); onScore(localScore); return;
        }
      }
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#22e6ff'; ctx.fillRect(8, paddleRef.current, 8, PH);
      ctx.fillStyle = '#ff2fb3'; ctx.beginPath(); ctx.arc(ball.x, ball.y, 7, 0, Math.PI * 2); ctx.fill();
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); };
  }, [tick, move, onScore]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">GAME OVER</div>
            <button onClick={() => { setOver(false); setScore(0); paddleRef.current = 160; setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <PadBtn icon="ChevronUp" onClick={() => move(-1)} />
        <PadBtn icon="ChevronDown" onClick={() => move(1)} />
      </div>
    </div>
  );
}

/* ---------------- BREAKOUT ---------------- */
function Breakout({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paddleRef = useRef(160);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState(0);

  const move = useCallback((dir: number) => {
    paddleRef.current = Math.max(0, Math.min(320, paddleRef.current + dir * 40));
  }, []);

  useEffect(() => {
    const W = 400, H = 400, PW = 80;
    const ball = { x: 200, y: 300, dx: 3, dy: -3 };
    let localScore = 0;
    let dead = false;
    const cols = 8, rows = 4;
    const bricks: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    };
    window.addEventListener('keydown', onKey);

    const loop = setInterval(() => {
      if (dead) return;
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.x < 8 || ball.x > W - 8) ball.dx *= -1;
      if (ball.y < 8) ball.dy *= -1;
      if (ball.y > H - 20 && ball.x > paddleRef.current && ball.x < paddleRef.current + PW) ball.dy *= -1;
      if (ball.y > H) { dead = true; setOver(true); onScore(localScore); return; }

      const bw = W / cols, bh = 24;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (bricks[r][c] && ball.x > c * bw && ball.x < (c + 1) * bw && ball.y > r * bh + 20 && ball.y < (r + 1) * bh + 20) {
          bricks[r][c] = false; ball.dy *= -1; localScore += 10; setScore(localScore);
        }
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, W, H);
      const colors = ['#ff2fb3', '#ffd23f', '#22e6ff', '#8b5cff'];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (bricks[r][c]) { ctx.fillStyle = colors[r % colors.length]; ctx.fillRect(c * bw + 2, r * bh + 22, bw - 4, bh - 4); }
      }
      ctx.fillStyle = '#22e6ff'; ctx.fillRect(paddleRef.current, H - 16, PW, 8);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2); ctx.fill();
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); };
  }, [tick, move, onScore]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">GAME OVER</div>
            <button onClick={() => { setOver(false); setScore(0); paddleRef.current = 160; setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <PadBtn icon="ChevronLeft" onClick={() => move(-1)} />
        <PadBtn icon="ChevronRight" onClick={() => move(1)} />
      </div>
    </div>
  );
}

/* ---------------- TETRIS ---------------- */
const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];
const COLORS = ['#22e6ff', '#ffd23f', '#8b5cff', '#ff8c22', '#2f7bff', '#3fe07a', '#ff2fb3'];

function Tetris({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState(0);
  const actionRef = useRef<string | null>(null);

  const doAction = useCallback((a: string) => { actionRef.current = a; }, []);

  useEffect(() => {
    const COLS = 10, ROWS = 20, S = 20;
    const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let piece = spawn();
    let localScore = 0;
    let dead = false;
    let dropCounter = 0;

    function spawn() {
      const idx = Math.floor(Math.random() * SHAPES.length);
      return { shape: SHAPES[idx], color: idx + 1, x: 3, y: 0 };
    }
    function collide(p: typeof piece) {
      for (let r = 0; r < p.shape.length; r++) for (let c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c]) {
          const nx = p.x + c, ny = p.y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && grid[ny][nx])) return true;
        }
      }
      return false;
    }
    function merge(p: typeof piece) {
      p.shape.forEach((row, r) => row.forEach((v, c) => { if (v && p.y + r >= 0) grid[p.y + r][p.x + c] = p.color; }));
    }
    function rotate(p: typeof piece) {
      const s = p.shape;
      const rotated = s[0].map((_, i) => s.map((row) => row[i]).reverse());
      const np = { ...p, shape: rotated };
      if (!collide(np)) p.shape = rotated;
    }
    function clearLines() {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r].every((v) => v)) {
          grid.splice(r, 1); grid.unshift(Array(COLS).fill(0));
          localScore += 100; setScore(localScore); r++;
        }
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft') doAction('left');
      if (e.key === 'ArrowRight') doAction('right');
      if (e.key === 'ArrowDown') doAction('down');
      if (e.key === 'ArrowUp' || e.key === ' ') doAction('rotate');
    };
    window.addEventListener('keydown', onKey);

    const loop = setInterval(() => {
      if (dead) return;
      const a = actionRef.current; actionRef.current = null;
      if (a === 'left') { const np = { ...piece, x: piece.x - 1 }; if (!collide(np)) piece.x--; }
      if (a === 'right') { const np = { ...piece, x: piece.x + 1 }; if (!collide(np)) piece.x++; }
      if (a === 'rotate') rotate(piece);
      if (a === 'down') dropCounter = 100;

      dropCounter += 8;
      if (dropCounter >= 30) {
        dropCounter = 0;
        const np = { ...piece, y: piece.y + 1 };
        if (collide(np)) {
          merge(piece); clearLines(); piece = spawn();
          if (collide(piece)) { dead = true; setOver(true); onScore(localScore); return; }
        } else piece.y++;
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, COLS * S, ROWS * S);
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (grid[r][c]) { ctx.fillStyle = COLORS[grid[r][c] - 1]; ctx.fillRect(c * S + 1, r * S + 1, S - 2, S - 2); }
      }
      piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v) { ctx.fillStyle = COLORS[piece.color - 1]; ctx.fillRect((piece.x + c) * S + 1, (piece.y + r) * S + 1, S - 2, S - 2); }
      }));
    }, 40);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); };
  }, [tick, doAction, onScore]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={200} height={400} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">GAME OVER</div>
            <button onClick={() => { setOver(false); setScore(0); setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <PadBtn icon="ChevronLeft" onClick={() => doAction('left')} />
        <PadBtn icon="RotateCw" onClick={() => doAction('rotate')} />
        <PadBtn icon="ChevronDown" onClick={() => doAction('down')} />
        <PadBtn icon="ChevronRight" onClick={() => doAction('right')} />
      </div>
    </div>
  );
}

/* ---------------- shared controls ---------------- */
function PadBtn({ icon, onClick }: { icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-12 h-12 rounded-lg border border-primary/40 bg-card text-primary active:bg-primary/20 hover:bg-primary/10 transition-colors touch-none"
    >
      <Icon name={icon} size={22} fallback="Circle" />
    </button>
  );
}

function DPad({ onDir }: { onDir: (x: number, y: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 w-40">
      <div />
      <PadBtn icon="ChevronUp" onClick={() => onDir(0, -1)} />
      <div />
      <PadBtn icon="ChevronLeft" onClick={() => onDir(-1, 0)} />
      <div />
      <PadBtn icon="ChevronRight" onClick={() => onDir(1, 0)} />
      <div />
      <PadBtn icon="ChevronDown" onClick={() => onDir(0, 1)} />
      <div />
    </div>
  );
}

/* ---------------- MODAL ---------------- */
export default function GamePlayer({ gameId, title, onClose }: Props) {
  const [best, setBest] = useState(0);
  const onScore = useCallback((n: number) => setBest((b) => Math.max(b, n)), []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onEsc); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 grid-bg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-sm text-primary text-glow-pink">{title}</h3>
            {best > 0 && <span className="text-xs text-muted-foreground">Best: {best}</span>}
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>
        {gameId === 'snake' && <Snake onScore={onScore} />}
        {gameId === 'tetris' && <Tetris onScore={onScore} />}
        {gameId === 'pong' && <Pong onScore={onScore} />}
        {gameId === 'breakout' && <Breakout onScore={onScore} />}
        <p className="text-center text-[11px] text-muted-foreground mt-5">Use arrow keys on desktop or the buttons on mobile</p>
      </div>
    </div>
  );
}
