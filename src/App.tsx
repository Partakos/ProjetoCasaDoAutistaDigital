import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Responsavel from "./pages/Responsavel";
import Profissional from "./pages/Profissional";
import Institucional from "./pages/Institucional";
import Crianca from "./pages/Crianca";
import BaseConhecimento from "./pages/BaseConhecimento";
import Acessibilidade from "./pages/Acessibilidade";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/responsavel" element={<Responsavel />} />
            <Route path="/profissional" element={<Profissional />} />
            <Route path="/institucional" element={<Institucional />} />
            <Route path="/crianca" element={<Crianca />} />
            <Route path="/base-conhecimento" element={<BaseConhecimento />} />
            <Route path="/acessibilidade" element={<Acessibilidade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
