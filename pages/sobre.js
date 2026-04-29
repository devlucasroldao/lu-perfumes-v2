import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Sobre() {
  const [sacola, setSacola] = useState([]);

  useEffect(() => {
    const salva = localStorage.getItem('sacola');
    if (salva) setSacola(JSON.parse(salva));
  }, []);

  return (
    <div style={styles.page}>
      <Head>
        <title>Sobre a Lu — Lu Perfumes & Presentes</title>
        <meta name="description" content="Conheça a Lu, revendedora apaixonada por perfumes e cosméticos em Arroio do Sal - RS." />
      </Head>

      <Navbar sacolaCount={sacola.length} />

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.fotoWrapper} className="animate-fade-left">
            <img src="/lu-foto.jpg" alt="Lu" style={styles.foto} />
            <div style={styles.fotoBadge}>🌸 Revendedora oficial</div>
          </div>
          <div style={styles.heroTexto} className="animate-fade-right">
            <span style={styles.heroBadge}>Sobre a Lu</span>
            <h1 style={styles.heroTitulo}>Olá, eu sou a Lu!</h1>
            <p style={styles.heroSubtitulo}>
              Revendedora apaixonada por perfumes, cosméticos e por ajudar cada cliente a encontrar o presente perfeito.
            </p>
            <div style={styles.heroBotoes}>
              <a href="https://wa.me/5551980272657" target="_blank" rel="noopener noreferrer" style={styles.btnWhats} className="btn-hover">📲 Falar com a Lu</a>
              <Link href="/catalogo" style={styles.btnCatalogo} className="btn-hover">Ver Catálogo 🌸</Link>
            </div>
            <div style={styles.heroStats}>
              {[
                { numero: '5+', label: 'Anos de experiência' },
                { numero: '5', label: 'Marcas parceiras' },
                { numero: '⭐', label: 'Atendimento 5 estrelas' },
              ].map((s, i) => (
                <div key={i} style={styles.heroStat}>
                  <span style={styles.heroStatNum}>{s.numero}</span>
                  <span style={styles.heroStatLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* História */}
      <section style={styles.section}>
        <div style={styles.historia}>
          <div style={styles.historiaTexto} className="animate-fade-left">
            <div style={styles.sectionBadge}>💛 Minha história</div>
            <h2 style={styles.sectionTitulo}>De onde veio essa paixão?</h2>
            <p style={styles.texto}>
              Tudo começou com o desejo de compartilhar produtos de qualidade com pessoas especiais. Hoje trabalho com O Boticário, Natura, Eudora, Avon e Mary Kay — levando beleza e cuidado pra cada cliente.
            </p>
            <p style={styles.texto}>
              Atendo com carinho e atenção personalizada. Meu objetivo é sempre encontrar o produto certo pra cada momento especial da sua vida.
            </p>
            <p style={styles.texto}>
              Em dúvida sobre qual perfume escolher ou precisa de um kit presente? É só me chamar!
            </p>
          </div>
          <div style={styles.historiaSide} className="animate-fade-right">
            {[
              { emoji: '🎁', titulo: 'Kits personalizados', texto: 'Monte o kit perfeito pra qualquer ocasião' },
              { emoji: '✨', titulo: 'Atendimento especial', texto: 'Atenção personalizada pro seu perfil' },
              { emoji: '📲', titulo: 'Pelo WhatsApp', texto: 'Tire dúvidas e faça pedidos direto comigo' },
              { emoji: '🚚', titulo: 'Entrega local', texto: 'Atendo em Arroio do Sal e região' },
            ].map((c, i) => (
              <div key={i} style={styles.card} className="card-hover">
                <span style={styles.cardEmoji}>{c.emoji}</span>
                <div>
                  <h3 style={styles.cardTitulo}>{c.titulo}</h3>
                  <p style={styles.cardTexto}>{c.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section style={styles.contato}>
        <div style={styles.contatoContent} className="animate-fade">
          <h2 style={styles.contatoTitulo}>Vamos conversar? 💬</h2>
          <p style={styles.contatoSubtitulo}>Tire suas dúvidas ou faça seu pedido direto comigo!</p>
          <div style={styles.contatoBotoes}>
            <a href="https://wa.me/5551980272657" target="_blank" rel="noopener noreferrer" style={styles.btnWhatsGrande} className="btn-hover">📲 WhatsApp</a>
            <a href="https://www.instagram.com/lu_roldaoperfumes/" target="_blank" rel="noopener noreferrer" style={styles.btnInsta} className="btn-hover">📷 Instagram</a>
          </div>
          <div style={styles.contatoInfos}>
            <div style={styles.contatoInfo}>
              <span>📍</span>
              <span>Rua Adalberto Torres, 365 — Arroio do Sal, RS</span>
            </div>
            <div style={styles.contatoInfo}>
              <span>📱</span>
              <span>(51) 98027-2657</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: { background: 'var(--bege)', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #4a5a35 0%, var(--verde) 100%)', padding: '72px 24px' },
  heroContent: { maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 60, alignItems: 'center' },
  fotoWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  foto: { width: 220, height: 220, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  fotoBadge: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '7px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600 },
  heroTexto: { color: '#fff' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 14 },
  heroTitulo: { fontSize: 38, fontWeight: 900, marginBottom: 14, lineHeight: 1.2 },
  heroSubtitulo: { fontSize: 16, opacity: 0.85, lineHeight: 1.7, marginBottom: 24 },
  heroBotoes: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 },
  btnWhats: { background: '#25D366', color: '#fff', padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14 },
  btnCatalogo: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: '2px solid rgba(255,255,255,0.4)' },
  heroStats: { display: 'flex', gap: 28 },
  heroStat: { display: 'flex', flexDirection: 'column', gap: 3 },
  heroStatNum: { fontSize: 26, fontWeight: 900 },
  heroStatLabel: { fontSize: 11, opacity: 0.75 },
  section: { maxWidth: 960, margin: '72px auto', padding: '0 24px' },
  historia: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 56, alignItems: 'start' },
  historiaTexto: { display: 'flex', flexDirection: 'column', gap: 16 },
  sectionBadge: { display: 'inline-block', background: 'var(--bege)', color: 'var(--verde)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 4 },
  sectionTitulo: { fontSize: 28, fontWeight: 800, color: 'var(--texto)', marginBottom: 4, lineHeight: 1.3 },
  texto: { fontSize: 15, color: '#666', lineHeight: 1.8 },
  historiaSide: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', transition: 'all 0.3s' },
  cardEmoji: { fontSize: 26, flexShrink: 0 },
  cardTitulo: { fontSize: 14, fontWeight: 700, color: 'var(--texto)', marginBottom: 3 },
  cardTexto: { fontSize: 13, color: '#888', lineHeight: 1.5 },
  contato: { background: 'linear-gradient(135deg, var(--verde) 0%, #9aab7a 100%)', padding: '72px 24px', textAlign: 'center' },
  contatoContent: { maxWidth: 560, margin: '0 auto' },
  contatoTitulo: { fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 10 },
  contatoSubtitulo: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 32, lineHeight: 1.6 },
  contatoBotoes: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 },
  btnWhatsGrande: { background: '#25D366', color: '#fff', padding: '14px 36px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnInsta: { background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', padding: '14px 36px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  contatoInfos: { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' },
  contatoInfo: { display: 'flex', gap: 10, alignItems: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 14 },
};