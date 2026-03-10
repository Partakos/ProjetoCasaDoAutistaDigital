import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  childId: string;
}

interface FamilyReport {
  id: string;
  created_at: string;
  eats_alone: boolean;
  uses_bathroom_alone: boolean;
  dresses_alone: boolean;
  speaks_full_sentences: string;
  maintains_eye_contact: string;
  responds_when_called: string;
  interacts_with_children: boolean;
  shows_empathy: boolean;
  recognizes_colors: boolean;
  recognizes_numbers: boolean;
  follows_simple_instructions: boolean;
  follows_complex_instructions: boolean;
  sensitive_to_loud_sounds: boolean;
  sensitive_to_touch: boolean;
  notes: string | null;
}

const triToNum = (v: string) => v === "sim" ? 3 : v === "parcial" ? 2 : 1;
const boolToNum = (v: boolean) => v ? 1 : 0;

const chartConfig = {
  autonomia: { label: "Autonomia", color: "hsl(var(--pastel-mint))" },
  comunicacao: { label: "Comunicação", color: "hsl(var(--pastel-blue))" },
  socializacao: { label: "Socialização", color: "hsl(var(--pastel-lilac))" },
  cognitivo: { label: "Cognitivo", color: "hsl(var(--pastel-yellow))" },
};

export function ResponsavelDashboard({ childId }: Props) {
  const [reports, setReports] = useState<FamilyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [childId]);

  const fetchReports = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("family_reports")
      .select("*")
      .eq("child_id", childId)
      .order("created_at", { ascending: true });
    setReports((data as FamilyReport[] | null) ?? []);
    setLoading(false);
  };

  if (loading) return <p className="text-muted-foreground">Carregando dashboard...</p>;
  if (reports.length === 0) return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">Nenhum relatório ainda. Preencha o formulário para ver os gráficos de evolução.</p>
      </CardContent>
    </Card>
  );

  const evolutionData = reports.map(r => ({
    date: format(new Date(r.created_at), "dd/MM", { locale: ptBR }),
    autonomia: Math.round(((boolToNum(r.eats_alone) + boolToNum(r.uses_bathroom_alone) + boolToNum(r.dresses_alone)) / 3) * 100),
    comunicacao: Math.round(((triToNum(r.speaks_full_sentences) + triToNum(r.maintains_eye_contact) + triToNum(r.responds_when_called)) / 9) * 100),
    socializacao: Math.round(((boolToNum(r.interacts_with_children) + boolToNum(r.shows_empathy) + (1 - boolToNum(r.interacts_with_children ? false : true))) / 3) * 100),
    cognitivo: Math.round(((boolToNum(r.recognizes_colors) + boolToNum(r.recognizes_numbers) + boolToNum(r.follows_simple_instructions) + boolToNum(r.follows_complex_instructions)) / 4) * 100),
  }));

  const latest = reports[reports.length - 1];
  const autonomyScore = Math.round(((boolToNum(latest.eats_alone) + boolToNum(latest.uses_bathroom_alone) + boolToNum(latest.dresses_alone)) / 3) * 100);
  const commScore = Math.round(((triToNum(latest.speaks_full_sentences) + triToNum(latest.maintains_eye_contact) + triToNum(latest.responds_when_called)) / 9) * 100);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-mint))" }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Autonomia</p>
            <p className="text-2xl font-bold text-foreground">{autonomyScore}%</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-blue))" }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Comunicação</p>
            <p className="text-2xl font-bold text-foreground">{commScore}%</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-lilac))" }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Relatórios</p>
            <p className="text-2xl font-bold text-foreground">{reports.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--pastel-yellow))" }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Sensibilidade</p>
            <p className="text-2xl font-bold text-foreground">
              {latest.sensitive_to_loud_sounds || latest.sensitive_to_touch ? "Alta" : "Normal"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evolution chart */}
      <Card>
        <CardHeader><CardTitle>📈 Evolução ao Longo do Tempo</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="autonomia" stroke="hsl(var(--pastel-mint))" strokeWidth={2} dot />
              <Line type="monotone" dataKey="comunicacao" stroke="hsl(var(--pastel-blue))" strokeWidth={2} dot />
              <Line type="monotone" dataKey="socializacao" stroke="hsl(var(--pastel-lilac))" strokeWidth={2} dot />
              <Line type="monotone" dataKey="cognitivo" stroke="hsl(var(--pastel-yellow))" strokeWidth={2} dot />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader><CardTitle>📋 Histórico de Relatórios</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...reports].reverse().map(r => (
              <div key={r.id} className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold text-foreground">
                  {format(new Date(r.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-pastel-mint/50 px-2 py-1">Autonomia: {Math.round(((boolToNum(r.eats_alone) + boolToNum(r.uses_bathroom_alone) + boolToNum(r.dresses_alone)) / 3) * 100)}%</span>
                  <span className="rounded bg-pastel-blue/50 px-2 py-1">Comunicação: {Math.round(((triToNum(r.speaks_full_sentences) + triToNum(r.maintains_eye_contact) + triToNum(r.responds_when_called)) / 9) * 100)}%</span>
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
