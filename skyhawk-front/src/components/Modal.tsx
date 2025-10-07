import type React from 'react';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Satellite, MapPin, TrendingUp, BarChart3, X, Loader2 } from 'lucide-react';
import type { TimeSeriesData } from '../services/skyHawkService';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TimeSeriesData | null;
  coordinates: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
}

// Estilos do modal com efeito glassmórfico refinado
const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(15px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    animation: 'fadeIn 0.4s ease-out',
  },
  container: {
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.85) 50%, rgba(26, 26, 26, 0.95) 100%)',
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '950px',
    width: '95%',
    maxHeight: '92vh',
    overflow: 'auto',
    color: 'white',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    boxShadow: `
      0 32px 64px -12px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  section: {
    background: 'linear-gradient(135deg, rgba(42, 42, 42, 0.7) 0%, rgba(26, 26, 26, 0.9) 100%)',
    backdropFilter: 'blur(15px)',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    marginBottom: '24px',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  kpiCard: {
    background: 'linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
  }
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data, coordinates, loading, error }) => {
  // Adicionar CSS para animação do loading
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!isOpen) return null;

  // Preparar dados para o gráfico
  const chartData = data?.data.timeline.map((date, index) => ({
    date: new Date(date).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    value: data.data.values[index] || 0,
    fullDate: date
  })) || [];

  // Calcular estatísticas
  const validValues = data?.data.values.filter(v => v !== null && !Number.isNaN(v)) || [];
  const stats = validValues.length > 0 ? {
    max: Math.max(...validValues),
    min: Math.min(...validValues),
    avg: validValues.reduce((a, b) => a + b, 0) / validValues.length
  } : null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        
        {/* Header com design refinado */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '20px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #007cbf 0%, #005a8b 100%)',
              padding: '12px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0, 124, 191, 0.3)',
            }}>
              <Satellite size={28} color="white" />
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '28px', 
                background: 'linear-gradient(135deg, #007cbf 0%, #00a8ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                letterSpacing: '-0.5px'
              }}>
                Análise Satelital
              </h2>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: '500'
              }}>
                Dados de Monitoramento por Satélite
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#cccccc',
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.4)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading refinado */}
        {loading && (
          <div style={{
            ...modalStyles.section,
            textAlign: 'center',
            padding: '80px 40px',
            background: 'linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(26, 26, 26, 0.95) 100%)',
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '24px' 
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #007cbf 0%, #005a8b 100%)',
                padding: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0, 124, 191, 0.3)'
              }}>
                <Loader2 size={48} color="white" className="spin" />
              </div>
              <div>
                <div style={{ 
                  color: 'white', 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  marginBottom: '8px' 
                }}>
                  Processando Dados Satelitais
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '14px',
                  maxWidth: '300px',
                  lineHeight: '1.5'
                }}>
                  Conectando com os serviços do INPE e processando a série temporal NDVI...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error refinado */}
        {error && (
          <div style={{
            ...modalStyles.section,
            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(26, 26, 26, 0.9) 100%)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            boxShadow: '0 8px 32px rgba(220, 53, 69, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                background: 'rgba(220, 53, 69, 0.2)',
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <X size={24} color="#ff6b6b" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '18px', 
                  color: '#ff6b6b',
                  fontWeight: '600'
                }}>
                  Erro na Consulta de Dados
                </h3>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  lineHeight: '1.6',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
                <div style={{ 
                  marginTop: '12px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <strong>Dica:</strong> Verifique se o backend está rodando em http://localhost:5000
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {data?.success && (
          <>
            {/* Coordenadas com design refinado */}
            {coordinates && (
              <div style={modalStyles.section}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #007cbf 0%, #005a8b 100%)',
                    padding: '8px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MapPin size={18} color="white" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#007cbf', fontWeight: '600' }}>
                    Localização Selecionada
                  </h3>
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    flex: '1',
                    minWidth: '200px'
                  }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                      Latitude
                    </div>
                    <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#007cbf', fontWeight: 'bold' }}>
                      {coordinates.lat.toFixed(6)}°
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    flex: '1',
                    minWidth: '200px'
                  }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                      Longitude
                    </div>
                    <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#007cbf', fontWeight: 'bold' }}>
                      {coordinates.lng.toFixed(6)}°
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KPIs - Estatísticas minimalistas */}
            {stats && (
              <div style={modalStyles.section}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    background: 'rgba(42, 42, 42, 0.8)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <BarChart3 size={20} color="#007cbf" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'white', fontWeight: '500' }}>
                    Indicadores Principais
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{
                    background: 'rgba(42, 42, 42, 0.6)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    textAlign: 'center' as const,
                  }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Valor Máximo
                    </div>
                    <div style={{ color: 'white', fontSize: '28px', fontWeight: '600', fontFamily: 'monospace', lineHeight: '1' }}>
                      {stats.max.toFixed(4)}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', marginTop: '4px' }}>
                      NDVI Peak
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(42, 42, 42, 0.6)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    textAlign: 'center' as const,
                  }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Valor Mínimo
                    </div>
                    <div style={{ color: 'white', fontSize: '28px', fontWeight: '600', fontFamily: 'monospace', lineHeight: '1' }}>
                      {stats.min.toFixed(4)}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', marginTop: '4px' }}>
                      NDVI Low
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(42, 42, 42, 0.6)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    textAlign: 'center' as const,
                  }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Valor Médio
                    </div>
                    <div style={{ color: 'white', fontSize: '28px', fontWeight: '600', fontFamily: 'monospace', lineHeight: '1' }}>
                      {stats.avg.toFixed(4)}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', marginTop: '4px' }}>
                      NDVI Average
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gráfico refinado */}
            <div style={modalStyles.section}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #007cbf 0%, #005a8b 100%)',
                  padding: '8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TrendingUp size={20} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', color: '#007cbf', fontWeight: '600' }}>
                    Série Temporal - {data.data.metadata.variable}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Satélite: {data.data.metadata.collection} • Resolução: {data.data.metadata.resolution}
                  </p>
                </div>
              </div>
              <div style={{ 
                height: '450px', 
                width: '100%',
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 42, 42, 0.6) 100%)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid 
                      strokeDasharray="2 4" 
                      stroke="rgba(255, 255, 255, 0.08)" 
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255, 255, 255, 0.6)" 
                      fontSize={12}
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                      tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                    />
                    <YAxis 
                      stroke="rgba(255, 255, 255, 0.6)" 
                      fontSize={12}
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                      tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                      domain={['dataMin - 0.02', 'dataMax + 0.02']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(26, 26, 26, 0.98)',
                        border: '1px solid rgba(0, 124, 191, 0.3)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                        fontSize: '13px'
                      }}
                      labelStyle={{ color: '#007cbf', fontWeight: 'bold' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="url(#gradient)" 
                      strokeWidth={4}
                      dot={{ fill: '#007cbf', strokeWidth: 3, r: 5, stroke: 'white' }}
                      activeDot={{ 
                        r: 8, 
                        stroke: '#007cbf', 
                        strokeWidth: 3, 
                        fill: 'white'
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#007cbf" />
                        <stop offset="50%" stopColor="#00a8ff" />
                        <stop offset="100%" stopColor="#007cbf" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Footer refinado */}
        <div style={{ 
          marginTop: '40px', 
          paddingTop: '24px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.12)', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
            Dados fornecidos pela API SkyHawk • {chartData.length} pontos de dados
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #007cbf 0%, #005a8b 100%)',
              border: '1px solid rgba(0, 124, 191, 0.3)',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 8px 25px rgba(0, 124, 191, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 124, 191, 0.4)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #0099e6 0%, #0066a3 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 124, 191, 0.3)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #007cbf 0%, #005a8b 100%)';
            }}
          >
            <X size={18} />
            Fechar Análise
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
