import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function ProdutoCard({ produto, onAddSacola, onLoginRequired }) {
  const [favorito, setFavorito] = useState(false);
  const [adicionado, setAdicionado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [hover, setHover] = useState(false);
  const [toastFavorito, setToastFavorito] = useState(false);

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

    if (!usuario) {
      // Mostra toast pedindo login
      setToastFavorito(true);
      setTimeout(() => setToastFavorito(false), 3000);
      return;
    }

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
    <div style={styles.wrapper}>
      {/* Toast de login para favoritos */}
      {toastFavorito && (
        <div style={styles.toast} className="animate-slide-down">
          <span>🔐 Faça login para favoritar!</span>
          <Link href="/favoritos" style={styles.toastLink}>Entrar</Link>
        </div>
      )}

      <Link
        href={`/produto/${produto.id}`}
        style={{
          ...styles.card,
          transform: hover ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hover ? '0 12px 32px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.07)',
        }}
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
          <div style={{ ...styles.overlay, opacity: hover ? 1 : 0 }}>
            <span style={styles.overlayTexto}>Ver detalhes</span>
          </div>
          {produto.destaque && <div style={styles.badge}>⭐ Destaque</div>}
          <button
            style={{ ...styles.favorito, background: favorito ? 'var(--rosa)' : '#fff', color: favorito ? '#fff' : '#ccc' }}
            onClick={toggleFavorito}
            title={usuario ? 'Favoritar' : 'Faça login para favoritar'}
          >
            {favorito ? '♥' : '♡'}
          </button>
        </div>

        {/* Info — altura fixa para consistência no grid */}
        <div style={styles.info}>
          <div style={styles.topo}>
            <span style={styles.marca}>{produto.marca}</span>
            {produto.categoria && (
              <span style={styles.categoria}>{produto.categoria}</span>
            )}
          </div>
          {/* Nome com altura fixa — 2 linhas */}
          <h3 style={styles.nome}>{produto.nome}</h3>
          {/* Descrição com altura fixa — 2 linhas */}
          <p style={styles.descricao}>{produto.descricao}</p>

          <div style={styles.rodape}>
            <span style={styles.semPreco}>💬 Consulte o preço</span>
            <button
              style={{ ...styles.botao, background: adicionado ? 'var(--verde)' : 'var(--rosa)' }}
              onClick={handleAdd}
            >
              {adicionado ? '✓' : '+'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

const styles = {
  wrapper: { position: 'relative' },
  toast: {
    position: 'absolute',
    top: -48,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#333',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 50,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  toastLink: {
    background: 'var(--rosa)',
    color: '#fff',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    height: '100%', // altura total do card
  },
  imagemWrapper: { position: 'relative', flexShrink: 0 },
  imagem: { width: '100%', height: 220, objectFit: 'cover', display: 'block' },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(120, 130, 91, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s ease' },
  overlayTexto: { color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 1 },
  badge: { position: 'absolute', top: 10, left: 10, background: 'var(--rosa)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  favorito: { position: 'absolute', top: 10, right: 10, border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: {
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1, // ocupa o restante do card
  },
  topo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  marca: { fontSize: 10, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1.5 },
  categoria: { fontSize: 9, background: '#f0f0f0', color: '#888', padding: '2px 8px', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize' },
  nome: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--texto)',
    lineHeight: 1.3,
    // Altura fixa para 2 linhas — garante alinhamento no grid
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '2.6em',
  },
  descricao: {
    fontSize: 12,
    color: '#999',
    lineHeight: 1.5,
    flex: 1,
    // Altura fixa para 2 linhas
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  rodape: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 10, borderTop: '1px solid #f0f0f0' },
  semPreco: { fontSize: 11, color: '#aaa', fontWeight: 500 },
  botao: { width: 32, height: 32, borderRadius: '50%', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};