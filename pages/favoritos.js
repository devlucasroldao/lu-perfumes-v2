import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

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
    const { data } = await supabase
      .from('favoritos')
      .select('*, produtos(*)')
      .eq('user_id', userId);
    if (data) setFavoritos(data.map(f => f.produtos));
    setCarregando(false);
  };

  const addSacola = (produto) => {
    setSacola(prev => {
      const nova = [...prev, produto];
      localStorage.setItem('sacola', JSON.stringify(nova));
      return nova;
    });
  };

  return (
    <div>
      <Navbar sacolaCount={sacola.length} />
      <main style={styles.main}>
        <h1 style={styles.titulo}>Meus Favoritos ♡</h1>

        {!usuario ? (
          <div style={styles.vazio}>
            <p style={styles.vaziaTxt}>Você precisa estar logado para ver seus favoritos 😊</p>
            <Link href="/" style={styles.btnVoltar}>← Voltar para a Home</Link>
          </div>
        ) : carregando ? (
          <p style={{ color: '#aaa' }}>Carregando favoritos... 🌸</p>
        ) : favoritos.length === 0 ? (
          <div style={styles.vazio}>
            <p style={styles.vaziaTxt}>Você ainda não favoritou nenhum produto 😊</p>
            <Link href="/catalogo" style={styles.btnVoltar}>Ver Catálogo</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {favoritos.map(p => (
              <ProdutoCard key={p.id} produto={p} onAddSacola={addSacola} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  main: { maxWidth: 1200, margin: '60px auto', padding: '0 24px' },
  titulo: { fontSize: 28, fontWeight: 700, marginBottom: 32, color: 'var(--texto)' },
  vazio: { textAlign: 'center', padding: '80px 0' },
  vaziaTxt: { fontSize: 18, color: '#aaa', marginBottom: 24 },
  btnVoltar: { background: 'var(--rosa)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 },
};