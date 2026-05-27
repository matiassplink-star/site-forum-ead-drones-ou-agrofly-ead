# Design System: ECR Drones

## Visual Theme
O tema visual é **Preto Terra** escuro e profundo, simbolizando a terra fértil no anoitecer e o solo sob monitoramento. O contraste é feito com tons orgânicos de verde floresta, o azul tecnológico da telemetria aérea e o âmbar dourado do trigo e do sol do meio-dia.

## Color Palette (OKLCH & HEX)

Utilizamos a regra de proporção visual **60% Verde / 30% Azul / 10% Âmbar** para criar harmonia e evitar poluição visual.

### Neutras e Fundo
- **Preto Terra (Fundo Principal)**:
  - HEX: `#0F1923`
  - OKLCH: `oklch(15.2% 0.02 245)` (Tintado levemente com o azul da marca para evitar cinza puro ou preto absoluto)
- **Cinza Suporte (Textos Secundários)**:
  - HEX: `#546E7A`
  - OKLCH: `oklch(50.3% 0.035 240)`
- **Branco Puro (Textos Principais)**:
  - HEX: `#FFFFFF`
  - OKLCH: `oklch(100% 0 0)`

### Cores de Marca
- **Deep Forest Green (60% - Base Orgânica e Card Backgrounds)**:
  - HEX: `#1A3C1F`
  - OKLCH: `oklch(28.4% 0.04 142)`
- **Campo Green (Destaques Verdes e Ícones do Agro)**:
  - HEX: `#2E7D32`
  - OKLCH: `oklch(51.2% 0.12 142)`
- **Technical Sky Blue (30% - Telemetria, Links de Dados e Guias)**:
  - HEX: `#1565C0`
  - OKLCH: `oklch(47.5% 0.18 260)`
- **Preto Blue-Tech (Variante Escura do Azul)**:
  - HEX: `#0D47A1`
  - OKLCH: `oklch(33.1% 0.19 265)`
- **Amber Gold (10% - Acentos de Conversão, ROI e CTAs Principais)**:
  - HEX: `#F57F17`
  - OKLCH: `oklch(67.2% 0.20 70)`
- **Dorado Sol (Acentos Secundários de Luz)**:
  - HEX: `#FFA000`
  - OKLCH: `oklch(76.1% 0.19 75)`

## Typography

Utilizamos tipografia moderna com alto contraste de peso para destacar a precisão técnica e a firmeza da marca.

- **Headings (Títulos)**:
  - Família: `var(--font-exo-2)`, `var(--font-sans)` (Google Fonts: **Exo 2** em pesos 700 e 900)
  - Características: Tecnológica, geométrica, robusta.
- **Body & Controls (Corpo e Controles)**:
  - Família: `var(--font-inter)`, `var(--font-sans)` (Google Fonts: **Inter** em pesos 400, 600, 700)
  - Características: Neutra, legibilidade superior em tamanhos pequenos e telas de dispositivos móveis.

## Spacing & Rhythm
- Espaçamentos baseados em múltiplos de `4px` (`0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`, `5rem`).
- Seções grandes contêm `py-20` (ou `80px`) para respiro imponente.
- Margens internas dos cards variam entre `p-6` (mobile) e `p-10` (desktop) para dar sensação premium de editorial técnico.

## Key Component Styles

### Botões (Buttons)
- **CTA Principal (Conversão de Lucro / Venda)**: Background `#F57F17` (Amber Gold), texto `#0F1923` (Preto Terra), peso `font-black`, sombra difusa dourada `shadow-[0_0_25px_rgba(245,127,23,0.3)]` com micro-transição no hover (`hover:scale-[1.02] hover:bg-[#FFA000] transition-all duration-300`).
- **CTA Secundário (Capacitação / Informação)**: Background `#1A3C1F` (Deep Forest), borda `border-brand-green/30`, texto `#FFFFFF`, transições suaves no hover.

### Cards e Contêineres
- Sem cantos excessivamente redondos. Usar `rounded-2xl` (`1rem`) ou `rounded-3xl` (`1.5rem`).
- Borda fina e translúcida: `border border-brand-green/10` ou `border-brand-blue-sky/20`.
- Fundos: Tintados em `bg-[#1A3C1F]/40` combinados com `backdrop-blur-md` para um visual tecnológico translúcido e elegante.
