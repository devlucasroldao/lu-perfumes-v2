import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import { supabase } from '../lib/supabase';
import Head from 'next/head';

const linhas = ['Todos', 'feminino', 'masculino', 'kids', 'baby'];
const marcas = ['Todos', 'O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'];
const tipos = ['Todos', 'floral', 'amadeirado', 'citrico', 'doce', 'frutal'];

const linhaEmojis = { feminino: '👩', masculino: '👨', kids: '👧', baby: '👶', Todos: '✨' };
const tipoEmojis = { floral: '🌸', amadeirado: '🌲', citrico: '🍋', doce: '🍬', frutal: '🍓', Todos: '✨' };

export default function Catalogo() {
  const router = useRouter();
  const [sacola, setSacola] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroLinha, setFiltroLinha] = useState('Todos');
  const [filtroMarca, setFiltroMarca] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [sidebarAberta, setSidebarAberta] = useState(true);

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
    buscarProdutos();
  }, []);

  useEffect(() => {
    if (router.query.linha) setFiltroLinha(router.query.linha);
    if (router.query.marca) setFiltroMarca(router.query.marca);
    if (router.query.tipo) setFiltroTipo(router.query.tipo);
    if (router.query.busca) setBusca(router.query.busca);
  }, [router.query]);

  const buscarProdutos = async () => {
    setCarregando(true);
    const { data } = await supabase.from('produtos').select('*').eq('ativo', true);
    if (data) setProdutos(data);
    setCarregando(false);
  };

  const addSacola = (produto) => {
    setSacola(prev => {
      const nova = [...prev, produto];
      localStorage.setItem('sacola', JSON.stringify(nova));
      return nova;
    });
  };

  const produtosFiltrados = produtos.filter(p => {
    const matchLinha = filtroLinha === 'Todos' || p.linha === filtroLinha;
    const matchMarca = filtroMarca === 'Todos' || p.marca === filtroMarca;
    const matchTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.marca.toLowerCase().includes(busca.toLowerCase());
    return matchLinha && matchMarca && matchTipo && matchBusca;
  });

  const limparFiltros = () => {
    setFiltroLinha('Todos');
    setFiltroMarca('Todos');
    setFiltroTipo('Todos');
    setBusca('');
  };

  const temFiltroAtivo = filtroLinha !== 'Todos' || filtroMarca !== 'Todos' || filtroTipo !== 'Todos' || busca !== '';

  return (
    <div style={styles.page}>
      <Head>
        <title>Catálogo — Lu Perfumes & Presentes</title>
        <meta name="description" content="Explore nosso catálogo completo de perfumes e cosméticos. Filtre por linha, marca e tipo." />
      </Head>

      <Navbar sacolaCount={sacola.length} />

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitulo} className="animate-fade delay-1">Catálogo 🌸</h1>
          <p style={styles.heroSubtitulo} className="animate-fade delay-2">Encontre o perfume ou cosmético perfeito pra você</p>
          <div style={styles.buscaWrapper} className="animate-fade delay-3">
            <span style={styles.buscaIcone}>🔍</span>
            <input
              style={styles.buscaInput}
              placeholder="Buscar produto ou marca..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            {busca && <button style={styles.buscaLimpar} onClick={() => setBusca('')}>✕</button>}
          </div>
        </div>
      </section>

      {/* Chips rápidos */}
      <div style={styles.chipsBar}>
        <div style={styles.chipsScroll}>
          {linhas.map(l => (
            <button
              key={l}
              style={{ ...styles.chip, background: filtroLinha === l ? 'var(--verde)' : '#fff', color: filtroLinha === l ? '#fff' : 'var(--texto)', border: filtroLinha === l ? '2px solid var(--verde)' : '2px solid #eee' }}
              onClick={() => setFiltroLinha(l)}
              className="btn-hover"
            >
              {linhaEmojis[l] || '•'} {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
          <div style={styles.chipDivisor} />
          {marcas.map(m => (
            <button
              key={m}
              style={{ ...styles.chip, background: filtroMarca === m ? 'var(--rosa)' : '#fff', color: filtroMarca === m ? '#fff' : 'var(--texto)', border: filtroMarca === m ? '2px solid var(--rosa)' : '2px solid #eee' }}
              onClick={() => setFiltroMarca(m)}
              className="btn-hover"
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <main style={styles.main}>
        <div style={styles.layout}>

          {/* Sidebar */}
          <aside style={{ ...styles.sidebar, display: sidebarAberta ? 'flex' : 'none' }}>
            <div style={styles.sidebarCard}>
              <div style={styles.sidebarHeader}>
                <h3 style={styles.sidebarTitulo}>Filtros</h3>
                {temFiltroAtivo && (
                  <button style={styles.limparBtn} onClick={limparFiltros}>Limpar tudo</button>
                )}
              </div>

              <div style={styles.filtroGrupo}>
                <h4 style={styles.filtroLabel}>Por Linha</h4>
                <div style={styles.filtroOpcoes}>
                  {linhas.map(l => (
                    <button
                      key={l}
                      style={{ ...styles.filtroBtn, background: filtroLinha === l ? 'var(--verde)' : 'transparent', color: filtroLinha === l ? '#fff' : 'var(--texto)' }}
                      onClick={() => setFiltroLinha(l)}
                    >
                      {linhaEmojis[l]} {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.filtroDivisor} />

              <div style={styles.filtroGrupo}>
                <h4 style={styles.filtroLabel}>Por Marca</h4>
                <div style={styles.filtroOpcoes}>
                  {marcas.map(m => (
                    <button
                      key={m}
                      style={{ ...styles.filtroBtn, background: filtroMarca === m ? 'var(--rosa)' : 'transparent', color: filtroMarca === m ? '#fff' : 'var(--texto)' }}
                      onClick={() => setFiltroMarca(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.filtroDivisor} />

              <div style={styles.filtroGrupo}>
                <h4 style={styles.filtroLabel}>Por Tipo</h4>
                <div style={styles.filtroOpcoes}>
                  {tipos.map(t => (
                    <button
                      key={t}
                      style={{ ...styles.filtroBtn, background: filtroTipo === t ? 'var(--verde)' : 'transparent', color: filtroTipo === t ? '#fff' : 'var(--texto)' }}
                      onClick={() => setFiltroTipo(t)}
                    >
                      {tipoEmojis[t] || '•'} {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Conteúdo */}
          <div style={styles.conteudo}>
            <div style={styles.conteudoHeader}>
              <div style={styles.conteudoInfo}>
                <button style={styles.toggleSidebar} onClick={() => setSidebarAberta(!sidebarAberta)}>
                  {sidebarAberta ? '◀ Esconder filtros' : '▶ Mostrar filtros'}
                </button>
                <p style={styles.resultado}>
                  {carregando ? 'Carregando...' : `${produtosFiltrados.length} produto(s) encontrado(s)`}
                </p>
              </div>
              {temFiltroAtivo && (
                <div style={styles.filtrosAtivos}>
                  {filtroLinha !== 'Todos' && <span style={styles.tagAtiva}>{filtroLinha} ✕</span>}
                  {filtroMarca !== 'Todos' && <span style={{ ...styles.tagAtiva, background: 'var(--rosa)' }}>{filtroMarca} ✕</span>}
                  {filtroTipo !== 'Todos' && <span style={styles.tagAtiva}>{filtroTipo} ✕</span>}
                  {busca && <span style={{ ...styles.tagAtiva, background: '#888' }}>"{busca}" ✕</span>}
                </div>
              )}
            </div>

            {carregando ? (
              <div style={styles.grid}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                    <div className="skeleton" style={{ height: 240 }} />
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="skeleton" style={{ height: 12, width: '60%' }} />
                      <div className="skeleton" style={{ height: 16, width: '80%' }} />
                      <div className="skeleton" style={{ height: 12, width: '90%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div style={styles.vazio} className="animate-scale">
                <span style={styles.vazioEmoji}>😕</span>
                <h3 style={styles.vazioTitulo}>Nenhum produto encontrado</h3>
                <p style={styles.vazioTexto}>Tente outros filtros ou limpe a busca</p>
                <button style={styles.limparBtn2} onClick={limparFiltros}>Limpar filtros</button>
              </div>
            ) : (
              <div style={styles.grid}>
                {produtosFiltrados.map((p, i) => (
                  <div key={p.id} className={`animate-fade delay-${Math.min(i + 1, 5)}`}>
                    <ProdutoCard produto={p} onAddSacola={addSacola} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, var(--rosa) 0%, #c99190 100%)', padding: '48px 24px' },
  heroContent: { maxWidth: 700, margin: '0 auto', textAlign: 'center', color: '#fff' },
  heroTitulo: { fontSize: 36, fontWeight: 800, marginBottom: 8 },
  heroSubtitulo: { fontSize: 16, opacity: 0.9, marginBottom: 24 },
  buscaWrapper: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 50, padding: '0 20px', gap: 8, maxWidth: 480, margin: '0 auto', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
  buscaIcone: { fontSize: 16, flexShrink: 0 },
  buscaInput: { flex: 1, border: 'none', padding: '14px 0', fontSize: 15, outline: 'none', fontFamily: 'inherit', color: 'var(--texto)', background: 'transparent' },
  buscaLimpar: { background: 'none', border: 'none', color: '#aaa', fontSize: 14, cursor: 'pointer', padding: 4 },
  chipsBar: { background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '12px 0' },
  chipsScroll: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center' },
  chip: { padding: '7px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  chipDivisor: { width: 1, height: 24, background: '#eee', flexShrink: 0, margin: '0 4px' },
  main: { maxWidth: 1200, margin: '32px auto', padding: '0 24px' },
  layout: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' },
  sidebar: { flexDirection: 'column', position: 'sticky', top: 80 },
  sidebarCard: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sidebarTitulo: { fontSize: 16, fontWeight: 700, color: 'var(--texto)' },
  limparBtn: { background: 'none', border: 'none', color: 'var(--rosa)', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  filtroGrupo: { marginBottom: 4 },
  filtroLabel: { fontSize: 11, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 },
  filtroOpcoes: { display: 'flex', flexDirection: 'column', gap: 2 },
  filtroBtn: { textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' },
  filtroDivisor: { height: 1, background: '#f0f0f0', margin: '16px 0' },
  conteudo: { flex: 1 },
  conteudoHeader: { marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  conteudoInfo: { display: 'flex', alignItems: 'center', gap: 16 },
  toggleSidebar: { background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#888', cursor: 'pointer', fontWeight: 600 },
  resultado: { fontSize: 13, color: '#aaa' },
  filtrosAtivos: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tagAtiva: { background: 'var(--verde)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
  vazio: { textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  vazioEmoji: { fontSize: 48, display: 'block', marginBottom: 12 },
  vazioTitulo: { fontSize: 18, fontWeight: 700, color: 'var(--texto)', marginBottom: 8 },
  vazioTexto: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  limparBtn2: { background: 'var(--rosa)', color: '#fff', padding: '10px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
};