import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import { supabase } from '../lib/supabase';
import Head from 'next/head';

const linhas = ['Todos', 'feminino', 'masculino', 'kids', 'baby'];
const marcas = ['Todos', 'O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'];
const tipos = ['Todos', 'floral', 'amadeirado', 'citrico', 'doce', 'frutal'];

export default function Catalogo() {
  const router = useRouter();
  const [sacola, setSacola] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroLinha, setFiltroLinha] = useState('Todos');
  const [filtroMarca, setFiltroMarca] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [busca, setBusca] = useState('');

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

  return (
    <div>
      <Head>
        <title>Catálogo — Lu Perfumes & Presentes</title>
        <meta name="description" content="Explore nosso catálogo completo de perfumes e cosméticos. Filtre por linha, marca e tipo." />
      </Head>

      <Navbar sacolaCount={sacola.length} />
      <main style={styles.main}>
        <div style={styles.topo}>
          <h1 style={styles.titulo}>Catálogo 🌸</h1>
          <input style={styles.busca} placeholder="🔍 Buscar produto ou marca..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>

        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            {[
              { titulo: 'Por Linha', opcoes: linhas, filtro: filtroLinha, setFiltro: setFiltroLinha },
              { titulo: 'Por Marca', opcoes: marcas, filtro: filtroMarca, setFiltro: setFiltroMarca },
              { titulo: 'Por Tipo', opcoes: tipos, filtro: filtroTipo, setFiltro: setFiltroTipo },
            ].map(grupo => (
              <div key={grupo.titulo} style={styles.filtroGrupo}>
                <h3 style={styles.filtroTitulo}>{grupo.titulo}</h3>
                {grupo.opcoes.map(op => (
                  <button key={op} style={{ ...styles.filtroBtn, background: grupo.filtro === op ? 'var(--verde)' : 'transparent', color: grupo.filtro === op ? '#fff' : 'var(--texto)' }} onClick={() => grupo.setFiltro(op)}>
                    {op.charAt(0).toUpperCase() + op.slice(1)}
                  </button>
                ))}
              </div>
            ))}
            <button style={styles.limpar} onClick={limparFiltros}>✕ Limpar filtros</button>
          </aside>

          <div style={styles.conteudo}>
            <p style={styles.resultado}>
              {carregando ? 'Carregando...' : `${produtosFiltrados.length} produto(s) encontrado(s)`}
            </p>
            {carregando ? (
              <p style={{ color: '#aaa' }}>Buscando produtos... 🌸</p>
            ) : produtosFiltrados.length === 0 ? (
              <div style={styles.vazio}>
                <p>Nenhum produto encontrado 😕</p>
                <button style={styles.limpar} onClick={limparFiltros}>Limpar filtros</button>
              </div>
            ) : (
              <div style={styles.grid}>
                {produtosFiltrados.map(p => <ProdutoCard key={p.id} produto={p} onAddSacola={addSacola} />)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  main: { maxWidth: 1200, margin: '40px auto', padding: '0 24px' },
  topo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  titulo: { fontSize: 28, fontWeight: 700, color: 'var(--texto)' },
  busca: { padding: '12px 20px', borderRadius: 50, border: '2px solid #eee', fontSize: 14, width: 300, outline: 'none', background: '#fff' },
  layout: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40 },
  sidebar: { display: 'flex', flexDirection: 'column' },
  filtroGrupo: { marginBottom: 24 },
  filtroTitulo: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--verde)', marginBottom: 10 },
  filtroBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', fontSize: 14, cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s' },
  limpar: { background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: '#999', cursor: 'pointer' },
  conteudo: { flex: 1 },
  resultado: { fontSize: 13, color: '#aaa', marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 },
  vazio: { textAlign: 'center', padding: '60px 0', color: '#aaa' },
};