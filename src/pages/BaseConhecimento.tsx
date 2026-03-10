import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Youtube, FileText, HelpCircle, ExternalLink, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface KnowledgeItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  url: string | null;
  author: string | null;
  created_at: string;
}

const typeConfig: Record<string, { icon: typeof BookOpen; label: string; color: string }> = {
  artigo: { icon: FileText, label: "Artigo", color: "bg-pastel-blue text-accent-foreground" },
  livro: { icon: BookOpen, label: "Livro", color: "bg-pastel-lilac text-primary-foreground" },
  video: { icon: Youtube, label: "Vídeo", color: "bg-pastel-pink text-foreground" },
  guia: { icon: HelpCircle, label: "Guia", color: "bg-pastel-mint text-secondary-foreground" },
};

const BaseConhecimento = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState({ type: "video", title: "", description: "", url: "", author: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase
      .from("knowledge_base")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as KnowledgeItem[] | null) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = (type: string) => items.filter((i) => i.type === type);

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Faça login", description: "Você precisa estar logado para sugerir conteúdo.", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("knowledge_base").insert({
      ...suggestion,
      suggested_by: user.id,
      approved: false,
    });
    setSending(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sugestão enviada!", description: "Seu conteúdo será analisado antes de ser publicado." });
      setSuggestion({ type: "video", title: "", description: "", url: "", author: "" });
    }
  };

  const renderItems = (type: string) => {
    const list = filtered(type);
    if (list.length === 0) return <p className="text-center text-muted-foreground py-8">Nenhum conteúdo disponível ainda.</p>;
    const cfg = typeConfig[type];
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => {
          const Icon = cfg.icon;
          return (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={cfg.color}>
                    <Icon className="h-3 w-3 mr-1" />
                    {cfg.label}
                  </Badge>
                </div>
                <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                {item.author && <CardDescription>por {item.author}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                {item.description && <p className="text-sm text-muted-foreground mb-4">{item.description}</p>}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2 w-full">
                      <ExternalLink className="h-4 w-4" />
                      Acessar
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-10 h-56 w-56 rounded-full bg-pastel-lilac/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-10 h-48 w-48 rounded-full bg-pastel-blue/30 blur-3xl" />
        </div>
        <div className="container text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-5xl">Base de Conhecimento</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Artigos, livros, vídeos e guias sobre autismo. Todos podem contribuir com sugestões!
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container">
          <Tabs defaultValue="artigo" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="artigo" className="gap-1"><FileText className="h-4 w-4 hidden sm:block" /> Artigos</TabsTrigger>
              <TabsTrigger value="livro" className="gap-1"><BookOpen className="h-4 w-4 hidden sm:block" /> Livros</TabsTrigger>
              <TabsTrigger value="video" className="gap-1"><Youtube className="h-4 w-4 hidden sm:block" /> Vídeos</TabsTrigger>
              <TabsTrigger value="guia" className="gap-1"><HelpCircle className="h-4 w-4 hidden sm:block" /> Guias</TabsTrigger>
            </TabsList>
            <TabsContent value="artigo">{loading ? <p className="text-center text-muted-foreground">Carregando...</p> : renderItems("artigo")}</TabsContent>
            <TabsContent value="livro">{loading ? <p className="text-center text-muted-foreground">Carregando...</p> : renderItems("livro")}</TabsContent>
            <TabsContent value="video">{loading ? <p className="text-center text-muted-foreground">Carregando...</p> : renderItems("video")}</TabsContent>
            <TabsContent value="guia">{loading ? <p className="text-center text-muted-foreground">Carregando...</p> : renderItems("guia")}</TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Suggestion Form */}
      <section className="bg-card py-12">
        <div className="container max-w-lg">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
            <Send className="mr-2 inline h-6 w-6" />
            Sugira um Conteúdo
          </h2>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSuggest} className="space-y-4">
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  <Select value={suggestion.type} onValueChange={(v) => setSuggestion((s) => ({ ...s, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo do YouTube</SelectItem>
                      <SelectItem value="livro">Livro</SelectItem>
                      <SelectItem value="artigo">Artigo</SelectItem>
                      <SelectItem value="guia">Guia / Tutorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Título</Label>
                  <Input value={suggestion.title} onChange={(e) => setSuggestion((s) => ({ ...s, title: e.target.value }))} required placeholder="Nome do conteúdo" />
                </div>
                <div className="space-y-1">
                  <Label>Autor</Label>
                  <Input value={suggestion.author} onChange={(e) => setSuggestion((s) => ({ ...s, author: e.target.value }))} placeholder="Autor ou canal" />
                </div>
                <div className="space-y-1">
                  <Label>Link (opcional)</Label>
                  <Input type="url" value={suggestion.url} onChange={(e) => setSuggestion((s) => ({ ...s, url: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <Label>Descrição</Label>
                  <Textarea value={suggestion.description} onChange={(e) => setSuggestion((s) => ({ ...s, description: e.target.value }))} placeholder="Por que esse conteúdo é importante?" rows={3} />
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar Sugestão"}
                </Button>
                {!user && <p className="text-xs text-muted-foreground text-center">Faça login para enviar sugestões.</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">© 2026 Casa dos Autistas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default BaseConhecimento;
