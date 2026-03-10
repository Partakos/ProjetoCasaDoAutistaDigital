import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Calendar, Mail, MapPin, Phone, Clock, Users, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
}

const services = [
  { title: "Atendimento Psicopedagógico", description: "Avaliação e intervenção focada no desenvolvimento da aprendizagem.", icon: Users },
  { title: "Terapia Ocupacional", description: "Atividades para desenvolver autonomia e habilidades motoras.", icon: Heart },
  { title: "Fonoaudiologia", description: "Estimulação da comunicação verbal e alternativa.", icon: Phone },
  { title: "Oficinas e Grupos", description: "Atividades em grupo para socialização e desenvolvimento.", icon: Building2 },
];

const Institucional = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.from("events").select("*").order("event_date", { ascending: true }).then(({ data }) => {
      setEvents((data as EventItem[] | null) ?? []);
    });
  }, []);

  const sendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert(contact);
    setSending(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mensagem enviada!", description: "Entraremos em contato em breve." });
      setContact({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-10 h-56 w-56 rounded-full bg-pastel-mint/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-10 h-48 w-48 rounded-full bg-pastel-blue/30 blur-3xl" />
        </div>
        <div className="container text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
            <Building2 className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-5xl">Casa dos Autistas</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Instituição dedicada ao acolhimento, educação e desenvolvimento de crianças no espectro autista e suas famílias.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">Nossos Serviços</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Card key={s.title} className="text-center">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pastel-mint/50">
                    <s.icon className="h-7 w-7 text-secondary-foreground" />
                  </div>
                  <h3 className="mb-2 font-display font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="bg-card py-12">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
            <Calendar className="mr-2 inline h-6 w-6" />
            Próximos Eventos
          </h2>
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum evento agendado no momento.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((ev) => (
                <Card key={ev.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{ev.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(ev.event_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  {(ev.description || ev.location) && (
                    <CardContent>
                      {ev.description && <p className="text-sm text-muted-foreground">{ev.description}</p>}
                      {ev.location && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {ev.location}
                        </p>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="py-12">
        <div className="container max-w-lg">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
            <Mail className="mr-2 inline h-6 w-6" />
            Fale Conosco
          </h2>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={sendContact} className="space-y-4">
                <div className="space-y-1">
                  <Label>Nome</Label>
                  <Input value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} required placeholder="Seu nome" />
                </div>
                <div className="space-y-1">
                  <Label>E-mail</Label>
                  <Input type="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} required placeholder="seu@email.com" />
                </div>
                <div className="space-y-1">
                  <Label>Mensagem</Label>
                  <Textarea value={contact.message} onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))} required placeholder="Como podemos ajudar?" rows={5} />
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">© 2026 Casa dos Autistas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Institucional;
