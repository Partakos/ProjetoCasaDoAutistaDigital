import { Link } from "react-router-dom";
import { Heart, Users, Building2, GraduationCap, Puzzle, Smile, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const areas = [
  {
    title: "Área da Criança",
    description: "Jogos educativos, comunicação alternativa e atividades interativas em um ambiente seguro e acolhedor.",
    icon: Puzzle,
    color: "bg-pastel-blue",
    textColor: "text-accent-foreground",
    href: "/crianca",
  },
  {
    title: "Área do Responsável",
    description: "Acompanhe o progresso, relatórios de evolução e acesse conteúdos educativos sobre TEA.",
    icon: Heart,
    color: "bg-pastel-pink",
    textColor: "text-foreground",
    href: "/responsavel",
  },
  {
    title: "Área Institucional",
    description: "Conheça nossos serviços, agende atendimentos e participe de eventos e oficinas.",
    icon: Building2,
    color: "bg-pastel-mint",
    textColor: "text-secondary-foreground",
    href: "/institucional",
  },
  {
    title: "Área Profissional",
    description: "Ferramentas para professores e terapeutas: planos de atividades, registros e comunicação.",
    icon: GraduationCap,
    color: "bg-pastel-lilac",
    textColor: "text-primary-foreground",
    href: "/profissional",
  },
];

const Index = () => {
  const { speak, stopSpeaking, settings } = useAccessibility();

  const handleTtsInteraction = (text: string) => {
    if (settings.ttsEnabled) speak(text);
  };

  const handleTtsLeave = () => {
    if (settings.ttsEnabled) stopSpeaking();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main id="main-content" role="main">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-pastel-blue/30 blur-3xl" />
          <div className="absolute right-1/4 top-32 h-56 w-56 rounded-full bg-pastel-lilac/30 blur-3xl" />
          <div className="absolute bottom-10 left-1/2 h-64 w-64 rounded-full bg-pastel-mint/30 blur-3xl" />
        </div>

        <div className="container text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 animate-float">
            <Smile className="h-12 w-12 text-primary" />
          </div>
          <h1
            className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
            onClick={() => handleTtsInteraction("Um espaço seguro para crescer e aprender")}
            onMouseLeave={handleTtsLeave}
          >
            Um espaço seguro para{" "}
            <span className="text-primary">crescer</span> e{" "}
            <span className="text-secondary-foreground">aprender</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            onClick={() => handleTtsInteraction("Plataforma digital inclusiva de apoio a crianças autistas, famílias e profissionais. Atividades interativas, acompanhamento e comunicação em um ambiente acolhedor.")}
            onMouseLeave={handleTtsLeave}
          >
            Plataforma digital inclusiva de apoio a crianças autistas, famílias e profissionais.
            Atividades interativas, acompanhamento e comunicação em um ambiente acolhedor.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/crianca">
              <Button size="lg" className="rounded-full px-8 text-base font-semibold">
                <Puzzle className="mr-2 h-5 w-5" />
                Área da Criança
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-base font-semibold">
                Acessar Plataforma
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Areas Cards */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
            Nossas Áreas
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <Link key={area.title} to={area.href}>
                <Card className="group h-full cursor-pointer border-2 border-transparent transition-all hover:border-primary/20 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${area.color} transition-transform group-hover:scale-110`}>
                      <area.icon className={`h-8 w-8 ${area.textColor}`} />
                    </div>
                    <h3
                      className="mb-2 font-display text-lg font-bold text-foreground"
                      onClick={() => handleTtsInteraction(area.title + ". " + area.description)}
                      onMouseLeave={handleTtsLeave}
                    >{area.title}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-16" aria-label="Recursos de acessibilidade">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
            Acessibilidade em Primeiro Lugar
          </h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pastel-yellow">
                <Eye className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="mb-2 font-display font-bold text-foreground">Modo Sensorial</h3>
              <p className="text-sm text-muted-foreground">Alto contraste, sem animações e controle de sons para conforto sensorial.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pastel-orange">
                <Users className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="mb-2 font-display font-bold text-foreground">Design Previsível</h3>
              <p className="text-sm text-muted-foreground">Botões consistentes, feedback imediato e sem mudanças bruscas.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pastel-mint">
                <Heart className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="mb-2 font-display font-bold text-foreground">Interface Acolhedora</h3>
              <p className="text-sm text-muted-foreground">Cores suaves, tipografia clara e layout responsivo para todos os dispositivos.</p>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8" role="contentinfo">
        <div className="container text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Smile className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-display font-bold text-foreground">Casa dos Autistas</span>
          </div>
          <div className="mb-3">
            <Link to="/acessibilidade" className="text-sm text-primary underline hover:text-primary/80">
              Acessibilidade
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Casa dos Autistas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
