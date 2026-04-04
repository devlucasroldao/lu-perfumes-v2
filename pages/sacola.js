import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

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
    const numero = '5551980272657'; // 
    const lista = sacola.map(p => `• ${p.nome} - ${p.marca}`).join('\n');
    const mensagem = `Olá Lu! 🌸 Tenho interesse nesses produtos:\n\n${lista}\n\nPoderia me passar mais informações?`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <Navbar sacolaCount={sacola.length} />
      <main style={styles.main}>
        <h1 style={styles.titulo}>Minha Sacola 🛍️</h1>

        {sacola.length === 0 ? (
          <div style={styles.vazia}>
            <p style={styles.vaziaTxt}>Sua sacola está vazia 😊</p>
            <Link href="/catalogo" style={styles.btnVer}>Ver Catálogo</Link>
          </div>
        ) : (
          <>
            <div style={styles.lista}>
              {sacola.map((produto, index) => (
                <div key={index} style={styles.item}>
                  <img
                    src={produto.foto || 'https://placehold.co/80x80?text=Sem+foto'}
                    alt={produto.nome}
                    style={styles.foto}
                  />
                  <div style={styles.itemInfo}>
                    <span style={styles.marca}>{produto.marca}</span>
                    <h3 style={styles.nome}>{produto.nome}</h3>
                    <p style={styles.desc}>{produto.descricao}</p>
                  </div>
                  <button style={styles.remover} onClick={() => remover(index)}>✕</button>
                </div>
              ))}
            </div>

            <div style={styles.rodape}>
              <p style={styles.total}>
                {sacola.length} {sacola.length === 1 ? 'produto' : 'produtos'} na sacola
              </p>
              <button style={styles.btnWhats} onClick={enviarWhatsApp}>
                📲 Enviar para WhatsApp da Lu
              </button>
              <div style={styles.rodapeBotoes}>
                <Link href="/catalogo" style={styles.btnContinuar}>+ Continuar comprando</Link>
                <button style={styles.btnLimpar} onClick={limparSacola}>🗑️ Limpar sacola</button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  main: { maxWidth: 800, margin: '60px auto', padding: '0 24px' },
  titulo: { fontSize: 28, fontWeight: 700, marginBottom: 32, color: 'var(--texto)' },
  vazia: { textAlign: 'center', padding: '80px 0' },
  vaziaTxt: { fontSize: 18, color: '#aaa', marginBottom: 24 },
  btnVer: { background: 'var(--rosa)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700 },
  lista: { display: 'flex', flexDirection: 'column', gap: 16 },
  item: { background: '#fff', borderRadius: 12, padding: 16, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  foto: { width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 },
  itemInfo: { flex: 1 },
  marca: { fontSize: 11, fontWeight: 600, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1 },
  nome: { fontSize: 16, fontWeight: 600, margin: '4px 0' },
  desc: { fontSize: 13, color: '#888' },
  remover: { background: 'none', color: '#ccc', fontSize: 18, padding: 8, borderRadius: '50%', cursor: 'pointer', flexShrink: 0 },
  rodape: { marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  total: { fontSize: 16, color: '#888' },
  btnWhats: { background: '#25D366', color: '#fff', padding: '16px 40px', borderRadius: 50, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', width: '100%', maxWidth: 400 },
  rodapeBotoes: { display: 'flex', gap: 24, alignItems: 'center' },
  btnContinuar: { color: 'var(--verde)', fontWeight: 600, fontSize: 14 },
  btnLimpar: { background: 'none', border: 'none', color: '#ccc', fontSize: 13, cursor: 'pointer' },
};