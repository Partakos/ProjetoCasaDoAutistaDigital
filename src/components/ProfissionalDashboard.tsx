import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  childId: string;
}

const chartConfig = {
  attention: { label: "Atenção", color: "hsl(var(--pastel-blue))" },
  participation: { label: "Participação", color: "hsl(var(--pastel-mint))" },
  focus: { label: "Foco (min)", color: "hsl(var(--pastel-lilac))" },
  familyAutonomy: { label: "Autonomia (Família)", color: "hsl(var(--pastel-pink))" },
  familyComm: { label: "Comunicação (Família)", color: "hsl(var(--pastel-orange))" },
};

const crisisMap: Record<string, number> = { nunca: 0, raramente: 1, semanal: 2, diario: 3, multiplas_vezes_dia: 4 };
const levelMap: Record<string, number> = { pre_alfabetizacao: 1, inicial: 2, intermediario: 3, avancado: 4 };

export function ProfissionalDashboard({ childId }: Props) {
  const [proReports, setProReports] = useState<any[]>([]);
  const [famReports, setFamReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    setLoading(true);
    const [pro, fam] = await Promise.all([
      supabase.from("professional_reports").select("*").eq("child_id", childId).order("created_at", { ascending: true }),
      supabase.from("family_reports").select("*").eq("child_id", childId).order("created_at", { ascending: true }),
    ]);
    setProReports(pro.data ?? []);
    setFamReports(fam.data ?? []);
    setLoading(false);
  };

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (proReports.length === 0 && famReports.length === 0) return (
    <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Nenhum relatório encontrado para esta criança.</p></CardContent></Card>
  );

  const latest = proReports[proReports.length - 1];

  const evolutionData = proReports.map(r => ({
    date: format(new Date(r.created_at), "dd/MM", { locale: ptBR }),
    attention: r.attention_score,
    participation: r.participation_score,
    focus: r.focus_duration_minutes,
  }));

  // Radar data for latest report
  const radarData = latest ? [
    { subject: "Atenção", value: (latest.attention_score / 5) * 100 },
    { subject: "Participação", value: (latest.participation_score / 5) * 100 },
    { subject: "Foco", value: Math.min(latest.focus_duration_minutes / 60 * 100, 100) },
    { subject: "Alfabetização", value: (levelMap[latest.literacy_level] / 4) * 100 },
    { subject: "Matemática", value: (levelMap[latest.math_level] / 4) * 100 },
    { subject: "Crises (inv)", value: ((4 - crisisMap[latest.crisis_frequency]) / 4) * 100 },
  ] : [];

  // Alert indicators
  const alerts: string[] = [];
  if (latest) {
    if (latest.attention_score <= 2) alerts.push("⚠️ Atenção abaixo da média");
    if (crisisMap[latest.crisis_frequency] >= 3) alerts.push("🚨 Alta frequência de crises");
    if (latest.focus_duration_minutes < 10) alerts.push("⏱ Tempo de foco muito baixo");
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader><CardTitle className="text-base text-destructive">Sinais de Alerta</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {alerts.map((a, i) => <li key={i} className="text-sm text-foreground">{a}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {latest && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-blue))" }}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Atenção</p>
              <p className="text-2xl font-bold">{latest.attention_score}/5</p>
            </CardContent>
          </Card>
          <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-mint))" }}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Participação</p>
              <p className="text-2xl font-bold">{latest.participation_score}/5</p>
            </CardContent>
          </Card>
          <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-lilac))" }}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Foco</p>
              <p className="text-2xl font-bold">{latest.focus_duration_minutes} min</p>
            </CardContent>
          </Card>
          <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-pink))" }}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Crises</p>
              <p className="text-2xl font-bold capitalize">{latest.crisis_frequency.replace("_", " ")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Evolution Chart */}
      {evolutionData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>📈 Evolução Escolar</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="attention" stroke="hsl(var(--pastel-blue))" strokeWidth={2} dot />
                <Line type="monotone" dataKey="participation" stroke="hsl(var(--pastel-mint))" strokeWidth={2} dot />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>🎯 Perfil Atual</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Desempenho" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Comparative with family reports */}
      {famReports.length > 0 && (
        <Card>
          <CardHeader><CardTitle>🔄 Comparativo Família vs Profissional</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Último Relatório Familiar</h4>
                {(() => {
                  const f = famReports[famReports.length - 1];
                  const triToLabel = (v: string) => v === "sim" ? "Sim" : v === "nao" ? "Não" : "Parcial";
                  return (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Fala: {triToLabel(f.speaks_full_sentences)}</p>
                      <p>Contato visual: {triToLabel(f.maintains_eye_contact)}</p>
                      <p>Come sozinho: {f.eats_alone ? "Sim" : "Não"}</p>
                      <p>Veste-se sozinho: {f.dresses_alone ? "Sim" : "Não"}</p>
                      <p>Sensível a sons: {f.sensitive_to_loud_sounds ? "Sim" : "Não"}</p>
                      <p className="text-xs text-muted-foreground mt-2">Data: {format(new Date(f.created_at), "dd/MM/yyyy", { locale: ptBR })}</p>
                    </div>
                  );
                })()}
              </div>
              {latest && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Último Relatório Profissional</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Atenção: {latest.attention_score}/5</p>
                    <p>Participação: {latest.participation_score}/5</p>
                    <p>Foco: {latest.focus_duration_minutes} min</p>
                    <p>Alfabetização: {latest.literacy_level.replace("_", " ")}</p>
                    <p>Crises: {latest.crisis_frequency.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground mt-2">Data: {format(new Date(latest.created_at), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader><CardTitle>📋 Histórico Profissional</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...proReports].reverse().map(r => (
              <div key={r.id} className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold text-foreground">
                  {format(new Date(r.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-pastel-blue/50 px-2 py-1">Atenção: {r.attention_score}/5</span>
                  <span className="rounded bg-pastel-mint/50 px-2 py-1">Participação: {r.participation_score}/5</span>
                  <span className="rounded bg-pastel-lilac/50 px-2 py-1">Foco: {r.focus_duration_minutes}min</span>
                </div>
                {r.notes && <p className="mt-2 text-sm text-muted-foreground">{r.notes}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
