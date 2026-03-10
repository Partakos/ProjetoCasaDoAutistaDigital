import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface AccessibilitySettings {
  highContrast: boolean;
  noAnimations: boolean;
  soundEnabled: boolean;
  simplified: boolean;
  ttsEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleHighContrast: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  toggleSimplified: () => void;
  toggleTts: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  voicesReady: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  noAnimations: false,
  soundEnabled: false,
  simplified: false,
  ttsEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("accessibility-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [voicesReady, setVoicesReady] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load voices (async on many mobile browsers)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
        setVoicesReady(true);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    // Fallback for Android WebView where voiceschanged may not fire
    const timer = setTimeout(loadVoices, 500);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    const root = document.documentElement;
    root.classList.toggle("high-contrast", settings.highContrast);
    root.classList.toggle("no-animations", settings.noAnimations);
  }, [settings]);

  const toggleHighContrast = () => setSettings(s => ({ ...s, highContrast: !s.highContrast }));
  const toggleAnimations = () => setSettings(s => ({ ...s, noAnimations: !s.noAnimations }));
  const toggleSound = () => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }));
  const toggleSimplified = () => setSettings(s => ({ ...s, simplified: !s.simplified }));
  const toggleTts = () => {
    setSettings(s => {
      if (s.ttsEnabled) {
        window.speechSynthesis?.cancel();
      }
      return { ...s, ttsEnabled: !s.ttsEnabled };
    });
  };

  const speak = useCallback((text: string) => {
    if (!settings.ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Pick best pt-BR voice, fallback to any Portuguese, then default
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
    const ptBrVoice = voices.find(v => v.lang === "pt-BR") 
      || voices.find(v => v.lang.startsWith("pt")) 
      || voices[0];
    if (ptBrVoice) utterance.voice = ptBrVoice;

    utterance.onerror = (e) => console.error("TTS error:", e.error);
    window.speechSynthesis.speak(utterance);
  }, [settings.ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return (
    <AccessibilityContext.Provider value={{ settings, toggleHighContrast, toggleAnimations, toggleSound, toggleSimplified, toggleTts, speak, stopSpeaking, voicesReady }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
};
