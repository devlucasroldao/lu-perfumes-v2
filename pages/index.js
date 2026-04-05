import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import Head from 'next/head';

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

const stats = [
  { numero: '5+', label: 'Marcas parceiras' },
  { numero: '100+', label: 'Produtos disponíveis' },
  { numero: '⭐', label: 'Atendimento 5 estrelas' },
  { numero: '🎁', label: 'Kits personalizados' },
];

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
      .from('produtos').select('*').eq('destaque', true).eq('ativo', true).limit(4);
    const { data: produtosData } = await supabase
      .from('produtos').select('*').eq('ativo', true);
    if (destaquesData) setDestaques(destaquesData);
    if (produtosData) { setTodosProdutos(produtosData); setProdutosFiltrados(produtosData); }
    setCarregando(false);
  };

  const filtrar = () => {
    let resultado = [...todosProdutos];
    if (filtroAtivo && filtroTipoAtivo === 'linha') resultado = resultado.filter(p => p.linha === filtroAtivo);
    if (filtroAtivo && filtroTipoAtivo === 'tipo') resultado = resultado.filter(p => p.tipo === filtroAtivo);
    if (marcaAtiva) resultado = resultado.filter(p => p.marca === marcaAtiva);
    setProdutosFiltrados(resultado);
  };

  const aplicarFiltro = (filtro) => {
    if (filtro.value === null) { setFiltroAtivo(null); setFiltroTipoAtivo(null); setMarcaAtiva(null); }
    else { setFiltroAtivo(filtro.value); setFiltroTipoAtivo(filtro.tipo); }
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
      <Head>
        <title>Lu Perfumes & Presentes — Arroio do Sal</title>
        <meta name="description" content="Perfumes, cosméticos e kits especiais para toda ocasião. Atendimento personalizado com carinho em Arroio do Sal - RS." />
        <meta name="keywords" content="perfumes, cosméticos, kits presente, Arroio do Sal, O Boticário, Natura, Eudora, Avon, Mary Kay" />
        <meta property="og:title" content="Lu Perfumes & Presentes" />
        <meta property="og:description" content="Perfumes, cosméticos e kits especiais para toda ocasião." />
        <meta property="og:type" content="website" />
      </Head>

      <Navbar sacolaCount={sacola.length} />

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <span style={styles.heroBadge} className="animate-fade delay-1">✨ Bem-vinda à Lu Perfumes</span>
          <h1 style={styles.heroTitulo} className="animate-fade delay-2">
            Perfumes & Presentes<br />
            <span style={styles.heroDestaque}>com muito carinho</span>
          </h1>
          <p style={styles.heroDesc} className="animate-fade delay-3">
            Encontre o perfume perfeito ou monte um kit especial para presentear quem você ama
          </p>
          <div style={styles.heroBotoes} className="animate-fade delay-4">
            <Link href="/catalogo" style={styles.btnPrimario} className="btn-hover">
              🌸 Ver Catálogo
            </Link>
            <Link href="/kits" style={styles.btnSecundario} className="btn-hover">
              🎁 Montar Kit
            </Link>
            <Link href="/sobre" style={styles.btnTerciario} className="btn-hover">
              Sobre a Lu →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsWrapper} className="animate-fade delay-5">
          {stats.map((s, i) => (
            <div key={i} style={styles.statItem}>
              <span style={styles.statNumero}>{s.numero}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
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
                className="btn-hover"
                onClick={() => aplicarFiltro(f)}
              >
                {f.label}
              </button>
            ))}
          </div>
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
                className="btn-hover"
                onClick={() => setMarcaAtiva(marcaAtiva === m ? null : m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {!temFiltroAtivo && destaques.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader} className="animate-fade">
            <div>
              <h2 style={styles.sectionTitulo}>Destaques da semana ⭐</h2>
              <p style={styles.sectionSubtitulo}>Os queridinhos da Lu selecionados especialmente pra você</p>
            </div>
            <Link href="/catalogo" style={styles.verTodos} className="link-hover">Ver todos →</Link>
          </div>
          <div style={styles.grid}>
            {destaques.map((p, i) => (
              <div key={p.id} className={`animate-fade delay-${Math.min(i + 1, 5)}`}>
                <ProdutoCard produto={p} onAddSacola={addSacola} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Marcas */}
      {!temFiltroAtivo && (
        <section style={styles.marcasSection}>
          <div style={styles.marcasContent}>
            <h2 style={styles.marcasTitulo} className="animate-fade">Marcas que trabalhamos 💄</h2>
            <div style={styles.marcasGrid} className="animate-fade delay-2">
              {marcas.map(m => (
                <Link key={m} href={`/catalogo?marca=${m}`} style={styles.marcaCard} className="card-hover">
                  <span style={styles.marcaNome}>{m}</span>
                  <span style={styles.marcaVerMais}>Ver produtos →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produtos */}
      <section style={styles.section}>
        <div style={styles.sectionHeader} className="animate-fade">
          <div>
            <h2 style={styles.sectionTitulo}>
              {temFiltroAtivo ? `${produtosFiltrados.length} produto(s) encontrado(s)` : 'Todos os produtos 🌸'}
            </h2>
            {!temFiltroAtivo && <p style={styles.sectionSubtitulo}>Navegue pelo nosso catálogo completo</p>}
          </div>
          {temFiltroAtivo && (
            <button style={styles.limparFiltros} onClick={() => { setFiltroAtivo(null); setFiltroTipoAtivo(null); setMarcaAtiva(null); }}>
              ✕ Limpar filtros
            </button>
          )}
        </div>
        {carregando ? (
          <div style={styles.grid}>
            {[1,2,3,4].map(i => (
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
            <p style={styles.vazioTexto}>Nenhum produto encontrado 😕</p>
            <button style={styles.limparFiltros} onClick={() => { setFiltroAtivo(null); setFiltroTipoAtivo(null); setMarcaAtiva(null); }}>
              Limpar filtros
            </button>
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
      </section>

      {/* Banner kits */}
      {!temFiltroAtivo && (
        <section style={styles.bannerKits} className="animate-fade">
          <div style={styles.bannerKitsContent}>
            <div style={styles.bannerKitsTexto}>
              <span style={styles.bannerKitsEmoji}>🎁</span>
              <div>
                <h2 style={styles.bannerKitsTitulo}>Precisa de um presente especial?</h2>
                <p style={styles.bannerKitsDesc}>A Lu monta kits personalizados pra qualquer ocasião com muito carinho!</p>
              </div>
            </div>
            <div style={styles.bannerKitsBotoes}>
              <Link href="/kits" style={styles.bannerKitsBtnPrimario} className="btn-hover">🎁 Ver Kits Prontos</Link>
              <Link href="/kits" style={styles.bannerKitsBtnSecundario} className="btn-hover">✨ Montar o Meu Kit</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #4a5a35 0%, var(--verde) 50%, #9aab7a 100%)', color: '#fff', padding: '80px 24px 0', position: 'relative', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5 },
  heroContent: { maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, paddingBottom: 48 },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '8px 20px', borderRadius: 50, fontSize: 14, fontWeight: 600, marginBottom: 20, backdropFilter: 'blur(8px)' },
  heroTitulo: { fontSize: 48, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 },
  heroDestaque: { color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' },
  heroDesc: { fontSize: 18, opacity: 0.85, lineHeight: 1.6, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' },
  heroBotoes: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimario: { background: 'var(--rosa)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnSecundario: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' },
  btnTerciario: { color: 'rgba(255,255,255,0.8)', padding: '14px 8px', fontWeight: 600, fontSize: 15 },
  statsWrapper: { maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '16px 16px 0 0', overflow: 'hidden' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px', borderRight: '1px solid rgba(255,255,255,0.1)' },
  statNumero: { fontSize: 24, fontWeight: 800, marginBottom: 4 },
  statLabel: { fontSize: 12, opacity: 0.8, textAlign: 'center' },
  filtrosSection: { background: '#fff', padding: '16px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 64, zIndex: 90 },
  filtrosWrapper: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 },
  filtrosScroll: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
  chip: { padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  section: { maxWidth: 1200, margin: '60px auto', padding: '0 24px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  sectionTitulo: { fontSize: 24, fontWeight: 800, color: 'var(--texto)', marginBottom: 4 },
  sectionSubtitulo: { fontSize: 14, color: '#aaa' },
  verTodos: { color: 'var(--verde)', fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 4 },
  limparFiltros: { background: 'none', border: '1px solid #ddd', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: '#999', cursor: 'pointer', flexShrink: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 },
  vazio: { textAlign: 'center', padding: '60px 0' },
  vazioTexto: { fontSize: 18, color: '#aaa', marginBottom: 16 },
  marcasSection: { background: '#fff', padding: '60px 24px' },
  marcasContent: { maxWidth: 1200, margin: '0 auto' },
  marcasTitulo: { fontSize: 24, fontWeight: 800, color: 'var(--texto)', marginBottom: 24, textAlign: 'center' },
  marcasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 },
  marcaCard: { background: 'var(--bege)', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8, border: '2px solid transparent', transition: 'all 0.2s' },
  marcaNome: { fontSize: 16, fontWeight: 700, color: 'var(--texto)' },
  marcaVerMais: { fontSize: 13, color: 'var(--verde)', fontWeight: 600 },
  bannerKits: { background: 'linear-gradient(135deg, var(--rosa) 0%, #c99190 100%)', margin: '0 0 0 0', padding: '48px 24px' },
  bannerKitsContent: { maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 },
  bannerKitsTexto: { display: 'flex', gap: 20, alignItems: 'center' },
  bannerKitsEmoji: { fontSize: 56, flexShrink: 0 },
  bannerKitsTitulo: { fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 },
  bannerKitsDesc: { fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 },
  bannerKitsBotoes: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  bannerKitsBtnPrimario: { background: '#fff', color: 'var(--rosa)', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  bannerKitsBtnSecundario: { background: 'transparent', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid rgba(255,255,255,0.6)' },
};