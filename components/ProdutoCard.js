import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function ProdutoCard({ produto, onAddSacola }) {
  const [favorito, setFavorito] = useState(false);
  const [adicionado, setAdicionado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user || null;
      setUsuario(user);
      if (user) verificarFavorito(user.id);
    });
  }, []);

  const verificarFavorito = async (userId) => {
    const { data } = await supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', userId)
      .eq('produto_id', produto.id)
      .single();
    setFavorito(!!data);
  };

  const toggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!usuario) return;
    if (favorito) {
      await supabase.from('favoritos').delete()
        .eq('user_id', usuario.id)
        .eq('produto_id', produto.id);
      setFavorito(false);
    } else {
      await supabase.from('favoritos').insert([{ user_id: usuario.id, produto_id: produto.id }]);
      setFavorito(true);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddSacola(produto);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  };

  return (
    <Link href={`/produto/${produto.id}`} style={styles.card}>
      <div style={styles.imagemWrapper}>
        <img
          src={produto.foto || 'https://placehold.co/400x300?text=Sem+foto'}
          alt={produto.nome}
          style={styles.imagem}
        />
        <button
          style={{ ...styles.favorito, color: favorito ? 'var(--rosa)' : '#ccc' }}
          onClick={toggleFavorito}
          title={usuario ? 'Favoritar' : 'Faça login para favoritar'}
        >
          {favorito ? '♥' : '♡'}
        </button>
      </div>
      <div style={styles.info}>
        <span style={styles.marca}>{produto.marca}</span>
        <h3 style={styles.nome}>{produto.nome}</h3>
        <p style={styles.descricao}>{produto.descricao}</p>
        <button
          style={{ ...styles.botao, background: adicionado ? 'var(--verde)' : 'var(--rosa)' }}
          onClick={handleAdd}
        >
          {adicionado ? '✓ Adicionado!' : '+ Adicionar à Sacola'}
        </button>
      </div>
    </Link>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s' },
  imagemWrapper: { position: 'relative' },
  imagem: { width: '100%', height: 220, objectFit: 'cover' },
  favorito: { position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
  info: { padding: 16, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  marca: { fontSize: 11, fontWeight: 600, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1 },
  nome: { fontSize: 15, fontWeight: 600, color: 'var(--texto)' },
  descricao: { fontSize: 13, color: '#888', lineHeight: 1.5, flex: 1 },
  botao: { marginTop: 8, padding: '10px 0', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, transition: 'background 0.3s', border: 'none', cursor: 'pointer' },
};