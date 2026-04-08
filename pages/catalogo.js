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
  const [filtrosMobileAbertos, setFiltrosMobileAbertos] = useState(false);
  const [abaMobile, setAbaMobile] = useState('linha');

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
  const totalFiltros = (filtroLinha !== 'Todos' ? 1 : 0) + (filtroMarca !== 'Todos' ? 1 : 0) + (filtroTipo !== 'Todos' ? 1 : 0);

  return (
    <div style={styles.page}>
      <Head>
        <title>Catálogo — Lu Perfumes & Presentes</title>
        <meta name="description" content="Explore nosso catálogo completo de perfumes e cosméticos. Filtre por linha, marca e tipo." />
      </Head>

      <Navbar sacolaCount={sacola.length} />

      {/* Header mobile-first */}
      <div style={styles.headerSection}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.titulo}>Catálogo 🌸</h1>
            <p style={styles.subtitulo}>{carregando ? 'Carregando...' : `${produtosFiltrados.length} produtos`}</p>
          </div>
          {temFiltroAtivo && (
            <button style={styles.btnLimparTopo} onClick={limparFiltros}>
              ✕ Limpar
            </button>
          )}
        </div>

        {/* Barra de busca */}
        <div style={styles.buscaWrapper}>
          <span style={styles.buscaIcone}>🔍</span>
          <input
            style={styles.buscaInput}
            placeholder="Buscar produto ou marca..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          {busca && <button style={styles.buscaLimpar} onClick={() => setBusca('')}>✕</button>}
        </div>

        {/* Botão filtros mobile */}
        <button
          style={{ ...styles.btnFiltrosMobile, background: filtrosMobileAbertos ? 'var(--verde)' : '#fff', color: filtrosMobileAbertos ? '#fff' : 'var(--texto)' }}
          onClick={() => setFiltrosMobileAbertos(!filtrosMobileAbertos)}
        >
          <span>⚙️ Filtros</span>
          {totalFiltros > 0 && <span style={styles.filtroBadge}>{totalFiltros}</span>}
          <span style={{ marginLeft: 'auto' }}>{filtrosMobileAbertos ? '▲' : '▼'}</span>
        </button>

        {/* Painel de filtros mobile */}
        {filtrosMobileAbertos && (
          <div style={styles.filtrosPainel} className="animate-slide-down">
            {/* Abas de filtro */}
            <div style={styles.filtrosAbas}>
              {[
                { key: 'linha', label: 'Linha' },
                { key: 'marca', label: 'Marca' },
                { key: 'tipo', label: 'Tipo' },
              ].map(aba => (
                <button
                  key={aba.key}
                  style={{ ...styles.filtroAba, background: abaMobile === aba.key ? 'var(--verde)' : 'transparent', color: abaMobile === aba.key ? '#fff' : 'var(--texto)' }}
                  onClick={() => setAbaMobile(aba.key)}
                >
                  {aba.label}
                  {aba.key === 'linha' && filtroLinha !== 'Todos' && <span style={styles.abaIndicador} />}
                  {aba.key === 'marca' && filtroMarca !== 'Todos' && <span style={styles.abaIndicador} />}
                  {aba.key === 'tipo' && filtroTipo !== 'Todos' && <span style={styles.abaIndicador} />}
                </button>
              ))}
            </div>

            {/* Opções da aba selecionada */}
            <div style={styles.filtrosOpcoes}>
              {abaMobile === 'linha' && linhas.map(l => (
                <button
                  key={l}
                  style={{ ...styles.opcaoBtn, background: filtroLinha === l ? 'var(--verde)' : '#f5f5f5', color: filtroLinha === l ? '#fff' : 'var(--texto)' }}
                  onClick={() => { setFiltroLinha(l); setFiltrosMobileAbertos(false); }}
                >
                  {linhaEmojis[l]} {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
              {abaMobile === 'marca' && marcas.map(m => (
                <button
                  key={m}
                  style={{ ...styles.opcaoBtn, background: filtroMarca === m ? 'var(--rosa)' : '#f5f5f5', color: filtroMarca === m ? '#fff' : 'var(--texto)' }}
                  onClick={() => { setFiltroMarca(m); setFiltrosMobileAbertos(false); }}
                >
                  {m}
                </button>
              ))}
              {abaMobile === 'tipo' && tipos.map(t => (
                <button
                  key={t}
                  style={{ ...styles.opcaoBtn, background: filtroTipo === t ? 'var(--verde)' : '#f5f5f5', color: filtroTipo === t ? '#fff' : 'var(--texto)' }}
                  onClick={() => { setFiltroTipo(t); setFiltrosMobileAbertos(false); }}
                >
                  {tipoEmojis[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags dos filtros ativos */}
        {temFiltroAtivo && (
          <div style={styles.filtrosAtivos}>
            {filtroLinha !== 'Todos' && (
              <span style={styles.tagAtiva} onClick={() => setFiltroLinha('Todos')}>
                {linhaEmojis[filtroLinha]} {filtroLinha} ✕
              </span>
            )}
            {filtroMarca !== 'Todos' && (
              <span style={{ ...styles.tagAtiva, background: 'var(--rosa)' }} onClick={() => setFiltroMarca('Todos')}>
                {filtroMarca} ✕
              </span>
            )}
            {filtroTipo !== 'Todos' && (
              <span style={styles.tagAtiva} onClick={() => setFiltroTipo('Todos')}>
                {tipoEmojis[filtroTipo]} {filtroTipo} ✕
              </span>
            )}
            {busca && (
              <span style={{ ...styles.tagAtiva, background: '#888' }} onClick={() => setBusca('')}>
                "{busca}" ✕
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid de produtos */}
      <main style={styles.main}>
        {carregando ? (
          <div style={styles.grid}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton" style={{ height: 10, width: '60%' }} />
                  <div className="skeleton" style={{ height: 14, width: '80%' }} />
                  <div className="skeleton" style={{ height: 10, width: '90%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div style={styles.vazio} className="animate-scale">
            <span style={styles.vazioEmoji}>😕</span>
            <h3 style={styles.vazioTitulo}>Nenhum produto encontrado</h3>
            <p style={styles.vazioTexto}>Tente outros filtros ou limpe a busca</p>
            <button style={styles.btnLimparVazio} onClick={limparFiltros}>Limpar filtros</button>
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
      </main>

      <style>{`
        @media (min-width: 769px) {
          .btn-filtros-mobile { display: none !important; }
          .filtros-painel-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  headerSection: { background: '#fff', padding: '16px 16px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 64, zIndex: 90, display: 'flex', flexDirection: 'column', gap: 12 },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  titulo: { fontSize: 22, fontWeight: 800, color: 'var(--texto)' },
  subtitulo: { fontSize: 13, color: '#aaa', marginTop: 2 },
  btnLimparTopo: { background: 'none', border: '1px solid #ddd', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: 'var(--rosa)', cursor: 'pointer', fontWeight: 600, flexShrink: 0 },
  buscaWrapper: { display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: 50, padding: '0 16px', gap: 8 },
  buscaIcone: { fontSize: 14, flexShrink: 0 },
  buscaInput: { flex: 1, border: 'none', background: 'transparent', padding: '11px 0', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: 'var(--texto)' },
  buscaLimpar: { background: 'none', border: 'none', color: '#aaa', fontSize: 14, cursor: 'pointer', padding: 4 },
  btnFiltrosMobile: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 12, border: '2px solid #eee', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%' },
  filtroBadge: { background: 'var(--rosa)', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  filtrosPainel: { background: '#fafafa', borderRadius: 12, padding: 16, border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 4 },
  filtrosAbas: { display: 'flex', gap: 8 },
  filtroAba: { flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' },
  abaIndicador: { position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--rosa)', display: 'block' },
  filtrosOpcoes: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  opcaoBtn: { padding: '8px 16px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  filtrosAtivos: { display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 12 },
  tagAtiva: { background: 'var(--verde)', color: '#fff', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  main: { maxWidth: 1200, margin: '20px auto', padding: '0 12px 60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 },
  vazio: { textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', margin: '0 4px' },
  vazioEmoji: { fontSize: 48, display: 'block', marginBottom: 12 },
  vazioTitulo: { fontSize: 18, fontWeight: 700, color: 'var(--texto)', marginBottom: 8 },
  vazioTexto: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  btnLimparVazio: { background: 'var(--rosa)', color: '#fff', padding: '10px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
};