import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Head from 'next/head';

export default function Sacola() {
  const [sacola, setSacola] = useState([]);

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
  }, []);

  const remover = (index) => {
    const nova = sacola.filter((_, i) => i !== index);
    setSacola(nova);
    localStorage.setItem('sacola', JSON.stringify(nova));
  };

  const limparSacola = () => {
    setSacola([]);
    localStorage.removeItem('sacola');
  };

  const enviarWhatsApp = () => {
    if (sacola.length === 0) return;
    const numero = '5551980272657';
    const lista = sacola.map(p => `• ${p.nome} - ${p.marca}`).join('\n');
    const mensagem = `Olá Lu! 🌸 Tenho interesse nesses produtos:\n\n${lista}\n\nPoderia me passar mais informações?`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div style={styles.page}>
      <Head>
        <title>Minha Sacola — Lu Perfumes & Presentes</title>
        <meta name="description" content="Veja os produtos selecionados e envie sua lista direto pro WhatsApp da Lu." />
      </Head>

      <Navbar sacolaCount={sacola.length} />

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.titulo}>Minha Sacola 🛍️</h1>
          <p style={styles.subtitulo}>{sacola.length === 0 ? 'Sua sacola está vazia' : `${sacola.length} ${sacola.length === 1 ? 'produto selecionado' : 'produtos selecionados'}`}</p>
        </div>

        {sacola.length === 0 ? (
          <div style={styles.vazia}>
            <div style={styles.vaziaIcone}>🛍️</div>
            <h2 style={styles.vaziaTitulo}>Sua sacola está vazia</h2>
            <p style={styles.vaziaTexto}>Navegue pelo catálogo e adicione os produtos que você ama!</p>
            <div style={styles.vaziaBotoes}>
              <Link href="/catalogo" style={styles.btnCatalogo}>Ver Catálogo 🌸</Link>
              <Link href="/kits" style={styles.btnKits}>Ver Kits 🎁</Link>
            </div>
          </div>
        ) : (
          <div style={styles.layout} className="sacola-layout">
            <div style={styles.lista}>
              <div style={styles.listaHeader}>
                <h2 style={styles.listaTitulo}>Produtos selecionados</h2>
                <button style={styles.btnLimpar} onClick={limparSacola}>🗑️ Limpar tudo</button>
              </div>

              {sacola.map((produto, index) => (
                <div key={index} style={styles.item}>
                  <img src={produto.foto || 'https://placehold.co/100x100?text=Sem+foto'} alt={produto.nome} style={styles.itemFoto} />
                  <div style={styles.itemInfo}>
                    <span style={styles.itemMarca}>{produto.marca}</span>
                    <h3 style={styles.itemNome}>{produto.nome}</h3>
                    <p style={styles.itemDesc}>{produto.descricao}</p>
                    <Link href={`/produto/${produto.id}`} style={styles.itemLink}>Ver detalhes →</Link>
                  </div>
                  <button style={styles.itemRemover} onClick={() => remover(index)}>✕</button>
                </div>
              ))}

              <div style={styles.continuar}>
                <Link href="/catalogo" style={styles.btnContinuar}>+ Continuar adicionando produtos</Link>
              </div>
            </div>

            <div style={styles.resumo} className="sacola-resumo-sticky">
              <div style={styles.resumoCard}>
                <h2 style={styles.resumoTitulo}>Resumo</h2>
                <div style={styles.resumoInfo}>
                  <div style={styles.resumoLinha}>
                    <span style={styles.resumoLabel}>Produtos</span>
                    <span style={styles.resumoValor}>{sacola.length}</span>
                  </div>
                  <div style={styles.resumoDivisor} />
                  <p style={styles.resumoAviso}>💬 Os preços são consultados diretamente com a Lu. Ela responde rapidinho!</p>
                </div>
                <button style={styles.btnWhats} onClick={enviarWhatsApp}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar para WhatsApp da Lu
                </button>
                <p style={styles.resumoRodape}>A Lu vai responder com os preços e disponibilidade de cada produto 🌸</p>
              </div>

              <div style={styles.sugestao}>
                <span style={styles.sugestaoEmoji}>🎁</span>
                <div>
                  <p style={styles.sugestaoTitulo}>Quer montar um kit?</p>
                  <p style={styles.sugestaoTexto}>A Lu pode embrulhar tudo bonitinho pra presente!</p>
                </div>
                <Link href="/kits" style={styles.sugestaoBtn}>Ver kits</Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' },
  header: { marginBottom: 32 },
  titulo: { fontSize: 32, fontWeight: 800, color: 'var(--texto)' },
  subtitulo: { fontSize: 16, color: '#aaa', marginTop: 4 },
  vazia: { background: '#fff', borderRadius: 24, padding: '80px 40px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  vaziaIcone: { fontSize: 64, marginBottom: 16 },
  vaziaTitulo: { fontSize: 24, fontWeight: 700, color: 'var(--texto)', marginBottom: 8 },
  vaziaTexto: { fontSize: 16, color: '#888', marginBottom: 32, lineHeight: 1.6 },
  vaziaBotoes: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnCatalogo: { background: 'var(--rosa)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnKits: { background: 'transparent', color: 'var(--verde)', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid var(--verde)' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' },
  lista: { display: 'flex', flexDirection: 'column', gap: 16 },
  listaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  listaTitulo: { fontSize: 18, fontWeight: 700, color: 'var(--texto)' },
  btnLimpar: { background: 'none', border: 'none', color: '#ccc', fontSize: 13, cursor: 'pointer', fontWeight: 600 },
  item: { background: '#fff', borderRadius: 16, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  itemFoto: { width: 100, height: 100, objectFit: 'cover', borderRadius: 12, flexShrink: 0 },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  itemMarca: { fontSize: 10, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1.5 },
  itemNome: { fontSize: 16, fontWeight: 700, color: 'var(--texto)' },
  itemDesc: { fontSize: 13, color: '#aaa', lineHeight: 1.5 },
  itemLink: { fontSize: 13, color: 'var(--rosa)', fontWeight: 600, marginTop: 4 },
  itemRemover: { background: 'none', border: 'none', color: '#ddd', fontSize: 18, cursor: 'pointer', flexShrink: 0, padding: 4 },
  continuar: { textAlign: 'center', paddingTop: 8 },
  btnContinuar: { color: 'var(--verde)', fontWeight: 600, fontSize: 14 },
  resumo: { display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 },
  resumoCard: { background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 20 },
  resumoTitulo: { fontSize: 20, fontWeight: 800, color: 'var(--texto)' },
  resumoInfo: { display: 'flex', flexDirection: 'column', gap: 12 },
  resumoLinha: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resumoLabel: { fontSize: 14, color: '#888' },
  resumoValor: { fontSize: 16, fontWeight: 700, color: 'var(--texto)' },
  resumoDivisor: { height: 1, background: '#f0f0f0' },
  resumoAviso: { fontSize: 13, color: '#aaa', lineHeight: 1.6, background: '#f9f9f7', padding: '12px 14px', borderRadius: 10 },
  btnWhats: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '16px 0', borderRadius: 50, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', width: '100%' },
  resumoRodape: { fontSize: 12, color: '#bbb', textAlign: 'center', lineHeight: 1.5 },
  sugestao: { background: '#fff', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sugestaoEmoji: { fontSize: 28, flexShrink: 0 },
  sugestaoTitulo: { fontSize: 14, fontWeight: 700, color: 'var(--texto)', marginBottom: 2 },
  sugestaoTexto: { fontSize: 12, color: '#aaa' },
  sugestaoBtn: { background: 'var(--bege)', color: 'var(--verde)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, flexShrink: 0, border: '1px solid var(--verde)' },
};