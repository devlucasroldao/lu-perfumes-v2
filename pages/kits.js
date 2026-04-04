import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';

export default function Kits() {
    const [sacola, setSacola] = useState([]);
    const [kits, setKits] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [kitPersonalizado, setKitPersonalizado] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [aba, setAba] = useState('prontos'); // 'prontos' ou 'personalizado'

    useEffect(() => {
        const salva = localStorage.getItem('sacola');
        if (salva) setSacola(JSON.parse(salva));
        buscarDados();
    }, []);

    const buscarDados = async () => {
        setCarregando(true);
        const { data: kitsData } = await supabase
            .from('kits')
            .select('*, kit_produtos(*, produtos(*))')
            .eq('ativo', true);

        const { data: produtosData } = await supabase
            .from('produtos')
            .select('*')
            .eq('ativo', true);

        if (kitsData) setKits(kitsData);
        if (produtosData) setProdutos(produtosData);
        setCarregando(false);
    };

    const toggleKitPersonalizado = (produto) => {
        setKitPersonalizado(prev => {
            const jaEsta = prev.find(p => p.id === produto.id);
            if (jaEsta) return prev.filter(p => p.id !== produto.id);
            return [...prev, produto];
        });
    };

    const enviarKitPronto = (kit) => {
        const numero = '5551980272657'; 
        const itens = kit.kit_produtos?.map(kp => `• ${kp.produtos?.nome} - ${kp.produtos?.marca}`).join('\n') || '';
        const mensagem = `Olá Lu! 🌸 Tenho interesse no kit *${kit.nome}*:\n\n${itens}\n\nPoderia me passar mais informações?`;
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
    };

    const enviarKitPersonalizado = () => {
        if (kitPersonalizado.length === 0) return;
        const numero = '5551980272657'; 
        const itens = kitPersonalizado.map(p => `• ${p.nome} - ${p.marca}`).join('\n');
        const mensagem = `Olá Lu! 🌸 Gostaria de montar um kit com esses produtos:\n\n${itens}\n\nPoderia me ajudar?`;
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
    };

    const addSacola = (produto) => {
        setSacola(prev => {
            const nova = [...prev, produto];
            localStorage.setItem('sacola', JSON.stringify(nova));
            return nova;
        });
    };

    return (
        <div>
            <Navbar sacolaCount={sacola.length} />

            <main style={styles.main}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.titulo}>Kits para Presentear 🎁</h1>
                    <p style={styles.subtitulo}>Escolha um kit pronto ou monte o seu do jeito que quiser!</p>
                </div>

                {/* Abas */}
                <div style={styles.abas}>
                    <button
                        style={{ ...styles.aba, ...(aba === 'prontos' ? styles.abaAtiva : {}) }}
                        onClick={() => setAba('prontos')}
                    >
                        🎀 Kits Prontos
                    </button>
                    <button
                        style={{ ...styles.aba, ...(aba === 'personalizado' ? styles.abaAtiva : {}) }}
                        onClick={() => setAba('personalizado')}
                    >
                        ✨ Monte o Seu Kit
                    </button>
                </div>

                {carregando ? (
                    <p style={{ color: '#aaa', textAlign: 'center', padding: 40 }}>Carregando... 🌸</p>
                ) : (
                    <>
                        {/* Kits Prontos */}
                        {aba === 'prontos' && (
                            <div>
                                {kits.length === 0 ? (
                                    <div style={styles.vazio}>
                                        <p>Nenhum kit cadastrado ainda 😊</p>
                                        <p style={{ fontSize: 13, color: '#bbb', marginTop: 8 }}>A Lu pode adicionar kits pelo painel admin em breve!</p>
                                    </div>
                                ) : (
                                    <div style={styles.gridKits}>
                                        {kits.map(kit => (
                                            <div key={kit.id} style={styles.cardKit}>
                                                <div style={styles.kitImagem}>
                                                    <img
                                                        src={kit.foto || 'https://placehold.co/400x200?text=Kit+Presente'}
                                                        alt={kit.nome}
                                                        style={styles.kitFoto}
                                                    />
                                                </div>
                                                <div style={styles.kitInfo}>
                                                    <h3 style={styles.kitNome}>{kit.nome}</h3>
                                                    <p style={styles.kitDesc}>{kit.descricao}</p>

                                                    {kit.kit_produtos?.length > 0 && (
                                                        <div style={styles.kitItens}>
                                                            <p style={styles.kitItensTitle}>Inclui:</p>
                                                            {kit.kit_produtos.map((kp, i) => (
                                                                <span key={i} style={styles.kitItem}>
                                                                    • {kp.produtos?.nome}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <button style={styles.btnWhats} onClick={() => enviarKitPronto(kit)}>
                                                        📲 Tenho interesse!
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Monte o Seu Kit */}
                        {aba === 'personalizado' && (
                            <div style={styles.personalizado}>
                                <div style={styles.instrucao}>
                                    <p>👆 Selecione os produtos que quer no seu kit e mande pro WhatsApp da Lu!</p>
                                </div>

                                {/* Sacola do kit */}
                                {kitPersonalizado.length > 0 && (
                                    <div style={styles.resumoKit}>
                                        <h3 style={styles.resumoTitulo}>Seu kit ({kitPersonalizado.length} {kitPersonalizado.length === 1 ? 'produto' : 'produtos'})</h3>
                                        <div style={styles.resumoItens}>
                                            {kitPersonalizado.map(p => (
                                                <div key={p.id} style={styles.resumoItem}>
                                                    <span>{p.nome} — {p.marca}</span>
                                                    <button style={styles.removerItem} onClick={() => toggleKitPersonalizado(p)}>✕</button>
                                                </div>
                                            ))}
                                        </div>
                                        <button style={styles.btnWhatsGrande} onClick={enviarKitPersonalizado}>
                                            📲 Enviar kit pro WhatsApp da Lu
                                        </button>
                                    </div>
                                )}

                                {/* Grid de produtos */}
                                <div style={styles.gridProdutos}>
                                    {produtos.map(p => {
                                        const selecionado = kitPersonalizado.find(k => k.id === p.id);
                                        return (
                                            <div
                                                key={p.id}
                                                style={{ ...styles.cardProduto, border: selecionado ? '2px solid var(--rosa)' : '2px solid transparent' }}
                                                onClick={() => toggleKitPersonalizado(p)}
                                            >
                                                <img
                                                    src={p.foto || 'https://placehold.co/300x200?text=Sem+foto'}
                                                    alt={p.nome}
                                                    style={styles.produtoFoto}
                                                />
                                                <div style={styles.produtoInfo}>
                                                    <span style={styles.produtoMarca}>{p.marca}</span>
                                                    <h4 style={styles.produtoNome}>{p.nome}</h4>
                                                </div>
                                                <div style={{ ...styles.check, background: selecionado ? 'var(--rosa)' : '#eee' }}>
                                                    {selecionado ? '✓' : '+'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

const styles = {
    main: { maxWidth: 1200, margin: '40px auto', padding: '0 24px' },
    header: { textAlign: 'center', marginBottom: 40 },
    titulo: { fontSize: 32, fontWeight: 800, color: 'var(--texto)' },
    subtitulo: { fontSize: 16, color: '#888', marginTop: 8 },
    abas: { display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center' },
    aba: { padding: '12px 32px', borderRadius: 50, border: '2px solid #ddd', background: 'transparent', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: 'var(--texto)', transition: 'all 0.2s' },
    abaAtiva: { background: 'var(--verde)', color: '#fff', border: '2px solid var(--verde)' },
    vazio: { textAlign: 'center', padding: '80px 0', color: '#aaa' },
    gridKits: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 },
    cardKit: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
    kitImagem: { width: '100%' },
    kitFoto: { width: '100%', height: 200, objectFit: 'cover' },
    kitInfo: { padding: 24 },
    kitNome: { fontSize: 20, fontWeight: 700, marginBottom: 8 },
    kitDesc: { fontSize: 14, color: '#888', marginBottom: 16, lineHeight: 1.5 },
    kitItens: { marginBottom: 16 },
    kitItensTitle: { fontSize: 12, fontWeight: 700, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    kitItem: { display: 'block', fontSize: 13, color: '#666', marginBottom: 4 },
    btnWhats: { background: '#25D366', color: '#fff', padding: '12px 24px', borderRadius: 50, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', width: '100%' },
    personalizado: { display: 'flex', flexDirection: 'column', gap: 24 },
    instrucao: { background: '#fff', padding: '16px 24px', borderRadius: 12, textAlign: 'center', fontSize: 15, color: '#666', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    resumoKit: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '2px solid var(--rosa)' },
    resumoTitulo: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--texto)' },
    resumoItens: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
    resumoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#faf9f7', borderRadius: 8, fontSize: 14 },
    removerItem: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16 },
    btnWhatsGrande: { background: '#25D366', color: '#fff', padding: '14px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', width: '100%' },
    gridProdutos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
    cardProduto: { background: '#fff', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative' },
    produtoFoto: { width: '100%', height: 160, objectFit: 'cover' },
    produtoInfo: { padding: '12px 16px' },
    produtoMarca: { fontSize: 11, fontWeight: 600, color: 'var(--verde)', textTransform: 'uppercase', letterSpacing: 1 },
    produtoNome: { fontSize: 14, fontWeight: 600, marginTop: 4, color: 'var(--texto)' },
    check: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, transition: 'background 0.2s' },
};