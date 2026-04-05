import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Head from 'next/head';

export default function Kits() {
  const [sacola, setSacola] = useState([]);
  const [kits, setKits] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [kitPersonalizado, setKitPersonalizado] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState('prontos');

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
    buscarDados();
  }, []);

  const buscarDados = async () => {
    setCarregando(true);
    const { data: kitsData } = await supabase
      .from('kits')
      .select('*, kit_produtos(*, produtos(*))')
      .eq('ativo', true);
    const { data: produtosData } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true);
    if (kitsData) setKits(kitsData);
    if (produtosData) setProdutos(produtosData);
    setCarregando(false);
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

  return (
    <div style={styles.page}>
      <Head>
        <title>Kits para Presentear — Lu Perfumes & Presentes</title>
        <meta name="description" content="Kits prontos ou personalizados para qualquer ocasião. Monte o presente perfeito com a Lu!" />
      </Head>
      <Navbar sacolaCount={sacola.length} />

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>🎁 Presentes especiais</span>
          <h1 style={styles.heroTitulo}>Kits para Presentear</h1>
          <p style={styles.heroSubtitulo}>Escolha um kit pronto ou monte o seu do jeito que quiser — a Lu cuida do resto!</p>
          <div style={styles.heroAbas}>
            <button
              style={{ ...styles.heroAba, ...(aba === 'prontos' ? styles.heroAbaAtiva : {}) }}
              onClick={() => setAba('prontos')}
            >
              🎀 Kits Prontos
            </button>
            <button
              style={{ ...styles.heroAba, ...(aba === 'personalizado' ? styles.heroAbaAtiva : {}) }}
              onClick={() => setAba('personalizado')}
            >
              ✨ Monte o Seu
            </button>
          </div>
        </div>
      </section>

      <main style={styles.main}>
        {carregando ? (
          <div style={styles.loading}>Carregando kits... 🌸</div>
        ) : (
          <>
            {/* Kits Prontos */}
            {aba === 'prontos' && (
              <div>
                {kits.length === 0 ? (
                  <div style={styles.vazio}>
                    <span style={styles.vazioBig}>🎁</span>
                    <h3 style={styles.vazioTitulo}>Kits em breve!</h3>
                    <p style={styles.vazioTexto}>A Lu está preparando kits especiais. Enquanto isso, monte o seu kit personalizado!</p>
                    <button style={styles.btnMontarKit} onClick={() => setAba('personalizado')}>
                      ✨ Montar kit personalizado
                    </button>
                  </div>
                ) : (
                  <div style={styles.gridKits}>
                    {kits.map(kit => (
                      <div key={kit.id} style={styles.cardKit}>
                        <div style={styles.kitImagemWrapper}>
                          <img
                            src={kit.foto || 'https://placehold.co/600x300?text=Kit+Presente'}
                            alt={kit.nome}
                            style={styles.kitFoto}
                          />
                          {kit.ocasiao && (
                            <span style={styles.kitBadge}>{kit.ocasiao}</span>
                          )}
                        </div>
                        <div style={styles.kitInfo}>
                          <h3 style={styles.kitNome}>{kit.nome}</h3>
                          <p style={styles.kitDesc}>{kit.descricao}</p>
                          {kit.kit_produtos?.length > 0 && (
                            <div style={styles.kitItens}>
                              <p style={styles.kitItensTitle}>O que inclui:</p>
                              <div style={styles.kitItensList}>
                                {kit.kit_produtos.map((kp, i) => (
                                  <span key={i} style={styles.kitItemChip}>
                                    {kp.produtos?.nome}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <button style={styles.btnInteresse} onClick={() => enviarKitPronto(kit)}>
                            📲 Tenho interesse!
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Monte o Seu Kit */}
            {aba === 'personalizado' && (
              <div style={styles.personalizado}>
                <div style={styles.instrucao}>
                  <span style={styles.instrucaoEmoji}>👆</span>
                  <div>
                    <h3 style={styles.instrucaoTitulo}>Como funciona?</h3>
                    <p style={styles.instrucaoTexto}>Selecione os produtos que quer no seu kit e mande a lista direto pro WhatsApp da Lu. Ela cuida de tudo!</p>
                  </div>
                </div>

                {kitPersonalizado.length > 0 && (
                  <div style={styles.resumoKit}>
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
                    <button style={styles.btnEnviar} onClick={enviarKitPersonalizado}>
                      📲 Enviar kit pro WhatsApp da Lu
                    </button>
                  </div>
                )}

                <div style={styles.gridProdutos}>
                  {produtos.map(p => {
                    const selecionado = kitPersonalizado.find(k => k.id === p.id);
                    return (
                      <div
                        key={p.id}
                        style={{ ...styles.cardProduto, border: selecionado ? '2px solid var(--rosa)' : '2px solid transparent', background: selecionado ? '#fff8f8' : '#fff' }}
                        onClick={() => toggleKitPersonalizado(p)}
                      >
                        <div style={styles.produtoImagemWrapper}>
                          <img
                            src={p.foto || 'https://placehold.co/300x200?text=Sem+foto'}
                            alt={p.nome}
                            style={styles.produtoFoto}
                          />
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
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, var(--rosa) 0%, #c99190 100%)', padding: '60px 24px 80px' },
  heroContent: { maxWidth: 700, margin: '0 auto', textAlign: 'center', color: '#fff' },
  heroBadge: { background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  heroTitulo: { fontSize: 42, fontWeight: 800, margin: '16px 0 12px' },
  heroSubtitulo: { fontSize: 17, opacity: 0.9, lineHeight: 1.6, marginBottom: 36 },
  heroAbas: { display: 'flex', gap: 12, justifyContent: 'center' },
  heroAba: { padding: '12px 28px', borderRadius: 50, border: '2px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' },
  heroAbaAtiva: { background: '#fff', color: 'var(--rosa)', border: '2px solid #fff' },
  main: { maxWidth: 1100, margin: '-32px auto 60px', padding: '0 24px' },
  loading: { textAlign: 'center', padding: '80px 0', color: '#aaa', fontSize: 16 },
  vazio: { background: '#fff', borderRadius: 24, padding: '60px 40px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  vazioBig: { fontSize: 64, display: 'block', marginBottom: 16 },
  vazioTitulo: { fontSize: 22, fontWeight: 700, color: 'var(--texto)', marginBottom: 8 },
  vazioTexto: { fontSize: 15, color: '#888', marginBottom: 24, lineHeight: 1.6 },
  btnMontarKit: { background: 'var(--rosa)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' },
  gridKits: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 },
  cardKit: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
  kitImagemWrapper: { position: 'relative' },
  kitFoto: { width: '100%', height: 220, objectFit: 'cover' },
  kitBadge: { position: 'absolute', top: 16, left: 16, background: 'var(--rosa)', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  kitInfo: { padding: 28 },
  kitNome: { fontSize: 22, fontWeight: 800, color: 'var(--texto)', marginBottom: 8 },
  kitDesc: { fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 20 },
  kitItens: { marginBottom: 20 },
  kitItensTitle: { fontSize: 12, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  kitItensList: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  kitItemChip: { background: 'var(--bege)', padding: '6px 12px', borderRadius: 20, fontSize: 13, color: 'var(--texto)', fontWeight: 500 },
  btnInteresse: { width: '100%', background: '#25D366', color: '#fff', padding: '14px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' },
  personalizado: { display: 'flex', flexDirection: 'column', gap: 24 },
  instrucao: { background: '#fff', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  instrucaoEmoji: { fontSize: 32, flexShrink: 0 },
  instrucaoTitulo: { fontSize: 16, fontWeight: 700, color: 'var(--texto)', marginBottom: 4 },
  instrucaoTexto: { fontSize: 14, color: '#888', lineHeight: 1.5 },
  resumoKit: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '2px solid var(--rosa)' },
  resumoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resumoTitulo: { fontSize: 18, fontWeight: 700, color: 'var(--texto)' },
  resumoCount: { background: 'var(--rosa)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  resumoItens: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  resumoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#faf9f7', borderRadius: 10 },
  resumoItemInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  resumoItemMarca: { fontSize: 10, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1 },
  resumoItemNome: { fontSize: 14, fontWeight: 600, color: 'var(--texto)' },
  removerItem: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16, padding: 4 },
  btnEnviar: { width: '100%', background: '#25D366', color: '#fff', padding: '14px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' },
  gridProdutos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  cardProduto: { borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  produtoImagemWrapper: { position: 'relative' },
  produtoFoto: { width: '100%', height: 160, objectFit: 'cover', display: 'block' },
  checkCircle: { position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s' },
  produtoInfo: { padding: '12px 16px' },
  produtoMarca: { fontSize: 10, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 },
  produtoNome: { fontSize: 14, fontWeight: 700, color: 'var(--texto)', marginBottom: 4 },
  produtoDesc: { fontSize: 12, color: '#aaa', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  footer: { background: 'var(--verde)', color: '#fff', textAlign: 'center', padding: '32px 24px' },
};