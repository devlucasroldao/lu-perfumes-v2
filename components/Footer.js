import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container} className="footer-grid">

        {/* Logo e descrição */}
        <div style={styles.coluna}>
          <div style={styles.logoWrapper}>
            <img src="/logo.png" alt="Lu Perfumes & Presentes" style={styles.logo} />
          </div>
          <p style={styles.desc}>
            Perfumes, cosméticos e kits especiais para toda ocasião. Atendimento personalizado com carinho e dedicação.
          </p>
          <div style={styles.redes}>
            <a href="https://wa.me/5551980272657" target="_blank" rel="noopener noreferrer" style={styles.redeBtn}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={styles.redeIcone}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a href="https://www.instagram.com/lu_roldaoperfumes/" target="_blank" rel="noopener noreferrer" style={{ ...styles.redeBtn, background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={styles.redeIcone}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Instagram
            </a>
          </div>
        </div>

        {/* Links rápidos */}
        <div style={styles.coluna}>
          <h3 style={styles.colunaTitulo}>Navegação</h3>
          <div style={styles.links}>
            <Link href="/" style={styles.link}>🏠 Home</Link>
            <Link href="/catalogo" style={styles.link}>🌸 Catálogo</Link>
            <Link href="/kits" style={styles.link}>🎁 Kits</Link>
            <Link href="/favoritos" style={styles.link}>🩷 Favoritos</Link>
            <Link href="/sacola" style={styles.link}>🛍️ Sacola</Link>
            <Link href="/sobre" style={styles.link}>💛 Sobre a Lu</Link>
          </div>
        </div>

        {/* Categorias */}
        <div style={styles.coluna}>
          <h3 style={styles.colunaTitulo}>Categorias</h3>
          <div style={styles.links}>
            <Link href="/catalogo?linha=feminino" style={styles.link}>👩 Feminino</Link>
            <Link href="/catalogo?linha=masculino" style={styles.link}>👨 Masculino</Link>
            <Link href="/catalogo?linha=kids" style={styles.link}>👧 Kids</Link>
            <Link href="/catalogo?linha=baby" style={styles.link}>👶 Baby</Link>
            <Link href="/catalogo?marca=O Boticário" style={styles.link}>O Boticário</Link>
            <Link href="/catalogo?marca=Natura" style={styles.link}>Natura</Link>
            <Link href="/catalogo?marca=Eudora" style={styles.link}>Eudora</Link>
            <Link href="/catalogo?marca=Avon" style={styles.link}>Avon</Link>
            <Link href="/catalogo?marca=Mary Kay" style={styles.link}>Mary Kay</Link>
          </div>
        </div>

        {/* Contato e localização */}
        <div style={styles.coluna}>
          <h3 style={styles.colunaTitulo}>Onde estamos</h3>
          <div style={styles.contato}>
            <div style={styles.contatoItem}>
              <span style={styles.contatoIcone}>📍</span>
              <div>
                <p style={styles.contatoTexto}>Rua Adalberto Torres, 365</p>
                <p style={styles.contatoTexto}>Arroio do Sal - RS - Brasil</p>
              </div>
            </div>
            <div style={styles.contatoItem}>
              <span style={styles.contatoIcone}>📱</span>
              <a href="https://wa.me/5551980272657" target="_blank" rel="noopener noreferrer" style={styles.contatoLink}>
                (51) 98027-2657
              </a>
            </div>

            <a href="https://www.google.com/maps/place/Lu+Perfumes+%26+Presentes/@-29.5495891,-49.8962356,17z/data=!3m1!4b1!4m6!3m5!1s0x95227d8c5d89f3a5:0xa729cd16c3bda5b2!8m2!3d-29.5495891!4d-49.8947045!16s%2Fg%2F11yy3wf170?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={styles.btnMapa}>🗺️ Ver no Google Maps</a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomContent}>
          <p style={styles.bottomTexto}>© 2026 Lu Perfumes & Presentes — Todos os direitos reservados</p>
          <p style={styles.bottomTexto}>Feito com 💛 por <a href="https://github.com/devlucasroldao" target="_blank" rel="noopener noreferrer" style={styles.bottomLink}>Lucas Roldão</a></p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#2a2a2a', color: '#fff', marginTop: 80 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 },
  coluna: { display: 'flex', flexDirection: 'column', gap: 16 },
  logoWrapper: { marginBottom: 4 },
  logo: { height: 48, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' },
  desc: { fontSize: 14, color: '#aaa', lineHeight: 1.7 },
  redes: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  redeBtn: { display: 'flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600 },
  redeIcone: { width: 16, height: 16 },
  colunaTitulo: { fontSize: 14, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  links: { display: 'flex', flexDirection: 'column', gap: 10 },
  link: { fontSize: 14, color: '#aaa', transition: 'color 0.2s' },
  contato: { display: 'flex', flexDirection: 'column', gap: 14 },
  contatoItem: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  contatoIcone: { fontSize: 16, flexShrink: 0, marginTop: 2 },
  contatoTexto: { fontSize: 14, color: '#aaa', lineHeight: 1.6 },
  contatoLink: { fontSize: 14, color: '#aaa' },
  btnMapa: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, marginTop: 4 },
  bottomBar: { borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px' },
  bottomContent: { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  bottomTexto: { fontSize: 13, color: '#666' },
  bottomLink: { color: 'var(--verde)', fontWeight: 600 },
};