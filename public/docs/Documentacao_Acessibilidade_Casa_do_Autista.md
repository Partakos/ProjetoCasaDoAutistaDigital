# Documentação: Artefato Digital Acessível — Casa do Autista

---

## 1. Visão Geral e Escopo

**1.1 Nome do Projeto:** Casa do Autista — Plataforma Digital Inclusiva

**1.2 Padrão de Acessibilidade Adotado:** WCAG 2.1 Nível AA

**1.3 Público-alvo:** Crianças autistas, famílias/responsáveis, profissionais de saúde e educação, e equipes institucionais que atuam no apoio a pessoas com Transtorno do Espectro Autista (TEA).

**1.4 Responsável pela Acessibilidade:** Equipe de desenvolvimento Casa do Autista

---

## 2. Checklist de Design Acessível (UI/UX)

### 2.1 Contraste de Cores ✅ IMPLEMENTADO
- Paleta com cores pastel suaves para o modo padrão, respeitando contraste mínimo.
- **Modo Alto Contraste** disponível no Menu de Acessibilidade (`AccessibilityMenu.tsx`), que alterna para fundo branco puro, texto preto puro e bordas definidas com contraste superior a 7:1.
- Variáveis CSS semânticas em `index.css` (`:root`, `.dark`, `.high-contrast`) garantem consistência.

### 2.2 Não uso da cor como único indicador ✅ IMPLEMENTADO
- Campos de formulário utilizam texto + ícones além de cor para sinalizar estados (ex: campos obrigatórios com label explícito).
- Botões utilizam texto descritivo além de cor.
- Ícones Lucide acompanham labels em todas as opções do menu de acessibilidade.

### 2.3 Fontes Legíveis ✅ IMPLEMENTADO
- **Font display (títulos):** Quicksand (sans-serif), peso 400-700.
- **Font body (corpo):** Nunito (sans-serif), peso 400-800.
- Tamanho base de 16px com escala responsiva.
- Configurado em `tailwind.config.ts` e importado via Google Fonts.

### 2.4 Foco Visível ✅ IMPLEMENTADO
- Focus ring de 3px sólido com cor `hsl(var(--ring))` e offset de 2px aplicado globalmente via `*:focus-visible` em `index.css`.
- Border-radius de 4px para indicação visual clara.
- Componentes Radix UI já incluem gerenciamento de foco nativo.

### 2.5 Hierarquia de Títulos ✅ IMPLEMENTADO
- H1 único por página (ex: "Um espaço seguro para crescer e aprender" na Home).
- H2 para seções ("Nossas Áreas", "Acessibilidade em Primeiro Lugar").
- H3 para subseções e cards.
- Classe `font-display` aplicada automaticamente a todos os headings.

---

## 3. Checklist de Desenvolvimento (Frontend/Backend)

### 3.1 HTML Semântico ✅ IMPLEMENTADO
- `<header>` com `role="banner"` no `AppHeader.tsx`.
- `<main>` com `id="main-content"` e `role="main"` em todas as páginas.
- `<nav>` para navegação desktop e mobile.
- `<footer>` com `role="contentinfo"`.
- `<section>` com `aria-label` descritivos.
- Atributo `lang="pt-BR"` no `<html>` (`index.html`).

### 3.2 Navegação por Teclado ✅ IMPLEMENTADO
- **Skip Navigation Link** ("Pular para o conteúdo principal") no topo de cada página, visível ao receber foco via Tab.
- Navegação completa via TAB/SHIFT+TAB por todos os links, botões e controles.
- Componentes Radix UI (Dialog, Popover, DropdownMenu) possuem armadilhas de foco controladas e fechamento via ESC.
- Alvos de toque mínimos de **44x44px** em dispositivos touch (`@media (pointer: coarse)`).

### 3.3 Atributos ALT ✅ IMPLEMENTADO
- Logo: `alt="Casa do Autista"` no `AppHeader.tsx`.
- Ícones decorativos usam `aria-hidden="true"` (ex: ícone Smile no footer).
- Imagens de placeholder possuem alt descritivo ou vazio conforme contexto.

### 3.4 Formulários Acessíveis ✅ IMPLEMENTADO
- Componente `<Label>` do Radix associado a campos via `htmlFor`/`id`.
- Mensagens de erro claras nos formulários de login e cadastro.
- Integração com `react-hook-form` + `zod` para validação com feedback.
- Switch toggles no Menu de Acessibilidade com labels descritivos.

### 3.5 ARIA Labels ✅ IMPLEMENTADO
- `aria-label="Configurações de acessibilidade"` no botão do menu.
- `aria-label="Menu de acessibilidade"` no `PopoverContent` com `role="dialog"`.
- `aria-label` em seções como "Recursos de acessibilidade".
- Prioridade para HTML nativo; ARIA usado apenas quando necessário.

### 3.6 Links Descritivos ✅ IMPLEMENTADO
- Links de navegação usam texto descritivo: "Área da Criança", "Área do Responsável", etc.
- Botões com texto claro: "Entrar", "Acessar Plataforma", "Meu Painel", "Sair".
- Nenhum uso de "clique aqui".

---

## 4. Conteúdo e Mídia

### 4.1 Textos Simples ✅ IMPLEMENTADO
- Linguagem clara e acolhedora em todas as páginas.
- Modo **Simplificado** disponível no Menu de Acessibilidade para reduzir complexidade visual.
- Descrições curtas e objetivas nos cards de áreas.

### 4.2 Legendas/Transcrição ⚠️ PARCIALMENTE IMPLEMENTADO
- **Leitura em Voz Alta (TTS):** Sistema nativo de Text-to-Speech via Web Speech API implementado em `AccessibilityContext.tsx`.
  - Voz em português brasileiro (`pt-BR`), velocidade 0.9, pitch 1.
  - Ativado pelo menu de acessibilidade; leitura ao passar o mouse/tocar nos textos.
  - Controles de iniciar/parar leitura.
- **Legendas em vídeos:** Não aplicável no momento — a plataforma não possui conteúdo em vídeo embarcado. Quando vídeos forem adicionados (ex: Base de Conhecimento), legendas deverão ser incluídas.

### 4.3 Evitar Piscadas ✅ IMPLEMENTADO
- Modo **Sem Animações** disponível, que zera `animation-duration` e `transition-duration` globalmente via classe `.no-animations`.
- Animações existentes são suaves (ex: `animate-float`) e não piscam.
- Nenhum elemento pisca mais de 3 vezes por segundo.

---

## 5. Ferramentas de Validação e Testes

### 5.1 Automático ⚠️ PENDENTE
- **Recomendação:** Executar Lighthouse (Chrome DevTools) e Axe DevTools para atingir nota > 90/100.
- **Status:** Ainda não documentado formalmente. Deve ser realizado antes do lançamento.

### 5.2 Manual ✅ IMPLEMENTADO
- Navegação completa via teclado verificada.
- Skip navigation link funcional.
- Menu de acessibilidade testado com todos os toggles.

### 5.3 Leitor de Tela ⚠️ PENDENTE
- **Recomendação:** Testar com NVDA (Windows) ou VoiceOver (macOS/iOS).
- **Status:** Estrutura ARIA e semântica preparada para compatibilidade. Teste formal pendente.

### 5.4 Simulador de Contraste ⚠️ PENDENTE
- **Recomendação:** Verificar com ferramentas como o Contrast Checker ou Colour Contrast Analyser.
- **Status:** Modo alto contraste implementado. Verificação formal com ferramentas externas pendente.

---

## 6. Declaração de Acessibilidade ✅ IMPLEMENTADO
- Página de **Acessibilidade** (`/acessibilidade`) disponível no rodapé do site.
- Contém: compromisso com inclusão, nível de conformidade WCAG 2.1 AA, recursos implementados, e método de contato para feedback.

---

## Resumo de Conformidade

| Seção | Status |
|-------|--------|
| 2.1 Contraste de Cores | ✅ Conforme |
| 2.2 Cor como indicador | ✅ Conforme |
| 2.3 Fontes Legíveis | ✅ Conforme |
| 2.4 Foco Visível | ✅ Conforme |
| 2.5 Hierarquia de Títulos | ✅ Conforme |
| 3.1 HTML Semântico | ✅ Conforme |
| 3.2 Navegação por Teclado | ✅ Conforme |
| 3.3 Atributos ALT | ✅ Conforme |
| 3.4 Formulários Acessíveis | ✅ Conforme |
| 3.5 ARIA Labels | ✅ Conforme |
| 3.6 Links Descritivos | ✅ Conforme |
| 4.1 Textos Simples | ✅ Conforme |
| 4.2 Legendas/Transcrição | ⚠️ Parcial (TTS ok, vídeos N/A) |
| 4.3 Evitar Piscadas | ✅ Conforme |
| 5.1 Teste Automático | ⚠️ Pendente |
| 5.2 Teste Manual | ✅ Conforme |
| 5.3 Leitor de Tela | ⚠️ Pendente |
| 5.4 Simulador Contraste | ⚠️ Pendente |
| 6.1 Declaração Publicada | ✅ Conforme |

---

*Documento gerado em: Março/2026*
*Projeto: Casa do Autista — Plataforma Digital Inclusiva*
