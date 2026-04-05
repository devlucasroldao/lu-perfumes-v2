import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Head from 'next/head';

export default function Favoritos() {
  const [sacola, setSacola] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user || null;
      setUsuario(user);
      if (user) buscarFavoritos(user.id);
      else setCarregando(false);
    });
  }, []);

  const buscarFavoritos = async (userId) => {
    setCarregando(true);
    const { data } = await supabase.from('favoritos').select('*, produtos(*)').eq('user_id', userId);
    if (data) setFavoritos(data.map(f => f.produtos).filter(Boolean));
    setCarregando(false);
  };

  const addSacola = (produto) => {
    setSacola(prev => {
      const nova = [...prev, produto];
      localStorage.setItem('sacola', JSON.stringify(nova));
      return nova;
    });
  };

  const adicionarTudoNaSacola = () => {
    setSacola(prev => {
      const nova = [...prev, ...favoritos];
      localStorage.setItem('sacola', JSON.stringify(nova));
      return nova;
    });
  };

  return (
    <div style={styles.page}>
      <Head>
        <title>Meus Favoritos — Lu Perfumes & Presentes</title>
        <meta name="description" content="Seus produtos favoritos salvos para consultar quando quiser." />
      </Head>

      <Navbar sacolaCount={sacola.length} />

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.titulo}>Meus Favoritos ♡</h1>
            <p style={styles.subtitulo}>
              {!usuario ? 'Faça login para ver seus favoritos' : carregando ? 'Carregando...' : `${favoritos.length} ${favoritos.length === 1 ? 'produto favoritado' : 'produtos favoritados'}`}
            </p>
          </div>
          {usuario && favoritos.length > 0 && (
            <button style={styles.btnAddTodos} onClick={adicionarTudoNaSacola}>🛍️ Adicionar tudo na sacola</button>
          )}
        </div>

        {!usuario && (
          <div style={styles.estado}>
            <div style={styles.estadoIcone}>🔐</div>
            <h2 style={styles.estadoTitulo}>Entre na sua conta</h2>
            <p style={styles.estadoTexto}>Faça login para salvar seus produtos favoritos e acessá-los de qualquer lugar!</p>
            <div style={styles.estadoBotoes}>
              <Link href="/catalogo" style={styles.btnEntrar}>Ver Catálogo 🌸</Link>
            </div>
          </div>
        )}

        {usuario && carregando && (
          <div style={styles.estado}>
            <div style={styles.estadoIcone}>🌸</div>
            <p style={styles.estadoTexto}>Buscando seus favoritos...</p>
          </div>
        )}

        {usuario && !carregando && favoritos.length === 0 && (
          <div style={styles.estado}>
            <div style={styles.estadoIcone}>♡</div>
            <h2 style={styles.estadoTitulo}>Nenhum favorito ainda</h2>
            <p style={styles.estadoTexto}>Explore o catálogo e clique no coração dos produtos que você ama para salvá-los aqui!</p>
            <div style={styles.estadoBotoes}>
              <Link href="/catalogo" style={styles.btnEntrar}>Ver Catálogo 🌸</Link>
              <Link href="/kits" style={styles.btnCatalogo}>Ver Kits 🎁</Link>
            </div>
          </div>
        )}

        {usuario && !carregando && favoritos.length > 0 && (
          <>
            <div style={styles.grid}>
              {favoritos.map(p => <ProdutoCard key={p.id} produto={p} onAddSacola={addSacola} />)}
            </div>
            <div style={styles.banner}>
              <span style={styles.bannerEmoji}>🎁</span>
              <div style={styles.bannerTexto}>
                <h3 style={styles.bannerTitulo}>Gostou de vários produtos?</h3>
                <p style={styles.bannerDesc}>Adicione tudo na sacola e mande a lista pro WhatsApp da Lu de uma vez!</p>
              </div>
              <div style={styles.bannerBotoes}>
                <button style={styles.btnAddTodosBanner} onClick={adicionarTudoNaSacola}>🛍️ Adicionar tudo</button>
                <Link href="/sacola" style={styles.btnVerSacola}>Ver sacola →</Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  main: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 },
  titulo: { fontSize: 32, fontWeight: 800, color: 'var(--texto)' },
  subtitulo: { fontSize: 16, color: '#aaa', marginTop: 4 },
  btnAddTodos: { background: 'var(--rosa)', color: '#fff', padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
  estado: { background: '#fff', borderRadius: 24, padding: '80px 40px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 480, margin: '0 auto' },
  estadoIcone: { fontSize: 64, marginBottom: 16 },
  estadoTitulo: { fontSize: 24, fontWeight: 700, color: 'var(--texto)', marginBottom: 8 },
  estadoTexto: { fontSize: 15, color: '#888', lineHeight: 1.6, marginBottom: 32 },
  estadoBotoes: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  btnEntrar: { background: 'var(--rosa)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnCatalogo: { background: 'transparent', color: 'var(--verde)', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid var(--verde)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24, marginBottom: 48 },
  banner: { background: '#fff', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', flexWrap: 'wrap' },
  bannerEmoji: { fontSize: 48, flexShrink: 0 },
  bannerTexto: { flex: 1 },
  bannerTitulo: { fontSize: 18, fontWeight: 800, color: 'var(--texto)', marginBottom: 4 },
  bannerDesc: { fontSize: 14, color: '#888', lineHeight: 1.5 },
  bannerBotoes: { display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 },
  btnAddTodosBanner: { background: 'var(--rosa)', color: '#fff', padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
  btnVerSacola: { color: 'var(--verde)', fontWeight: 700, fontSize: 14 },
};