import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function ProdutoCard({ produto, onAddSacola }) {
  const [favorito, setFavorito] = useState(false);
  const [adicionado, setAdicionado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [hover, setHover] = useState(false);

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
    <Link
      href={`/produto/${produto.id}`}
      style={{ ...styles.card, transform: hover ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hover ? '0 12px 32px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.07)' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Imagem */}
      <div style={styles.imagemWrapper}>
        <img
          src={produto.foto || 'https://placehold.co/400x400?text=Sem+foto'}
          alt={produto.nome}
          style={styles.imagem}
        />

        {/* Overlay ao hover */}
        <div style={{ ...styles.overlay, opacity: hover ? 1 : 0 }}>
          <span style={styles.overlayTexto}>Ver detalhes</span>
        </div>

        {/* Badge destaque */}
        {produto.destaque && (
          <div style={styles.badge}>⭐ Destaque</div>
        )}

        {/* Botão favorito */}
        <button
          style={{ ...styles.favorito, background: favorito ? 'var(--rosa)' : '#fff', color: favorito ? '#fff' : '#ccc' }}
          onClick={toggleFavorito}
          title={usuario ? 'Favoritar' : 'Faça login para favoritar'}
        >
          {favorito ? '♥' : '♡'}
        </button>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <div style={styles.topo}>
          <span style={styles.marca}>{produto.marca}</span>
          <span style={styles.linha}>{produto.linha}</span>
        </div>

        <h3 style={styles.nome}>{produto.nome}</h3>
        <p style={styles.descricao}>{produto.descricao}</p>

        <div style={styles.rodape}>
          <span style={styles.semPreco}>💬 Consulte o preço</span>
          <button
            style={{ ...styles.botao, background: adicionado ? 'var(--verde)' : 'var(--rosa)', transform: adicionado ? 'scale(0.97)' : 'scale(1)' }}
            onClick={handleAdd}
          >
            {adicionado ? '✓' : '+'}
          </button>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s ease', textDecoration: 'none' },
  imagemWrapper: { position: 'relative', overflow: 'hidden' },
  imagem: { width: '100%', height: 240, objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(120, 130, 91, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s ease' },
  overlayTexto: { color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 1 },
  badge: { position: 'absolute', top: 12, left: 12, background: 'var(--rosa)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  favorito: { position: 'absolute', top: 12, right: 12, border: 'none', borderRadius: '50%', width: 34, height: 34, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: { padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  topo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  marca: { fontSize: 11, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1.5 },
  linha: { fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, background: '#f5f5f5', padding: '3px 8px', borderRadius: 20 },
  nome: { fontSize: 16, fontWeight: 700, color: 'var(--texto)', lineHeight: 1.3 },
  descricao: { fontSize: 13, color: '#999', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  rodape: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 12, borderTop: '1px solid #f0f0f0' },
  semPreco: { fontSize: 12, color: '#aaa', fontWeight: 500 },
  botao: { width: 36, height: 36, borderRadius: '50%', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};