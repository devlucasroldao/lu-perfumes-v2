import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Busca() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fechar = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAberto(false);
      }
    };
    document.addEventListener('click', fechar);
    return () => document.removeEventListener('click', fechar);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      setAberto(false);
      return;
    }
    const timer = setTimeout(() => buscar(), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const buscar = async () => {
    setCarregando(true);
    const { data } = await supabase
      .from('produtos')
      .select('id, nome, marca, linha, tipo, foto')
      .eq('ativo', true)
      .or(`nome.ilike.%${query}%,marca.ilike.%${query}%,tipo.ilike.%${query}%,linha.ilike.%${query}%`)
      .limit(6);
    if (data) {
      setResultados(data);
      setAberto(true);
    }
    setCarregando(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.length > 1) {
      router.push(`/catalogo?busca=${encodeURIComponent(query)}`);
      setAberto(false);
      setQuery('');
    }
    if (e.key === 'Escape') {
      setAberto(false);
      setQuery('');
    }
  };

  return (
    <div ref={ref} style={styles.wrapper}>
      <div style={styles.inputWrapper}>
        <span style={styles.icone}>🔍</span>
        <input
          style={styles.input}
          placeholder="Buscar perfume, marca..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setAberto(true)}
        />
        {query && (
          <button style={styles.limpar} onClick={() => { setQuery(''); setAberto(false); }}>✕</button>
        )}
      </div>

      {aberto && (
        <div style={styles.dropdown}>
          {carregando ? (
            <div style={styles.estado}>Buscando... 🌸</div>
          ) : resultados.length === 0 ? (
            <div style={styles.estado}>Nenhum produto encontrado 😕</div>
          ) : (
            <>
              {resultados.map(p => (
                <Link
                  key={p.id}
                  href={`/produto/${p.id}`}
                  style={styles.item}
                  onClick={() => { setAberto(false); setQuery(''); }}
                >
                  <img
                    src={p.foto || 'https://placehold.co/48x48?text=?'}
                    alt={p.nome}
                    style={styles.itemFoto}
                  />
                  <div style={styles.itemInfo}>
                    <span style={styles.itemNome}>{p.nome}</span>
                    <div style={styles.itemTags}>
                      <span style={styles.tag}>{p.marca}</span>
                      <span style={styles.tag}>{p.linha}</span>
                      <span style={styles.tag}>{p.tipo}</span>
                    </div>
                  </div>
                  <span style={styles.itemSeta}>›</span>
                </Link>
              ))}
              <Link
                href={`/catalogo?busca=${encodeURIComponent(query)}`}
                style={styles.verTodos}
                onClick={() => { setAberto(false); setQuery(''); }}
              >
                Ver todos os resultados para "{query}" →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { position: 'relative', width: '100%', maxWidth: 400 },
  inputWrapper: { display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: 50, padding: '0 16px', gap: 8, border: '2px solid transparent', transition: 'all 0.2s' },
  icone: { fontSize: 14, flexShrink: 0 },
  input: { flex: 1, border: 'none', background: 'transparent', padding: '10px 0', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: 'var(--texto)' },
  limpar: { background: 'none', border: 'none', color: '#aaa', fontSize: 14, cursor: 'pointer', padding: 4, flexShrink: 0 },
  dropdown: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 500 },
  estado: { padding: '20px 16px', textAlign: 'center', color: '#aaa', fontSize: 14 },
  item: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', transition: 'background 0.15s', borderBottom: '1px solid #f5f5f5' },
  itemFoto: { width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemNome: { display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--texto)', marginBottom: 4 },
  itemTags: { display: 'flex', gap: 4, flexWrap: 'wrap' },
  tag: { fontSize: 10, background: '#f0f0f0', color: '#888', padding: '2px 6px', borderRadius: 10, fontWeight: 600 },
  itemSeta: { color: '#ccc', fontSize: 18, flexShrink: 0 },
  verTodos: { display: 'block', padding: '12px 16px', fontSize: 13, color: 'var(--verde)', fontWeight: 700, textAlign: 'center', background: '#f9f9f7' },
};