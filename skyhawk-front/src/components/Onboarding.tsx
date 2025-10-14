import React, { useEffect, useState } from 'react';

const steps = [
  {
    title: 'Selecionar um Ponto no Mapa',
    description: 'Clique em qualquer lugar do mapa para definir a localização de interesse. O sistema irá carregar dados disponíveis para esse ponto.'
  },
  {
    title: 'Inserir Coordenadas (opcional)',
    description: 'Você pode inserir latitude e longitude manualmente na barra superior se preferir precisão numérica.'
  },
  {
    title: 'Visualizar Séries Temporais',
    description: 'Após selecionar o ponto, abra a análise para ver séries temporais (NDVI, por exemplo) e indicadores principais.'
  },
  {
    title: 'Filtrar e Exportar',
    description: 'Use os filtros disponíveis para escolher satélite, variável e período. Você pode exportar os metadados quando necessário.'
  }
];

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000,
  padding: '20px'
};

const cardStyles: React.CSSProperties = {
  width: '880px',
  maxWidth: '100%',
  background: 'linear-gradient(180deg, #0f1724 0%, #121826 100%)',
  color: 'white',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 12px 40px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02)'
};

const footerButton: React.CSSProperties = {
  background: 'linear-gradient(135deg, #007cbf 0%, #005a8b 100%)',
  border: 'none',
  color: 'white',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 700
};

const Onboarding: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem('skyhawk:onboardingSeen');
      if (!seen) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const close = () => {
    if (dontShow) {
      try { localStorage.setItem('skyhawk:onboardingSeen', 'true'); } catch (e) { }
    }
    setVisible(false);
  };

  if (!visible) return null;

  const step = steps[index];

  return (
    <div style={overlayStyles} role="dialog" aria-modal="true">
      <div style={cardStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Bem-vindo ao SkyHawk</h2>
            <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.72)' }}>Um breve passo a passo para começar a usar o sistema.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13 }}>
              <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)} style={{ marginRight: 8 }} />
              Não mostrar novamente
            </label>
            <button onClick={close} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Fechar</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 120px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ padding: 8, borderRadius: 8, background: i === index ? 'linear-gradient(135deg,#007cbf,#005a8b)' : 'rgba(255,255,255,0.02)', color: i === index ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIndex(i)}>
                <div style={{ fontSize: 13 }}>{i + 1}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>{step.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>{step.description}</p>

            <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: index === 0 ? 'rgba(255,255,255,0.3)' : 'white', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>Anterior</button>
              <button onClick={() => setIndex(Math.min(steps.length - 1, index + 1))} disabled={index === steps.length - 1} style={footerButton}>Próximo</button>
              <div style={{ marginLeft: 'auto' }}>
                <button onClick={close} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'white', cursor: 'pointer' }}>Concluir</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
