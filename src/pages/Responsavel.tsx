import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Smile, Plus, BarChart3, FileText, LogOut, Home, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import { ResponsavelDashboard } from "@/components/ResponsavelDashboard";

interface Child {
  id: string;
  name: string;
  age: number | null;
  diagnosis: string | null;
  school: string | null;
  birth_date: string | null;
}

const Responsavel = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({ name: "", age: "", diagnosis: "", school: "", birth_date: "" });
  const [submitting, setSubmitting] = useState(false);

  // Family report form state
  const [report, setReport] = useState({
    speaks_full_sentences: "parcial",
    uses_alternative_communication: false,
    maintains_eye_contact: "parcial",
    responds_when_called: "parcial",
    recognizes_colors: false,
    recognizes_numbers: false,
    follows_simple_instructions: false,
    follows_complex_instructions: false,
    allows_haircut: true,
    sensitive_to_loud_sounds: false,
    sensitive_to_touch: false,
    texture_difficulty: false,
    interacts_with_children: false,
    prefers_playing_alone: true,
    shows_empathy: false,
    eats_alone: false,
    uses_bathroom_alone: false,
    dresses_alone: false,
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchChildren();
  }, [user]);

  const fetchChildren = async () => {
    const { data } = await supabase.from("children").select("*").eq("responsible_id", user!.id);
    if (data) {
      setChildren(data as Child[]);
      if (data.length > 0 && !selectedChild) setSelectedChild(data[0].id);
    }
  };

  const addChild = async () => {
    if (!newChild.name.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("children").insert({
      name: newChild.name.trim(),
      age: newChild.age ? parseInt(newChild.age) : null,
      diagnosis: newChild.diagnosis || null,
      school: newChild.school || null,
      birth_date: newChild.birth_date || null,
      responsible_id: user!.id,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Criança cadastrada!" });
      setNewChild({ name: "", age: "", diagnosis: "", school: "", birth_date: "" });
      setShowAddChild(false);
      fetchChildren();
    }
  };

  const submitReport = async () => {
    if (!selectedChild) return;
    setSubmitting(true);
    const { error } = await supabase.from("family_reports").insert({
      child_id: selectedChild,
      created_by: user!.id,
      ...report,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Relatório salvo com sucesso!" });
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Carregando...</p></div>;

  const TriSelect = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="sim">Sim</SelectItem>
          <SelectItem value="nao">Não</SelectItem>
          <SelectItem value="parcial">Parcial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const BoolSwitch = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <Label className="text-sm">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pastel-pink">
              <Users className="h-5 w-5 text-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">Área do Responsável</span>
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
                  <SelectItem key={c.id} value={c.id}>{c.name} {c.age ? `(${c.age} anos)` : ""}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma criança cadastrada.</p>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowAddChild(!showAddChild)}>
            <Plus className="mr-1 h-4 w-4" /> Cadastrar
          </Button>
        </div>

        {/* Add child form */}
        {showAddChild && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">Cadastrar Criança</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Nome *</Label>
                <Input value={newChild.name} onChange={e => setNewChild(p => ({ ...p, name: e.target.value }))} placeholder="Nome da criança" />
              </div>
              <div className="space-y-1">
                <Label>Idade</Label>
                <Input type="number" value={newChild.age} onChange={e => setNewChild(p => ({ ...p, age: e.target.value }))} placeholder="Ex: 6" />
              </div>
              <div className="space-y-1">
                <Label>Diagnóstico</Label>
                <Select value={newChild.diagnosis} onValueChange={v => setNewChild(p => ({ ...p, diagnosis: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="severo">Severo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Escola</Label>
                <Input value={newChild.school} onChange={e => setNewChild(p => ({ ...p, school: e.target.value }))} placeholder="Escola atual" />
              </div>
              <div className="space-y-1">
                <Label>Data de Nascimento</Label>
                <Input type="date" value={newChild.birth_date} onChange={e => setNewChild(p => ({ ...p, birth_date: e.target.value }))} />
              </div>
              <div className="flex items-end">
                <Button onClick={addChild} disabled={submitting || !newChild.name.trim()}>
                  {submitting ? "Salvando..." : "Cadastrar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        {selectedChild && (
          <Tabs defaultValue="formulario">
            <TabsList className="mb-6">
              <TabsTrigger value="formulario"><FileText className="mr-1 h-4 w-4" /> Formulário</TabsTrigger>
              <TabsTrigger value="dashboard"><BarChart3 className="mr-1 h-4 w-4" /> Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="formulario">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Comunicação */}
                <Card>
                  <CardHeader><CardTitle className="text-base">🗣 Comunicação</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <TriSelect label="Fala frases completas?" value={report.speaks_full_sentences} onChange={v => setReport(r => ({ ...r, speaks_full_sentences: v }))} />
                    <BoolSwitch label="Usa comunicação alternativa?" checked={report.uses_alternative_communication} onChange={v => setReport(r => ({ ...r, uses_alternative_communication: v }))} />
                    <TriSelect label="Mantém contato visual?" value={report.maintains_eye_contact} onChange={v => setReport(r => ({ ...r, maintains_eye_contact: v }))} />
                    <TriSelect label="Responde quando chamado?" value={report.responds_when_called} onChange={v => setReport(r => ({ ...r, responds_when_called: v }))} />
                  </CardContent>
                </Card>

                {/* Desenvolvimento Cognitivo */}
                <Card>
                  <CardHeader><CardTitle className="text-base">🧠 Desenvolvimento Cognitivo</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <BoolSwitch label="Reconhece cores?" checked={report.recognizes_colors} onChange={v => setReport(r => ({ ...r, recognizes_colors: v }))} />
                    <BoolSwitch label="Reconhece números?" checked={report.recognizes_numbers} onChange={v => setReport(r => ({ ...r, recognizes_numbers: v }))} />
                    <BoolSwitch label="Segue instruções simples?" checked={report.follows_simple_instructions} onChange={v => setReport(r => ({ ...r, follows_simple_instructions: v }))} />
                    <BoolSwitch label="Segue instruções complexas?" checked={report.follows_complex_instructions} onChange={v => setReport(r => ({ ...r, follows_complex_instructions: v }))} />
                  </CardContent>
                </Card>

                {/* Sensibilidade Sensorial */}
                <Card>
                  <CardHeader><CardTitle className="text-base">💇 Sensibilidade Sensorial</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <BoolSwitch label="Permite cortar cabelo?" checked={report.allows_haircut} onChange={v => setReport(r => ({ ...r, allows_haircut: v }))} />
                    <BoolSwitch label="Sensível a sons altos?" checked={report.sensitive_to_loud_sounds} onChange={v => setReport(r => ({ ...r, sensitive_to_loud_sounds: v }))} />
                    <BoolSwitch label="Sensível a toque?" checked={report.sensitive_to_touch} onChange={v => setReport(r => ({ ...r, sensitive_to_touch: v }))} />
                    <BoolSwitch label="Dificuldade com texturas?" checked={report.texture_difficulty} onChange={v => setReport(r => ({ ...r, texture_difficulty: v }))} />
                  </CardContent>
                </Card>

                {/* Socialização */}
                <Card>
                  <CardHeader><CardTitle className="text-base">🤝 Socialização</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <BoolSwitch label="Interage com outras crianças?" checked={report.interacts_with_children} onChange={v => setReport(r => ({ ...r, interacts_with_children: v }))} />
                    <BoolSwitch label="Prefere brincar sozinho?" checked={report.prefers_playing_alone} onChange={v => setReport(r => ({ ...r, prefers_playing_alone: v }))} />
                    <BoolSwitch label="Demonstra empatia?" checked={report.shows_empathy} onChange={v => setReport(r => ({ ...r, shows_empathy: v }))} />
                  </CardContent>
                </Card>

                {/* Autonomia */}
                <Card>
                  <CardHeader><CardTitle className="text-base">🎯 Autonomia</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <BoolSwitch label="Come sozinho?" checked={report.eats_alone} onChange={v => setReport(r => ({ ...r, eats_alone: v }))} />
                    <BoolSwitch label="Usa banheiro sozinho?" checked={report.uses_bathroom_alone} onChange={v => setReport(r => ({ ...r, uses_bathroom_alone: v }))} />
                    <BoolSwitch label="Veste-se sozinho?" checked={report.dresses_alone} onChange={v => setReport(r => ({ ...r, dresses_alone: v }))} />
                  </CardContent>
                </Card>

                {/* Observações */}
                <Card>
                  <CardHeader><CardTitle className="text-base">📝 Observações</CardTitle></CardHeader>
                  <CardContent>
                    <Textarea
                      value={report.notes}
                      onChange={e => setReport(r => ({ ...r, notes: e.target.value }))}
                      placeholder="Observações sobre o desenvolvimento da criança..."
                      rows={5}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button size="lg" onClick={submitReport} disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar Relatório"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dashboard">
              <ResponsavelDashboard childId={selectedChild} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Responsavel;
