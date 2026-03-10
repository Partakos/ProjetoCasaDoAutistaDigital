import { AppHeader } from "@/components/AppHeader";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Shield, Eye, Keyboard, Volume2, Mail, AudioLines, Zap, Type, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const recursos = [
  {
    icon: Eye,
    title: "Alto Contraste",
    description: "Modo de alto contraste com fundo branco, texto preto e bordas definidas para máxima legibilidade.",
  },
  {
    icon: Zap,
    title: "Sem Animações",
    description: "Desativa todas as animações e transições para conforto sensorial.",
  },
  {
    icon: AudioLines,
    title: "Leitura em Voz Alta",
    description: "Sistema de Text-to-Speech em português brasileiro para auxílio a pessoas com deficiência visual.",
  },
  {
    icon: Keyboard,
    title: "Navegação por Teclado",
    description: "Todo o site é navegável via teclado com indicadores de foco visíveis e link de pular navegação.",
  },
  {
    icon: Type,
    title: "Tipografia Acessível",
    description: "Fontes sans-serif legíveis (Nunito e Quicksand) com tamanho mínimo de 16px.",
  },
  {
    icon: Smartphone,
    title: "Alvos de Toque",
    description: "Botões e elementos interativos com tamanho mínimo de 44x44px em dispositivos touch.",
  },
];

const Acessibilidade = () => {
  const { speak, stopSpeaking, settings } = useAccessibility();

  const handleTtsHover = (text: string) => {
    if (settings.ttsEnabled) speak(text);
  };

  const handleTtsLeave = () => {
    if (settings.ttsEnabled) stopSpeaking();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main id="main-content" role="main" className="container py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold text-foreground"
                onMouseEnter={() => handleTtsHover("Declaração de Acessibilidade")}
                onMouseLeave={handleTtsLeave}
              >
                Declaração de Acessibilidade
              </h1>
              <p className="text-muted-foreground">Casa do Autista — Plataforma Digital Inclusiva</p>
            </div>
          </div>

          <section className="mb-10 space-y-4" aria-label="Compromisso">
            <h2 className="text-xl font-bold text-foreground">Nosso Compromisso</h2>
            <p
              className="text-muted-foreground leading-relaxed"
              onMouseEnter={() => handleTtsHover("A Casa do Autista está comprometida em garantir a acessibilidade digital para todas as pessoas, incluindo aquelas com deficiência. Trabalhamos continuamente para melhorar a experiência de uso da nossa plataforma, seguindo as diretrizes WCAG 2.1 Nível AA.")}
              onMouseLeave={handleTtsLeave}
            >
              A Casa do Autista está comprometida em garantir a acessibilidade digital para todas as pessoas, incluindo aquelas com deficiência. Trabalhamos continuamente para melhorar a experiência de uso da nossa plataforma, seguindo as diretrizes <strong>WCAG 2.1 Nível AA</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Reconhecemos que a acessibilidade é um processo contínuo e estamos sempre buscando aprimorar nossos recursos para atender às necessidades de todos os nossos usuários — crianças autistas, famílias, profissionais e equipes institucionais.
            </p>
          </section>

          <section className="mb-10" aria-label="Recursos de acessibilidade">
            <h2 className="mb-6 text-xl font-bold text-foreground">Recursos Implementados</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {recursos.map((recurso) => (
                <Card key={recurso.title} className="border-border">
                  <CardContent className="flex gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <recurso.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{recurso.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{recurso.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-10 space-y-4" aria-label="Conformidade">
            <h2 className="text-xl font-bold text-foreground">Nível de Conformidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta plataforma busca conformidade com o nível <strong>AA das WCAG 2.1</strong>. Isso inclui:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>HTML semântico com roles ARIA apropriados</li>
              <li>Contraste de cores adequado (mínimo 4.5:1 para texto)</li>
              <li>Navegação completa por teclado com skip links</li>
              <li>Textos alternativos em imagens</li>
              <li>Formulários com labels associados e feedback de erro</li>
              <li>Controle de animações e estímulos sensoriais</li>
              <li>Sistema de leitura em voz alta (TTS) em português</li>
            </ul>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6" aria-label="Contato">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Feedback e Contato
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Se você encontrar barreiras de acessibilidade ou tiver sugestões de melhoria, entre em contato conosco pela página <a href="/institucional" className="text-primary underline hover:text-primary/80 font-medium">Institucional</a> ou envie uma mensagem pelo formulário de contato.
            </p>
            <p className="text-sm text-muted-foreground">
              Nos esforçamos para responder dentro de 5 dias úteis e implementar melhorias de acessibilidade sempre que possível.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-8" role="contentinfo">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Casa dos Autistas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Acessibilidade;
