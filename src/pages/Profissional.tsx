import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { GraduationCap, LogOut, Home, FileText, BarChart3, MessageSquare, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import { ProfissionalDashboard } from "@/components/ProfissionalDashboard";
import { MessagesPanel } from "@/components/MessagesPanel";
import { FamilyReportsView } from "@/components/FamilyReportsView";

interface Child {
  id: string;
  name: string;
  age: number | null;
  diagnosis: string | null;
  school: string | null;
  responsible_id: string;
}

const Profissional = () => {
  const { user, loading, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [report, setReport] = useState({
    attention_score: 3,
    participation_score: 3,
    focus_duration_minutes: 15,
    responds_to_commands: "parcial",
    crisis_frequency: "raramente",
    trigger_stimuli: "",
    working_strategies: "",
    literacy_level: "pre_alfabetizacao",
    math_level: "pre_alfabetizacao",
    motor_coordination: "em_desenvolvimento",
    quarterly_goals: "",
    recommended_interventions: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchChildren();
  }, [user]);

  const fetchChildren = async () => {
    const { data } = await supabase.from("children").select("*");
    if (data) {
      setChildren(data as Child[]);
      if (data.length > 0 && !selectedChild) setSelectedChild(data[0].id);
    }
  };

  const submitReport = async () => {
    if (!selectedChild) return;
    setSubmitting(true);
    const { error } = await supabase.from("professional_reports").insert({
      child_id: selectedChild,
      created_by: user!.id,
      ...report,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Relatório profissional salvo!" });
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Carregando...</p></div>;

  const selectedChildData = children.find(c => c.id === selectedChild);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pastel-lilac">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">Área Profissional</span>
          </Link>
          <div className="flex items-center gap-2">
            <AccessibilityMenu />
            <Link to="/"><Button variant="ghost" size="icon"><Home className="h-5 w-5" /></Button></Link>
            <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Child selector */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Label className="font-display font-bold">Criança:</Label>
          {children.length > 0 ? (
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {children.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} {c.age ? `(${c.age} anos)` : ""} — {c.diagnosis || "sem diagnóstico"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma criança encontrada.</p>
          )}
        </div>

        {selectedChild && (
          <Tabs defaultValue="formulario">
            <TabsList className="mb-6">
              <TabsTrigger value="formulario"><FileText className="mr-1 h-4 w-4" /> Formulário Técnico</TabsTrigger>
              <TabsTrigger value="dashboard"><BarChart3 className="mr-1 h-4 w-4" /> Dashboard</TabsTrigger>
              <TabsTrigger value="relatorio-familia"><ClipboardList className="mr-1 h-4 w-4" /> Relatório Familiar</TabsTrigger>
              <TabsTrigger value="mensagens"><MessageSquare className="mr-1 h-4 w-4" /> Mensagens</TabsTrigger>
            </TabsList>

            <TabsContent value="formulario">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Avaliação Escolar */}
                <Card>
                  <CardHeader><CardTitle className="text-base">📊 Avaliação Escolar</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Atenção em sala: {report.attention_score}/5</Label>
                      <Slider value={[report.attention_score]} onValueChange={([v]) => setReport(r => ({ ...r, attention_score: v }))} min={1} max={5} step={1} className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-sm">Participação: {report.participation_score}/5</Label>
                      <Slider value={[report.participation_score]} onValueChange={([v]) => setReport(r => ({ ...r, participation_score: v }))} min={1} max={5} step={1} className="mt-2" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Tempo de foco (minutos)</Label>
                      <Input type="number" value={report.focus_duration_minutes} onChange={e => setReport(r => ({ ...r, focus_duration_minutes: parseInt(e.target.value) || 0 }))} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Resposta a comandos</Label>
                      <Select value={report.responds_to_commands} onValueChange={v => setReport(r => ({ ...r, responds_to_commands: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                          <SelectItem value="parcial">Parcial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Comportamento */}
                <Card>
                  <CardHeader><CardTitle className="text-base">🧩 Comportamento</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-sm">Frequência de crises</Label>
                      <Select value={report.crisis_frequency} onValueChange={v => setReport(r => ({ ...r, crisis_frequency: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nunca">Nunca</SelectItem>
                          <SelectItem value="raramente">Raramente</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="diario">Diário</SelectItem>
                          <SelectItem value="multiplas_vezes_dia">Múltiplas vezes ao dia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Estímulos desencadeadores</Label>
                      <Textarea value={report.trigger_stimuli} onChange={e => setReport(r => ({ ...r, trigger_stimuli: e.target.value }))} placeholder="Ex: barulho alto, mudança de rotina..." rows={3} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Estratégias que funcionam</Label>
                      <Textarea value={report.working_strategies} onChange={e => setReport(r => ({ ...r, working_strategies: e.target.value }))} placeholder="Ex: timer visual, pausas sensoriais..." rows={3} />
                    </div>
                  </CardContent>
                </Card>

                {/* Desempenho Acadêmico */}
                <Card>
                  <CardHeader><CardTitle className="text-base">📚 Desempenho Acadêmico</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-sm">Alfabetização</Label>
                      <Select value={report.literacy_level} onValueChange={v => setReport(r => ({ ...r, literacy_level: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre_alfabetizacao">Pré-alfabetização</SelectItem>
                          <SelectItem value="inicial">Inicial</SelectItem>
                          <SelectItem value="intermediario">Intermediário</SelectItem>
                          <SelectItem value="avancado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Matemática</Label>
                      <Select value={report.math_level} onValueChange={v => setReport(r => ({ ...r, math_level: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre_alfabetizacao">Pré-alfabetização</SelectItem>
                          <SelectItem value="inicial">Inicial</SelectItem>
                          <SelectItem value="intermediario">Intermediário</SelectItem>
                          <SelectItem value="avancado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Coordenação motora</Label>
                      <Select value={report.motor_coordination} onValueChange={v => setReport(r => ({ ...r, motor_coordination: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="em_desenvolvimento">Em desenvolvimento</SelectItem>
                          <SelectItem value="adequada">Adequada</SelectItem>
                          <SelectItem value="avancada">Avançada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Plano Individualizado */}
                <Card>
                  <CardHeader><CardTitle className="text-base">🎯 Plano Individualizado</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-sm">Metas trimestrais</Label>
                      <Textarea value={report.quarterly_goals} onChange={e => setReport(r => ({ ...r, quarterly_goals: e.target.value }))} placeholder="Defina as metas para o trimestre..." rows={4} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Intervenções recomendadas</Label>
                      <Textarea value={report.recommended_interventions} onChange={e => setReport(r => ({ ...r, recommended_interventions: e.target.value }))} placeholder="Intervenções sugeridas..." rows={4} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Observações gerais</Label>
                      <Textarea value={report.notes} onChange={e => setReport(r => ({ ...r, notes: e.target.value }))} placeholder="Observações adicionais..." rows={3} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button size="lg" onClick={submitReport} disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar Relatório Profissional"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dashboard">
              <ProfissionalDashboard childId={selectedChild} />
            </TabsContent>

            <TabsContent value="relatorio-familia">
              <FamilyReportsView childId={selectedChild} />
            </TabsContent>

            <TabsContent value="mensagens">
              {selectedChildData && (
                <MessagesPanel childId={selectedChild} otherUserId={selectedChildData.responsible_id} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Profissional;
