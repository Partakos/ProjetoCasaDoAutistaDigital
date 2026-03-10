import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle, Smile, Palette, Brain, Wind, RotateCcw, CheckCircle2 } from "lucide-react";

// Simple color matching game
const COLORS = [
  { name: "Vermelho", hsl: "0 70% 60%", emoji: "🔴" },
  { name: "Azul", hsl: "220 70% 60%", emoji: "🔵" },
  { name: "Verde", hsl: "120 50% 50%", emoji: "🟢" },
  { name: "Amarelo", hsl: "50 90% 60%", emoji: "🟡" },
];

const EMOTIONS = [
  { name: "Feliz", emoji: "😊" },
  { name: "Triste", emoji: "😢" },
  { name: "Bravo", emoji: "😠" },
  { name: "Surpreso", emoji: "😲" },
  { name: "Com medo", emoji: "😨" },
  { name: "Calmo", emoji: "😌" },
];

type GameType = "colors" | "emotions" | "memory" | "breathing" | null;

const Crianca = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container py-8">
        {!activeGame ? (
          <>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pastel-blue/50">
                <Puzzle className="h-8 w-8 text-accent-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Vamos Brincar! 🎮</h1>
              <p className="mt-2 text-muted-foreground">Escolha uma atividade para começar</p>
            </div>

            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
              <GameCard title="🎨 Cores" description="Aprenda e combine as cores!" icon={Palette} color="bg-pastel-yellow/50" onClick={() => setActiveGame("colors")} />
              <GameCard title="😊 Emoções" description="Identifique as emoções!" icon={Smile} color="bg-pastel-pink/50" onClick={() => setActiveGame("emotions")} />
              <GameCard title="🧠 Memória" description="Encontre os pares!" icon={Brain} color="bg-pastel-lilac/50" onClick={() => setActiveGame("memory")} />
              <GameCard title="🌬 Respiração" description="Vamos nos acalmar juntos" icon={Wind} color="bg-pastel-mint/50" onClick={() => setActiveGame("breathing")} />
            </div>
          </>
        ) : (
          <div>
            <Button variant="ghost" onClick={() => setActiveGame(null)} className="mb-4">
              ← Voltar
            </Button>
            {activeGame === "colors" && <ColorGame />}
            {activeGame === "emotions" && <EmotionGame />}
            {activeGame === "memory" && <MemoryGame />}
            {activeGame === "breathing" && <BreathingExercise />}
          </div>
        )}
      </div>
    </div>
  );
};

function GameCard({ title, description, icon: Icon, color, onClick }: { title: string; description: string; icon: any; color: string; onClick: () => void }) {
  return (
    <Card className="cursor-pointer transition-transform hover:scale-105" onClick={onClick}>
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${color}`}>
          <Icon className="h-10 w-10 text-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ColorGame() {
  const [target, setTarget] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const handlePick = (color: typeof COLORS[0]) => {
    if (color.name === target.name) {
      setFeedback("🎉 Muito bem!");
      setScore((s) => s + 1);
      setTimeout(() => {
        setFeedback(null);
        setTarget(COLORS[Math.floor(Math.random() * COLORS.length)]);
      }, 1200);
    } else {
      setFeedback("Tente de novo! 💪");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader><CardTitle className="text-center">🎨 Encontre a Cor: {target.name}</CardTitle></CardHeader>
      <CardContent>
        <p className="mb-2 text-center text-sm text-muted-foreground">Pontos: {score}</p>
        <div className="grid grid-cols-2 gap-4">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => handlePick(c)}
              className="flex h-24 items-center justify-center rounded-xl text-4xl transition-transform hover:scale-105"
              style={{ backgroundColor: `hsl(${c.hsl})` }}
              aria-label={c.name}
            >
              {c.emoji}
            </button>
          ))}
        </div>
        {feedback && (
          <p className="mt-4 text-center text-lg font-bold text-foreground">{feedback}</p>
        )}
      </CardContent>
    </Card>
  );
}

function EmotionGame() {
  const [target, setTarget] = useState(() => EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const handlePick = (emotion: typeof EMOTIONS[0]) => {
    if (emotion.name === target.name) {
      setFeedback("🎉 Correto!");
      setScore((s) => s + 1);
      setTimeout(() => {
        setFeedback(null);
        setTarget(EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]);
      }, 1200);
    } else {
      setFeedback("Tente de novo! 💪");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader><CardTitle className="text-center">😊 Qual é a emoção: {target.name}?</CardTitle></CardHeader>
      <CardContent>
        <p className="mb-2 text-center text-sm text-muted-foreground">Pontos: {score}</p>
        <div className="grid grid-cols-3 gap-4">
          {EMOTIONS.map((e) => (
            <button
              key={e.name}
              onClick={() => handlePick(e)}
              className="flex h-20 flex-col items-center justify-center rounded-xl border-2 border-border bg-card transition-transform hover:scale-105 hover:border-primary"
              aria-label={e.name}
            >
              <span className="text-3xl">{e.emoji}</span>
            </button>
          ))}
        </div>
        {feedback && (
          <p className="mt-4 text-center text-lg font-bold text-foreground">{feedback}</p>
        )}
      </CardContent>
    </Card>
  );
}

function MemoryGame() {
  const emojis = ["🐶", "🐱", "🐸", "🦋", "🌈", "⭐"];
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setSelected([]);
    setMoves(0);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleFlip = (id: number) => {
    if (selected.length >= 2) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;
      if (newCards[a].emoji === newCards[b].emoji) {
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards([...newCards]);
        setSelected([]);
      } else {
        setTimeout(() => {
          newCards[a].flipped = false;
          newCards[b].flipped = false;
          setCards([...newCards]);
          setSelected([]);
        }, 800);
      }
    }
  };

  const allMatched = cards.length > 0 && cards.every((c) => c.matched);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🧠 Jogo da Memória</span>
          <Button variant="ghost" size="sm" onClick={initGame}><RotateCcw className="mr-1 h-4 w-4" /> Reiniciar</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-center text-sm text-muted-foreground">Jogadas: {moves}</p>
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`flex h-16 items-center justify-center rounded-xl text-2xl transition-all ${
                card.flipped || card.matched
                  ? "bg-pastel-yellow/50 scale-105"
                  : "bg-muted hover:bg-muted/80"
              } ${card.matched ? "opacity-60" : ""}`}
            >
              {card.flipped || card.matched ? card.emoji : "❓"}
            </button>
          ))}
        </div>
        {allMatched && (
          <div className="mt-4 flex items-center justify-center gap-2 text-lg font-bold text-foreground">
            <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
            Parabéns! 🎉 ({moves} jogadas)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BreathingExercise() {
  const [phase, setPhase] = useState<"idle" | "in" | "hold" | "out">("idle");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) { setPhase("idle"); return; }
    let timeout: number;
    const cycle = () => {
      setPhase("in");
      timeout = window.setTimeout(() => {
        setPhase("hold");
        timeout = window.setTimeout(() => {
          setPhase("out");
          timeout = window.setTimeout(cycle, 4000);
        }, 4000);
      }, 4000);
    };
    cycle();
    return () => clearTimeout(timeout);
  }, [running]);

  const label = phase === "in" ? "Inspire... 🌬" : phase === "hold" ? "Segure... ✨" : phase === "out" ? "Expire... 🍃" : "Pronto para começar?";
  const scale = phase === "in" ? "scale-125" : phase === "hold" ? "scale-125" : phase === "out" ? "scale-100" : "scale-100";

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader><CardTitle className="text-center">🌬 Respiração Guiada</CardTitle></CardHeader>
      <CardContent className="flex flex-col items-center py-8">
        <div className={`mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-pastel-mint/50 transition-transform duration-[4000ms] ease-in-out ${scale}`}>
          <span className="text-5xl">🫧</span>
        </div>
        <p className="mb-6 text-xl font-bold text-foreground">{label}</p>
        <Button size="lg" onClick={() => setRunning(!running)}>
          {running ? "Parar" : "Começar"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default Crianca;
