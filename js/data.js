/* =====================================================
   CONECTA IMÓVEIS CONCEITO — FONTE ÚNICA DE DADOS
   =====================================================
   Este arquivo centraliza todos os dados do portal: regiões,
   empreendimentos, construtoras, depoimentos e FAQ.

   REGRA DE OURO: nunca inventar preço, metragem, quartos,
   construtora ou qualquer outro dado. Quando a informação não
   existir, usar "A definir" (para textos) ou null (para números).
   Campos com null/"A definir" são automaticamente ocultados ou
   sinalizados como pendentes pelas páginas que consomem este
   arquivo — ver js/app.js -> renderField().

   COMO ADICIONAR UM NOVO EMPREENDIMENTO:
   1. Copie um objeto do array EMPREENDIMENTOS abaixo.
   2. Preencha os campos que você tiver. Apague o que não tiver
      (ou deixe null / "A definir" — o site trata os dois casos).
   3. O "id" vira a URL: /empreendimentos/{id}/  — use letras
      minúsculas, sem acento, separadas por hífen.
   4. Coloque as fotos em images/empreendimentos/ com os nomes
      listados no campo "imagens" e elas aparecerão automaticamente.

   COMO ADICIONAR PLANTAS (imagens e/ou PDFs):
   Preencha o array "plantas" desse mesmo objeto assim:
   plantas: [
     { nome: "Tipo A — 2 quartos", area: "58 m²",
       imagem: "images/plantas/slug-tipo-a.jpg",
       pdf: "images/plantas/slug-tipo-a.pdf" }
   ]
   - "imagem" e "pdf" são opcionais, mas pelo menos um dos dois deixa a
     planta útil (imagem mostra o desenho, pdf permite baixar/imprimir).
   - Coloque os arquivos dentro de images/plantas/.
   - Enquanto "plantas" estiver vazio, a página mostra o texto de
     "tipologia" (se existir, como no Gran Village Eusébio IV) ou um
     aviso convidando a chamar no WhatsApp.
   ===================================================== */

var SITE = {
  nome: "Conecta Imóveis Conceito",
  slogan: "Especialista em conexão de sonhos.",
  creci: "CRECI-CE 23158-J",
  whatsapp: "5585992911212",
  telefoneExibicao: "+55 (85) 99291-1212",
  email: "contato@conectaimoveisconceito.com.br",
  instagram: "https://www.instagram.com/conectaimoveis.conceito/",
  dominio: "https://www.conectaimoveisconceito.com.br",
  mensagemPadraoWhatsapp: "Olá! Vi o site da Conecta Imóveis Conceito e quero saber mais sobre os imóveis disponíveis."
};

/* ---------------------------------------------------
   REGIÕES — dados reais extraídos do site atual
   --------------------------------------------------- */
var REGIOES = {
  fortaleza: {
    id: "fortaleza",
    tag: "Capital",
    titulo: "Fortaleza",
    distancia: "Capital do Ceará",
    descricao: "A capital cearense concentra os bairros mais valorizados da orla e regiões residenciais consolidadas, com infraestrutura completa de comércio, saúde, lazer e transporte.",
    bairros: ["Meireles", "Aldeota", "Cocó", "Papicu", "Praia de Iracema", "Centro"],
    imagens: ["images/regioes/fortaleza-01.jpg", "images/regioes/fortaleza-02.jpg", "images/regioes/fortaleza-03.jpg"]
  },
  eusebio: {
    id: "eusebio",
    tag: "Litoral leste",
    titulo: "Eusébio",
    distancia: "A 24 km de Fortaleza",
    descricao: "Vizinha à capital, Eusébio vive forte expansão imobiliária, com condomínios residenciais, fácil acesso pela CE-040 e proximidade com grandes polos de comércio e serviços.",
    bairros: ["Precabura", "Cararu", "Mangabeira", "Encantada", "Centro"],
    imagens: ["images/regioes/eusebio-01.jpg", "images/regioes/eusebio-02.jpg", "images/regioes/eusebio-03.jpg"]
  },
  caucaia: {
    id: "caucaia",
    tag: "Litoral oeste",
    titulo: "Caucaia",
    distancia: "A 16 km de Fortaleza",
    descricao: "Segundo município mais populoso do Ceará, reúne desde bairros urbanos consolidados até praias procuradas para segunda residência, como Icaraí e Cumbuco.",
    bairros: ["Icaraí", "Cumbuco", "Jurema", "Bom Princípio", "Centro"],
    imagens: ["images/regioes/caucaia-01.jpg", "images/regioes/caucaia-02.jpg", "images/regioes/caucaia-03.jpg"]
  },
  maracanau: {
    id: "maracanau",
    tag: "Polo industrial",
    titulo: "Maracanaú",
    distancia: "A 21 km de Fortaleza",
    descricao: "Importante polo industrial da Região Metropolitana, com bairros residenciais em crescimento e boa infraestrutura de comércio, serviços e transporte.",
    bairros: ["Centro", "Cidade Nova", "Boa Vista", "Coqueiral", "Distrito Industrial I"],
    imagens: ["images/regioes/maracanau-01.jpg", "images/regioes/maracanau-02.jpg", "images/regioes/maracanau-03.jpg"]
  },
  aquiraz: {
    id: "aquiraz",
    tag: "Praias",
    titulo: "Aquiraz",
    distancia: "A 27 km de Fortaleza",
    descricao: "Conhecida pelas praias e resorts, Aquiraz atrai quem busca imóveis para lazer, investimento ou moradia perto do litoral leste da capital.",
    bairros: ["Porto das Dunas", "Prainha do Pacheco", "Iguape", "Centro"],
    imagens: ["images/regioes/aquiraz-01.jpg", "images/regioes/aquiraz-02.jpg", "images/regioes/aquiraz-03.jpg"]
  },
  sga: {
    id: "sga",
    tag: "Complexo portuário",
    titulo: "São Gonçalo do Amarante",
    distancia: "A 55 km de Fortaleza",
    descricao: "Impulsionada pelo Complexo Industrial e Portuário do Pecém, a cidade vem ganhando novos empreendimentos residenciais e comerciais na Região Metropolitana.",
    bairros: ["Pecém", "Centro", "Munguba"],
    imagens: ["images/regioes/sga-01.jpg", "images/regioes/sga-02.jpg", "images/regioes/sga-03.jpg"]
  }
};

/* ---------------------------------------------------
   EMPREENDIMENTOS
   --------------------------------------------------- */
var EMPREENDIMENTOS = [

  {
    id: "gran-village-eusebio-iv",
    nome: "Gran Village Eusébio IV",
    construtora: "A definir",
    regiaoId: "eusebio",
    cidade: "Eusébio",
    bairro: "Tamatanduba",
    tipo: "Condomínio residencial",
    status: "Em obras",
    quartos: null,
    suites: null,
    vagas: null,
    metragem: "40,94 m² (unidade padrão)",
    preco: "Consulte disponibilidade",
    imagens: [
      "images/empreendimentos/eusebio-GVEIV-01.jpg",
      "images/empreendimentos/eusebio-GVEIV-02.jpg",
      "images/empreendimentos/eusebio-GVEIV-03.jpg",
      "images/empreendimentos/eusebio-GVEIV-04.jpg",
      "images/empreendimentos/eusebio-GVEIV-05.jpg"
    ],
    plantas: [{ nome: "Unidade padrão", area: "40,94 m²",
    imagem: "images/plantas/gran-village-planta.jpg" }
],
    descricao: "O Gran Village Eusébio IV está em uma região estratégica, valorizando seu imóvel e seu tempo.",
    diferenciais: ["Piscina adulto e infantil", "Academia ao ar livre", "Mesas de jogos", "Caramanchão", "Bicicletário", "Playground", "Salão aberto com churrasqueira", "Academia", "Espaço kids", "Pet place", "Quadra de beach tennis", "Coworking"],
    proximidades: ["5 min — Shopping Eusébio", "5 min — São Luiz Supermercado", "5 min — Chico do Caranguejo", "6 min — Colégio Farias Brito Júnior Eusébio", "10 min — Shopping Terrazo"],
    tipologia: { titulo: "Descrição da Unidade Padrão", area: "40,94 m²", ambientes: ["Quarto 01", "Quarto 02", "WC", "Sala", "Cozinha", "Área de serviço"] },
    localizacao: "A definir"
  },

  { id: "empreendimento-eusebio-02", nome: "Empreendimento Eusébio 02", construtora: "A definir", regiaoId: "eusebio", cidade: "Eusébio", bairro: "Centro", tipo: "Apartamento", status: "Pronto para morar", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/eusebio-02-01.jpg", "images/empreendimentos/eusebio-02-02.jpg", "images/empreendimentos/eusebio-02-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-fortaleza-01", nome: "Empreendimento Fortaleza 01", construtora: "A definir", regiaoId: "fortaleza", cidade: "Fortaleza", bairro: "Meireles", tipo: "Apartamento", status: "Pronto para morar", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/fortaleza-01-01.jpg", "images/empreendimentos/fortaleza-01-02.jpg", "images/empreendimentos/fortaleza-01-03.jpg", "images/empreendimentos/fortaleza-01-04.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-fortaleza-02", nome: "Empreendimento Fortaleza 02", construtora: "A definir", regiaoId: "fortaleza", cidade: "Fortaleza", bairro: "Aldeota", tipo: "Apartamento", status: "Lançamento", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/fortaleza-02-01.jpg", "images/empreendimentos/fortaleza-02-02.jpg", "images/empreendimentos/fortaleza-02-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-caucaia-01", nome: "Empreendimento Caucaia 01", construtora: "A definir", regiaoId: "caucaia", cidade: "Caucaia", bairro: "Cumbuco", tipo: "Casa / apartamento", status: "Pronto para morar", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/caucaia-01-01.jpg", "images/empreendimentos/caucaia-01-02.jpg", "images/empreendimentos/caucaia-01-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-caucaia-02", nome: "Empreendimento Caucaia 02", construtora: "A definir", regiaoId: "caucaia", cidade: "Caucaia", bairro: "Icaraí", tipo: "Apartamento", status: "Lançamento", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/caucaia-02-01.jpg", "images/empreendimentos/caucaia-02-02.jpg", "images/empreendimentos/caucaia-02-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-maracanau-01", nome: "Empreendimento Maracanaú 01", construtora: "A definir", regiaoId: "maracanau", cidade: "Maracanaú", bairro: "Cidade Nova", tipo: "Residencial", status: "Pronto para morar", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/maracanau-01-01.jpg", "images/empreendimentos/maracanau-01-02.jpg", "images/empreendimentos/maracanau-01-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-maracanau-02", nome: "Empreendimento Maracanaú 02", construtora: "A definir", regiaoId: "maracanau", cidade: "Maracanaú", bairro: "Centro", tipo: "Apartamento", status: "Lançamento", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/maracanau-02-01.jpg", "images/empreendimentos/maracanau-02-02.jpg", "images/empreendimentos/maracanau-02-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-aquiraz-01", nome: "Empreendimento Aquiraz 01", construtora: "A definir", regiaoId: "aquiraz", cidade: "Aquiraz", bairro: "Porto das Dunas", tipo: "Apartamento / resort", status: "Lançamento", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/aquiraz-01-01.jpg", "images/empreendimentos/aquiraz-01-02.jpg", "images/empreendimentos/aquiraz-01-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-aquiraz-02", nome: "Empreendimento Aquiraz 02", construtora: "A definir", regiaoId: "aquiraz", cidade: "Aquiraz", bairro: "Iguape", tipo: "Casa", status: "Pronto para morar", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/aquiraz-02-01.jpg", "images/empreendimentos/aquiraz-02-02.jpg", "images/empreendimentos/aquiraz-02-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-sga-01", nome: "Empreendimento SGA 01", construtora: "A definir", regiaoId: "sga", cidade: "São Gonçalo do Amarante", bairro: "Pecém", tipo: "Residencial", status: "Em obras", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/sga-01-01.jpg", "images/empreendimentos/sga-01-02.jpg", "images/empreendimentos/sga-01-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" },

  { id: "empreendimento-sga-02", nome: "Empreendimento SGA 02", construtora: "A definir", regiaoId: "sga", cidade: "São Gonçalo do Amarante", bairro: "Centro", tipo: "Casa / apartamento", status: "Pronto para morar", quartos: null, suites: null, vagas: null, metragem: "A definir", preco: "Consulte disponibilidade", imagens: ["images/empreendimentos/sga-02-01.jpg", "images/empreendimentos/sga-02-02.jpg", "images/empreendimentos/sga-02-03.jpg"], plantas: [], descricao: "Informações completas deste empreendimento em atualização — metragens, quartos, vagas, diferenciais e condições de pagamento serão publicados em breve.", diferenciais: [], localizacao: "A definir" }

];

/* ---------------------------------------------------
   CONSTRUTORAS PARCEIRAS — 18 logos existentes (sem
   identificação de nome nos arquivos originais)
   --------------------------------------------------- */
var CONSTRUTORAS = Array.from({ length: 18 }, function (_, i) {
  var n = String(i + 1).padStart(2, "0");
  return { id: "construtora-" + n, logo: "images/construtoras/construtora-" + n + ".png" };
});

/* ---------------------------------------------------
   DEPOIMENTOS — reais, extraídos do site atual
   --------------------------------------------------- */
var DEPOIMENTOS = [
  {
    iniciais: "SF",
    nome: "Samara e Fernando",
    papel: "Compraram seu primeiro imóvel",
    texto: "Nosso primeiro imóvel ❤️ Estamos muito felizes com essa conquista! A infraestrutura, os itens de lazer, a planta do apartamento e o atendimento da corretora fizeram toda a diferença para realizarmos esse sonho.",
    video: "https://www.youtube.com/embed/3hsygjsSgGU"
  },
  {
    iniciais: "JP",
    nome: "João Paulo Lima",
    papel: "Comprou na Aldeota",
    texto: "Comprei remoto, morando em SP. A equipe gravou vídeos detalhados e cuidou de toda a negociação e documentação à distância.",
    video: ""
  },
  {
    iniciais: "MF",
    nome: "Marcos Ferreira",
    papel: "Vendeu no Papicu",
    texto: "Avaliação do meu imóvel foi honesta e o anúncio vendeu em 40 dias, dentro do valor que a imobiliária indicou.",
    video: ""
  }
];

/* ---------------------------------------------------
   FAQ — reais, extraídos do site atual
   --------------------------------------------------- */
var FAQ = [
  { pergunta: "Preciso pagar algo para ser atendido?", resposta: "Não. O primeiro contato, a curadoria de imóveis e a visita são totalmente gratuitos para quem busca comprar um imóvel." },
  { pergunta: "Vocês atendem quem mora em outra cidade?", resposta: "Sim. Fazemos visitas em vídeo-chamada e cuidamos de toda a documentação remotamente, com atualizações constantes pelo WhatsApp." },
  { pergunta: "Trabalham com financiamento bancário?", resposta: "Sim, orientamos a simulação com os principais bancos e acompanhamos o processo até a assinatura do contrato." }
];

/* ---------------------------------------------------
   COMO FUNCIONA — real, extraído do site atual
   --------------------------------------------------- */
var COMO_FUNCIONA = [
  { titulo: "Você fala com a gente", texto: "Pelo WhatsApp ou formulário, em menos de um dia útil um corretor já te responde." },
  { titulo: "Selecionamos opções", texto: "Cruzamos bairro, orçamento e perfil da família com nosso portfólio ativo." },
  { titulo: "Agendamos a visita", texto: "Presencial ou por vídeo — você conhece o imóvel no seu ritmo." },
  { titulo: "Cuidamos da papelada", texto: "Contrato, documentação e financiamento acompanhados até a entrega das chaves." }
];
