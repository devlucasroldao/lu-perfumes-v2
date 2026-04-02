import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UploadFoto({ onUpload, fotoAtual }) {
  const [enviando, setEnviando] = useState(false);
  const [preview, setPreview] = useState(fotoAtual || '');

  const handleUpload = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    // Preview instantâneo
    const leitor = new FileReader();
    leitor.onload = (ev) => setPreview(ev.target.result);
    leitor.readAsDataURL(arquivo);

    setEnviando(true);

    const extensao = arquivo.name.split('.').pop();
    const nomeArquivo = `produto-${Date.now()}.${extensao}`;

    const { error } = await supabase.storage
      .from('fotos')
      .upload(nomeArquivo, arquivo, { upsert: true });

    if (error) {
      alert('Erro ao enviar foto. Tenta de novo!');
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage
      .from('fotos')
      .getPublicUrl(nomeArquivo);

    onUpload(data.publicUrl);
    setEnviando(false);
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Foto do Produto</label>

      <div style={styles.area}>
        {preview ? (
          <div style={styles.previewWrapper}>
            <img src={preview} alt="preview" style={styles.preview} />
            <button
              style={styles.trocar}
              onClick={() => document.getElementById('inputFoto').click()}
            >
              🔄 Trocar foto
            </button>
          </div>
        ) : (
          <div
            style={styles.dropzone}
            onClick={() => document.getElementById('inputFoto').click()}
          >
            {enviando ? (
              <p style={styles.enviando}>⏳ Enviando...</p>
            ) : (
              <>
                <p style={styles.icone}>📷</p>
                <p style={styles.texto}>Clique para escolher uma foto</p>
                <p style={styles.subtexto}>JPG, PNG ou WEBP</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        id="inputFoto"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />

      {enviando && (
        <p style={styles.status}>⏳ Enviando foto...</p>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  area: { width: '100%' },
  dropzone: { border: '2px dashed #ddd', borderRadius: 12, padding: '32px 24px', textAlign: 'center', cursor: 'pointer', transition: 'border 0.2s', background: '#fafafa' },
  icone: { fontSize: 32, marginBottom: 8 },
  texto: { fontSize: 14, fontWeight: 600, color: '#666' },
  subtexto: { fontSize: 12, color: '#aaa', marginTop: 4 },
  enviando: { fontSize: 14, color: '#aaa' },
  previewWrapper: { position: 'relative', display: 'inline-block', width: '100%' },
  preview: { width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 },
  trocar: { position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 },
  status: { fontSize: 12, color: '#78825B', fontWeight: 600 },
};