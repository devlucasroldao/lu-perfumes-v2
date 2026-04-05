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
        <div>
            <Head>
                <title>Sobre a Lu — Lu Perfumes & Presentes</title>
                <meta name="description" content="Conheça a Lu, revendedora apaixonada por perfumes e cosméticos em Arroio do Sal - RS." />
            </Head>
            <Navbar sacolaCount={sacola.length} />
            <main style={styles.main}>

                <section style={styles.hero}>
                    <div style={styles.heroContent}>
                        <img src="/lu-foto.jpg" alt="Lu" style={styles.fotoLu} />
                        <div style={styles.heroTexto}>
                            <span style={styles.tag}>Sobre a Lu</span>
                            <h1 style={styles.titulo}>Olá, eu sou a Lu!</h1>
                            <p style={styles.subtitulo}>Revendedora apaixonada por perfumes, cosméticos e por ajudar cada cliente a encontrar o presente perfeito — seja pra si mesmo ou pra quem ama.</p>
                            <div style={styles.heroBotoes}>
                                <a href="https://wa.me/5551980272657" target="_blank" rel="noopener noreferrer" style={styles.btnWhats}>📲 Falar com a Lu</a>
                                <Link href="/catalogo" style={styles.btnCatalogo}>Ver Catálogo 🌸</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section style={styles.section}>
                    <div style={styles.historia}>
                        <div style={styles.historiaTexto}>
                            <h2 style={styles.sectionTitulo}>Minha história 💛</h2>
                            <p style={styles.texto}>Tudo começou com a paixão por cosméticos e o desejo de compartilhar produtos de qualidade com pessoas especiais. Hoje, trabalho com as melhores marcas do mercado — O Boticário, Natura, Eudora, Avon e Mary Kay — levando beleza, cuidado e presentes incríveis pra cada cliente.</p>
                            <p style={styles.texto}>Atendo com carinho e atenção personalizada. Cada cliente é único, e meu objetivo é sempre encontrar o produto certo pra cada momento especial da sua vida.</p>
                            <p style={styles.texto}>Se você está em dúvida sobre qual perfume escolher, precisa de um kit presente ou quer descobrir novos produtos, é só me chamar — adoro ajudar!</p>
                        </div>
                        <div style={styles.historiaSide}>
                            <div style={styles.card}>
                                <span style={styles.cardEmoji}>🎁</span>
                                <h3 style={styles.cardTitulo}>Kits personalizados</h3>
                                <p style={styles.cardTexto}>Monte o kit perfeito pra qualquer ocasião com a ajuda da Lu</p>
                            </div>
                            <div style={styles.card}>
                                <span style={styles.cardEmoji}>✨</span>
                                <h3 style={styles.cardTitulo}>Atendimento especial</h3>
                                <p style={styles.cardTexto}>Cada cliente recebe atenção personalizada e produtos ideais pro seu perfil</p>
                            </div>
                            <div style={styles.card}>
                                <span style={styles.cardEmoji}>🌿</span>
                                <h3 style={styles.cardTitulo}>Marcas de qualidade</h3>
                                <p style={styles.cardTexto}>Trabalho apenas com marcas reconhecidas e produtos originais</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section style={styles.marcasSection}>
                    <h2 style={{ ...styles.sectionTitulo, textAlign: 'center' }}>Marcas que trabalho 💄</h2>
                    <div style={styles.marcas}>
                        {['O Boticário', 'Natura', 'Eudora', 'Avon', 'Mary Kay'].map(m => (
                            <Link key={m} href={`/catalogo?marca=${m}`} style={styles.marca}>{m}</Link>
                        ))}
                    </div>
                </section>

                <section style={styles.contato}>
                    <div style={styles.contatoContent}>
                        <h2 style={styles.contatoTitulo}>Vamos conversar? 💬</h2>
                        <p style={styles.contatoSubtitulo}>Tire suas dúvidas, peça sugestões ou faça seu pedido direto comigo!</p>
                        <div style={styles.contatoBotoes}>
                            <a href="https://wa.me/5551980272657" target="_blank" rel="noopener noreferrer" style={styles.btnWhatsGrande}>📲 WhatsApp</a>
                            <a href="https://www.instagram.com/lu_roldaoperfumes/" target="_blank" rel="noopener noreferrer" style={styles.btnInsta}>📷 Instagram</a>
                        </div>
                        <p style={styles.contatoHorario}>🕐 Atendimento: Segunda a Sábado, das 8h às 20h</p>
                    </div>
                </section>

            </main>
        </div>
    );
}

const styles = {
    main: { background: 'var(--bege)', minHeight: '100vh' },
    hero: { background: 'linear-gradient(135deg, var(--verde) 0%, #9aab7a 100%)', padding: '80px 24px' },
    heroContent: { maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 60, alignItems: 'center' },
    ilustracao: { width: 200, height: 200, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 },
    heroTexto: { color: '#fff' },
    tag: { background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
    fotoLu: { width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
    titulo: { fontSize: 40, fontWeight: 800, margin: '16px 0 12px' },
    subtitulo: { fontSize: 17, opacity: 0.9, lineHeight: 1.6, marginBottom: 32 },
    heroBotoes: { display: 'flex', gap: 16, flexWrap: 'wrap' },
    btnWhats: { background: '#25D366', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15 },
    btnCatalogo: { background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15, border: '2px solid rgba(255,255,255,0.5)' },
    section: { maxWidth: 1000, margin: '80px auto', padding: '0 24px' },
    historia: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 60, alignItems: 'start' },
    historiaTexto: { display: 'flex', flexDirection: 'column', gap: 16 },
    sectionTitulo: { fontSize: 28, fontWeight: 800, color: 'var(--texto)', marginBottom: 8 },
    texto: { fontSize: 16, color: '#666', lineHeight: 1.8 },
    historiaSide: { display: 'flex', flexDirection: 'column', gap: 16 },
    card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
    cardEmoji: { fontSize: 32, display: 'block', marginBottom: 12 },
    cardTitulo: { fontSize: 16, fontWeight: 700, color: 'var(--texto)', marginBottom: 8 },
    cardTexto: { fontSize: 14, color: '#888', lineHeight: 1.6 },
    marcasSection: { background: '#fff', padding: '60px 24px' },
    marcas: { maxWidth: 1000, margin: '24px auto 0', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
    marca: { background: 'var(--bege)', padding: '14px 28px', borderRadius: 50, fontWeight: 600, fontSize: 15, color: 'var(--verde)', border: '2px solid var(--verde)', transition: 'all 0.2s' },
    contato: { background: 'var(--verde)', padding: '80px 24px', textAlign: 'center' },
    contatoContent: { maxWidth: 600, margin: '0 auto' },
    contatoTitulo: { fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 12 },
    contatoSubtitulo: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 32, lineHeight: 1.6 },
    contatoBotoes: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 },
    btnWhatsGrande: { background: '#25D366', color: '#fff', padding: '16px 40px', borderRadius: 50, fontWeight: 700, fontSize: 16 },
    btnInsta: { background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', padding: '16px 40px', borderRadius: 50, fontWeight: 700, fontSize: 16 },
    contatoHorario: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
    footer: { background: '#3a3a3a', color: '#fff', textAlign: 'center', padding: '32px 24px' },
};