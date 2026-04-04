import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

export default function Navbar({ sacolaCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [linhaOpen, setLinhaOpen] = useState(false);
  const [marcaOpen, setMarcaOpen] = useState(false);
  const [tipoOpen, setTipoOpen] = useState(false);
  const [usuarioOpen, setUsuarioOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });
    const fecharTodos = () => {
      setLinhaOpen(false);
      setMarcaOpen(false);
      setTipoOpen(false);
      setUsuarioOpen(false);
    };
    document.addEventListener('click', fecharTodos);
    return () => {
      listener.subscription.unsubscribe();
      document.removeEventListener('click', fecharTodos);
    };
  }, []);

  const sair = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  return (
    <>
      <nav style={styles.nav} onClick={e => e.stopPropagation()}>
        <div style={styles.container} className="nav-container">

          <Link href="/" style={styles.logo} className="nav-logo">
            🌸 Lu Perfumes & Presentes
          </Link>

          {/* Links desktop */}
          <div style={styles.links} className="nav-links">
            <div style={styles.dropdown}>
              <span style={styles.link} onClick={() => { setLinhaOpen(!linhaOpen); setMarcaOpen(false); setTipoOpen(false); setUsuarioOpen(false); }}>Por Linha ▾</span>
              {linhaOpen && (
                <div style={styles.dropMenu}>
                  {['feminino','masculino','kids','baby'].map(l => (
                    <Link key={l} href={`/catalogo?linha=${l}`} style={styles.dropItem} onClick={() => setLinhaOpen(false)}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.dropdown}>
              <span style={styles.link} onClick={() => { setMarcaOpen(!marcaOpen); setLinhaOpen(false); setTipoOpen(false); setUsuarioOpen(false); }}>Por Marca ▾</span>
              {marcaOpen && (
                <div style={styles.dropMenu}>
                  {['O Boticário','Natura','Eudora','Avon','Mary Kay'].map(m => (
                    <Link key={m} href={`/catalogo?marca=${m}`} style={styles.dropItem} onClick={() => setMarcaOpen(false)}>{m}</Link>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.dropdown}>
              <span style={styles.link} onClick={() => { setTipoOpen(!tipoOpen); setLinhaOpen(false); setMarcaOpen(false); setUsuarioOpen(false); }}>Por Tipo ▾</span>
              {tipoOpen && (
                <div style={styles.dropMenu}>
                  {['Floral','Amadeirado','Cítrico','Doce','Frutal'].map(t => (
                    <Link key={t} href={`/catalogo?tipo=${t.toLowerCase()}`} style={styles.dropItem} onClick={() => setTipoOpen(false)}>{t}</Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/kits" style={styles.link}>Kits 🎁</Link>
          </div>

          <div style={styles.acoes}>
            {/* Usuario desktop */}
            <div style={{ ...styles.dropdown }} className="nav-links">
              {usuario ? (
                <>
                  <span style={styles.usuarioBtn} onClick={() => { setUsuarioOpen(!usuarioOpen); setLinhaOpen(false); setMarcaOpen(false); setTipoOpen(false); }}>
                    👤 {usuario.email.split('@')[0]}
                  </span>
                  {usuarioOpen && (
                    <div style={{ ...styles.dropMenu, right: 0, left: 'auto' }}>
                      <Link href="/favoritos" style={styles.dropItem} onClick={() => setUsuarioOpen(false)}>♡ Favoritos</Link>
                      <span style={{ ...styles.dropItem, color: 'var(--rosa)', cursor: 'pointer' }} onClick={() => { sair(); setUsuarioOpen(false); }}>Sair</span>
                    </div>
                  )}
                </>
              ) : (
                <button style={styles.btnLogin} onClick={() => setModalOpen(true)}>Entrar</button>
              )}
            </div>

            <Link href="/sacola" style={styles.sacolaBtn}>
              🛍️
              {sacolaCount > 0 && <span style={styles.badge}>{sacolaCount}</span>}
            </Link>

            {/* Hamburguer mobile */}
            <button
              style={styles.hamburguer}
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-hamburguer"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div style={styles.menuMobile}>
            <Link href="/catalogo?linha=feminino" style={styles.menuItem} onClick={() => setMenuOpen(false)}>👩 Feminino</Link>
            <Link href="/catalogo?linha=masculino" style={styles.menuItem} onClick={() => setMenuOpen(false)}>👨 Masculino</Link>
            <Link href="/catalogo?linha=kids" style={styles.menuItem} onClick={() => setMenuOpen(false)}>👧 Kids</Link>
            <Link href="/catalogo?linha=baby" style={styles.menuItem} onClick={() => setMenuOpen(false)}>👶 Baby</Link>
            <Link href="/kits" style={styles.menuItem} onClick={() => setMenuOpen(false)}>🎁 Kits</Link>
            <Link href="/favoritos" style={styles.menuItem} onClick={() => setMenuOpen(false)}>♡ Favoritos</Link>
            <div style={styles.menuDivisor} />
            {usuario ? (
              <>
                <span style={{ ...styles.menuItem, color: '#888', fontSize: 13 }}>👤 {usuario.email}</span>
                <span style={{ ...styles.menuItem, color: 'var(--rosa)', cursor: 'pointer' }} onClick={() => { sair(); setMenuOpen(false); }}>Sair</span>
              </>
            ) : (
              <span style={{ ...styles.menuItem, color: 'var(--verde)', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setModalOpen(true); setMenuOpen(false); }}>Entrar / Cadastrar</span>
            )}
          </div>
        )}
      </nav>

      {modalOpen && (
        <AuthModal
          onClose={() => setModalOpen(false)}
          onLogin={() => setModalOpen(false)}
        />
      )}

      <style>{`
        @media (min-width: 769px) { .nav-hamburguer { display: none !important; } }
        @media (max-width: 768px) { .nav-links { display: none !important; } }
      `}</style>
    </>
  );
}

const styles = {
  nav: { background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontWeight: 700, fontSize: 18, color: 'var(--verde)', flexShrink: 0 },
  links: { display: 'flex', gap: 32, alignItems: 'center' },
  link: { fontSize: 14, fontWeight: 500, color: 'var(--texto)', cursor: 'pointer', whiteSpace: 'nowrap' },
  dropdown: { position: 'relative' },
  dropMenu: { position: 'absolute', top: '100%', left: 0, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', borderRadius: 8, padding: '8px 0', minWidth: 160, display: 'flex', flexDirection: 'column', zIndex: 200 },
  dropItem: { padding: '10px 16px', fontSize: 14, color: 'var(--texto)' },
  acoes: { display: 'flex', gap: 16, alignItems: 'center' },
  usuarioBtn: { fontSize: 14, fontWeight: 600, color: 'var(--verde)', cursor: 'pointer', whiteSpace: 'nowrap' },
  btnLogin: { background: 'var(--rosa)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' },
  sacolaBtn: { position: 'relative', fontSize: 20 },
  badge: { position: 'absolute', top: -6, right: -8, background: 'var(--rosa)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  hamburguer: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--texto)', padding: '4px 8px' },
  menuMobile: { background: '#fff', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column' },
  menuItem: { padding: '14px 24px', fontSize: 15, color: 'var(--texto)', borderBottom: '1px solid #f5f5f5', fontWeight: 500 },
  menuDivisor: { height: 1, background: '#eee', margin: '4px 0' },
};