import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Eye, Volume2, VolumeX, Zap, ZapOff, Minimize2, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AccessibilityMenu = () => {
  const { settings, toggleHighContrast, toggleAnimations, toggleSound, toggleSimplified, toggleTts } = useAccessibility();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-2 border-primary/30 bg-card hover:bg-primary/10"
          aria-label="Configurações de acessibilidade"
        >
          <Eye className="h-5 w-5 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-4" align="end" role="dialog" aria-label="Menu de acessibilidade">
        <h3 className="font-display font-bold text-foreground">Modo Sensorial</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" /> Alto Contraste
            </Label>
            <Switch id="high-contrast" checked={settings.highContrast} onCheckedChange={toggleHighContrast} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="no-animations" className="flex items-center gap-2 text-sm">
              {settings.noAnimations ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />} Sem Animações
            </Label>
            <Switch id="no-animations" checked={settings.noAnimations} onCheckedChange={toggleAnimations} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="flex items-center gap-2 text-sm">
              {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />} Sons
            </Label>
            <Switch id="sound" checked={settings.soundEnabled} onCheckedChange={toggleSound} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="simplified" className="flex items-center gap-2 text-sm">
              <Minimize2 className="h-4 w-4" /> Simplificado
            </Label>
            <Switch id="simplified" checked={settings.simplified} onCheckedChange={toggleSimplified} />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <Label htmlFor="tts" className="flex items-center gap-2 text-sm">
              <AudioLines className="h-4 w-4" /> Leitura em Voz Alta
            </Label>
            <Switch id="tts" checked={settings.ttsEnabled} onCheckedChange={toggleTts} />
          </div>
          {settings.ttsEnabled && (
            <p className="text-xs text-muted-foreground pl-6">
              Passe o mouse ou toque nos textos para ouvir a leitura.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AccessibilityMenu;
