import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminGuard({ children }) {
  const [liberado, setLiberado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const ok = sessionStorage.getItem('admin_ok');
    if (ok === 'true') setLiberado(true);
    setCarregando(false);
  }, []);

  const entrar = () => {
    if (senha === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_ok', 'true');
      setLiberado(true);
      setErro(false);
    } else {
      setErro(true);
      setSenha('');
    }
  };

  if (carregando) return null;

  if (!liberado) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.titulo}>🔒 Área Restrita</h1>
          <p style={styles.subtitulo}>Painel administrativo — Lu Perfumes</p>

          {erro && <div style={styles.erro}>Senha incorreta! Tenta de novo.</div>}

          <div style={styles.campo}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && entrar()}
              autoFocus
            />
          </div>

          <button style={styles.btn} onClick={entrar}>
            Entrar no painel
          </button>

          <Link href="/" style={styles.voltar}>← Voltar para o site</Link>
        </div>
      </div>
    );
  }

  return children;
}

const styles = {
  page: { minHeight: '100vh', background: '#F3EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#fff', borderRadius: 20, padding: 48, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 16 },
  titulo: { fontSize: 24, fontWeight: 800, color: '#78825B', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: -8 },
  erro: { background: '#f8d7da', color: '#842029', padding: '10px 14px', borderRadius: 8, fontSize: 13, textAlign: 'center' },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '12px 16px', borderRadius: 10, border: '2px solid #eee', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  btn: { background: '#78825B', color: '#fff', padding: '14px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' },
  voltar: { textAlign: 'center', fontSize: 13, color: '#aaa' },
};