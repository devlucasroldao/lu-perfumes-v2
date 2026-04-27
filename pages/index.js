import { useState, useEffect, useCallback } = from 'react';
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
  { label: '🌸 Perfumaria', value: 'perfumaria', tipo: 'categoria' },
  { label: '💄 Maquiagem', value: 'maquiagem', tipo: 'categoria' },
  { label: '🛁 Corpo e Banho', value: 'corpo_banho', tipo: 'categoria' },
  { label: '✨ Skincare', value: 'skincare', tipo: 'categoria' },
  { label: '🧴 Cabelos', value: 'cabelos', tipo: 'categoria' },
];

const marcas = ['O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'];

export default function Home() {
  const [sacola, setSacola] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [filtroTipoAtivo, setFiltroTipoAtivo] = useState(null);
  const [marcaAtiva, setMarcaAtiva] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
    buscarDados();
  }, []);

  const buscarDados = async () => {
    setCarregando(true);
    const { data: destaquesData } = await supabase
      .from('produtos').select('*').eq('destaque', true).eq('ativo', true).limit(8);
    const { data: produtosData } = await supabase
      .from('produtos').select('*').eq('ativo', true);
    if (destaquesData) setDestaques(destaquesData);
    if (produtosData) setTodosProdutos(produtosData);
    setCarregando(false);
  };

  const produtosFiltrados = useCallback(() => {
    return todosProdutos.filter(p => {
      if (!filtroAtivo) return true;
      if (filtroTipoAtivo === 'linha') return p.linha === filtroAtivo;
      if (filtroTipoAtivo === 'categoria') return p.categoria === filtroAtivo;
      if (filtroTipoAtivo === 'marca') return p.marca === filtroAtivo;
      return true;
    }).filter(p => !marcaAtiva || p.marca === marcaAtiva);
  }, [todosProdutos, filtroAtivo, filtroTipoAtivo, marcaAtiva])();

  const aplicarFiltro = (filtro) => {
    if (!filtro.value) {
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
            <Link href="/catalogo" style={styles.btnPrimario} className="btn-hover">🌸 Ver Catálogo</Link>
            <Link href="/kits" style={styles.btnSecundario} className="btn-hover">🎁 Montar Kit</Link>
            <Link href="/sobre" style={styles.btnTerciario} className="btn-hover">Sobre a Lu →</Link>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsWrapper} className="animate-fade delay-5">
          {[
            { numero: '5+', label: 'Marcas parceiras' },
            { numero: '100+', label: 'Produtos disponíveis' },
            { numero: '⭐', label: 'Atendimento 5 estrelas' },
            { numero: '🎁', label: 'Kits personalizados' },
          ].map((s, i) => (
            <div key={i} style={styles.statItem}>
              <span style={styles.statNumero}>{s.numero}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filtros rápidos */}
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

      {/* Destaques da semana */}
      {!temFiltroAtivo && destaques.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader} className="animate-fade">
            <div>
              <h2 style={styles.sectionTitulo}>Destaques da semana ⭐</h2>
              <p style={styles.sectionSubtitulo}>Os queridinhos da Lu selecionados especialmente pra você</p>
            </div>
            <Link href="/catalogo" style={styles.verTodos} className="link-hover">Ver todos →</Link>
          </div>
          <div className="grid-home">
            {destaques.map((p, i) => (
              <div key={p.id} className={`animate-fade delay-${Math.min(i + 1, 5)}`}>
                <ProdutoCard produto={p} onAddSacola={addSacola} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção Kits — no lugar das marcas */}
      {!temFiltroAtivo && (
        <section style={styles.kitsSection}>
          <div style={styles.kitsContent} className="animate-fade">
            <div style={styles.kitsEsquerda}>
              <span style={styles.kitsEmoji}>🎁</span>
              <div>
                <h2 style={styles.kitsTitulo}>Precisa de um presente especial?</h2>
                <p style={styles.kitsTexto}>A Lu monta kits personalizados pra qualquer ocasião — aniversário, chá de bebê, Dia das Mães e muito mais!</p>
                <div style={styles.kitsBotoes}>
                  <Link href="/kits" style={styles.btnKitsPrimario} className="btn-hover">🎀 Ver Kits Prontos</Link>
                  <Link href="/kits" style={styles.btnKitsSecundario} className="btn-hover">✨ Montar o Meu Kit</Link>
                </div>
              </div>
            </div>
            <div style={styles.kitsDireita}>
              {[
                { emoji: '💐', titulo: 'Dia das Mães', desc: 'Kits especiais pra ela' },
                { emoji: '🍼', titulo: 'Chá de Bebê', desc: 'Linha baby completa' },
                { emoji: '🎂', titulo: 'Aniversário', desc: 'Presentes inesquecíveis' },
                { emoji: '💑', titulo: 'Namorados', desc: 'Surpresas românticas' },
              ].map((item, i) => (
                <Link key={i} href="/kits" style={styles.kitCard} className="card-hover">
                  <span style={styles.kitCardEmoji}>{item.emoji}</span>
                  <div>
                    <p style={styles.kitCardTitulo}>{item.titulo}</p>
                    <p style={styles.kitCardDesc}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos os produtos */}
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
          <div className="grid-home">
            {[1,2,3,4].map(i => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                <div className="skeleton" style={{ height: 220 }} />
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton" style={{ height: 10, width: '60%' }} />
                  <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 10, width: '90%' }} />
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
          <div className="grid-home">
            {produtosFiltrados.map((p, i) => (
              <div key={p.id} className={`animate-fade delay-${Math.min(i + 1, 5)}`}>
                <ProdutoCard produto={p} onAddSacola={addSacola} />
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .grid-home {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: stretch;
        }
        .grid-home > div {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .grid-home > div > a {
          flex: 1;
        }
        @media (max-width: 1024px) {
          .grid-home { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .grid-home { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 480px) {
          .grid-home { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        }
        /* Esconde scrollbar */
        .filtros-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #4a5a35 0%, var(--verde) 50%, #9aab7a 100%)', color: '#fff', padding: '80px 24px 0', position: 'relative', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', inset: 0, opacity: 0.5 },
  heroContent: { maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, paddingBottom: 48 },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '8px 20px', borderRadius: 50, fontSize: 14, fontWeight: 600, marginBottom: 20 },
  heroTitulo: { fontSize: 44, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 },
  heroDestaque: { color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' },
  heroDesc: { fontSize: 17, opacity: 0.85, lineHeight: 1.6, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' },
  heroBotoes: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimario: { background: 'var(--rosa)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnSecundario: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid rgba(255,255,255,0.4)' },
  btnTerciario: { color: 'rgba(255,255,255,0.8)', padding: '14px 8px', fontWeight: 600, fontSize: 15 },
  statsWrapper: { maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'rgba(255,255,255,0.1)', borderRadius: '16px 16px 0 0', overflow: 'hidden' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px', borderRight: '1px solid rgba(255,255,255,0.1)' },
  statNumero: { fontSize: 24, fontWeight: 800, marginBottom: 4 },
  statLabel: { fontSize: 12, opacity: 0.8, textAlign: 'center' },
  filtrosSection: { background: '#fff', padding: '16px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 64, zIndex: 90 },
  filtrosWrapper: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 },
  filtrosScroll: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' },
  chip: { padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  section: { maxWidth: 1200, margin: '60px auto', padding: '0 24px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  sectionTitulo: { fontSize: 24, fontWeight: 800, color: 'var(--texto)', marginBottom: 4 },
  sectionSubtitulo: { fontSize: 14, color: '#aaa' },
  verTodos: { color: 'var(--verde)', fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 4 },
  limparFiltros: { background: 'none', border: '1px solid #ddd', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: '#999', cursor: 'pointer', flexShrink: 0 },
  vazio: { textAlign: 'center', padding: '60px 0' },
  vazioTexto: { fontSize: 18, color: '#aaa', marginBottom: 16 },
  kitsSection: { background: '#fff', padding: '60px 24px' },
  kitsContent: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' },
  kitsEsquerda: { display: 'flex', gap: 20, alignItems: 'flex-start' },
  kitsEmoji: { fontSize: 56, flexShrink: 0 },
  kitsTitulo: { fontSize: 26, fontWeight: 800, color: 'var(--texto)', marginBottom: 8, lineHeight: 1.3 },
  kitsTexto: { fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 24 },
  kitsBotoes: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  btnKitsPrimario: { background: 'var(--rosa)', color: '#fff', padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14 },
  btnKitsSecundario: { background: 'transparent', color: 'var(--verde)', padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: '2px solid var(--verde)' },
  kitsDireita: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  kitCard: { background: 'var(--bege)', borderRadius: 16, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', transition: 'all 0.2s' },
  kitCardEmoji: { fontSize: 28, flexShrink: 0 },
  kitCardTitulo: { fontSize: 14, fontWeight: 700, color: 'var(--texto)', marginBottom: 2 },
  kitCardDesc: { fontSize: 12, color: '#888' },
};