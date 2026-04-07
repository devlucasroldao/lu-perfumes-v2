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
            <p style={styles.heroSubtitulo}>Revendedora apaixonada por perfumes, cosméticos e por ajudar cada cliente a encontrar o presente perfeito — seja pra si mesmo ou pra quem ama.</p>
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
            <p style={styles.texto}>Tudo começou com a paixão por cosméticos e o desejo de compartilhar produtos de qualidade com pessoas especiais. Hoje, trabalho com as melhores marcas do mercado — O Boticário, Natura, Eudora, Avon e Mary Kay — levando beleza, cuidado e presentes incríveis pra cada cliente.</p>
            <p style={styles.texto}>Atendo com carinho e atenção personalizada. Cada cliente é único, e meu objetivo é sempre encontrar o produto certo pra cada momento especial da sua vida.</p>
            <p style={styles.texto}>Se você está em dúvida sobre qual perfume escolher, precisa de um kit presente ou quer descobrir novos produtos, é só me chamar — adoro ajudar!</p>
          </div>
          <div style={styles.historiaSide} className="animate-fade-right">
            {[
              { emoji: '🎁', titulo: 'Kits personalizados', texto: 'Monte o kit perfeito pra qualquer ocasião com a ajuda da Lu' },
              { emoji: '✨', titulo: 'Atendimento especial', texto: 'Cada cliente recebe atenção personalizada e produtos ideais pro seu perfil' },
              { emoji: '🌿', titulo: 'Marcas de qualidade', texto: 'Trabalho apenas com marcas reconhecidas e produtos originais' },
              { emoji: '📲', titulo: 'Atendimento pelo WhatsApp', texto: 'Tire suas dúvidas e faça pedidos diretamente pelo WhatsApp' },
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

      {/* Marcas */}
      <section style={styles.marcasSection}>
        <div style={styles.marcasContent}>
          <div style={styles.sectionBadge}>💄 Marcas que trabalho</div>
          <h2 style={styles.sectionTitulo}>Produtos originais das melhores marcas</h2>
          <div style={styles.marcasGrid} className="animate-fade delay-2">
            {['O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'].map(m => (
              <Link key={m} href={`/catalogo?marca=${m}`} style={styles.marcaCard} className="card-hover">
                <span style={styles.marcaEmoji}>🌸</span>
                <span style={styles.marcaNome}>{m}</span>
                <span style={styles.marcaVerMais}>Ver produtos →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimento / frase */}
      <section style={styles.fraseSection}>
        <div style={styles.fraseContent} className="animate-fade">
          <span style={styles.fraseAspas}>"</span>
          <p style={styles.frase}>Meu maior presente é ver a felicidade de quem recebe um produto especial. Cada entrega é feita com muito carinho!</p>
          <div style={styles.fraseAutor}>
            <img src="/lu-foto.jpg" alt="Lu" style={styles.fraseAutorFoto} />
            <div>
              <p style={styles.fraseAutorNome}>Lu Roldão</p>
              <p style={styles.fraseAutorCargo}>Fundadora — Lu Perfumes & Presentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section style={styles.contato}>
        <div style={styles.contatoContent} className="animate-fade">
          <div style={styles.sectionBadge} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>💬 Vamos conversar?</div>
          <h2 style={styles.contatoTitulo}>Pronta pra te atender!</h2>
          <p style={styles.contatoSubtitulo}>Tire suas dúvidas, peça sugestões ou faça seu pedido direto comigo!</p>
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
  hero: { background: 'linear-gradient(135deg, #4a5a35 0%, var(--verde) 100%)', padding: '80px 24px' },
  heroContent: { maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 60, alignItems: 'center' },
  fotoWrapper: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  foto: { width: 260, height: 260, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  fotoBadge: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, backdropFilter: 'blur(8px)' },
  heroTexto: { color: '#fff' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 },
  heroTitulo: { fontSize: 42, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 },
  heroSubtitulo: { fontSize: 16, opacity: 0.85, lineHeight: 1.7, marginBottom: 28 },
  heroBotoes: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 },
  btnWhats: { background: '#25D366', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
  btnCatalogo: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid rgba(255,255,255,0.4)' },
  heroStats: { display: 'flex', gap: 32 },
  heroStat: { display: 'flex', flexDirection: 'column', gap: 4 },
  heroStatNum: { fontSize: 28, fontWeight: 900 },
  heroStatLabel: { fontSize: 12, opacity: 0.75 },
  section: { maxWidth: 1000, margin: '80px auto', padding: '0 24px' },
  historia: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, alignItems: 'start' },
  historiaTexto: { display: 'flex', flexDirection: 'column', gap: 16 },
  sectionBadge: { display: 'inline-block', background: 'var(--bege)', color: 'var(--verde)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 8 },
  sectionTitulo: { fontSize: 30, fontWeight: 800, color: 'var(--texto)', marginBottom: 8, lineHeight: 1.3 },
  texto: { fontSize: 15, color: '#666', lineHeight: 1.8 },
  historiaSide: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'all 0.3s' },
  cardEmoji: { fontSize: 28, flexShrink: 0 },
  cardTitulo: { fontSize: 15, fontWeight: 700, color: 'var(--texto)', marginBottom: 4 },
  cardTexto: { fontSize: 13, color: '#888', lineHeight: 1.5 },
  marcasSection: { background: '#fff', padding: '60px 24px' },
  marcasContent: { maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 },
  marcasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16, marginTop: 24 },
  marcaCard: { background: 'var(--bege)', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', border: '2px solid transparent', transition: 'all 0.2s' },
  marcaEmoji: { fontSize: 28 },
  marcaNome: { fontSize: 15, fontWeight: 700, color: 'var(--texto)' },
  marcaVerMais: { fontSize: 12, color: 'var(--verde)', fontWeight: 600 },
  fraseSection: { background: 'var(--bege)', padding: '60px 24px' },
  fraseContent: { maxWidth: 700, margin: '0 auto', textAlign: 'center' },
  fraseAspas: { fontSize: 80, color: 'var(--verde)', lineHeight: 0.5, display: 'block', marginBottom: 24, fontFamily: 'Georgia, serif' },
  frase: { fontSize: 20, color: 'var(--texto)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 32 },
  fraseAutor: { display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' },
  fraseAutorFoto: { width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--verde)' },
  fraseAutorNome: { fontSize: 15, fontWeight: 700, color: 'var(--texto)' },
  fraseAutorCargo: { fontSize: 13, color: '#aaa' },
  contato: { background: 'linear-gradient(135deg, var(--verde) 0%, #9aab7a 100%)', padding: '80px 24px', textAlign: 'center' },
  contatoContent: { maxWidth: 600, margin: '0 auto' },
  contatoTitulo: { fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12, marginTop: 12 },
  contatoSubtitulo: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 36, lineHeight: 1.6 },
  contatoBotoes: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 },
  btnWhatsGrande: { background: '#25D366', color: '#fff', padding: '16px 40px', borderRadius: 50, fontWeight: 700, fontSize: 16 },
  btnInsta: { background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', padding: '16px 40px', borderRadius: 50, fontWeight: 700, fontSize: 16 },
  contatoInfos: { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' },
  contatoInfo: { display: 'flex', gap: 10, alignItems: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 14 },
};