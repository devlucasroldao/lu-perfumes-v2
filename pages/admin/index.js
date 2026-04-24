import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import UploadFoto from '../../components/UploadFoto';
import AdminGuard from '../../components/AdminGuard';
import Link from 'next/link';

const produtoVazio = { nome: '', marca: '', descricao: '', linha: 'feminino', tipo: 'floral', categoria: 'perfumaria', foto: '', destaque: false, ativo: true };
const kitVazio = { nome: '', descricao: '', ocasiao: '', foto: '', ativo: true };

export default function Admin() {
  const [aba, setAba] = useState('produtos');

  const [produtos, setProdutos] = useState([]);
  const [formProduto, setFormProduto] = useState(produtoVazio);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [buscaProduto, setBuscaProduto] = useState('');

  const [kits, setKits] = useState([]);
  const [formKit, setFormKit] = useState(kitVazio);
  const [editandoKit, setEditandoKit] = useState(null);
  const [produtosDoKit, setProdutosDoKit] = useState([]);
  const [buscaKit, setBuscaKit] = useState('');
  const [buscaProdutoKit, setBuscaProdutoKit] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('sucesso');

  useEffect(() => { buscarTudo(); }, []);

  const buscarTudo = async () => {
    setCarregando(true);
    const { data: p } = await supabase.from('produtos').select('*').order('id', { ascending: false });
    const { data: k } = await supabase.from('kits').select('*, kit_produtos(*, produtos(*))').order('id', { ascending: false });
    if (p) setProdutos(p);
    if (k) setKits(k);
    setCarregando(false);
  };

  const mostrarMensagem = (msg, tipo = 'sucesso') => {
    setMensagem(msg);
    setTipoMensagem(tipo);
    setTimeout(() => setMensagem(''), 3000);
  };

  // ─── PRODUTOS ───

  const salvarProduto = async () => {
    if (!formProduto.nome || !formProduto.marca) {
      mostrarMensagem('⚠️ Nome e marca são obrigatórios!', 'erro');
      return;
    }
    setSalvando(true);

    // Remove o id do payload antes de salvar
    const { id, ...dadosProduto } = formProduto;

    if (editandoProduto) {
      const { error } = await supabase
        .from('produtos')
        .update(dadosProduto)
        .eq('id', editandoProduto);

      if (error) {
        mostrarMensagem('❌ Erro ao atualizar produto!', 'erro');
      } else {
        mostrarMensagem('✅ Produto atualizado com sucesso!');
      }
    } else {
      const { error } = await supabase.from('produtos').insert([dadosProduto]);
      if (error) {
        mostrarMensagem('❌ Erro ao adicionar produto!', 'erro');
      } else {
        mostrarMensagem('✅ Produto adicionado com sucesso!');
      }
    }

    setFormProduto(produtoVazio);
    setEditandoProduto(null);
    setSalvando(false);
    buscarTudo();
  };

  const editarProduto = (p) => {
    setFormProduto({ ...p });
    setEditandoProduto(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirProduto = async (id) => {
    if (!confirm('Tem certeza que quer excluir esse produto?')) return;
    await supabase.from('produtos').delete().eq('id', id);
    mostrarMensagem('🗑️ Produto removido!');
    buscarTudo();
  };

  const toggleProduto = async (p) => {
    await supabase.from('produtos').update({ ativo: !p.ativo }).eq('id', p.id);
    buscarTudo();
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome?.toLowerCase().includes(buscaProduto.toLowerCase()) ||
    p.marca?.toLowerCase().includes(buscaProduto.toLowerCase())
  );

  // ─── KITS ───

  const salvarKit = async () => {
    if (!formKit.nome) {
      mostrarMensagem('⚠️ Nome do kit é obrigatório!', 'erro');
      return;
    }
    setSalvando(true);

    const { id, kit_produtos, ...dadosKit } = formKit;
    let kitId = editandoKit;

    if (editandoKit) {
      const { error } = await supabase.from('kits').update(dadosKit).eq('id', editandoKit);
      if (error) {
        mostrarMensagem('❌ Erro ao atualizar kit!', 'erro');
        setSalvando(false);
        return;
      }
      await supabase.from('kit_produtos').delete().eq('kit_id', editandoKit);
    } else {
      const { data, error } = await supabase.from('kits').insert([dadosKit]).select();
      if (error) {
        mostrarMensagem('❌ Erro ao criar kit!', 'erro');
        setSalvando(false);
        return;
      }
      kitId = data?.[0]?.id;
    }

    if (produtosDoKit.length > 0) {
      const relacoes = produtosDoKit.map(pid => ({ kit_id: kitId, produto_id: pid }));
      await supabase.from('kit_produtos').insert(relacoes);
    }

    mostrarMensagem(editandoKit ? '✅ Kit atualizado com sucesso!' : '✅ Kit criado com sucesso!');
    setFormKit(kitVazio);
    setEditandoKit(null);
    setProdutosDoKit([]);
    setSalvando(false);
    buscarTudo();
  };

  const editarKit = (kit) => {
    const { kit_produtos, ...dadosKit } = kit;
    setFormKit({ ...dadosKit });
    setEditandoKit(kit.id);
    setProdutosDoKit(kit.kit_produtos?.map(kp => kp.produto_id) || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirKit = async (id) => {
    if (!confirm('Tem certeza que quer excluir esse kit?')) return;
    await supabase.from('kits').delete().eq('id', id);
    mostrarMensagem('🗑️ Kit removido!');
    buscarTudo();
  };

  const toggleProdutoKit = (id) => {
    setProdutosDoKit(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const kitsFiltrados = kits.filter(k =>
    k.nome?.toLowerCase().includes(buscaKit.toLowerCase()) ||
    k.ocasiao?.toLowerCase().includes(buscaKit.toLowerCase())
  );

  const produtosParaKit = produtos.filter(p =>
    p.ativo && (
      p.nome?.toLowerCase().includes(buscaProdutoKit.toLowerCase()) ||
      p.marca?.toLowerCase().includes(buscaProdutoKit.toLowerCase())
    )
  );

  return (
    <AdminGuard>
      <div style={styles.page}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🌸 Painel Admin — Lu Perfumes</h1>
          <Link href="/" style={styles.voltar}>← Ver site</Link>
        </header>

        <div style={styles.abas}>
          <button style={{ ...styles.aba, ...(aba === 'produtos' ? styles.abaAtiva : {}) }} onClick={() => setAba('produtos')}>
            📦 Produtos ({produtos.length})
          </button>
          <button style={{ ...styles.aba, ...(aba === 'kits' ? styles.abaAtiva : {}) }} onClick={() => setAba('kits')}>
            🎁 Kits ({kits.length})
          </button>
        </div>

        <main style={styles.main}>
          {mensagem && (
            <div style={{ ...styles.mensagem, background: tipoMensagem === 'erro' ? '#f8d7da' : '#d4edda', color: tipoMensagem === 'erro' ? '#842029' : '#155724' }}>
              {mensagem}
            </div>
          )}

          {/* ─── ABA PRODUTOS ─── */}
          {aba === 'produtos' && (
            <>
              <section style={styles.card}>
                <h2 style={styles.cardTitulo}>{editandoProduto ? '✏️ Editar Produto' : '➕ Novo Produto'}</h2>
                <div style={styles.grid2}>
                  <div style={styles.campo}>
                    <label style={styles.label}>Categoria</label>
                    <select style={styles.input} value={formProduto.categoria} onChange={e => setFormProduto({ ...formProduto, categoria: e.target.value })}>
                      <option value="perfumaria">🌸 Perfumaria</option>
                      <option value="maquiagem">💄 Maquiagem</option>
                      <option value="corpo_banho">🛁 Corpo e Banho</option>
                      <option value="skincare">✨ Skincare</option>
                      <option value="cabelos">🧴 Cabelos</option>
                    </select>
                  </div>
                  <label style={styles.label}>Nome *</label>
                  <input style={styles.input} value={formProduto.nome} onChange={e => setFormProduto({ ...formProduto, nome: e.target.value })} placeholder="Ex: Malbec Gold" />
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Marca *</label>
                  <select style={styles.input} value={formProduto.marca} onChange={e => setFormProduto({ ...formProduto, marca: e.target.value })}>
                    <option value="">Selecione...</option>
                    {['O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Linha</label>
                  <select style={styles.input} value={formProduto.linha} onChange={e => setFormProduto({ ...formProduto, linha: e.target.value })}>
                    {['feminino', 'masculino', 'kids', 'baby'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Tipo</label>
                  <select style={styles.input} value={formProduto.tipo} onChange={e => setFormProduto({ ...formProduto, tipo: e.target.value })}>
                    {['floral', 'amadeirado', 'citrico', 'doce', 'frutal'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ ...styles.campo, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Descrição</label>
                  <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }} value={formProduto.descricao} onChange={e => setFormProduto({ ...formProduto, descricao: e.target.value })} placeholder="Descreva o produto..." />
                </div>
                <div style={{ ...styles.campo, gridColumn: '1 / -1' }}>
                  <UploadFoto fotoAtual={formProduto.foto} onUpload={(url) => setFormProduto({ ...formProduto, foto: url })} />
                  {formProduto.foto && (
                    <div style={styles.previewWrapper}>
                      <img src={formProduto.foto} alt="preview" style={styles.previewImg} />
                    </div>
                  )}
                </div>
              </div>
              <div style={styles.checks}>
                <label style={styles.checkLabel}><input type="checkbox" checked={formProduto.destaque} onChange={e => setFormProduto({ ...formProduto, destaque: e.target.checked })} /> ⭐ Destaque na Home</label>
                <label style={styles.checkLabel}><input type="checkbox" checked={formProduto.ativo} onChange={e => setFormProduto({ ...formProduto, ativo: e.target.checked })} /> ✅ Ativo</label>
              </div>
              <div style={styles.botoes}>
                <button style={styles.btnSalvar} onClick={salvarProduto} disabled={salvando}>
                  {salvando ? 'Salvando...' : editandoProduto ? '💾 Salvar alterações' : '➕ Adicionar produto'}
                </button>
                {editandoProduto && (
                  <button style={styles.btnCancelar} onClick={() => { setFormProduto(produtoVazio); setEditandoProduto(null); }}>
                    Cancelar
                  </button>
                )}
              </div>
            </section>

          <section style={styles.card}>
            <div style={styles.listaHeader}>
              <h2 style={styles.cardTitulo}>📦 Produtos cadastrados ({produtos.length})</h2>
              <div style={styles.buscaWrapper}>
                <span>🔍</span>
                <input
                  style={styles.buscaInput}
                  placeholder="Buscar produto..."
                  value={buscaProduto}
                  onChange={e => setBuscaProduto(e.target.value)}
                />
                {buscaProduto && <button style={styles.buscaLimpar} onClick={() => setBuscaProduto('')}>✕</button>}
              </div>
            </div>
            {buscaProduto && <p style={styles.buscaInfo}>{produtosFiltrados.length} produto(s) encontrado(s)</p>}
            {carregando ? <p style={{ color: '#aaa' }}>Carregando...</p> : (
              <div style={styles.lista}>
                {produtosFiltrados.map(p => (
                  <div key={p.id} style={{ ...styles.item, opacity: p.ativo ? 1 : 0.5 }}>
                    {p.foto && <img src={p.foto} alt={p.nome} style={styles.itemFoto} />}
                    <div style={styles.itemInfo}>
                      <strong style={{ fontSize: 15 }}>{p.nome}</strong>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        <span style={styles.tag}>{p.marca}</span>
                        <span style={styles.tag}>{p.linha}</span>
                        <span style={styles.tag}>{p.tipo}</span>
                        {p.destaque && <span style={{ ...styles.tag, background: '#fff3cd', color: '#856404' }}>⭐ destaque</span>}
                        {!p.ativo && <span style={{ ...styles.tag, background: '#f8d7da', color: '#842029' }}>inativo</span>}
                      </div>
                    </div>
                    <div style={styles.itemAcoes}>
                      <button style={styles.btnToggle} onClick={() => toggleProduto(p)}>{p.ativo ? '⏸️' : '▶️'}</button>
                      <button style={styles.btnEditar} onClick={() => editarProduto(p)}>✏️ Editar</button>
                      <button style={styles.btnExcluir} onClick={() => excluirProduto(p.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
          )}

        {/* ─── ABA KITS ─── */}
        {aba === 'kits' && (
          <>
            <section style={styles.card}>
              <h2 style={styles.cardTitulo}>{editandoKit ? '✏️ Editar Kit' : '➕ Novo Kit'}</h2>
              <div style={styles.grid2}>
                <div style={styles.campo}>
                  <label style={styles.label}>Nome do Kit *</label>
                  <input style={styles.input} value={formKit.nome} onChange={e => setFormKit({ ...formKit, nome: e.target.value })} placeholder="Ex: Kit Dia das Mães" />
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Ocasião</label>
                  <input style={styles.input} value={formKit.ocasiao} onChange={e => setFormKit({ ...formKit, ocasiao: e.target.value })} placeholder="Ex: Dia das Mães, Aniversário..." />
                </div>
                <div style={{ ...styles.campo, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Descrição</label>
                  <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }} value={formKit.descricao} onChange={e => setFormKit({ ...formKit, descricao: e.target.value })} placeholder="Descreva o kit..." />
                </div>
                <div style={{ ...styles.campo, gridColumn: '1 / -1' }}>
                  <UploadFoto fotoAtual={formKit.foto} onUpload={(url) => setFormKit({ ...formKit, foto: url })} />
                  {formKit.foto && (
                    <div style={styles.previewWrapper}>
                      <img src={formKit.foto} alt="preview" style={styles.previewImg} />
                    </div>
                  )}
                </div>
              </div>

              {/* Busca de produtos para o kit */}
              <div style={{ marginTop: 24 }}>
                <label style={styles.label}>Produtos do Kit ({produtosDoKit.length} selecionados)</label>
                <div style={{ ...styles.buscaWrapper, margin: '10px 0' }}>
                  <span>🔍</span>
                  <input
                    style={styles.buscaInput}
                    placeholder="Buscar produto para o kit..."
                    value={buscaProdutoKit}
                    onChange={e => setBuscaProdutoKit(e.target.value)}
                  />
                  {buscaProdutoKit && <button style={styles.buscaLimpar} onClick={() => setBuscaProdutoKit('')}>✕</button>}
                </div>
                <div style={styles.gridSelecao}>
                  {produtosParaKit.map(p => {
                    const selecionado = produtosDoKit.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        style={{ ...styles.cardSelecao, border: selecionado ? '2px solid var(--verde)' : '2px solid #eee', background: selecionado ? '#f0f4ea' : '#fff' }}
                        onClick={() => toggleProdutoKit(p.id)}
                      >
                        <span style={{ ...styles.checkSelecao, background: selecionado ? '#78825B' : '#ddd' }}>
                          {selecionado ? '✓' : '+'}
                        </span>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13 }}>{p.nome}</p>
                          <p style={{ fontSize: 11, color: '#888' }}>{p.marca}</p>
                        </div>
                      </div>
                    );
                  })}
                  {produtosParaKit.length === 0 && (
                    <p style={{ color: '#aaa', fontSize: 13, padding: '8px 0' }}>Nenhum produto encontrado</p>
                  )}
                </div>
              </div>

              <div style={styles.checks}>
                <label style={styles.checkLabel}><input type="checkbox" checked={formKit.ativo} onChange={e => setFormKit({ ...formKit, ativo: e.target.checked })} /> ✅ Kit ativo</label>
              </div>
              <div style={styles.botoes}>
                <button style={styles.btnSalvar} onClick={salvarKit} disabled={salvando}>
                  {salvando ? 'Salvando...' : editandoKit ? '💾 Salvar Kit' : '➕ Criar Kit'}
                </button>
                {editandoKit && (
                  <button style={styles.btnCancelar} onClick={() => { setFormKit(kitVazio); setEditandoKit(null); setProdutosDoKit([]); }}>
                    Cancelar
                  </button>
                )}
              </div>
            </section>

            <section style={styles.card}>
              <div style={styles.listaHeader}>
                <h2 style={styles.cardTitulo}>🎁 Kits cadastrados ({kits.length})</h2>
                <div style={styles.buscaWrapper}>
                  <span>🔍</span>
                  <input
                    style={styles.buscaInput}
                    placeholder="Buscar kit..."
                    value={buscaKit}
                    onChange={e => setBuscaKit(e.target.value)}
                  />
                  {buscaKit && <button style={styles.buscaLimpar} onClick={() => setBuscaKit('')}>✕</button>}
                </div>
              </div>
              {buscaKit && <p style={styles.buscaInfo}>{kitsFiltrados.length} kit(s) encontrado(s)</p>}
              {carregando ? <p style={{ color: '#aaa' }}>Carregando...</p> : kitsFiltrados.length === 0 ? (
                <p style={{ color: '#aaa' }}>Nenhum kit encontrado.</p>
              ) : (
                <div style={styles.lista}>
                  {kitsFiltrados.map(k => (
                    <div key={k.id} style={{ ...styles.item, opacity: k.ativo ? 1 : 0.5 }}>
                      {k.foto && <img src={k.foto} alt={k.nome} style={styles.itemFoto} />}
                      <div style={styles.itemInfo}>
                        <strong style={{ fontSize: 15 }}>{k.nome}</strong>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                          {k.ocasiao && <span style={styles.tag}>{k.ocasiao}</span>}
                          <span style={styles.tag}>{k.kit_produtos?.length || 0} produtos</span>
                          {!k.ativo && <span style={{ ...styles.tag, background: '#f8d7da', color: '#842029' }}>inativo</span>}
                        </div>
                      </div>
                      <div style={styles.itemAcoes}>
                        <button style={styles.btnEditar} onClick={() => editarKit(k)}>✏️ Editar</button>
                        <button style={styles.btnExcluir} onClick={() => excluirKit(k.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
    </AdminGuard >
  );
}

const styles = {
  page: { background: '#F3EFE9', minHeight: '100vh' },
  header: { background: '#fff', padding: '20px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 700, color: '#78825B' },
  voltar: { fontSize: 14, color: '#78825B', fontWeight: 600 },
  abas: { display: 'flex', background: '#fff', borderBottom: '2px solid #eee', padding: '0 32px' },
  aba: { padding: '16px 24px', border: 'none', background: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#999', borderBottom: '3px solid transparent', marginBottom: -2 },
  abaAtiva: { color: '#78825B', borderBottom: '3px solid #78825B' },
  main: { maxWidth: 960, margin: '32px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 32 },
  mensagem: { padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600 },
  card: { background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTitulo: { fontSize: 18, fontWeight: 700, color: '#3a3a3a', marginBottom: 0 },
  listaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  buscaWrapper: { display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 50, padding: '8px 16px', minWidth: 240 },
  buscaInput: { flex: 1, border: 'none', background: 'transparent', fontSize: 13, outline: 'none', fontFamily: 'inherit' },
  buscaLimpar: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 14, padding: 2 },
  buscaInfo: { fontSize: 12, color: '#aaa', marginBottom: 12 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '10px 14px', borderRadius: 8, border: '2px solid #eee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' },
  previewWrapper: { marginTop: 12, borderRadius: 12, overflow: 'hidden', border: '2px solid #eee', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  previewImg: { width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 10 },
  checks: { display: 'flex', gap: 24, margin: '16px 0' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' },
  botoes: { display: 'flex', gap: 12 },
  btnSalvar: { background: '#78825B', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
  btnCancelar: { background: 'none', color: '#999', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, border: '2px solid #eee', cursor: 'pointer' },
  gridSelecao: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginTop: 10 },
  cardSelecao: { padding: '10px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' },
  checkSelecao: { width: 24, height: 24, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 },
  lista: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 10, border: '1px solid #eee', flexWrap: 'wrap', gap: 8 },
  itemFoto: { width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 },
  itemInfo: { flex: 1 },
  tag: { fontSize: 11, background: '#f0f0f0', padding: '3px 8px', borderRadius: 20, color: '#666' },
  itemAcoes: { display: 'flex', gap: 8 },
  btnToggle: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', background: 'none', cursor: 'pointer' },
  btnEditar: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: 'none', background: '#78825B', color: '#fff', cursor: 'pointer' },
  btnExcluir: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: 'none', background: '#f8d7da', cursor: 'pointer' },
};