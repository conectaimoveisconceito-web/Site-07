# Conecta Imóveis Conceito — novo site

Site reconstruído do zero, inspirado na arquitetura e organização de portais
imobiliários como a Habitnet (estrutura de páginas, navegação, filtros),
mas com identidade visual e conteúdo 100% próprios da Conecta.

## Como abrir localmente

Não precisa de instalação nem build. Basta servir a pasta como arquivos
estáticos, por exemplo:

```
python3 -m http.server 8000
```

e abrir `http://localhost:8000/`. Não abra os arquivos `.html` direto no
navegador com `file://` — os links entre páginas e o fetch de dados podem
não funcionar perfeitamente por causa de restrições de segurança do navegador.

## Estrutura de pastas

```
index.html                        → Home
imoveis/                          → catálogo completo com filtros
lancamentos/                      → lançamentos e apartamentos na planta
regioes/                          → navegação por região → bairro → empreendimento
empreendimentos/                  → índice + 1 pasta por empreendimento
sobre/, contato/                  → páginas institucionais
blog/                             → índice + 2 artigos de exemplo
politica-de-privacidade/
lp/                               → estrutura pronta para landing pages futuras
css/style.css                     → todo o visual do site
js/data.js                        → FONTE ÚNICA DE DADOS (leia abaixo)
js/app.js, imoveis.js, empreendimentos.js
images/                           → onde colocar as fotos reais (veja abaixo)
sitemap.xml, robots.txt
```

## Identidade visual

As cores abaixo foram extraídas diretamente dos arquivos de logo que você
enviou (não são aproximação):

- Laranja: `#FF6600`
- Teal/turquesa (gradiente do ícone): `#00CFB4` → `#00B5BF`
- Navy (fundo escuro): `#091A3B`

Essas variáveis estão em `css/style.css` (`:root`) — `--orange`, `--teal`,
`--teal-light`, `--teal-dark`, `--navy`. O site não usa mais magenta/rosa
em lugar nenhum.

A logo real (ícone + rodapé/header) já está em `images/logo/`:
- `conecta-icone.png` — símbolo isolado, fundo transparente (usado no header/footer)
- `conecta-logo-completo.png` — logo completa com "Conecta Imóveis" (disponível para uso em materiais maiores, como a página Sobre, se quiser trocar o placeholder da foto da equipe)
- `favicon.png` — ícone quadrado com fundo navy, usado como favicon do site
- `images/geral/og-conecta.png` — imagem quadrada de marca, usada como preview ao compartilhar links (WhatsApp, redes sociais)

## O que é dado real vs. o que é placeholder

Meu ponto de partida foram os arquivos do site atual que você enviou
(`index.html`, `main.js`, `style.css`). Isso é o que veio com **dado real**:

- Marca, WhatsApp (`5585992911212`), e-mail, Instagram, CRECI-CE 23158-J
- As 6 regiões de atuação com bairros e descrições
- Os 3 depoimentos (Samara e Fernando, João Paulo Lima, Marcos Ferreira)
- As 3 perguntas do FAQ
- **1 empreendimento com dado completo**: Gran Village Eusébio IV (bairro,
  status, lazer, proximidades, metragem da unidade padrão)

Todo o resto — os outros 11 empreendimentos, preços, quartos, vagas,
metragens, nomes de construtoras, plantas em PDF — **não existia nos
arquivos originais**, então segui a regra do seu prompt de não inventar:
esses campos aparecem como *"A definir"* ou ficam ocultos, e cada
empreendimento tem um texto avisando que a informação está em atualização.

As fotos também não vieram no upload — por isso todo o site usa um
placeholder visual (ícone + legenda) no lugar de cada imagem.

## Como adicionar um empreendimento novo (ou completar um existente)

Tudo fica em **`js/data.js`**, no array `EMPREENDIMENTOS`. Cada objeto
segue este formato:

```js
{
  id: "nome-do-empreendimento",     // vira a URL /empreendimentos/nome-do-empreendimento/
  nome: "Nome do Empreendimento",
  construtora: "Nome da construtora ou 'A definir'",
  regiaoId: "eusebio",              // precisa bater com uma chave de REGIOES
  cidade: "Eusébio",
  bairro: "Nome do bairro",
  tipo: "Apartamento",
  status: "Lançamento" | "Em obras" | "Pronto para morar",
  quartos: 2,                       // ou null se não souber
  suites: 1,                        // ou null
  vagas: 1,                         // ou null
  metragem: "65 m²",                // ou "A definir"
  preco: "A partir de R$ 350.000",  // ou "Consulte disponibilidade"
  imagens: ["images/empreendimentos/arquivo-01.jpg", ...],
  plantas: [
    { nome: "Tipo A — 2 quartos", area: "58 m²",
      imagem: "images/plantas/arquivo-planta-a.jpg",
      pdf: "images/plantas/arquivo-planta-a.pdf" }   // pdf é opcional
  ],
  descricao: "Texto real do empreendimento.",
  diferenciais: ["Piscina", "Academia", ...],
  localizacao: "A definir"
}
```

Enquanto `plantas` estiver vazio (`[]`), a página mostra o texto de
"tipologia" (se existir, como no Gran Village Eusébio IV) ou um aviso
convidando a chamar no WhatsApp — nunca fica quebrado ou em branco.

Depois de editar o array, **não precisa gerar nada** — a página individual
já existe? Se for um empreendimento **novo**, crie a pasta
`empreendimentos/nome-do-empreendimento/index.html` copiando qualquer
outra pasta de empreendimento existente e trocando só a linha
`window.EMP_ID = "...";` para o novo id. O resto (galeria, specs,
diferenciais, plantas, formulário, WhatsApp) é renderizado automaticamente
a partir do `data.js`.

Não esqueça de adicionar a nova URL em `sitemap.xml`.

## Como adicionar as fotos e plantas reais

1. Coloque os arquivos dentro de `images/empreendimentos/` (fotos),
   `images/plantas/` (imagens/PDFs de planta), `images/regioes/` ou
   `images/construtoras/` (logos), usando os nomes já referenciados em
   `js/data.js` (ou atualize os caminhos no `data.js` para o nome do
   arquivo real).
2. Assim que um arquivo existir no caminho esperado, ele substitui
   automaticamente o placeholder cinza — não precisa mexer em nenhum
   HTML. Isso vale para fotos de empreendimento, imagens de planta,
   fotos de região e logos de construtora. Se o arquivo não existir (ou
   o caminho estiver errado), o placeholder aparece normalmente, sem
   quebrar a página.
3. A logo fica em `images/logo/conecta-icone.png` e o favicon em
   `images/logo/favicon.png` — ambos já estão preenchidos com a logo
   real da Conecta.
4. Os depoimentos ainda não têm campo de foto no `data.js` (só
   iniciais). Se quiser adicionar fotos dos clientes, me avise que eu
   preparo o campo e a exibição.

## Filtros, busca e formulário

- A busca do Hero e os filtros de `/imoveis/` e `/lancamentos/` são
  100% client-side (JavaScript puro, sem back-end) e já ignoram
  acento/maiúsculas na busca por texto.
- O formulário de contato (geral e por empreendimento) hoje monta uma
  mensagem e abre o WhatsApp automaticamente — não há back-end de
  e-mail configurado. Se no futuro você tiver um serviço de e-mail/CRM,
  troque a função `initLeadForms()` em `js/app.js` para enviar via
  `fetch()` ao endpoint desejado, mantendo ou não o fallback de WhatsApp.

## Testado

Testei todas as páginas em desktop e mobile (Chromium via Playwright):
sem erros de JavaScript, sem overflow horizontal, filtros combinados,
busca com acento, formulário, lightbox da galeria e menu mobile —
todos funcionando. Os únicos "erros" que aparecem no console são 404 de
imagens que ainda não existem (logo e favicon), o que é esperado até
você enviar os arquivos reais.
