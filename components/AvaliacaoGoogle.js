export default function AvaliacaoGoogle() {
  const linkAvaliar = 'https://search.google.com/local/writereview?placeid=ChIJpfOJXYx9I5QRsqW9wyzbKac';
  const linkVerAvaliacoes = 'https://www.google.com/maps/place/Lu+Perfumes+%26+Presentes/@-29.5495891,-49.8947045,19z';

  return (
    <section style={styles.section}>
      <div style={styles.container} className="animate-fade">
        <div style={styles.esquerda}>
          <div style={styles.googleIcone}>
            <svg viewBox="0 0 24 24" style={{ width: 40, height: 40 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <div>
            <h2 style={styles.titulo}>Avalie a Lu no Google! ⭐</h2>
            <p style={styles.subtitulo}>Sua opinião ajuda outras pessoas a encontrar a Lu e faz toda a diferença pro negócio dela!</p>
            <div style={styles.estrelas}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={styles.estrela}>⭐</span>
              ))}
              <span style={styles.estrelasTexto}>Seja o próximo a avaliar!</span>
            </div>
          </div>
        </div>

        <div style={styles.direita}>
          <a href={linkAvaliar} target="_blank" rel="noopener noreferrer" style={styles.btnAvaliar} className="btn-hover">
            ⭐ Avaliar agora
          </a>
          <a href={linkVerAvaliacoes} target="_blank" rel="noopener noreferrer" style={styles.btnVer} className="btn-hover">
            Ver avaliações →
          </a>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: { background: '#fff', padding: '48px 24px', borderTop: '1px solid #f0f0f0' },
  container: { maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap' },
  esquerda: { display: 'flex', gap: 20, alignItems: 'flex-start', flex: 1 },
  googleIcone: { background: '#f5f5f5', borderRadius: 16, padding: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 22, fontWeight: 800, color: 'var(--texto)', marginBottom: 8 },
  subtitulo: { fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 12, maxWidth: 480 },
  estrelas: { display: 'flex', alignItems: 'center', gap: 4 },
  estrela: { fontSize: 20 },
  estrelasTexto: { fontSize: 13, color: '#aaa', marginLeft: 8, fontWeight: 500 },
  direita: { display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 },
  btnAvaliar: { background: 'var(--verde)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, textAlign: 'center', whiteSpace: 'nowrap' },
  btnVer: { background: 'transparent', color: 'var(--verde)', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, textAlign: 'center', border: '2px solid var(--verde)', whiteSpace: 'nowrap' },
};