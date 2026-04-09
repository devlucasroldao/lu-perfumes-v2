import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Head from 'next/head';

export default function Kits() {
  const [sacola, setSacola] = useState([]);
  const [kits, setKits] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [kitPersonalizado, setKitPersonalizado] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState('prontos');
  const [usuario, setUsuario] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroKits, setFiltroKits] = useState('todos');

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
    buscarDados();
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user || null;
      setUsuario(user);
      if (user) buscarFavoritos(user.id);
    });
  }, []);

  const buscarDados = async () => {
    setCarregando(true);
    const { data: kitsData } = await supabase.from('kits').select('*, kit_produtos(*, produtos(*))').eq('ativo', true);
    const { data: produtosData } = await supabase.from('produtos').select('*').eq('ativo', true);
    if (kitsData) setKits(kitsData);
    if (produtosData) setProdutos(produtosData);
    setCarregando(false);
  };

  const buscarFavoritos = async (userId) => {
    const { data } = await supabase.from('favoritos').select('*, produtos(*)').eq('user_id', userId);
    if (data) setFavoritos(data.map(f => f.produtos).filter(Boolean));
  };

  const toggleKitPersonalizado = (produto) => {
    setKitPersonalizado(prev => {
      const jaEsta = prev.find(p => p.id === produto.id);
      if (jaEsta) return prev.filter(p => p.id !== produto.id);
      return [...prev, produto];
    });
  };

  const enviarKitPronto = (kit) => {
    const numero = '5551980272657';
    const itens = kit.kit_produtos?.map(kp => `• ${kp.produtos?.nome} - ${kp.produtos?.marca}`).join('\n') || '';
    const mensagem = `Olá Lu! 🌸 Tenho interesse no kit *${kit.nome}*:\n\n${itens}\n\nPoderia me passar mais informações?`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const enviarKitPersonalizado = () => {
    if (kitPersonalizado.length === 0) return;
    const numero = '5551980272657';
    const itens = kitPersonalizado.map(p => `• ${p.nome} - ${p.marca}`).join('\n');
    const mensagem = `Olá Lu! 🌸 Gostaria de montar um kit com esses produtos:\n\n${itens}\n\nPoderia me ajudar?`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const produtosExibidos = (() => {
    let lista = filtroKits === 'favoritos' ? favoritos : produtos;
    if (busca) lista = lista.filter(p =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.marca.toLowerCase().includes(busca.toLowerCase()) ||
      p.tipo?.toLowerCase().includes(busca.toLowerCase())
    );
    return lista;
  })();

  const Abas = () => (
    <div style={styles.abas}>
      <button style={{ ...styles.aba, ...(aba === 'prontos' ? styles.abaAtiva : {}) }} onClick={() => setAba('prontos')}>
        🎀 Kits Prontos {kits.length > 0 && <span style={styles.abaBadge}>{kits.length}</span>}
      </button>
      <button style={{ ...styles.aba, ...(aba === 'personalizado' ? styles.abaAtiva : {}) }} onClick={() => setAba('personalizado')}>
        ✨ Monte o Seu
      </button>
    </div>
  );

  const KitsProntos = () => (
    <div>
      {kits.length === 0 ? (
        <div style={styles.vazio}>
          <span style={styles.vazioEmoji}>🎁</span>
          <h3 style={styles.vazioTitulo}>Kits em breve!</h3>
          <p style={styles.vazioTexto}>A Lu está preparando kits especiais. Monte o seu kit personalizado!</p>
          <button style={styles.btnAcao} onClick={() => setAba('personalizado')}>✨ Montar kit personalizado</button>
        </div>
      ) : (
        <div className="kits-grid">
          {kits.map((kit, i) => (
            <div key={kit.id} style={styles.cardKit} className={`animate-fade delay-${Math.min(i+1,5)} card-hover`}>
              <div style={styles.kitImagemWrapper}>
                <img src={kit.foto || 'https://placehold.co/600x300?text=Kit+Presente'} alt={kit.nome} style={styles.kitFoto} />
                {kit.ocasiao && <span style={styles.kitBadge}>{kit.ocasiao}</span>}
              </div>
              <div style={styles.kitInfo}>
                <h3 style={styles.kitNome}>{kit.nome}</h3>
                <p style={styles.kitDesc}>{kit.descricao}</p>
                {kit.kit_produtos?.length > 0 && (
                  <div style={styles.kitItens}>
                    <p style={styles.kitItensTitle}>O que inclui:</p>
                    <div style={styles.kitItensList}>
                      {kit.kit_produtos.map((kp, i) => (
                        <span key={i} style={styles.kitItemChip}>{kp.produtos?.nome}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button style={styles.btnWhats} onClick={() => enviarKitPronto(kit)} className="btn-hover">
                  📲 Tenho interesse!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const MonteOSeu = () => (
    <div style={styles.personalizado}>
      <div style={styles.instrucao}>
        <span style={styles.instrucaoEmoji}>👆</span>
        <div>
          <h3 style={styles.instrucaoTitulo}>Como funciona?</h3>
          <p style={styles.instrucaoTexto}>Selecione os produtos e mande a lista pro WhatsApp da Lu!</p>
        </div>
      </div>

      {kitPersonalizado.length > 0 && (
        <div style={styles.resumoKit} className="animate-slide-down">
          <div style={styles.resumoHeader}>
            <h3 style={styles.resumoTitulo}>Seu kit</h3>
            <span style={styles.resumoCount}>{kitPersonalizado.length} {kitPersonalizado.length === 1 ? 'produto' : 'produtos'}</span>
          </div>
          <div style={styles.resumoItens}>
            {kitPersonalizado.map(p => (
              <div key={p.id} style={styles.resumoItem}>
                <div style={styles.resumoItemInfo}>
                  <span style={styles.resumoItemMarca}>{p.marca}</span>
                  <span style={styles.resumoItemNome}>{p.nome}</span>
                </div>
                <button style={styles.removerItem} onClick={() => toggleKitPersonalizado(p)}>✕</button>
              </div>
            ))}
          </div>
          <button style={styles.btnEnviar} onClick={enviarKitPersonalizado} className="btn-hover">
            📲 Enviar kit pro WhatsApp da Lu
          </button>
        </div>
      )}

      <div style={styles.buscaWrapper}>
        <div style={styles.buscaInput}>
          <span>🔍</span>
          <input style={styles.input} placeholder="Buscar produto, marca ou tipo..." value={busca} onChange={e => setBusca(e.target.value)} />
          {busca && <button style={styles.buscaLimpar} onClick={() => setBusca('')}>✕</button>}
        </div>
        <div style={styles.filtrosBusca}>
          <button style={{ ...styles.filtroBuscaBtn, background: filtroKits === 'todos' ? 'var(--verde)' : '#fff', color: filtroKits === 'todos' ? '#fff' : 'var(--texto)', border: filtroKits === 'todos' ? '2px solid var(--verde)' : '2px solid #eee' }} onClick={() => setFiltroKits('todos')} className="btn-hover">
            🌸 Todos ({produtos.length})
          </button>
          {usuario && (
            <button style={{ ...styles.filtroBuscaBtn, background: filtroKits === 'favoritos' ? 'var(--rosa)' : '#fff', color: filtroKits === 'favoritos' ? '#fff' : 'var(--texto)', border: filtroKits === 'favoritos' ? '2px solid var(--rosa)' : '2px solid #eee' }} onClick={() => setFiltroKits('favoritos')} className="btn-hover">
              ♥ Favoritos ({favoritos.length})
            </button>
          )}
          {!usuario && (
            <div style={styles.loginDica}>
              💡 <Link href="/favoritos" style={{ color: 'var(--verde)', fontWeight: 600 }}>Faça login</Link> para ver seus favoritos!
            </div>
          )}
        </div>
      </div>

      {busca && <p style={styles.resultadoBusca}>{produtosExibidos.length} produto(s) encontrado(s) para "{busca}"</p>}

      {produtosExibidos.length === 0 ? (
        <div style={styles.vazio}>
          <span style={styles.vazioEmoji}>😕</span>
          <h3 style={styles.vazioTitulo}>{filtroKits === 'favoritos' ? 'Nenhum favorito ainda' : 'Nenhum produto encontrado'}</h3>
          <p style={styles.vazioTexto}>{filtroKits === 'favoritos' ? 'Favorite produtos no catálogo!' : 'Tente outro termo de busca'}</p>
          {filtroKits === 'favoritos' && <Link href="/catalogo" style={styles.btnAcao}>Ver Catálogo 🌸</Link>}
        </div>
      ) : (
        <div className="produtos-grid-kits">
          {produtosExibidos.map((p, i) => {
            const selecionado = kitPersonalizado.find(k => k.id === p.id);
            return (
              <div
                key={p.id}
                style={{ ...styles.cardProduto, border: selecionado ? '2px solid var(--rosa)' : '2px solid transparent', background: selecionado ? '#fff8f8' : '#fff' }}
                onClick={() => toggleKitPersonalizado(p)}
                className={`animate-fade delay-${Math.min(i+1,5)}`}
              >
                <div style={styles.produtoImagemWrapper}>
                  <img src={p.foto || 'https://placehold.co/300x200?text=Sem+foto'} alt={p.nome} style={styles.produtoFoto} />
                  <div style={{ ...styles.checkCircle, background: selecionado ? 'var(--rosa)' : 'rgba(255,255,255,0.9)', color: selecionado ? '#fff' : '#aaa' }}>
                    {selecionado ? '✓' : '+'}
                  </div>
                </div>
                <div style={styles.produtoInfo}>
                  <span style={styles.produtoMarca}>{p.marca}</span>
                  <h4 style={styles.produtoNome}>{p.nome}</h4>
                  <p style={styles.produtoDesc}>{p.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.page}>
      <Head>
        <title>Kits para Presentear — Lu Perfumes & Presentes</title>
        <meta name="description" content="Kits prontos ou personalizados para qualquer ocasião. Monte o presente perfeito com a Lu!" />
      </Head>

      <Navbar sacolaCount={sacola.length} />

      {/* ─── DESKTOP ─── */}
      <div className="desktop-only">
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <span style={styles.heroBadge} className="animate-fade delay-1">🎁 Presentes especiais</span>
            <h1 style={styles.heroTitulo} className="animate-fade delay-2">Kits para Presentear</h1>
            <p style={styles.heroSubtitulo} className="animate-fade delay-3">Escolha um kit pronto ou monte o seu do jeito que quiser!</p>
            <div style={styles.heroAbas} className="animate-fade delay-4">
              <button style={{ ...styles.heroAba, ...(aba === 'prontos' ? styles.heroAbaAtiva : {}) }} onClick={() => setAba('prontos')}>🎀 Kits Prontos</button>
              <button style={{ ...styles.heroAba, ...(aba === 'personalizado' ? styles.heroAbaAtiva : {}) }} onClick={() => setAba('personalizado')}>✨ Monte o Seu</button>
            </div>
          </div>
        </section>
        <main style={styles.mainDesktop}>
          {carregando ? <p style={{ color: '#aaa', textAlign: 'center', padding: 40 }}>Carregando... 🌸</p> : (
            <>
              {aba === 'prontos' && <KitsProntos />}
              {aba === 'personalizado' && <MonteOSeu />}
            </>
          )}
        </main>
      </div>

      {/* ─── MOBILE ─── */}
      <div className="mobile-only">
        {/* Header sticky mobile */}
        <div style={styles.headerMobile}>
          <div style={styles.headerTop}>
            <h1 style={styles.tituloMobile}>Kits 🎁</h1>
          </div>
          <Abas />
        </div>

        <main style={styles.mainMobile}>
          {carregando ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>Carregando... 🌸</div>
          ) : (
            <>
              {aba === 'prontos' && <KitsProntos />}
              {aba === 'personalizado' && <MonteOSeu />}
            </>
          )}
        </main>
      </div>

      <style>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }

        .kits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .produtos-grid-kits {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }

          .kits-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .produtos-grid-kits {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },

  // ─── DESKTOP ───
  hero: { background: 'linear-gradient(135deg, var(--rosa) 0%, #c99190 100%)', padding: '60px 24px 80px' },
  heroContent: { maxWidth: 700, margin: '0 auto', textAlign: 'center', color: '#fff' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 },
  heroTitulo: { fontSize: 42, fontWeight: 800, margin: '0 0 12px' },
  heroSubtitulo: { fontSize: 17, opacity: 0.9, lineHeight: 1.6, marginBottom: 36 },
  heroAbas: { display: 'flex', gap: 12, justifyContent: 'center' },
  heroAba: { padding: '12px 28px', borderRadius: 50, border: '2px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' },
  heroAbaAtiva: { background: '#fff', color: 'var(--rosa)', border: '2px solid #fff' },
  mainDesktop: { maxWidth: 1100, margin: '-32px auto 60px', padding: '0 24px' },

  // ─── MOBILE ───
  headerMobile: { background: '#fff', padding: '16px 16px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 64, zIndex: 90 },
  headerTop: { marginBottom: 12 },
  tituloMobile: { fontSize: 22, fontWeight: 800, color: 'var(--texto)' },
  abas: { display: 'flex', gap: 0, borderTop: '1px solid #f0f0f0' },
  aba: { flex: 1, padding: '14px 0', border: 'none', background: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#aaa', borderBottom: '3px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  abaAtiva: { color: 'var(--rosa)', borderBottom: '3px solid var(--rosa)' },
  abaBadge: { background: 'var(--rosa)', color: '#fff', borderRadius: 20, padding: '2px 7px', fontSize: 11, fontWeight: 700 },
  mainMobile: { padding: '16px 12px 80px' },

  // ─── COMPARTILHADOS ───
  vazio: { background: '#fff', borderRadius: 24, padding: '48px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  vazioEmoji: { fontSize: 48, display: 'block', marginBottom: 12 },
  vazioTitulo: { fontSize: 20, fontWeight: 700, color: 'var(--texto)', marginBottom: 8 },
  vazioTexto: { fontSize: 14, color: '#888', marginBottom: 20, lineHeight: 1.6 },
  btnAcao: { background: 'var(--rosa)', color: '#fff', padding: '12px 28px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
  cardKit: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', transition: 'all 0.3s' },
  kitImagemWrapper: { position: 'relative' },
  kitFoto: { width: '100%', height: 200, objectFit: 'cover', display: 'block' },
  kitBadge: { position: 'absolute', top: 12, left: 12, background: 'var(--rosa)', color: '#fff', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  kitInfo: { padding: '20px' },
  kitNome: { fontSize: 20, fontWeight: 800, color: 'var(--texto)', marginBottom: 8 },
  kitDesc: { fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 16 },
  kitItens: { marginBottom: 16 },
  kitItensTitle: { fontSize: 11, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  kitItensList: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  kitItemChip: { background: 'var(--bege)', padding: '5px 10px', borderRadius: 20, fontSize: 12, color: 'var(--texto)', fontWeight: 500 },
  btnWhats: { width: '100%', background: '#25D366', color: '#fff', padding: '13px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' },
  personalizado: { display: 'flex', flexDirection: 'column', gap: 16 },
  instrucao: { background: '#fff', borderRadius: 16, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  instrucaoEmoji: { fontSize: 28, flexShrink: 0 },
  instrucaoTitulo: { fontSize: 15, fontWeight: 700, color: 'var(--texto)', marginBottom: 4 },
  instrucaoTexto: { fontSize: 13, color: '#888', lineHeight: 1.5 },
  resumoKit: { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '2px solid var(--rosa)' },
  resumoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  resumoTitulo: { fontSize: 16, fontWeight: 700, color: 'var(--texto)' },
  resumoCount: { background: 'var(--rosa)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  resumoItens: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
  resumoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#faf9f7', borderRadius: 10 },
  resumoItemInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  resumoItemMarca: { fontSize: 10, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1 },
  resumoItemNome: { fontSize: 13, fontWeight: 600, color: 'var(--texto)' },
  removerItem: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16, padding: 4 },
  btnEnviar: { width: '100%', background: '#25D366', color: '#fff', padding: '13px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' },
  buscaWrapper: { background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 12 },
  buscaInput: { display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: 50, padding: '0 14px', gap: 8 },
  input: { flex: 1, border: 'none', background: 'transparent', padding: '11px 0', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: 'var(--texto)' },
  buscaLimpar: { background: 'none', border: 'none', color: '#aaa', fontSize: 14, cursor: 'pointer', padding: 4 },
  filtrosBusca: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  filtroBuscaBtn: { padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  loginDica: { fontSize: 13, color: '#888' },
  resultadoBusca: { fontSize: 13, color: '#aaa', paddingLeft: 4 },
  cardProduto: { borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  produtoImagemWrapper: { position: 'relative' },
  produtoFoto: { width: '100%', height: 150, objectFit: 'cover', display: 'block' },
  checkCircle: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s' },
  produtoInfo: { padding: '10px 14px', background: '#fff' },
  produtoMarca: { fontSize: 10, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 3 },
  produtoNome: { fontSize: 13, fontWeight: 700, color: 'var(--texto)', marginBottom: 3 },
  produtoDesc: { fontSize: 11, color: '#aaa', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
};