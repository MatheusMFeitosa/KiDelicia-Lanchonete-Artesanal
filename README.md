# KiDelícia — Lanchonete Artesanal

Loja virtual de uma lanchonete artesanal (hambúrgueres, pizzas, acompanhamentos e sobremesas), desenvolvida como prova prática da disciplina de Web 2 com HTML, CSS e JavaScript puro, sem bibliotecas externas de lógica.

**Autor(a):** _preencher com seu nome_
**Link da loja publicada (opcional):** _preencher se fizer deploy_

## Funcionalidades

- **Carrinho de compras funcional:** adicionar produto, alterar quantidade, remover item, total em reais e contador no ícone.
- **Carrinho lateral (drawer)** com fundo escurecido, fechamento por botão, clique fora ou tecla `Esc`.
- **Persistência com `localStorage`:** o carrinho e o tema não se perdem ao recarregar a página.
- **Frete:** R$ 8,00, grátis em pedidos a partir de R$ 80,00, com barra de progresso.
- **Filtro por categoria, busca por nome/descrição e ordenação** (mais pedidos, menor preço, maior preço, melhor avaliação).
- **Tema claro/escuro:** respeita a preferência do sistema e guarda a escolha do usuário.
- **Aviso rápido (toast)** e **validação de e-mail** na newsletter.

## Design

### Paleta de cores

Todas as cores são variáveis CSS (`:root`), o que permite trocar o tema claro/escuro apenas redefinindo as variáveis.

| Cor | Variável | Hex (claro) | Hex (escuro) | Uso |
|---|---|---|---|---|
| Marrom café | `--escuro` | `#2b1d19` | `#f5ebe6` | Texto principal e identidade da marca |
| Vermelho | `--vermelho` | `#c4302b` | `#c4302b` | Marca, selos, botão ativo e destaques |
| Amarelo | `--amarelo` | `#ffc857` | `#ffc857` | Ícones, foco e detalhes sobre fundo escuro |
| Creme | `--branco` | `#fffff1` | `#1a1210` | Fundo da página |
| Card | `--card-bg` | `#ffffff` | `#261b18` | Fundo dos cards e do carrinho |
| Texto secundário | `--texto-secundario` | `#6e5a54` | `#b8a69e` | Descrições e metadados |
| Verde | `--verde` | `#1e7b3a` | `#4ade80` | Preços e barra de frete grátis |
| Erro | `--erro` | `#c4302b` | `#ff8a80` | Mensagens de validação |

Cores fixas (não mudam com o tema):

| Cor | Variável | Hex | Uso |
|---|---|---|---|
| Café fixo | `--cafe` | `#2b1d19` | Barra de busca, botões escuros, banner e cabeçalho do carrinho |
| Creme fixo | `--creme` | `#fffff1` | Texto sobre fundos vermelhos ou escuros |
| Amarelo claro | `--amarelo-claro` | `#ffd670` | Hover do botão "Ver Cardápio" |
| Estrela | `--estrela` | `#f59e0b` | Estrelas de avaliação |

### Tipografia

Duas famílias gratuitas do Google Fonts, definidas em variáveis CSS:

| Fonte | Variável | Uso |
|---|---|---|
| **Fredoka** | `--fonte-titulo` | Logotipo, títulos e preços |
| **Poppins** | `--fonte-principal` | Corpo do texto, navegação, botões e campos de formulário |

### Ícones

[Font Awesome](https://fontawesome.com) (kit gratuito).

### Imagens
[Unsplash](https://unsplash.com).
