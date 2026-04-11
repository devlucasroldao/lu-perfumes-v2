import { useState } from 'react';

// ─── CONFIGURAÇÃO ATIVA ───────────────────────────────────────────
// Troca o conteúdo do CONFIG abaixo para ativar a promoção desejada!
// Quando não tiver promoção, deixa ativo: false

const CONFIG = {
  ativo: false,
  emoji: '🌸',
  mensagem: 'Bem-vinda à Lu Perfumes & Presentes!',
  linkTexto: 'Ver Catálogo',
  linkUrl: '/catalogo',
  cor: 'var(--rosa)',
  corTexto: '#fff',
};

// ─── DATAS FESTIVAS — COPIE E COLE NO CONFIG ACIMA ───────────────

// 💐 DIA DAS MÃES (2º domingo de maio)
// { ativo: true, emoji: '💐', mensagem: 'Dia das Mães chegando! Presenteie com amor e carinho!', linkTexto: 'Ver Kits', linkUrl: '/kits', cor: '#c9607a', corTexto: '#fff' }

// 👨 DIA DOS PAIS (2º domingo de agosto)
// { ativo: true, emoji: '👔', mensagem: 'Dia dos Pais! Perfumes especiais pra ele!', linkTexto: 'Ver Masculino', linkUrl: '/catalogo?linha=masculino', cor: '#3a5a8a', corTexto: '#fff' }

// 💑 DIA DOS NAMORADOS (12 de junho)
// { ativo: true, emoji: '❤️', mensagem: 'Dia dos Namorados — Surpreenda quem você ama!', linkTexto: 'Montar Kit', linkUrl: '/kits', cor: '#b5294a', corTexto: '#fff' }

// 🎄 NATAL (25 de dezembro)
// { ativo: true, emoji: '🎄', mensagem: 'Natal chegando! Kits especiais pra presentear!', linkTexto: 'Ver Kits', linkUrl: '/kits', cor: '#2d6a2d', corTexto: '#fff' }

// 🎆 ANO NOVO (1 de janeiro)
// { ativo: true, emoji: '🎆', mensagem: 'Feliz Ano Novo! Comece 2026 cheiroso! 🌸', linkTexto: 'Ver Catálogo', linkUrl: '/catalogo', cor: '#1a1a2e', corTexto: '#fff' }

// 👻 HALLOWEEN (31 de outubro)
// { ativo: true, emoji: '👻', mensagem: 'Halloween! Fragrâncias misteriosas e irresistíveis!', linkTexto: 'Ver Catálogo', linkUrl: '/catalogo', cor: '#7a3b00', corTexto: '#fff' }

// 🎉 BLACK FRIDAY (última sexta de novembro)
// { ativo: true, emoji: '🔥', mensagem: 'Black Friday na Lu Perfumes! Aproveite!', linkTexto: 'Ver Tudo', linkUrl: '/catalogo', cor: '#111', corTexto: '#fff' }

// 👶 DIA DAS CRIANÇAS (12 de outubro)
// { ativo: true, emoji: '🧸', mensagem: 'Dia das Crianças! Kits baby e kids especiais!', linkTexto: 'Ver Kids', linkUrl: '/catalogo?linha=kids', cor: '#e8a020', corTexto: '#fff' }

// 👩 DIA DA MULHER (8 de março)
// { ativo: true, emoji: '👩', mensagem: 'Dia Internacional da Mulher — Celebre com perfume!', linkTexto: 'Ver Feminino', linkUrl: '/catalogo?linha=feminino', cor: '#9b3a7a', corTexto: '#fff' }

// 🌹 DIA DE SÃO VALENTIM (14 de fevereiro)
// { ativo: true, emoji: '🌹', mensagem: 'Dia de São Valentim — Presentes especiais pra quem você ama!', linkTexto: 'Ver Kits', linkUrl: '/kits', cor: '#c0392b', corTexto: '#fff' }

// ☀️ VERÃO (dezembro a março)
// { ativo: true, emoji: '☀️', mensagem: 'Verão chegando! Fragrâncias frescas e cítricas!', linkTexto: 'Ver Cítricos', linkUrl: '/catalogo?tipo=citrico', cor: '#e07b20', corTexto: '#fff' }

// 🍂 INVERNO (junho a setembro)
// { ativo: true, emoji: '🍂', mensagem: 'No inverno, o perfume certo aquece ainda mais!', linkTexto: 'Ver Amadeirados', linkUrl: '/catalogo?tipo=amadeirado', cor: '#6b3a1f', corTexto: '#fff' }

// 🎓 FORMATURA (novembro e dezembro)
// { ativo: true, emoji: '🎓', mensagem: 'Época de formatura! Kits especiais pra presentear formandos!', linkTexto: 'Ver Kits', linkUrl: '/kits', cor: '#2c3e7a', corTexto: '#fff' }

// 👶 CHÁS DE BEBÊ (qualquer época)
// { ativo: true, emoji: '🍼', mensagem: 'Kits baby lindos para chás de bebê!', linkTexto: 'Ver Baby', linkUrl: '/catalogo?linha=baby', cor: '#7abfcf', corTexto: '#fff' }

// 🌸 PROMOÇÃO GENÉRICA
// { ativo: true, emoji: '🌸', mensagem: 'Promoção especial! Entre em contato com a Lu!', linkTexto: 'Falar com a Lu', linkUrl: '/sobre', cor: 'var(--verde)', corTexto: '#fff' }

// ─────────────────────────────────────────────────────────────────

export default function BannerPromocao() {
  const [fechado, setFechado] = useState(false);

  if (!CONFIG.ativo || fechado) return null;

  return (
    <div style={{ ...styles.banner, background: CONFIG.cor, color: CONFIG.corTexto }}>
      <div style={styles.conteudo}>
        <span style={styles.emoji}>{CONFIG.emoji}</span>
        <p style={styles.mensagem}>{CONFIG.mensagem}</p>
        <a href={CONFIG.linkUrl} style={styles.link}>{CONFIG.linkTexto} →</a>
      </div>
      <button style={styles.fechar} onClick={() => setFechado(true)}>✕</button>
    </div>
  );
}

const styles = {
  banner: { position: 'sticky', top: 0, zIndex: 200, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  conteudo: { display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center', flexWrap: 'wrap' },
  emoji: { fontSize: 18, flexShrink: 0 },
  mensagem: { fontSize: 13, fontWeight: 600, textAlign: 'center' },
  link: { background: 'rgba(255,255,255,0.25)', color: 'inherit', padding: '4px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  fechar: { background: 'none', border: 'none', color: 'inherit', fontSize: 16, cursor: 'pointer', opacity: 0.7, flexShrink: 0, padding: 4 },
};