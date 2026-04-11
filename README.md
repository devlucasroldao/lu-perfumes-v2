<div align="center">

<img src="public/logo.png" alt="Lu Perfumes & Presentes" width="200"/>

# 🌸 Lu Perfumes & Presentes

**Catálogo online de perfumes e cosméticos com experiência de compra integrada ao WhatsApp**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://lu-perfumes-v2.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

[🌐 Ver o site](https://lu-perfumes-v2.vercel.app) • [📱 Testar no celular](https://lu-perfumes-v2.vercel.app) • [🐛 Reportar bug](https://github.com/devlucasroldao/lu-perfumes-v2/issues)

</div>

---

## 📋 Sobre o Projeto

O **Lu Perfumes & Presentes** é um catálogo online desenvolvido para resolver um problema real: a dificuldade da revendedora Lu em atender todos os clientes simultaneamente pelo WhatsApp.

### 😓 O problema
A Lu recebia dezenas de perguntas repetitivas todo dia:
- *"Quais perfumes masculinos você tem?"*
- *"Queria um presente para minha namorada, o que você recomenda?"*
- *"Tem kit para chá de bebê?"*

Isso consumia horas do dia dela, deixando menos tempo para compras, estoque e crescimento do negócio.

### ✅ A solução
Um site completo onde o cliente navega pelo catálogo, monta sua lista de produtos e envia tudo de uma vez pelo WhatsApp — sem precisar ficar esperando resposta pra cada pergunta.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🌸 **Catálogo completo** | Filtros por linha, marca, tipo e busca em tempo real |
| 🛍️ **Sacola inteligente** | Lista de produtos enviada direto pro WhatsApp da Lu |
| 🎁 **Kits personalizados** | Kits prontos ou montagem livre pelo cliente |
| ❤️ **Favoritos** | Salvar produtos favoritos com login |
| 🔍 **Busca avançada** | Busca em tempo real na navbar com resultados instantâneos |
| 👤 **Login de usuário** | Autenticação completa via Supabase Auth |
| 🔐 **Painel Admin** | Gestão de produtos e kits com senha protegida |
| 📸 **Upload de fotos** | Upload de imagens direto pelo admin via Supabase Storage |
| 📱 **Mobile first** | Layout responsivo otimizado para celular |
| ⭐ **SEO otimizado** | Meta tags e títulos em todas as páginas |
| 📊 **Google Analytics** | Rastreamento de visitas e comportamento |
| 🎄 **Banner promocional** | Banner configurável para datas especiais |

---

## 🛠️ Tecnologias

**Frontend**
- [Next.js 14](https://nextjs.org/) — Framework React com roteamento
- React 18 — Interface de usuário
- CSS-in-JS — Estilização com objetos de estilo
- CSS Animations — Animações e transições

**Backend & Banco de dados**
- [Supabase](https://supabase.com/) — Banco de dados PostgreSQL
- Supabase Auth — Autenticação de usuários
- Supabase Storage — Armazenamento de imagens

**Deploy & Analytics**
- [Vercel](https://vercel.com/) — Deploy automático via GitHub
- Google Analytics — Métricas de acesso

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/devlucasroldao/lu-perfumes-v2.git

# Entre na pasta
cd lu-perfumes-v2

# Instale as dependências
npm install
```

### Variáveis de ambiente

Cria um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
NEXT_PUBLIC_ADMIN_PASSWORD=sua_senha_admin
NEXT_PUBLIC_GA_ID=seu_id_google_analytics
```

### Banco de dados

Roda esses SQLs no Supabase SQL Editor:

```sql
-- Tabela de produtos
CREATE TABLE produtos (
  id bigint generated always as identity primary key,
  nome text, marca text, descricao text,
  linha text, tipo text, foto text,
  destaque boolean default false, ativo boolean default true
);

-- Tabela de kits
CREATE TABLE kits (
  id bigint generated always as identity primary key,
  nome text, descricao text, ocasiao text,
  foto text, ativo boolean default true
);

-- Tabela de relacionamento kit-produtos
CREATE TABLE kit_produtos (
  id bigint generated always as identity primary key,
  kit_id bigint references kits(id) on delete cascade,
  produto_id bigint references produtos(id) on delete cascade
);

-- Tabela de favoritos
CREATE TABLE favoritos (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  produto_id bigint references produtos(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Habilita RLS e políticas públicas
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura publica" ON produtos FOR SELECT USING (true);
CREATE POLICY "Insercao publica" ON produtos FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualizacao publica" ON produtos FOR UPDATE USING (true);
CREATE POLICY "Exclusao publica" ON produtos FOR DELETE USING (true);

CREATE POLICY "Leitura publica kits" ON kits FOR SELECT USING (true);
CREATE POLICY "Insercao publica kits" ON kits FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualizacao publica kits" ON kits FOR UPDATE USING (true);
CREATE POLICY "Exclusao publica kits" ON kits FOR DELETE USING (true);

CREATE POLICY "Leitura publica kit_produtos" ON kit_produtos FOR SELECT USING (true);
CREATE POLICY "Insercao publica kit_produtos" ON kit_produtos FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualizacao publica kit_produtos" ON kit_produtos FOR UPDATE USING (true);
CREATE POLICY "Exclusao publica kit_produtos" ON kit_produtos FOR DELETE USING (true);

CREATE POLICY "Usuario ve seus favoritos" ON favoritos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuario add favoritos" ON favoritos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuario remove favoritos" ON favoritos FOR DELETE USING (auth.uid() = user_id);
```

### Rodando

```bash
npm run dev
```

Acessa [http://localhost:3000](http://localhost:3000) 🚀

---

## 📁 Estrutura do projeto
lu-perfumes-v2/
├── components/
│   ├── Navbar.js           # Navegação com menu mobile
│   ├── ProdutoCard.js      # Card de produto com favorito
│   ├── Footer.js           # Rodapé completo
│   ├── AdminGuard.js       # Proteção da rota admin
│   ├── AuthModal.js        # Modal de login/cadastro
│   ├── Busca.js            # Busca em tempo real
│   ├── UploadFoto.js       # Upload de imagens
│   ├── AvaliacaoGoogle.js  # Bloco de avaliação Google
│   ├── BannerPromocao.js   # Banner de datas especiais
│   └── GoogleAnalytics.js  # Script do Analytics
├── pages/
│   ├── index.js            # Home com filtros rápidos
│   ├── catalogo.js         # Catálogo com sidebar
│   ├── sacola.js           # Sacola + envio WhatsApp
│   ├── kits.js             # Kits prontos e personalizados
│   ├── favoritos.js        # Produtos favoritos
│   ├── sobre.js            # Sobre a Lu
│   ├── 404.js              # Página de erro
│   ├── produto/
│   │   └── [id].js         # Detalhes do produto
│   └── admin/
│       └── index.js        # Painel administrativo
├── lib/
│   └── supabase.js         # Cliente Supabase
├── styles/
│   └── globals.css         # Estilos globais e animações
└── public/
└── logo.png            # Logo da loja
---

## 🎨 Identidade Visual

| Cor | Hex | Uso |
|---|---|---|
| 🟤 Bege claro | `#F3EFE9` | Background principal |
| 🌿 Verde sálvia | `#78825B` | Cor primária, botões |
| 🌹 Rosa queimado | `#B57A77` | Destaques, badges |
| ⬛ Texto | `#3a3a3a` | Texto principal |

---

## 📱 Screenshots

| Home | Catálogo | Detalhes |
|---|---|---|
| ![Home](https://placehold.co/300x600?text=Home) | ![Catálogo](https://placehold.co/300x600?text=Catalogo) | ![Detalhes](https://placehold.co/300x600?text=Detalhes) |

---

## 👨‍💻 Autor

**Lucas Roldão**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Lucas_Rold%C3%A3o-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/devlucasroldao)
[![GitHub](https://img.shields.io/badge/GitHub-devlucasroldao-black?style=for-the-badge&logo=github)](https://github.com/devlucasroldao)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Feito com 💛 para a Lu Perfumes & Presentes</p>
  <p>🌸 <a href="https://lu-perfumes-v2.vercel.app">lu-perfumes-v2.vercel.app</a></p>
</div>