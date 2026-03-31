import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const campoVazio = { nome: '', marca: '', descricao: '', linha: 'feminino', tipo: 'floral', foto: '', destaque: false, ativo: true };

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(campoVazio);
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => { buscarProdutos(); }, []);

  const buscarProdutos = async () => {
    setCarregando(true);
    const { data } = await supabase.from('produtos').select('*').order('id', { ascending: false });
    if (data) setProdutos(data);
    setCarregando(false);
  };

  const salvar = async () => {
    if (!form.nome || !form.marca) {
      setMensagem('⚠️ Nome e marca são obrigatórios!');
      setTimeout(() => setMensagem(''), 3000);
      return;
    }
    setSalvando(true);
    if (editando) {
      await supabase.from('produtos').update(form).eq('id', editando);
      setMensagem('✅ Produto atualizado!');
    } else {
      await supabase.from('produtos').insert([form]);
      setMensagem('✅ Produto adicionado!');
    }
    setForm(campoVazio);
    setEditando(null);
    setSalvando(false);
    buscarProdutos();
    setTimeout(() => setMensagem(''), 3000);
  };

  const editar = (produto) => {
    setForm(produto);
    setEditando(produto.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluir = async (id) => {
    if (!confirm('Tem certeza que quer excluir esse produto?')) return;
    await supabase.from('produtos').delete().eq('id', id);
    setMensagem('🗑️ Produto removido!');
    buscarProdutos();
    setTimeout(() => setMensagem(''), 3000);
  };

  const toggle = async (produto) => {
    await supabase.from('produtos').update({ ativo: !produto.ativo }).eq('id', produto.id);
    buscarProdutos();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🌸 Painel Admin — Lu Perfumes</h1>
        <a href="/" style={styles.voltar}>← Ver site</a>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.cardTitulo}>{editando ? '✏️ Editar Produto' : '➕ Novo Produto'}</h2>
          {mensagem && <div style={styles.mensagem}>{mensagem}</div>}

          <div style={styles.grid2}>
            <div style={styles.campo}>
              <label style={styles.label}>Nome do Produto *</label>
              <input style={styles.input} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Malbec Gold" />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Marca *</label>
              <select style={styles.input} value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })}>
                <option value="">Selecione...</option>
                {['O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Linha</label>
              <select style={styles.input} value={form.linha} onChange={e => setForm({ ...form, linha: e.target.value })}>
                {['feminino', 'masculino', 'kids', 'baby'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Tipo de Fragrância</label>
              <select style={styles.input} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                {['floral', 'amadeirado', 'citrico', 'doce', 'frutal'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ ...styles.campo, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Descrição</label>
              <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva o produto..." />
            </div>
            <div style={{ ...styles.campo, gridColumn: '1 / -1' }}>
              <label style={styles.label}>URL da Foto</label>
              <input style={styles.input} value={form.foto} onChange={e => setForm({ ...form, foto: e.target.value })} placeholder="https://..." />
              {form.foto && <img src={form.foto} alt="preview" style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }} />}
            </div>
          </div>

          <div style={styles.checks}>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.destaque} onChange={e => setForm({ ...form, destaque: e.target.checked })} />
              ⭐ Destaque na Home
            </label>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
              ✅ Produto ativo
            </label>
          </div>

          <div style={styles.botoes}>
            <button style={styles.btnSalvar} onClick={salvar} disabled={salvando}>
              {salvando ? 'Salvando...' : editando ? '💾 Salvar alterações' : '➕ Adicionar produto'}
            </button>
            {editando && (
              <button style={styles.btnCancelar} onClick={() => { setForm(campoVazio); setEditando(null); }}>
                Cancelar
              </button>
            )}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitulo}>📦 Produtos cadastrados ({produtos.length})</h2>
          {carregando ? (
            <p style={{ color: '#aaa' }}>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p style={{ color: '#aaa' }}>Nenhum produto ainda. Adicione o primeiro! 👆</p>
          ) : (
            <div style={styles.lista}>
              {produtos.map(p => (
                <div key={p.id} style={{ ...styles.item, opacity: p.ativo ? 1 : 0.5 }}>
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
                    <button style={styles.btnToggle} onClick={() => toggle(p)}>
                      {p.ativo ? '⏸️ Desativar' : '▶️ Ativar'}
                    </button>
                    <button style={styles.btnEditar} onClick={() => editar(p)}>✏️ Editar</button>
                    <button style={styles.btnExcluir} onClick={() => excluir(p.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: { background: '#F3EFE9', minHeight: '100vh' },
  header: { background: '#fff', padding: '20px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 700, color: '#78825B' },
  voltar: { fontSize: 14, color: '#78825B', fontWeight: 600 },
  main: { maxWidth: 960, margin: '32px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 32 },
  card: { background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTitulo: { fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#3a3a3a' },
  mensagem: { background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '10px 14px', borderRadius: 8, border: '2px solid #eee', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' },
  checks: { display: 'flex', gap: 24, margin: '16px 0' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' },
  botoes: { display: 'flex', gap: 12 },
  btnSalvar: { background: '#78825B', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' },
  btnCancelar: { background: 'none', color: '#999', padding: '12px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, border: '2px solid #eee', cursor: 'pointer' },
  lista: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 10, border: '1px solid #eee', flexWrap: 'wrap', gap: 8 },
  itemInfo: { flex: 1 },
  tag: { fontSize: 11, background: '#f0f0f0', padding: '3px 8px', borderRadius: 20, color: '#666' },
  itemAcoes: { display: 'flex', gap: 8 },
  btnToggle: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', background: 'none', cursor: 'pointer' },
  btnEditar: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: 'none', background: '#78825B', color: '#fff', cursor: 'pointer' },
  btnExcluir: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: 'none', background: '#f8d7da', cursor: 'pointer' },
};