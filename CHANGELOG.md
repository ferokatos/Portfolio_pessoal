# Histórico de Alterações (Changelog)

Este arquivo documenta todas as alterações de design e estrutura feitas no portfólio.

## [Novo Design] - Atualizações Recentes

### O que mudamos:
1. **Criação da Branch `new-design`**: Para isolar as alterações do novo visual.
2. **Nova Seção Hero**: Adição de uma seção de apresentação inicial (Hero) no topo da página principal.
3. **Redesign do Painel de Navegação (Header)**: O menu superior foi transformado em um painel flutuante, fixo e moderno.
4. **Remoção do Botão "Baixar CV"**: Retirada do botão de currículo da seção Hero para simplificar os links.

### Onde mudamos:
- `index.html`: 
  - Atualização estrutural da tag `<header>`.
  - Inserção da `<section id="home" class="hero">` contendo perfil, animações e links sociais.
  - Remoção do link `<a href="#" class="btn-link">Baixar CV</a>`.
- `style.css`: 
  - Adição de novos blocos de estilo para a classe `.hero` e animações (`pulse-glow`, `float`).
  - Atualização do estilo da tag `header` (inclusão de posições fixas, limits de largura ampliados e `backdrop-filter`).
  - Alteração no `header` de `justify-content: space-between` para `justify-content: center` para centralizar a navegação.
  - Adição de responsividade (`@media` queries) para ajustar o Hero e o novo cabeçalho em telas menores (tablets e celulares).

### Como mudamos:
- **Painel de navegação**: Modificamos a propriedade de `position: sticky` para `position: fixed` no `style.css`, aplicando um `border-radius: 50px` para formato de pílula, e configurando o `backdrop-filter: blur(10px)` para dar um aspecto translúcido de "vidro" (glassmorphism). Posteriormente, ajustamos sua largura para expandir quase de uma lateral à outra (`width: calc(100% - 20px)` e `max-width: 1920px`). E também centralizamos os links de navegação trocando o `justify-content` para `center`.
- **Navegação Animada e Ícones Locais**: Baixamos os ícones vetoriais (.svg) da biblioteca Boxicons e os salvamos fisicamente na pasta `icons/`. Adicionamos esses ícones em tags `<img>` ao lado dos itens de navegação e usamos a propriedade CSS `filter` para que eles mudem perfeitamente de cor ao interagir (ficando roxos no `:hover`). Criamos também um indicador visual moderno sob cada link: uma barra colorida estilizada via `::after` no CSS que desliza para preencher a base da palavra quando o usuário passa o mouse ou quando a aba está ativa.
- **Sincronização de Scroll (JavaScript)**: Adicionamos em `script.js` um ouvinte para o evento `scroll`. Ele calcula a posição de cada `<section>` da página e automaticamente injeta a classe `.active` no link de navegação correspondente. Assim, a barrinha colorida roxa muda de lugar e acompanha o usuário enquanto ele navega pelo site.
- **Seção Hero**: Usamos `display: flex` para dividir a área em três colunas (texto à esquerda, foto no centro com anel de brilho usando `radial-gradient` no CSS, e botões à direita).
- **Animações (Dinamismo)**: Inserimos `@keyframes` no CSS para que os elementos flutuem (`float`) e para gerar o efeito de pulso (`pulse-glow`), e os botões receberam eventos `:hover` com transições de sombra e deslocamento no eixo Y.

## [Novo Design] - Reorganização das Ferramentas (Tech Stack)

### O que mudamos:
- **Movimentação das Ferramentas**: Removemos a seção "ferramentas" de dentro da área "Sobre mim" e colocamos os respectivos ícones diretamente na seção Hero.

### Onde mudamos:
- `index.html`: 
  - Exclusão do bloco `<h2>ferramentas</h2>` e da `<ul class="stacks">` na seção `#sobre`.
  - Inserção de uma nova `div` com classe `.tech-icons` no lado esquerdo da seção Hero, onde antes ficavam as redes sociais.
- `style.css`:
  - Substituição da classe `.social-icons` por `.tech-icons`.
  - Substituição do seletor `a` pela classe `.icon-wrapper`, adicionando estilo de interatividade (`cursor: pointer` e `box-shadow` no hover).

### Como mudamos:
- As ferramentas (Python, HTML, CSS, VS Code, Git) ganharam um formato mais dinâmico de botões redondos menores, utilizando as mesmas animações interativas que estávamos usando antes para as redes sociais. Isso unifica a estética do topo e garante que os visitantes vejam o seu stack de tecnologias imediatamente ao entrar no portfólio.

## [Novo Design] - Reestruturação para Landing Page Moderna

### O que mudamos:
- **Separação Estrutural**: Dividimos as seções do site para que cada uma atue de forma isolada e bem definida (Home, Sobre mim, Projetos, e Contatos), remetendo ao estilo das Landing Pages modernas.
- **Hero Clean**: Removemos o avatar gerado aleatoriamente e centralizamos a atenção nos textos principais e botões.
- **Sobre Mim com Foto**: Criamos um "placeholder" visual interativo no estilo glassmorphism (que tem o `glow-circle` atrás) especialmente para quando você mandar a sua foto real.
- **Modernização de Contatos e Projetos**: Tiramos os contatos de dentro da seção "Sobre" e demos uma seção própria inteira para eles na base da página, reestilizando seus cards para que se pareçam com os blocos de "Projetos" e tenham os hover effects atualizados com sombras roxas e destaque nos ícones.
- **Títulos Padronizados**: Criamos a classe `.section-title` para uniformizar todos os títulos das seções com o mesmo padrão e com uma fina barra roxa animada na base de cada um.
- **Tipografia Atualizada**: Trocamos as fontes antigas por **Arial Bold** (para todos os títulos e destaques) e **Roboto Bold** (para os textos comuns e botões), importando o Roboto direto do Google Fonts.
