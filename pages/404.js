import Link from 'next/link';
import Head from 'next/head';

export default function Pagina404() {
  return (
    <div style={styles.page}>
      <Head>
        <title>Página não encontrada — Lu Perfumes & Presentes</title>
      </Head>
      <div style={styles.content}>
        <p style={styles.emoji}>🌸</p>
        <h1 style={styles.titulo}>Ops! Página não encontrada</h1>
        <p style={styles.subtitulo}>
          Parece que esse perfume evaporou... <br />
          A página que você procura não existe!
        </p>

        <div style={styles.botoes}>
          <Link href="/" style={styles.btnPrimario}>← Voltar para a Home</Link>
          <Link href="/catalogo" style={styles.btnSecundario}>Ver Catálogo 🌸</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bege, #F3EFE9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { textAlign: 'center', maxWidth: 480 },
  emoji: { fontSize: 72, marginBottom: 24 },
  titulo: { fontSize: 28, fontWeight: 800, color: 'var(--texto, #3a3a3a)', marginBottom: 16 },
  subtitulo: { fontSize: 16, color: '#888', lineHeight: 1.6, marginBottom: 40 },
  botoes: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimario: { background: 'var(--verde, #78825B)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnSecundario: { background: 'transparent', color: 'var(--verde, #78825B)', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid var(--verde, #78825B)' },
};