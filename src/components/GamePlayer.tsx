import { useEffect, useRef, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

export const ENGINE_MAP: Record<string, string> = {
  snake: 'snake',
  tetris: 'tetris',
  pong: 'pong',
  breakout: 'breakout',
  arkanoid: 'breakout',
  spaceinvaders: 'shooter',
  galaga: 'shooter',
  contra: 'shooter',
  metalslug: 'shooter',
  '1942': 'shooter',
  rtype: 'shooter',
  gradius: 'shooter',
  asteroids: 'shooter',
  centipede: 'shooter',
  pacman: 'maze',
  mspacman: 'maze',
  digdug: 'maze',
  bomberman: 'maze',
  donkeykong: 'platformer',
  qbert: 'platformer',
  bubblebobble: 'platformer',
  goldenaxe: 'platformer',
  doubledragon: 'platformer',
  finalfight: 'platformer',
  tmnt: 'platformer',
  shinobi: 'platformer',
  alteredbeast: 'platformer',
  streetfighter2: 'fighting',
  mortalkombat: 'fighting',
  kof: 'fighting',
  frogger: 'racing',
  outrun: 'racing',
};

export const PLAYABLE = Object.keys(ENGINE_MAP);

type Props = {
  gameId: string;
  title: string;
  emoji: string;
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

/* ---------------- SHOOTER (Space Invaders / Galaga / Contra / etc.) ---------------- */
function Shooter({ emoji, onScore }: { emoji: string; onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shipXRef = useRef(190);
  const shootRef = useRef(false);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState(0);

  const move = useCallback((dir: number) => { shipXRef.current = Math.max(10, Math.min(370, shipXRef.current + dir * 24)); }, []);
  const shoot = useCallback(() => { shootRef.current = true; }, []);

  useEffect(() => {
    const W = 400, H = 460;
    let bullets: { x: number; y: number }[] = [];
    let enemyBullets: { x: number; y: number }[] = [];
    let enemies: { x: number; y: number; alive: boolean }[] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) enemies.push({ x: 30 + c * 48, y: 30 + r * 40, alive: true });
    let dir = 1;
    let localScore = 0;
    let dead = false;
    let frame = 0;

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === ' ') shoot();
    };
    window.addEventListener('keydown', onKey);

    const loop = setInterval(() => {
      if (dead) return;
      frame++;
      if (shootRef.current) { bullets.push({ x: shipXRef.current, y: H - 40 }); shootRef.current = false; }
      bullets = bullets.filter((b) => b.y > 0);
      bullets.forEach((b) => (b.y -= 8));

      const alive = enemies.filter((e) => e.alive);
      if (alive.some((e) => e.x <= 10 || e.x >= 370)) dir *= -1;
      enemies.forEach((e) => { if (e.alive) { e.x += dir * 0.6; e.y += frame % 90 === 0 ? 10 : 0; } });

      if (frame % 45 === 0 && alive.length) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        enemyBullets.push({ x: shooter.x, y: shooter.y });
      }
      enemyBullets = enemyBullets.filter((b) => b.y < H);
      enemyBullets.forEach((b) => (b.y += 5));

      bullets.forEach((b) => {
        enemies.forEach((e) => {
          if (e.alive && Math.abs(b.x - e.x) < 16 && Math.abs(b.y - e.y) < 16) {
            e.alive = false; b.y = -100; localScore += 20; setScore(localScore);
          }
        });
      });

      if (enemyBullets.some((b) => Math.abs(b.x - shipXRef.current) < 14 && b.y > H - 30) || alive.some((e) => e.y > H - 40)) {
        dead = true; setOver(true); onScore(localScore); return;
      }
      if (enemies.every((e) => !e.alive)) {
        enemies = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) enemies.push({ x: 30 + c * 48, y: 30 + r * 40, alive: true });
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.font = '22px monospace';
      enemies.forEach((e) => { if (e.alive) ctx.fillText(emoji, e.x - 11, e.y + 8); });
      ctx.fillStyle = '#22e6ff'; bullets.forEach((b) => ctx.fillRect(b.x - 2, b.y, 4, 10));
      ctx.fillStyle = '#ff2fb3'; enemyBullets.forEach((b) => ctx.fillRect(b.x - 2, b.y, 4, 10));
      ctx.font = '26px monospace'; ctx.fillText('🚀', shipXRef.current - 13, H - 15);
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); };
  }, [tick, move, shoot, onScore, emoji]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={460} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">GAME OVER</div>
            <button onClick={() => { setOver(false); setScore(0); shipXRef.current = 190; setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <PadBtn icon="ChevronLeft" onClick={() => move(-1)} />
        <PadBtn icon="Zap" onClick={shoot} />
        <PadBtn icon="ChevronRight" onClick={() => move(1)} />
      </div>
    </div>
  );
}

/* ---------------- MAZE (Pac-Man / Dig Dug / Bomberman / etc.) ---------------- */
function Maze({ emoji, onScore }: { emoji: string; onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tick, setTick] = useState(0);

  const setDir = useCallback((x: number, y: number) => { dirRef.current = { x, y }; }, []);

  useEffect(() => {
    const cells = 15, size = 26;
    const player = { x: 1, y: 1 };
    let dots: { x: number; y: number }[] = [];
    for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) if ((x + y) % 2 === 0) dots.push({ x, y });
    const ghosts = [{ x: 13, y: 13 }, { x: 13, y: 1 }, { x: 1, y: 13 }];
    let localScore = 0;
    let dead = false;

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
      const nx = player.x + dirRef.current.x, ny = player.y + dirRef.current.y;
      if (nx >= 0 && nx < cells && ny >= 0 && ny < cells) { player.x = nx; player.y = ny; }

      dots = dots.filter((d) => {
        if (d.x === player.x && d.y === player.y) { localScore += 10; setScore(localScore); return false; }
        return true;
      });

      ghosts.forEach((g) => {
        if (g.x < player.x) g.x += 0.12; else if (g.x > player.x) g.x -= 0.12;
        if (g.y < player.y) g.y += 0.12; else if (g.y > player.y) g.y -= 0.12;
        if (Math.abs(g.x - player.x) < 0.6 && Math.abs(g.y - player.y) < 0.6) { dead = true; setOver(true); onScore(localScore); }
      });

      if (dots.length === 0) { dead = true; setWon(true); onScore(localScore); }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, cells * size, cells * size);
      ctx.fillStyle = '#ffd23f';
      dots.forEach((d) => { ctx.beginPath(); ctx.arc(d.x * size + size / 2, d.y * size + size / 2, 3, 0, Math.PI * 2); ctx.fill(); });
      ctx.font = `${size - 4}px monospace`;
      ctx.fillText(emoji, player.x * size + 2, player.y * size + size - 4);
      ghosts.forEach((g) => ctx.fillText('👻', g.x * size + 2, g.y * size + size - 4));
    }, 110);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); };
  }, [tick, setDir, onScore, emoji]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={390} height={390} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {(over || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">{won ? 'YOU WIN!' : 'GAME OVER'}</div>
            <button onClick={() => { setOver(false); setWon(false); setScore(0); setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <DPad onDir={setDir} />
    </div>
  );
}

/* ---------------- PLATFORMER (Donkey Kong / Q*bert / TMNT / etc.) ---------------- */
function Platformer({ emoji, onScore }: { emoji: string; onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 40, y: 300 });
  const onGroundRef = useRef(true);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState(0);

  const move = useCallback((dir: number) => { velRef.current.x = dir * 3; }, []);
  const jump = useCallback(() => { if (onGroundRef.current) { velRef.current.y = -11; onGroundRef.current = false; } }, []);

  useEffect(() => {
    const W = 400, H = 400, GROUND = 340;
    let localScore = 0;
    let dead = false;
    let coins = Array.from({ length: 6 }, (_, i) => ({ x: 60 + i * 55, y: 260 - (i % 3) * 60, taken: false }));
    let barrels = [{ x: 400, y: GROUND - 20 }];
    let frame = 0;

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowUp' || e.key === ' ') jump();
    };
    const onKeyUp = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') velRef.current.x = 0; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);

    const loop = setInterval(() => {
      if (dead) return;
      frame++;
      velRef.current.y += 0.6;
      posRef.current.x = Math.max(10, Math.min(W - 30, posRef.current.x + velRef.current.x));
      posRef.current.y += velRef.current.y;
      if (posRef.current.y >= GROUND) { posRef.current.y = GROUND; velRef.current.y = 0; onGroundRef.current = true; }

      if (frame % 70 === 0) barrels.push({ x: W, y: GROUND - 20 });
      barrels = barrels.filter((b) => b.x > -20);
      barrels.forEach((b) => (b.x -= 3));

      coins.forEach((c) => {
        if (!c.taken && Math.abs(c.x - posRef.current.x) < 20 && Math.abs(c.y - posRef.current.y) < 20) {
          c.taken = true; localScore += 15; setScore(localScore);
        }
      });
      if (coins.every((c) => c.taken)) coins = Array.from({ length: 6 }, (_, i) => ({ x: 60 + i * 55, y: 260 - (i % 3) * 60, taken: false }));

      if (barrels.some((b) => Math.abs(b.x - posRef.current.x) < 16 && Math.abs(b.y - posRef.current.y) < 18)) {
        dead = true; setOver(true); onScore(localScore); return;
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#8b5cff'; ctx.fillRect(0, GROUND + 20, W, 6);
      ctx.font = '20px monospace';
      coins.forEach((c) => { if (!c.taken) ctx.fillText('🟡', c.x - 10, c.y + 8); });
      ctx.font = '22px monospace'; barrels.forEach((b) => ctx.fillText('🛢️', b.x - 11, b.y + 10));
      ctx.font = '26px monospace'; ctx.fillText(emoji, posRef.current.x - 13, posRef.current.y + 13);
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKeyUp); };
  }, [tick, move, jump, onScore, emoji]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">GAME OVER</div>
            <button onClick={() => { setOver(false); setScore(0); posRef.current = { x: 40, y: 300 }; setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <PadBtn icon="ChevronLeft" onClick={() => move(-1)} />
        <PadBtn icon="ArrowUp" onClick={jump} />
        <PadBtn icon="ChevronRight" onClick={() => move(1)} />
      </div>
    </div>
  );
}

/* ---------------- FIGHTING (Street Fighter II / Mortal Kombat / KOF) ---------------- */
function Fighting({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [p1, setP1] = useState(100);
  const [p2, setP2] = useState(100);
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState(0);
  const posRef = useRef(80);
  const attackRef = useRef(false);

  const move = useCallback((dir: number) => { posRef.current = Math.max(20, Math.min(200, posRef.current + dir * 10)); }, []);
  const attack = useCallback(() => { attackRef.current = true; }, []);

  useEffect(() => {
    const W = 400, H = 300;
    let enemyX = 280;
    let hpP1 = 100, hpP2 = 100;
    let dead = false;
    let frame = 0;
    let flash = 0;

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === ' ') attack();
    };
    window.addEventListener('keydown', onKey);

    const loop = setInterval(() => {
      if (dead) return;
      frame++;
      if (enemyX > posRef.current + 40) enemyX -= 1.2; else if (enemyX < posRef.current + 20) enemyX += 0.4;

      if (attackRef.current) {
        attackRef.current = false;
        if (Math.abs(enemyX - posRef.current) < 55) { hpP2 = Math.max(0, hpP2 - 12); setP2(hpP2); flash = 6; }
      }
      if (frame % 55 === 0 && Math.abs(enemyX - posRef.current) < 60) { hpP1 = Math.max(0, hpP1 - 8); setP1(hpP1); }

      if (hpP1 <= 0 || hpP2 <= 0) { dead = true; setOver(true); onScore(hpP2 <= 0 ? 100 : 0); return; }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#8b5cff'; ctx.fillRect(0, H - 30, W, 30);
      ctx.font = '40px monospace';
      ctx.fillText('🥋', posRef.current - 20, H - 40);
      ctx.fillStyle = flash > 0 ? '#ff2fb3' : '#000'; if (flash > 0) flash--;
      ctx.font = '40px monospace'; ctx.fillText('🐉', enemyX - 20, H - 40);
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); };
  }, [tick, move, attack, onScore]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[400px] justify-between gap-4 px-1">
        <div className="flex-1"><div className="text-[10px] text-secondary mb-1">YOU</div><div className="h-3 rounded bg-muted overflow-hidden"><div className="h-full bg-secondary transition-all" style={{ width: `${p1}%` }} /></div></div>
        <div className="flex-1"><div className="text-[10px] text-primary mb-1 text-right">RIVAL</div><div className="h-3 rounded bg-muted overflow-hidden"><div className="h-full bg-primary ml-auto transition-all" style={{ width: `${p2}%` }} /></div></div>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={300} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">{p2 <= 0 ? 'YOU WIN!' : 'YOU LOSE'}</div>
            <button onClick={() => { setOver(false); setP1(100); setP2(100); posRef.current = 80; setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <PadBtn icon="ChevronLeft" onClick={() => move(-1)} />
        <PadBtn icon="Swords" onClick={attack} />
        <PadBtn icon="ChevronRight" onClick={() => move(1)} />
      </div>
    </div>
  );
}

/* ---------------- RACING / LANES (Frogger / Out Run) ---------------- */
function Racing({ emoji, onScore }: { emoji: string; onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: 190, y: 370 });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [tick, setTick] = useState(0);

  const setDir = useCallback((x: number, y: number) => {
    posRef.current.x = Math.max(10, Math.min(370, posRef.current.x + x * 30));
    posRef.current.y = Math.max(10, Math.min(370, posRef.current.y + y * 30));
  }, []);

  useEffect(() => {
    const W = 400, H = 400;
    let localScore = 0;
    let dead = false;
    const cars = Array.from({ length: 6 }, (_, i) => ({ x: (i * 70) % W, y: 60 + i * 50, dir: i % 2 === 0 ? 1 : -1, speed: 1.5 + (i % 3) }));

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
      cars.forEach((c) => { c.x += c.dir * c.speed; if (c.x > W + 20) c.x = -20; if (c.x < -20) c.x = W + 20; });

      if (cars.some((c) => Math.abs(c.x - posRef.current.x) < 20 && Math.abs(c.y - posRef.current.y) < 16)) {
        dead = true; setOver(true); onScore(localScore); return;
      }
      if (posRef.current.y <= 15) {
        localScore += 50; setScore(localScore); posRef.current = { x: 190, y: 370 };
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0d0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1a1530'; for (let i = 0; i < H; i += 50) ctx.fillRect(0, i, W, 25);
      ctx.font = '20px monospace'; cars.forEach((c) => ctx.fillText('🚗', c.x - 10, c.y + 8));
      ctx.font = '24px monospace'; ctx.fillText(emoji, posRef.current.x - 12, posRef.current.y + 10);
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', onKey); };
  }, [tick, setDir, onScore, emoji]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-xs text-secondary">SCORE {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="rounded-lg border border-secondary/40 box-glow-cyan max-w-full" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 rounded-lg">
            <div className="font-display text-sm text-primary text-glow-pink">GAME OVER</div>
            <button onClick={() => { setOver(false); setScore(0); posRef.current = { x: 190, y: 370 }; setTick((t) => t + 1); }} className="rounded-lg bg-primary px-6 py-3 font-display text-[10px] text-primary-foreground box-glow-pink">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <DPad onDir={setDir} />
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
export default function GamePlayer({ gameId, title, emoji, onClose }: Props) {
  const [best, setBest] = useState(0);
  const onScore = useCallback((n: number) => setBest((b) => Math.max(b, n)), []);
  const engine = ENGINE_MAP[gameId] || 'snake';

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
        {engine === 'snake' && <Snake onScore={onScore} />}
        {engine === 'tetris' && <Tetris onScore={onScore} />}
        {engine === 'pong' && <Pong onScore={onScore} />}
        {engine === 'breakout' && <Breakout onScore={onScore} />}
        {engine === 'shooter' && <Shooter emoji={emoji} onScore={onScore} />}
        {engine === 'maze' && <Maze emoji={emoji} onScore={onScore} />}
        {engine === 'platformer' && <Platformer emoji={emoji} onScore={onScore} />}
        {engine === 'fighting' && <Fighting onScore={onScore} />}
        {engine === 'racing' && <Racing emoji={emoji} onScore={onScore} />}
        <p className="text-center text-[11px] text-muted-foreground mt-5">Use arrow keys on desktop or the buttons on mobile</p>
      </div>
    </div>
  );
}