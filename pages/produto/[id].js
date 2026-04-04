import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function DetalhesProduto() {
  const router = useRouter();
  const { id } = router.query;
  const [produto, setProduto] = useState(null);
  const [sacola, setSacola] = useState([]);
  const [adicionado, setAdicionado] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user || null;
      setUsuario(user);
      if (user && id) verificarFavorito(user.id);
    });
  }, []);

  useEffect(() => {
    if (id) {
      buscarProduto();
    }
  }, [id]);

  const buscarProduto = async () => {
    setCarregando(true);
    const { data } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setProduto(data);
      buscarRelacionados(data.linha, data.marca, data.id);
    }
    setCarregando(false);
  };

  const buscarRelacionados = async (linha, marca, produtoId) => {
    const { data } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .or(`linha.eq.${linha},marca.eq.${marca}`)
      .neq('id', produtoId)
      .limit(4);
    if (data) setProdutosRelacionados(data);
  };

  const verificarFavorito = async (userId) => {
    const { data } = await supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', userId)
      .eq('produto_id', id)
      .single();
    setFavorito(!!data);
  };

  const toggleFavorito = async () => {
    if (!usuario) return;
    if (favorito) {
      await supabase.from('favoritos').delete()
        .eq('user_id', usuario.id)
        .eq('produto_id', id);
      setFavorito(false);
    } else {
      await supabase.from('favoritos').insert([{ user_id: usuario.id, produto_id: Number(id) }]);
      setFavorito(true);
    }
  };

  const addSacola = () => {
    if (!produto) return;
    setSacola(prev => {
      const nova = [...prev, produto];
      localStorage.setItem('sacola', JSON.stringify(nova));
      return nova;
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  const enviarWhatsApp = () => {
    const numero = '5551999999999'; // ← número da Lu
    const mensagem = `Olá Lu! 🌸 Tenho interesse no produto *${produto.nome}* da ${produto.marca}. Poderia me passar mais informações?`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  if (carregando) return (
    <div>
      <Navbar sacolaCount={sacola.length} />
      <div style={styles.loading}>Carregando produto... 🌸</div>
    </div>
  );

  if (!produto) return (
    <div>
      <Navbar sacolaCount={sacola.length} />
      <div style={styles.loading}>
        <p>Produto não encontrado 😕</p>
        <Link href="/catalogo" style={styles.btnVoltar}>← Ver Catálogo</Link>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar sacolaCount={sacola.length} />

      <main style={styles.main}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link href="/" style={styles.breadItem}>Home</Link>
          <span style={styles.breadSep}>›</span>
          <Link href="/catalogo" style={styles.breadItem}>Catálogo</Link>
          <span style={styles.breadSep}>›</span>
          <span style={{ color: 'var(--texto)' }}>{produto.nome}</span>
        </div>

        {/* Produto principal */}
        <div style={styles.produto}>
          {/* Foto */}
          <div style={styles.fotoWrapper}>
            <img
              src={produto.foto || 'https://placehold.co/600x600?text=Sem+foto'}
              alt={produto.nome}
              style={styles.foto}
            />
            <button
              style={{ ...styles.favoritoBtn, color: favorito ? 'var(--rosa)' : '#ccc' }}
              onClick={toggleFavorito}
              title={usuario ? 'Favoritar' : 'Faça login para favoritar'}
            >
              {favorito ? '♥' : '♡'}
            </button>
          </div>

          {/* Infos */}
          <div style={styles.infos}>
            <div style={styles.tags}>
              <span style={styles.tagMarca}>{produto.marca}</span>
              <span style={styles.tagLinha}>{produto.linha}</span>
              <span style={styles.tagTipo}>{produto.tipo}</span>
            </div>

            <h1 style={styles.nome}>{produto.nome}</h1>
            <p style={styles.descricao}>{produto.descricao}</p>

            <div style={styles.aviso}>
              <span>💬</span>
              <p>Os preços são consultados diretamente com a Lu pelo WhatsApp!</p>
            </div>

            <div style={styles.botoes}>
              <button
                style={{ ...styles.btnSacola, background: adicionado ? 'var(--verde)' : 'var(--rosa)' }}
                onClick={addSacola}
              >
                {adicionado ? '✓ Adicionado à sacola!' : '+ Adicionar à Sacola'}
              </button>
              <button style={styles.btnWhats} onClick={enviarWhatsApp}>
                📲 Consultar preço
              </button>
            </div>

            <Link href="/sacola" style={styles.verSacola}>
              Ver minha sacola {sacola.length > 0 && `(${sacola.length} ${sacola.length === 1 ? 'item' : 'itens'})`} →
            </Link>
          </div>
        </div>

        {/* Produtos relacionados */}
        {produtosRelacionados.length > 0 && (
          <section style={styles.relacionados}>
            <h2 style={styles.relacionadosTitulo}>Você também pode gostar ✨</h2>
            <div style={styles.relacionadosGrid}>
              {produtosRelacionados.map(p => (
                <Link key={p.id} href={`/produto/${p.id}`} style={styles.cardRelacionado}>
                  <img
                    src={p.foto || 'https://placehold.co/300x300?text=Sem+foto'}
                    alt={p.nome}
                    style={styles.cardRelacionadoFoto}
                  />
                  <div style={styles.cardRelacionadoInfo}>
                    <span style={styles.tagMarca}>{p.marca}</span>
                    <p style={styles.cardRelacionadoNome}>{p.nome}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  loading: { textAlign: 'center', padding: '80px 24px', color: '#aaa', fontSize: 16 },
  btnVoltar: { display: 'inline-block', marginTop: 16, background: 'var(--rosa)', color: '#fff', padding: '12px 24px', borderRadius: 50, fontWeight: 700 },
  main: { maxWidth: 1100, margin: '40px auto', padding: '0 24px' },
  breadcrumb: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32, fontSize: 13, color: '#aaa' },
  breadItem: { color: 'var(--verde)', fontWeight: 500 },
  breadSep: { color: '#ccc' },
  produto: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginBottom: 80 },
  fotoWrapper: { position: 'relative' },
  foto: { width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  favoritoBtn: { position: 'absolute', top: 16, right: 16, background: '#fff', border: 'none', borderRadius: '50%', width: 44, height: 44, fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  infos: { display: 'flex', flexDirection: 'column', gap: 20 },
  tags: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tagMarca: { background: 'var(--verde)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  tagLinha: { background: '#f0f0f0', color: '#666', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  tagTipo: { background: '#f0f0f0', color: '#666', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  nome: { fontSize: 32, fontWeight: 800, color: 'var(--texto)', lineHeight: 1.2 },
  descricao: { fontSize: 16, color: '#666', lineHeight: 1.7 },
  aviso: { background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, color: '#888' },
  botoes: { display: 'flex', flexDirection: 'column', gap: 12 },
  btnSacola: { padding: '16px 0', borderRadius: 50, color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', transition: 'background 0.3s', textAlign: 'center' },
  btnWhats: { padding: '16px 0', borderRadius: 50, color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', background: '#25D366', textAlign: 'center' },
  verSacola: { color: 'var(--verde)', fontWeight: 600, fontSize: 14, textAlign: 'center' },
  relacionados: { borderTop: '1px solid #eee', paddingTop: 48 },
  relacionadosTitulo: { fontSize: 22, fontWeight: 700, marginBottom: 24, color: 'var(--texto)' },
  relacionadosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
  cardRelacionado: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' },
  cardRelacionadoFoto: { width: '100%', height: 180, objectFit: 'cover' },
  cardRelacionadoInfo: { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 },
  cardRelacionadoNome: { fontSize: 14, fontWeight: 600, color: 'var(--texto)' },
};