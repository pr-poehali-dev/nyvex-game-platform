import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';

type Game = {
  id: string;
  title: string;
  emoji: string;
  category: string;
  year: number;
  desc: string;
  plays: number;
};

const CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Shooter', 'Beat em up', 'Fighting', 'Platformer'];

const GAMES: Game[] = [
  { id: 'snake', title: 'Snake', emoji: '🐍', category: 'Arcade', year: 1976, desc: 'Guide the growing snake, eat, and never bite your tail.', plays: 48210 },
  { id: 'tetris', title: 'Tetris', emoji: '🟦', category: 'Puzzle', year: 1984, desc: 'Stack falling blocks and clear the lines. The eternal classic.', plays: 91340 },
  { id: 'pacman', title: 'Pac-Man', emoji: '🟡', category: 'Arcade', year: 1980, desc: 'Munch every dot while dodging four hungry ghosts.', plays: 87652 },
  { id: 'mspacman', title: 'Ms. Pac-Man', emoji: '🎀', category: 'Arcade', year: 1982, desc: 'The faster, smarter sequel with new mazes.', plays: 41220 },
  { id: 'spaceinvaders', title: 'Space Invaders', emoji: '👾', category: 'Shooter', year: 1978, desc: 'Blast waves of descending aliens before they land.', plays: 76410 },
  { id: 'galaga', title: 'Galaga', emoji: '🚀', category: 'Shooter', year: 1981, desc: 'Legendary space shooter with capturing bosses.', plays: 63180 },
  { id: 'pong', title: 'Pong', emoji: '🏓', category: 'Arcade', year: 1972, desc: 'The one that started it all. Table tennis, digital.', plays: 33290 },
  { id: 'breakout', title: 'Breakout', emoji: '🧱', category: 'Arcade', year: 1976, desc: 'Bounce, smash bricks and clear the wall.', plays: 29870 },
  { id: 'arkanoid', title: 'Arkanoid', emoji: '🔲', category: 'Arcade', year: 1986, desc: 'Breakout evolved with power-ups and bosses.', plays: 38940 },
  { id: 'donkeykong', title: 'Donkey Kong', emoji: '🦍', category: 'Platformer', year: 1981, desc: 'Climb, jump barrels and rescue the girl.', plays: 55120 },
  { id: 'frogger', title: 'Frogger', emoji: '🐸', category: 'Arcade', year: 1981, desc: 'Hop across traffic and rivers to safety.', plays: 44730 },
  { id: 'digdug', title: 'Dig Dug', emoji: '⛏️', category: 'Arcade', year: 1982, desc: 'Dig tunnels and inflate your enemies underground.', plays: 27650 },
  { id: 'bomberman', title: 'Bomberman', emoji: '💣', category: 'Arcade', year: 1983, desc: 'Plant bombs, blast walls, trap your rivals.', plays: 51980 },
  { id: 'qbert', title: 'Q*bert', emoji: '🟠', category: 'Puzzle', year: 1982, desc: 'Hop across pyramid cubes to change their color.', plays: 22340 },
  { id: 'bubblebobble', title: 'Bubble Bobble', emoji: '🫧', category: 'Platformer', year: 1986, desc: 'Trap foes in bubbles as the bubble dragons.', plays: 47810 },
  { id: 'contra', title: 'Contra', emoji: '🔫', category: 'Shooter', year: 1987, desc: 'Run and gun through relentless alien armies.', plays: 68930 },
  { id: 'metalslug', title: 'Metal Slug', emoji: '🎖️', category: 'Shooter', year: 1996, desc: 'Frantic run-and-gun with iconic pixel art.', plays: 72410 },
  { id: '1942', title: '1942', emoji: '✈️', category: 'Shooter', year: 1984, desc: 'Pilot your plane through WWII dogfights.', plays: 31220 },
  { id: 'rtype', title: 'R-Type', emoji: '🛸', category: 'Shooter', year: 1987, desc: 'Sci-fi horizontal shooter with the Force pod.', plays: 34560 },
  { id: 'gradius', title: 'Gradius', emoji: '🌌', category: 'Shooter', year: 1985, desc: 'Power up the Vic Viper and save the galaxy.', plays: 36780 },
  { id: 'asteroids', title: 'Asteroids', emoji: '☄️', category: 'Shooter', year: 1979, desc: 'Blast drifting space rocks in zero gravity.', plays: 40120 },
  { id: 'centipede', title: 'Centipede', emoji: '🐛', category: 'Shooter', year: 1981, desc: 'Shoot the descending centipede through mushrooms.', plays: 25890 },
  { id: 'streetfighter2', title: 'Street Fighter II', emoji: '🥋', category: 'Fighting', year: 1991, desc: 'The fighting game that defined a genre.', plays: 84670 },
  { id: 'mortalkombat', title: 'Mortal Kombat', emoji: '🐉', category: 'Fighting', year: 1992, desc: 'Brutal one-on-one combat with fatalities.', plays: 79230 },
  { id: 'kof', title: 'King of Fighters', emoji: '👊', category: 'Fighting', year: 1994, desc: 'Team-based fighting crossover series.', plays: 46120 },
  { id: 'goldenaxe', title: 'Golden Axe', emoji: '🪓', category: 'Beat em up', year: 1989, desc: 'Hack-and-slash fantasy beat em up.', plays: 43980 },
  { id: 'doubledragon', title: 'Double Dragon', emoji: '🐲', category: 'Beat em up', year: 1987, desc: 'Co-op street brawling to rescue Marian.', plays: 52310 },
  { id: 'finalfight', title: 'Final Fight', emoji: '🥊', category: 'Beat em up', year: 1989, desc: 'Clean up Metro City street by street.', plays: 48260 },
  { id: 'tmnt', title: 'TMNT Arcade', emoji: '🐢', category: 'Beat em up', year: 1989, desc: 'Four turtles vs the Foot Clan, arcade style.', plays: 61470 },
  { id: 'shinobi', title: 'Shinobi', emoji: '🥷', category: 'Platformer', year: 1987, desc: 'Ninja action across deadly stages.', plays: 29940 },
  { id: 'alteredbeast', title: 'Altered Beast', emoji: '🐺', category: 'Beat em up', year: 1988, desc: 'Rise from your grave and shapeshift to fight.', plays: 26710 },
  { id: 'outrun', title: 'Out Run', emoji: '🏎️', category: 'Arcade', year: 1986, desc: 'Cruise coastal highways in a red convertible.', plays: 38550 },
];

const STATS = [
  { label: 'Total visitors', value: '1 284 903', icon: 'Users', color: 'text-glow-pink' },
  { label: 'Online now', value: '3 472', icon: 'Wifi', color: 'text-glow-cyan' },
  { label: 'Game launches', value: '9 641 250', icon: 'Play', color: 'text-glow-pink' },
  { label: 'Hours played', value: '412 880', icon: 'Clock', color: 'text-glow-cyan' },
];

const Index = () => {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      const matchCat = category === 'All' || g.category === category;
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const popular = useMemo(() => [...GAMES].sort((a, b) => b.plays - a.plays).slice(0, 3), []);

  return (
    <div className="min-h-screen flex flex-col grid-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕹️</span>
            <span className="font-display text-xl text-primary text-glow-pink tracking-tight">Nyvex</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <a href="#games" className="hover:text-secondary transition-colors">Games</a>
            <a href="#stats" className="hover:text-secondary transition-colors">Statistics</a>
            <a href="#platforms" className="hover:text-secondary transition-colors">Platforms</a>
          </nav>
          <button className="flex items-center gap-2 rounded-md border border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
            <Icon name="Lock" size={15} />
            Admin
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-20 animate-scanline bg-gradient-to-b from-transparent via-secondary/40 to-transparent h-1/3" />
        <div className="container relative text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 px-4 py-1.5 text-xs font-semibold text-secondary box-glow-cyan mb-8 animate-fade-in">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-glow-pulse" />
            {GAMES.length}+ classic games · playable in browser
          </div>
          <h1 className="font-display text-3xl md:text-5xl leading-[1.4] mb-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <span className="text-primary text-glow-pink">PLAY THE</span>
            <br />
            <span className="text-secondary text-glow-cyan">ARCADE LEGENDS</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Snake, Tetris, Pac-Man, Street Fighter and hundreds more — one portal, every device. Windows, Linux, macOS, Android & iOS.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <a href="#games" className="rounded-lg bg-primary px-8 py-4 font-display text-xs text-primary-foreground box-glow-pink hover:scale-105 transition-transform">
              START PLAYING
            </a>
            <a href="#stats" className="rounded-lg border border-border px-8 py-4 font-semibold text-foreground hover:border-secondary transition-colors">
              View statistics
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card/60 backdrop-blur p-6 hover:border-primary/50 transition-colors">
              <Icon name={s.icon} size={22} className="text-secondary mb-3" />
              <div className={`font-display text-lg ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="container py-10">
        <h2 className="font-display text-sm text-accent mb-6 flex items-center gap-2">
          <Icon name="Flame" size={18} /> MOST POPULAR
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {popular.map((g, i) => (
            <div key={g.id} className="relative flex items-center gap-4 rounded-xl border border-accent/30 bg-card/60 p-5 overflow-hidden">
              <span className="font-display text-3xl text-accent/30 absolute right-4 top-2">#{i + 1}</span>
              <span className="text-4xl animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{g.emoji}</span>
              <div>
                <div className="font-bold text-lg">{g.title}</div>
                <div className="text-xs text-muted-foreground">{g.plays.toLocaleString('en-US')} launches</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Games catalog */}
      <section id="games" className="container py-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="font-display text-lg text-secondary text-glow-cyan">CLASSIC GAMES</h2>
          <div className="relative w-full md:w-72">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              className="w-full rounded-lg border border-border bg-card/60 pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                category === c
                  ? 'bg-primary text-primary-foreground box-glow-pink'
                  : 'border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((g) => (
            <div
              key={g.id}
              className="group relative rounded-xl border border-border bg-card/60 backdrop-blur p-5 flex flex-col hover:border-primary/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl group-hover:scale-110 transition-transform">{g.emoji}</span>
                <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">{g.year}</span>
              </div>
              <h3 className="font-bold text-base mb-1">{g.title}</h3>
              <span className="text-[11px] uppercase tracking-wide text-secondary mb-2">{g.category}</span>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{g.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Icon name="Play" size={11} /> {g.plays.toLocaleString('en-US')}
                </span>
                <button className="flex items-center gap-1 rounded-md bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Play" size={12} /> Play
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-5xl mb-4">👾</div>
            No games found. Try another search.
          </div>
        )}
      </section>

      {/* Platforms */}
      <section id="platforms" className="container py-12">
        <div className="rounded-2xl border border-border bg-card/40 p-8 text-center">
          <h2 className="font-display text-sm text-primary mb-6">PLAYS EVERYWHERE</h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            {[
              { icon: 'Monitor', label: 'Windows' },
              { icon: 'Terminal', label: 'Linux' },
              { icon: 'Apple', label: 'macOS' },
              { icon: 'Smartphone', label: 'Android' },
              { icon: 'Tablet', label: 'iOS' },
            ].map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2">
                <Icon name={p.icon} size={28} className="text-secondary" fallback="Monitor" />
                <span className="text-xs font-medium">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕹️</span>
            <span className="font-display text-sm text-primary text-glow-pink">Nyvex</span>
          </div>
          <p className="font-display text-[10px] text-muted-foreground">Created by Nyvex</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
