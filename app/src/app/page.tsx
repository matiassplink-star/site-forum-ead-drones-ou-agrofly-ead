export default function HomePage() {
  return (
    <main style={{
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
      fontFamily: 'var(--font-outfit, system-ui, sans-serif)',
      color: '#ffffff',
      overflowX: 'hidden',
    }}>

      {/* ── GRID DE FUNDO TECNOLÓGICO ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(46, 125, 50, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(46, 125, 50, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── GLOW VERDE NO TOPO ── */}
      <div style={{
        position: 'fixed',
        top: '-200px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '500px',
        background: 'radial-gradient(ellipse, rgba(46, 125, 50, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── NAVEGAÇÃO ── */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 48px',
          borderBottom: '1px solid rgba(46, 125, 50, 0.2)',
          backdropFilter: 'blur(12px)',
          background: 'rgba(13, 17, 23, 0.8)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #2E7D32, #43A047)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 0 20px rgba(46, 125, 50, 0.4)',
            }}>🚁</div>
            <span style={{
              fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #ffffff, #A5D6A7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>ECR Drones</span>
          </div>

          {/* Links nav */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {['Cursos', 'Comunidade', 'Lives', 'Planos'].map((item) => (
              <a key={item} href="#" style={{
                color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                fontSize: '15px', fontWeight: 500,
                transition: 'color 0.2s',
              }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#A5D6A7')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >{item}</a>
            ))}
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="#" style={{
              color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
              fontSize: '14px', fontWeight: 500, padding: '8px 16px',
            }}>Entrar</a>
            <a href="#" style={{
              background: 'linear-gradient(135deg, #FF8F00, #FFB300)',
              color: '#0d1117', textDecoration: 'none',
              fontSize: '14px', fontWeight: 700, padding: '10px 22px',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(255, 143, 0, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 143, 0, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 143, 0, 0.3)'
              }}
            >Começar Grátis</a>
          </div>
        </nav>

        {/* ── SEÇÃO HERO ── */}
        <section style={{
          textAlign: 'center',
          padding: '120px 48px 80px',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(46, 125, 50, 0.15)',
            border: '1px solid rgba(46, 125, 50, 0.4)',
            borderRadius: '50px', padding: '6px 18px', marginBottom: '32px',
            fontSize: '13px', color: '#A5D6A7', fontWeight: 600,
          }}>
            🌾 Plataforma #1 em Drones Agrícolas do Brasil
          </div>

          {/* Título principal */}
          <h1 style={{
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: '-2px', marginBottom: '24px',
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Domine a tecnologia<br />
            <span style={{
              background: 'linear-gradient(90deg, #43A047, #A5D6A7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>de drones agrícolas</span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: '20px', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 48px',
            fontFamily: 'var(--font-inter, system-ui, sans-serif)',
          }}>
            Aprenda mapeamento NDVI, pulverização autônoma e legislação ANAC com quem
            opera no campo. Mais de <strong style={{ color: '#ffffff' }}>500 alunos</strong> já
            transformaram sua carreira.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" style={{
              background: 'linear-gradient(135deg, #FF8F00, #FFB300)',
              color: '#0d1117', textDecoration: 'none',
              fontSize: '17px', fontWeight: 800, padding: '16px 36px',
              borderRadius: '12px',
              boxShadow: '0 0 40px rgba(255, 143, 0, 0.4)',
              transition: 'all 0.2s',
            }}>
              🚀 Começar Gratuitamente
            </a>
            <a href="#" style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff', textDecoration: 'none',
              fontSize: '17px', fontWeight: 600, padding: '16px 36px',
              borderRadius: '12px', transition: 'all 0.2s',
            }}>
              ▶ Ver aula gratuita
            </a>
          </div>

          {/* Social proof */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '40px',
            marginTop: '64px', flexWrap: 'wrap',
          }}>
            {[
              { valor: '500+', label: 'Alunos formados' },
              { valor: '40+', label: 'Aulas em vídeo' },
              { valor: '6', label: 'Módulos especializados' },
              { valor: '4.9★', label: 'Avaliação média' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px', fontWeight: 900,
                  background: 'linear-gradient(90deg, #43A047, #A5D6A7)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{stat.valor}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRILHAS DE CURSOS ── */}
        <section style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: '40px', fontWeight: 800, marginBottom: '12px',
              letterSpacing: '-1px',
            }}>Trilhas de Aprendizagem</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px' }}>
              Do iniciante ao operador profissional certificado
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              {
                emoji: '🎯', tag: 'Gratuito', tagColor: '#43A047',
                title: 'Introdução aos Drones no Agro',
                desc: 'Entenda o cenário, os equipamentos e a legislação básica. Perfeito para quem está começando.',
                aulas: '8 aulas', horas: '3h',
              },
              {
                emoji: '🗺️', tag: 'Premium', tagColor: '#FF8F00',
                title: 'Mapeamento Aéreo e NDVI',
                desc: 'Planejamento de voo, processamento com Pix4D e interpretação de índices de vegetação.',
                aulas: '14 aulas', horas: '6h',
              },
              {
                emoji: '💧', tag: 'Premium', tagColor: '#FF8F00',
                title: 'Pulverização Autônoma Avançada',
                desc: 'Calibração de bicos, tecnologia de aplicação e gestão de drift em lavouras reais.',
                aulas: '18 aulas', horas: '8h',
              },
            ].map((curso) => (
              <div key={curso.title} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '32px',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
                onMouseOver={(e) => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(46, 125, 50, 0.08)'
                  el.style.border = '1px solid rgba(46, 125, 50, 0.3)'
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(255,255,255,0.03)'
                  el.style.border = '1px solid rgba(255,255,255,0.08)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <span style={{ fontSize: '36px' }}>{curso.emoji}</span>
                  <span style={{
                    background: curso.tagColor + '22',
                    color: curso.tagColor,
                    border: `1px solid ${curso.tagColor}44`,
                    borderRadius: '6px', padding: '4px 10px',
                    fontSize: '12px', fontWeight: 700,
                  }}>{curso.tag}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>
                  {curso.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                  {curso.desc}
                </p>
                <div style={{
                  display: 'flex', gap: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px',
                  color: 'rgba(255,255,255,0.4)', fontSize: '13px',
                }}>
                  <span>📹 {curso.aulas}</span>
                  <span>⏱ {curso.horas}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PLANOS ── */}
        <section style={{ padding: '80px 48px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>
              Escolha seu plano
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px' }}>
              Comece gratuitamente. Faça upgrade quando estiver pronto.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Plano Free */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '36px',
            }}>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '8px' }}>PLANO GRATUITO</div>
              <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '4px' }}>R$0</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>para sempre</div>
              {['Acesso às aulas introdutórias', 'Participação no fórum', 'Newsletters semanais', '3 materiais para download'].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '14px', fontSize: '15px', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#43A047' }}>✓</span> {item}
                </div>
              ))}
              <a href="#" style={{
                display: 'block', textAlign: 'center', marginTop: '32px',
                border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff',
                textDecoration: 'none', padding: '14px', borderRadius: '10px',
                fontWeight: 600, fontSize: '15px',
              }}>Criar conta grátis</a>
            </div>

            {/* Plano Premium */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.15), rgba(255, 143, 0, 0.05))',
              border: '1px solid rgba(255, 143, 0, 0.4)',
              borderRadius: '16px', padding: '36px', position: 'relative',
              boxShadow: '0 0 40px rgba(255, 143, 0, 0.1)',
            }}>
              <div style={{
                position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #FF8F00, #FFB300)',
                color: '#0d1117', fontSize: '12px', fontWeight: 800,
                padding: '4px 16px', borderRadius: '50px',
              }}>MAIS POPULAR</div>
              <div style={{ fontSize: '14px', color: '#FFB300', fontWeight: 600, marginBottom: '8px' }}>PLANO PREMIUM</div>
              <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '4px' }}>R$47</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>por mês</div>
              {[
                'Tudo do plano gratuito',
                'Todos os cursos avançados',
                'Lives exclusivas mensais',
                'Downloads ilimitados',
                'Certificado de conclusão',
                'Suporte direto com instrutores',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '14px', fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ color: '#FF8F00' }}>✓</span> {item}
                </div>
              ))}
              <a href="#" style={{
                display: 'block', textAlign: 'center', marginTop: '32px',
                background: 'linear-gradient(135deg, #FF8F00, #FFB300)',
                color: '#0d1117', textDecoration: 'none', padding: '14px',
                borderRadius: '10px', fontWeight: 800, fontSize: '15px',
                boxShadow: '0 0 25px rgba(255, 143, 0, 0.35)',
              }}>Assinar Premium →</a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '40px 48px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '14px',
        }}>
          © 2026 ECR Drones. Tecnologia aeroespacial ao alcance do produtor.
          <br />
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>
            🚧 Em desenvolvimento — Fase 2 em breve
          </span>
        </footer>

      </div>
    </main>
  )
}
