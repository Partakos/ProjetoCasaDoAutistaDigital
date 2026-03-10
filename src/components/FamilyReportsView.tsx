import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface Props {
  childId: string;
}

const triLabel = (v: string | null) => v === "sim" ? "Sim" : v === "nao" ? "Não" : "Parcial";

export function FamilyReportsView({ childId }: Props) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("family_reports")
      .select("*")
      .eq("child_id", childId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReports(data ?? []);
        setLoading(false);
      });
  }, [childId]);

  if (loading) return <p className="text-muted-foreground">Carregando relatórios familiares...</p>;
  if (reports.length === 0) return (
    <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Nenhum relatório familiar enviado para esta criança.</p></CardContent></Card>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">📋 Relatórios do Responsável ({reports.length})</h3>
      {reports.map((r) => (
        <Card key={r.id}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>{format(new Date(r.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span>
              <Badge variant="secondary" className="text-xs">Salvo</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Comunicação */}
              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">🗣 Comunicação</p>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>Fala frases completas: <strong>{triLabel(r.speaks_full_sentences)}</strong></li>
                  <li>Contato visual: <strong>{triLabel(r.maintains_eye_contact)}</strong></li>
                  <li>Responde quando chamado: <strong>{triLabel(r.responds_when_called)}</strong></li>
                  <li>Comunicação alternativa: <strong>{r.uses_alternative_communication ? "Sim" : "Não"}</strong></li>
                </ul>
              </div>

              {/* Cognitivo */}
              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">🧠 Cognitivo</p>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>Reconhece cores: <strong>{r.recognizes_colors ? "Sim" : "Não"}</strong></li>
                  <li>Reconhece números: <strong>{r.recognizes_numbers ? "Sim" : "Não"}</strong></li>
                  <li>Instruções simples: <strong>{r.follows_simple_instructions ? "Sim" : "Não"}</strong></li>
                  <li>Instruções complexas: <strong>{r.follows_complex_instructions ? "Sim" : "Não"}</strong></li>
                </ul>
              </div>

              {/* Sensorial */}
              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">💇 Sensorial</p>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>Sons altos: <strong>{r.sensitive_to_loud_sounds ? "Sensível" : "Normal"}</strong></li>
                  <li>Toque: <strong>{r.sensitive_to_touch ? "Sensível" : "Normal"}</strong></li>
                  <li>Texturas: <strong>{r.texture_difficulty ? "Dificuldade" : "Normal"}</strong></li>
                  <li>Cortar cabelo: <strong>{r.allows_haircut ? "Permite" : "Não permite"}</strong></li>
                </ul>
              </div>

              {/* Socialização */}
              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">🤝 Socialização</p>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>Interage com crianças: <strong>{r.interacts_with_children ? "Sim" : "Não"}</strong></li>
                  <li>Prefere brincar sozinho: <strong>{r.prefers_playing_alone ? "Sim" : "Não"}</strong></li>
                  <li>Demonstra empatia: <strong>{r.shows_empathy ? "Sim" : "Não"}</strong></li>
                </ul>
              </div>

              {/* Autonomia */}
              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">🎯 Autonomia</p>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>Come sozinho: <strong>{r.eats_alone ? "Sim" : "Não"}</strong></li>
                  <li>Usa banheiro sozinho: <strong>{r.uses_bathroom_alone ? "Sim" : "Não"}</strong></li>
                  <li>Veste-se sozinho: <strong>{r.dresses_alone ? "Sim" : "Não"}</strong></li>
                </ul>
              </div>
            </div>

            {r.notes && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">📝 Observações</p>
                <p className="mt-1 text-sm text-foreground">{r.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
