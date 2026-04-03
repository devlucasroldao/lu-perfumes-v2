import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onClose, onLogin }) {
  const [modo, setModo] = useState('login'); // 'login' ou 'cadastro'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async () => {
    if (!email || !senha) { setErro('Preenche email e senha!'); return; }
    setCarregando(true);
    setErro('');

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) { setErro('Email ou senha incorretos!'); setCarregando(false); return; }
    } else {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) { setErro('Erro ao cadastrar. Tenta de novo!'); setCarregando(false); return; }
    }

    setCarregando(false);
    onLogin();
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.fechar} onClick={onClose}>✕</button>
        <h2 style={styles.titulo}>🌸 {modo === 'login' ? 'Entrar' : 'Criar conta'}</h2>
        <p style={styles.subtitulo}>
          {modo === 'login' ? 'Para salvar seus favoritos!' : 'É rapidinho, prometo!'}
        </p>

        {erro && <div style={styles.erro}>{erro}</div>}

        <div style={styles.campos}>
          <div style={styles.campo}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        <button style={styles.btnEntrar} onClick={handleSubmit} disabled={carregando}>
          {carregando ? 'Aguarda...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <p style={styles.trocar}>
          {modo === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
          <span style={styles.link} onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro(''); }}>
            {modo === 'login' ? 'Cadastre-se' : 'Entrar'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 400, position: 'relative' },
  fechar: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa' },
  titulo: { fontSize: 24, fontWeight: 800, color: 'var(--texto)', marginBottom: 8 },
  subtitulo: { fontSize: 14, color: '#aaa', marginBottom: 24 },
  erro: { background: '#f8d7da', color: '#842029', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  campos: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '12px 16px', borderRadius: 10, border: '2px solid #eee', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  btnEntrar: { width: '100%', background: 'var(--rosa)', color: '#fff', padding: '14px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' },
  trocar: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#888' },
  link: { color: 'var(--verde)', fontWeight: 600, cursor: 'pointer' },
};