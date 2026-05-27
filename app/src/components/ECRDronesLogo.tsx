import React from 'react';

interface ECRDronesLogoProps {
  version?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  size?: number;
  height?: number;
  width?: number;
  showTagline?: boolean;
}

export default function ECRDronesLogo({
  version = 1,
  size = 50,
  height,
  width,
  showTagline = true,
}: ECRDronesLogoProps) {
  // Ajuste de dimensões com base na proporção das logos oficiais do manual
  const logoHeight = height || size;
  
  // Logos horizontais (como a versão 3) são proporcionalmente muito mais largas que a altura (cerca de 4.8 vezes)
  const defaultWidth = version === 3 
    ? size * 4.8 
    : version === 4 
      ? size * 2.2 
      : size;

  const logoWidth = width || defaultWidth;

  // Mapeamento dos caminhos das imagens oficiais reais disponibilizadas na pasta public
  const officialImages: Record<number, string> = {
    1: '/ECR_Drones_Versao_1_Principal_Escura.png',
    2: '/ECR_Drones_Versao_2_Principal_Claro.png',
    3: '/ECR_Drones_Versao_3_Horizontal_Completa.png',
    4: '/ECR_Drones_Versao_4_Vertical_Empilhada.png',
    5: '/ECR_Drones_Versao_5_Icone_Isolado.png',
  };

  const src = officialImages[version];

  // Se a versão solicitada possuir uma imagem oficial na pasta public, renderiza a imagem real!
  if (src) {
    return (
      <img
        src={src}
        alt={`ECR Drones Logotipo Oficial - Versão ${version}`}
        style={{
          height: `${logoHeight}px`,
          width: `${logoWidth}px`,
          objectFit: 'contain',
          display: 'block',
        }}
        className="select-none pointer-events-none"
      />
    );
  }

  // ── FALLBACK EM SVG PURO ──
  // Utilizado para as versões monocromáticas (6 e 7) e dourada premium (8) que rodam via vetorização pura

  let gridColor = 'rgba(255, 160, 0, 0.2)'; 
  let armsColor = '#FFA000';
  let wheatColor = '#FFA000';
  let rotorColor = '#FFA000';
  let textColor = '#FFA000';
  let subtextColor = '#FFA000';
  let taglineColor = 'rgba(255, 160, 0, 0.7)';
  let divColor = 'rgba(255, 160, 0, 0.4)';
  let bgStyle: React.CSSProperties = {};

  switch (version) {
    case 6: // Monocromática Preta
      gridColor = '#0F1923';
      armsColor = '#0F1923';
      wheatColor = '#0F1923';
      rotorColor = '#0F1923';
      textColor = '#0F1923';
      subtextColor = '#0F1923';
      taglineColor = '#0F1923';
      divColor = '#0F1923';
      break;

    case 7: // Monocromática Branca
      gridColor = '#FFFFFF';
      armsColor = '#FFFFFF';
      wheatColor = '#FFFFFF';
      rotorColor = '#FFFFFF';
      textColor = '#FFFFFF';
      subtextColor = '#FFFFFF';
      taglineColor = '#FFFFFF';
      divColor = '#FFFFFF';
      break;

    case 8: // Versão Dourada Premium (Para certificados)
      gridColor = 'rgba(255, 160, 0, 0.2)';
      armsColor = '#FFA000';
      wheatColor = '#FFA000';
      rotorColor = '#FFA000';
      textColor = '#FFA000';
      subtextColor = '#FFA000';
      taglineColor = 'rgba(255, 160, 0, 0.7)';
      divColor = 'rgba(255, 160, 0, 0.4)';
      bgStyle = { backgroundColor: '#000000', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255, 160, 0, 0.3)' };
      break;
  }

  const LogoSymbol = () => (
    <svg
      width={logoHeight}
      height={logoHeight}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Grid de base topográfica */}
      <line x1="20" y1="88" x2="80" y2="88" stroke={gridColor} strokeWidth="1.2" />
      <line x1="26" y1="84" x2="74" y2="84" stroke={gridColor} strokeWidth="1.0" />
      <line x1="32" y1="80" x2="68" y2="80" stroke={gridColor} strokeWidth="0.8" />
      <line x1="38" y1="76" x2="62" y2="76" stroke={gridColor} strokeWidth="0.6" />
      <line x1="32" y1="76" x2="20" y2="88" stroke={gridColor} strokeWidth="0.6" strokeDasharray="1 1" />
      <line x1="50" y1="76" x2="50" y2="88" stroke={gridColor} strokeWidth="0.6" strokeDasharray="1 1" />
      <line x1="68" y1="76" x2="80" y2="88" stroke={gridColor} strokeWidth="0.6" strokeDasharray="1 1" />

      {/* Braços do drone */}
      <path d="M26 24L74 72M74 24L26 72" stroke={armsColor} strokeWidth="4" strokeLinecap="round" />

      {/* Hélices / Rotor */}
      <circle cx="26" cy="24" r="8" stroke={rotorColor} strokeWidth="1.5" strokeDasharray="4 2" />
      <circle cx="26" cy="24" r="2.5" fill={armsColor} />
      <circle cx="74" cy="24" r="8" stroke={rotorColor} strokeWidth="1.5" strokeDasharray="4 2" />
      <circle cx="74" cy="24" r="2.5" fill={armsColor} />
      <circle cx="26" cy="72" r="8" stroke={rotorColor} strokeWidth="1.5" strokeDasharray="4 2" />
      <circle cx="26" cy="72" r="2.5" fill={armsColor} />
      <circle cx="74" cy="72" r="8" stroke={rotorColor} strokeWidth="1.5" strokeDasharray="4 2" />
      <circle cx="74" cy="72" r="2.5" fill={armsColor} />

      {/* Hastes */}
      <circle cx="26" cy="24" r="4" stroke={armsColor} strokeWidth="1" />
      <circle cx="74" cy="24" r="4" stroke={armsColor} strokeWidth="1" />
      <circle cx="26" cy="72" r="4" stroke={armsColor} strokeWidth="1" />
      <circle cx="74" cy="72" r="4" stroke={armsColor} strokeWidth="1" />

      {/* Corpo Central: Espiga de trigo estilizada */}
      <line x1="50" y1="28" x2="50" y2="70" stroke={wheatColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 22 C47 26 47 30 50 34 C53 30 53 26 50 22 Z" fill={wheatColor} />
      <path d="M50 32 C43 32 41 38 49 42 C49 38 46 34 50 32 Z" fill={wheatColor} />
      <path d="M50 32 C57 32 59 38 51 42 C51 38 54 34 50 32 Z" fill={wheatColor} />
      <path d="M50 40 C41 40 39 47 49 51 C49 47 45 42 50 40 Z" fill={wheatColor} />
      <path d="M50 40 C59 40 61 47 51 51 C51 47 55 42 50 40 Z" fill={wheatColor} />
      <path d="M50 48 C39 48 37 56 49 60 C49 56 44 50 50 48 Z" fill={wheatColor} />
      <path d="M50 48 C61 48 63 56 51 60 C51 56 56 50 50 48 Z" fill={wheatColor} />
      <path d="M50 56 C37 56 35 65 49 69 C49 65 43 58 50 56 Z" fill={wheatColor} />
      <path d="M50 56 C63 56 65 65 51 69 C51 65 57 58 50 56 Z" fill={wheatColor} />
    </svg>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', ...bgStyle }}>
      <LogoSymbol />
      {/* Barra de Divisão */}
      <div style={{ width: '1px', height: `${logoHeight * 0.8}px`, backgroundColor: divColor }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Wordmark ECR DRONES */}
        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span style={{
            fontFamily: 'var(--font-exo-2), sans-serif',
            fontWeight: 900,
            fontSize: `${logoHeight * 0.6}px`,
            color: textColor,
            letterSpacing: '-1px'
          }}>ECR</span>
          <span style={{
            fontFamily: 'var(--font-exo-2), sans-serif',
            fontWeight: 500,
            fontSize: `${logoHeight * 0.38}px`,
            color: subtextColor,
            letterSpacing: '4px',
            marginLeft: '8px',
            textTransform: 'uppercase'
          }}>Drones</span>
        </div>
        
        {/* Tagline */}
        {showTagline && (
          <span style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            fontSize: `${logoHeight * 0.16}px`,
            color: taglineColor,
            marginTop: '4px',
            letterSpacing: '0.5px'
          }}>
            Escola de Capacitação Rural
          </span>
        )}
      </div>
    </div>
  );
}
