import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const filtrosRapidos = [
  { label: '✨ Todos', value: null, tipo: null },
  { label: '👩 Feminino', value: 'feminino', tipo: 'linha' },
  { label: '👨 Masculino', value: 'masculino', tipo: 'linha' },
  { label: '👶 Baby', value: 'baby', tipo: 'linha' },
  { label: '👧 Kids', value: 'kids', tipo: 'linha' },
  { label: '🌸 Floral', value: 'floral', tipo: 'tipo' },
  { label: '🌲 Amadeirado', value: 'amadeirado', tipo: 'tipo' },
  { label: '🍋 Cítrico', value: 'citrico', tipo: 'tipo' },
  { label: '🍬 Doce', value: 'doce', tipo: 'tipo' },
  { label: '🍓 Frutal', value: 'frutal', tipo: 'tipo' },
];

const marcas = ['O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'];

export default function Home() {
  const [sacola, setSacola] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [filtroTipoAtivo, setFiltroTipoAtivo] = useState(null);
  const [marcaAtiva, setMarcaAtiva] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
    buscarDados();
  }, []);

  useEffect(() => {
    filtrar();
  }, [filtroAtivo, filtroTipoAtivo, marcaAtiva, todosProdutos]);

  const buscarDados = async () => {
    setCarregando(true);
    const { data: destaquesData } = await supabase
      .from('produtos')
      .select('*')
      .eq('destaque', true)
      .eq('ativo', true)
      .limit(4);

    const { data: produtosData } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true);

    if (destaquesData) setDestaques(destaquesData);
    if (produtosData) {
      setTodosProdutos(produtosData);
      setProdutosFiltrados(produtosData);
    }
    setCarregando(false);
  };

  const filtrar = () => {
    let resultado = [...todosProdutos];
    if (filtroAtivo && filtroTipoAtivo === 'linha') {
      resultado = resultado.filter(p => p.linha === filtroAtivo);
    }
    if (filtroAtivo && filtroTipoAtivo === 'tipo') {
      resultado = resultado.filter(p => p.tipo === filtroAtivo);
    }
    if (marcaAtiva) {
      resultado = resultado.filter(p => p.marca === marcaAtiva);
    }
    setProdutosFiltrados(resultado);
  };

  const aplicarFiltro = (filtro) => {
    if (filtro.value === null) {
      setFiltroAtivo(null);
      setFiltroTipoAtivo(null);
      setMarcaAtiva(null);
    } else {
      setFiltroAtivo(filtro.value);
      setFiltroTipoAtivo(filtro.tipo);
    }
  };

  const addSacola = (produto) => {
    setSacola(prev => {
      const nova = [...prev, produto];
      localStorage.setItem('sacola', JSON.stringify(nova));
      return nova;
    });
  };

  const temFiltroAtivo = filtroAtivo || marcaAtiva;

  return (
    <div style={styles.page}>
      <Navbar sacolaCount={sacola.length} />

      {/* Banner */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <p style={styles.bannerSub}>✨ Encontre o presente perfeito</p>
          <h1 style={styles.bannerTitulo}>Lu Perfumes & Presentes</h1>
          <p style={styles.bannerDesc}>Perfumes, cosméticos e kits especiais para toda ocasião</p>
          <div style={styles.bannerBotoes}>
            <Link href="/catalogo" style={styles.btnPrimario}>Ver Catálogo completo</Link>
            <Link href="/kits" style={styles.btnSecundario}>Montar Kit 🎁</Link>
          </div>
        </div>
      </section>

      {/* Chips de filtro rápido */}
      <section style={styles.filtrosSection}>
        <div style={styles.filtrosWrapper}>
          <div style={styles.filtrosScroll}>
            {filtrosRapidos.map(f => (
              <button
                key={f.label}
                style={{
                  ...styles.chip,
                  background: filtroAtivo === f.value && filtroTipoAtivo === f.tipo ? 'var(--verde)' : '#fff',
                  color: filtroAtivo === f.value && filtroTipoAtivo === f.tipo ? '#fff' : 'var(--texto)',
                  border: filtroAtivo === f.value && filtroTipoAtivo === f.tipo ? '2px solid var(--verde)' : '2px solid #eee',
                }}
                onClick={() => aplicarFiltro(f)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filtro por marca */}
          <div style={styles.filtrosScroll}>
            {marcas.map(m => (
              <button
                key={m}
                style={{
                  ...styles.chip,
                  background: marcaAtiva === m ? 'var(--rosa)' : '#fff',
                  color: marcaAtiva === m ? '#fff' : 'var(--texto)',
                  border: marcaAtiva === m ? '2px solid var(--rosa)' : '2px solid #eee',
                }}
                onClick={() => setMarcaAtiva(marcaAtiva === m ? null : m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques — só mostra quando não tem filtro */}
      {!temFiltroAtivo && destaques.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitulo}>Destaques da semana ⭐</h2>
            <Link href="/catalogo" style={styles.verTodos}>Ver todos →</Link>
          </div>
          <div style={styles.grid}>
            {destaques.map(p => (
              <ProdutoCard key={p.id} produto={p} onAddSacola={addSacola} />
            ))}
          </div>
        </section>
      )}

      {/* Produtos filtrados */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitulo}>
            {temFiltroAtivo ? `${produtosFiltrados.length} produto(s) encontrado(s)` : 'Todos os produtos 🌸'}
          </h2>
          {temFiltroAtivo && (
            <button
              style={styles.limparFiltros}
              onClick={() => { setFiltroAtivo(null); setFiltroTipoAtivo(null); setMarcaAtiva(null); }}
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {carregando ? (
          <p style={{ color: '#aaa' }}>Carregando produtos... 🌸</p>
        ) : produtosFiltrados.length === 0 ? (
          <div style={styles.vazio}>
            <p style={styles.vazioTexto}>Nenhum produto encontrado 😕</p>
            <button style={styles.limparFiltros} onClick={() => { setFiltroAtivo(null); setFiltroTipoAtivo(null); setMarcaAtiva(null); }}>
              Limpar filtros
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {produtosFiltrados.map(p => (
              <ProdutoCard key={p.id} produto={p} onAddSacola={addSacola} />
            ))}
          </div>
        )}
      </section>

      {/* Banner kits */}
      {!temFiltroAtivo && (
        <section style={styles.bannerKits}>
          <div style={styles.bannerKitsContent}>
            <span style={styles.bannerKitsEmoji}>🎁</span>
            <div>
              <h2 style={styles.bannerKitsTitulo}>Precisa de um presente especial?</h2>
              <p style={styles.bannerKitsTexto}>A Lu monta kits personalizados pra qualquer ocasião!</p>
            </div>
            <Link href="/kits" style={styles.bannerKitsBtn}>Ver Kits</Link>
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  banner: { background: 'linear-gradient(135deg, var(--verde) 0%, #9aab7a 100%)', color: '#fff', padding: '80px 24px', textAlign: 'center' },
  bannerContent: { maxWidth: 600, margin: '0 auto' },
  bannerSub: { fontSize: 14, opacity: 0.9, marginBottom: 12 },
  bannerTitulo: { fontSize: 42, fontWeight: 800, marginBottom: 12 },
  bannerDesc: { fontSize: 16, opacity: 0.85, marginBottom: 32 },
  bannerBotoes: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimario: { background: 'var(--rosa)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnSecundario: { background: 'transparent', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid #fff' },
  filtrosSection: { background: '#fff', padding: '16px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 64, zIndex: 90 },
  filtrosWrapper: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 },
  filtrosScroll: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
  chip: { padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  section: { maxWidth: 1200, margin: '48px auto', padding: '0 24px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sectionTitulo: { fontSize: 22, fontWeight: 700, color: 'var(--texto)' },
  verTodos: { color: 'var(--verde)', fontWeight: 600, fontSize: 14 },
  limparFiltros: { background: 'none', border: '1px solid #ddd', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: '#999', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 },
  vazio: { textAlign: 'center', padding: '60px 0' },
  vazioTexto: { fontSize: 18, color: '#aaa', marginBottom: 16 },
  bannerKits: { background: '#fff', margin: '48px 24px', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' },
  bannerKitsContent: { padding: '32px 40px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  bannerKitsEmoji: { fontSize: 48, flexShrink: 0 },
  bannerKitsTitulo: { fontSize: 20, fontWeight: 800, color: 'var(--texto)', marginBottom: 4 },
  bannerKitsTexto: { fontSize: 14, color: '#888' },
  bannerKitsBtn: { marginLeft: 'auto', background: 'var(--rosa)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15, flexShrink: 0 },
};