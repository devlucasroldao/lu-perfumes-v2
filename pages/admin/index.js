import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const produtoVazio = { nome: '', marca: '', descricao: '', linha: 'feminino', tipo: 'floral', foto: '', destaque: false, ativo: true };
const kitVazio = { nome: '', descricao: '', ocasiao: '', foto: '', ativo: true };

export default function Admin() {
  const [aba, setAba] = useState('produtos');

  // Produtos
  const [produtos, setProdutos] = useState([]);
  const [formProduto, setFormProduto] = useState(produtoVazio);
  const [editandoProduto, setEditandoProduto] = useState(null);

  // Kits
  const [kits, setKits] = useState([]);
  const [formKit, setFormKit] = useState(kitVazio);
  const [editandoKit, setEditandoKit] = useState(null);
  const [produtosDoKit, setProdutosDoKit] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => { buscarTudo(); }, []);

  const buscarTudo = async () => {
    setCarregando(true);
    const { data: p } = await supabase.from('produtos').select('*').order('id', { ascending: false });
    const { data: k } = await supabase.from('kits').select('*, kit_produtos(*, produtos(*))').order('id', { ascending: false });
    if (p) setProdutos(p);
    if (k) setKits(k);
    setCarregando(false);
  };

  const mostrarMensagem = (msg) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), 3000);
  };

  // ─── PRODUTOS ───────────────────────────────────────

  const salvarProduto = async () => {
    if (!formProduto.nome || !formProduto.marca) { mostrarMensagem('⚠️ Nome e marca são obrigatórios!'); return; }
    setSalvando(true);
    if (editandoProduto) {
      await supabase.from('produtos').update(formProduto).eq('id', editandoProduto);
      mostrarMensagem('✅ Produto atualizado!');
    } else {
      await supabase.from('produtos').insert([formProduto]);
      mostrarMensagem('✅ Produto adicionado!');
    }
    setFormProduto(produtoVazio);
    setEditandoProduto(null);
    setSalvando(false);
    buscarTudo();
  };

  const editarProduto = (p) => {
    setFormProduto(p);
    setEditandoProduto(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirProduto = async (id) => {
    if (!confirm('Excluir produto?')) return;
    await supabase.from('produtos').delete().eq('id', id);
    mostrarMensagem('🗑️ Produto removido!');
    buscarTudo();
  };

  const toggleProduto = async (p) => {
    await supabase.from('produtos').update({ ativo: !p.ativo }).eq('id', p.id);
    buscarTudo();
  };

  // ─── KITS ───────────────────────────────────────────

  const salvarKit = async () => {
    if (!formKit.nome) { mostrarMensagem('⚠️ Nome do kit é obrigatório!'); return; }
    setSalvando(true);

    let kitId = editandoKit;

    if (editandoKit) {
      await supabase.from('kits').update(formKit).eq('id', editandoKit);
      await supabase.from('kit_produtos').delete().eq('kit_id', editandoKit);
    } else {
      const { data } = await supabase.from('kits').insert([formKit]).select();
      kitId = data?.[0]?.id;
    }

    if (produtosDoKit.length > 0) {
      const relacoes = produtosDoKit.map(pid => ({ kit_id: kitId, produto_id: pid }));
      await supabase.from('kit_produtos').insert(relacoes);
    }

    mostrarMensagem(editandoKit ? '✅ Kit atualizado!' : '✅ Kit criado!');
    setFormKit(kitVazio);
    setEditandoKit(null);
    setProdutosDoKit([]);
    setSalvando(false);
    buscarTudo();
  };

  const editarKit = (kit) => {
    setFormKit({ nome: kit.nome, descricao: kit.descricao, ocasiao: kit.ocasiao, foto: kit.foto, ativo: kit.ativo });
    setEditandoKit(kit.id);
    setProdutosDoKit(kit.kit_produtos?.map(kp => kp.produto_id) || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirKit = async (id) => {
    if (!confirm('Excluir kit?')) return;
    await supabase.from('kits').delete().eq('id', id);
    mostrarMensagem('🗑️ Kit removido!');
    buscarTudo();
  };

  const toggleProdutoKit = (id) => {
    setProdutosDoKit(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🌸 Painel Admin — Lu Perfumes</h1>
        <a href="/" style={styles.voltar}>← Ver site</a>
      </header>

      {/* Abas */}
      <div style={styles.abas}>
        <button style={{ ...styles.aba, ...(aba === 'produtos' ? styles.abaAtiva : {}) }} onClick={() => setAba('produtos')}>
          📦 Produtos ({produtos.length})
        </button>
        <button style={{ ...styles.aba, ...(aba === 'kits' ? styles.abaAtiva : {}) }} onClick={() => setAba('kits')}>
          🎁 Kits ({kits.length})
        </button>
      </div>

      <main style={styles.main}>
        {mensagem && <div style={styles.mensagem}>{mensagem}</div>}

        {/* ─── ABA PRODUTOS ─── */}
        {aba === 'produtos' && (
          <>
            <section style={styles.card}>
              <h2 style={styles.cardTitulo}>{editandoProduto ? '✏️ Editar Produto' : '➕ Novo Produto'}</h2>
              <div style={styles.grid2}>
                <div style={styles.campo}>
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
                  <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }} value={formProduto.descricao} onChange={e => setFormProduto({ ...formProduto, descricao: e.target.value })} />
                </div>
                <div style={{ ...styles.campo, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>URL da Foto</label>
                  <input style={styles.input} value={formProduto.foto} onChange={e => setFormProduto({ ...formProduto, foto: e.target.value })} placeholder="https://..." />
                  {formProduto.foto && <img src={formProduto.foto} alt="preview" style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }} />}
                </div>
              </div>
              <div style={styles.checks}>
                <label style={styles.checkLabel}><input type="checkbox" checked={formProduto.destaque} onChange={e => setFormProduto({ ...formProduto, destaque: e.target.checked })} /> ⭐ Destaque na Home</label>
                <label style={styles.checkLabel}><input type="checkbox" checked={formProduto.ativo} onChange={e => setFormProduto({ ...formProduto, ativo: e.target.checked })} /> ✅ Ativo</label>
              </div>
              <div style={styles.botoes}>
                <button style={styles.btnSalvar} onClick={salvarProduto} disabled={salvando}>{salvando ? 'Salvando...' : editandoProduto ? '💾 Salvar' : '➕ Adicionar'}</button>
                {editandoProduto && <button style={styles.btnCancelar} onClick={() => { setFormProduto(produtoVazio); setEditandoProduto(null); }}>Cancelar</button>}
              </div>
            </section>

            <section style={styles.card}>
              <h2 style={styles.cardTitulo}>📦 Produtos cadastrados ({produtos.length})</h2>
              {carregando ? <p style={{ color: '#aaa' }}>Carregando...</p> : (
                <div style={styles.lista}>
                  {produtos.map(p => (
                    <div key={p.id} style={{ ...styles.item, opacity: p.ativo ? 1 : 0.5 }}>
                      <div style={styles.itemInfo}>
                        <strong>{p.nome}</strong>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                          <span style={styles.tag}>{p.marca}</span>
                          <span style={styles.tag}>{p.linha}</span>
                          {p.destaque && <span style={{ ...styles.tag, background: '#fff3cd', color: '#856404' }}>⭐ destaque</span>}
                          {!p.ativo && <span style={{ ...styles.tag, background: '#f8d7da', color: '#842029' }}>inativo</span>}
                        </div>
                      </div>
                      <div style={styles.itemAcoes}>
                        <button style={styles.btnToggle} onClick={() => toggleProduto(p)}>{p.ativo ? '⏸️' : '▶️'}</button>
                        <button style={styles.btnEditar} onClick={() => editarProduto(p)}>✏️</button>
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
                  <label style={styles.label}>URL da Foto</label>
                  <input style={styles.input} value={formKit.foto} onChange={e => setFormKit({ ...formKit, foto: e.target.value })} placeholder="https://..." />
                  {formKit.foto && <img src={formKit.foto} alt="preview" style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }} />}
                </div>
              </div>

              {/* Seleção de produtos do kit */}
              <div style={{ marginTop: 24 }}>
                <label style={styles.label}>Produtos do Kit ({produtosDoKit.length} selecionados)</label>
                <div style={styles.gridSelecao}>
                  {produtos.filter(p => p.ativo).map(p => {
                    const selecionado = produtosDoKit.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        style={{ ...styles.cardSelecao, border: selecionado ? '2px solid var(--verde)' : '2px solid #eee', background: selecionado ? '#f0f4ea' : '#fff' }}
                        onClick={() => toggleProdutoKit(p.id)}
                      >
                        <span style={styles.checkSelecao}>{selecionado ? '✓' : '+'}</span>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13 }}>{p.nome}</p>
                          <p style={{ fontSize: 11, color: '#888' }}>{p.marca}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={styles.checks}>
                <label style={styles.checkLabel}><input type="checkbox" checked={formKit.ativo} onChange={e => setFormKit({ ...formKit, ativo: e.target.checked })} /> ✅ Kit ativo</label>
              </div>
              <div style={styles.botoes}>
                <button style={styles.btnSalvar} onClick={salvarKit} disabled={salvando}>{salvando ? 'Salvando...' : editandoKit ? '💾 Salvar Kit' : '➕ Criar Kit'}</button>
                {editandoKit && <button style={styles.btnCancelar} onClick={() => { setFormKit(kitVazio); setEditandoKit(null); setProdutosDoKit([]); }}>Cancelar</button>}
              </div>
            </section>

            <section style={styles.card}>
              <h2 style={styles.cardTitulo}>🎁 Kits cadastrados ({kits.length})</h2>
              {carregando ? <p style={{ color: '#aaa' }}>Carregando...</p> : kits.length === 0 ? (
                <p style={{ color: '#aaa' }}>Nenhum kit ainda. Crie o primeiro! 👆</p>
              ) : (
                <div style={styles.lista}>
                  {kits.map(k => (
                    <div key={k.id} style={{ ...styles.item, opacity: k.ativo ? 1 : 0.5 }}>
                      <div style={styles.itemInfo}>
                        <strong>{k.nome}</strong>
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
  );
}

const styles = {
  page: { background: '#F3EFE9', minHeight: '100vh' },
  header: { background: '#fff', padding: '20px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 700, color: '#78825B' },
  voltar: { fontSize: 14, color: '#78825B', fontWeight: 600 },
  abas: { display: 'flex', gap: 0, background: '#fff', borderBottom: '2px solid #eee', padding: '0 32px' },
  aba: { padding: '16px 24px', border: 'none', background: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#999', borderBottom: '3px solid transparent', marginBottom: -2 },
  abaAtiva: { color: '#78825B', borderBottom: '3px solid #78825B' },
  main: { maxWidth: 960, margin: '32px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 32 },
  mensagem: { background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: 8, fontSize: 14 },
  card: { background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTitulo: { fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#3a3a3a' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '10px 14px', borderRadius: 8, border: '2px solid #eee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' },
  checks: { display: 'flex', gap: 24, margin: '16px 0' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' },
  botoes: { display: 'flex', gap: 12 },
  btnSalvar: { background: '#78825B', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
  btnCancelar: { background: 'none', color: '#999', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, border: '2px solid #eee', cursor: 'pointer' },
  gridSelecao: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginTop: 10 },
  cardSelecao: { padding: '10px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' },
  checkSelecao: { width: 24, height: 24, borderRadius: '50%', background: 'var(--verde)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 },
  lista: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 10, border: '1px solid #eee', flexWrap: 'wrap', gap: 8 },
  itemInfo: { flex: 1 },
  tag: { fontSize: 11, background: '#f0f0f0', padding: '3px 8px', borderRadius: 20, color: '#666' },
  itemAcoes: { display: 'flex', gap: 8 },
  btnToggle: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', background: 'none', cursor: 'pointer' },
  btnEditar: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: 'none', background: '#78825B', color: '#fff', cursor: 'pointer' },
  btnExcluir: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: 'none', background: '#f8d7da', cursor: 'pointer' },
};