// =====================================================
// FUNÇÃO PRINCIPAL — cria um lead no PipeRun
// Chamada pelo site (js/app.js e js/empreendimentos.js) via fetch()
// para POST /.netlify/functions/criar-lead
//
// Variáveis de ambiente necessárias (configurar em Netlify ->
// Site configuration -> Environment variables):
//   PIPERUN_TOKEN       token de autenticação do usuário no PipeRun
//   PIPERUN_PIPELINE_ID id do funil onde o lead deve entrar
//   PIPERUN_STAGE_ID    id da etapa inicial do funil
//   PIPERUN_ORIGIN_ID   (opcional) id da origem "Site" no PipeRun
// =====================================================

const API = "https://api.pipe.run/v1";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: "Método não permitido" }) };
  }

  const token = process.env.PIPERUN_TOKEN;
  const pipelineId = process.env.PIPERUN_PIPELINE_ID;
  const stageId = process.env.PIPERUN_STAGE_ID;
  const originId = process.env.PIPERUN_ORIGIN_ID; // opcional

  if (!token || !pipelineId || !stageId) {
    console.error("Variáveis de ambiente do PipeRun não configuradas.");
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Integração com o CRM não configurada corretamente." })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: "Corpo da requisição inválido." }) };
  }

  const nome = (payload.nome || "").toString().trim();
  const telefone = (payload.telefone || "").toString().trim();
  const email = (payload.email || "").toString().trim();
  const mensagem = (payload.mensagem || "").toString().trim();
  const contexto = (payload.contexto || "").toString().trim(); // ex: nome do empreendimento

  if (!nome || !telefone) {
    return { statusCode: 422, body: JSON.stringify({ success: false, message: "Nome e telefone são obrigatórios." }) };
  }

  const headers = { "Content-Type": "application/json", token };

  try {
    // 1. cria (ou atualiza, se já existir) a pessoa no PipeRun
    const personBody = { name: nome, contactPhones: [telefone] };
    if (email) personBody.contactEmails = [email];
    if (mensagem) personBody.observation = mensagem;

    const personResp = await fetch(API + "/persons", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(personBody)
    });
    const personData = await personResp.json();

    if (!personResp.ok || !personData.success) {
      console.error("Erro ao criar pessoa no PipeRun:", personData);
      return { statusCode: 502, body: JSON.stringify({ success: false, message: "Erro ao registrar contato no CRM.", detalhe: personData }) };
    }

    const personId = personData.data.id;

    // 2. cria a oportunidade (deal) vinculada à pessoa
    const titulo = contexto ? nome + " — " + contexto : nome + " — site";
    const dealBody = {
      pipeline_id: Number(pipelineId),
      stage_id: Number(stageId),
      title: titulo,
      person_id: personId
    };
    if (originId) dealBody.origin_id = Number(originId);
    if (mensagem) dealBody.reference = mensagem.slice(0, 190);

    const dealResp = await fetch(API + "/deals", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(dealBody)
    });
    const dealData = await dealResp.json();

    if (!dealResp.ok || !dealData.success) {
      console.error("Erro ao criar oportunidade no PipeRun:", dealData);
      return { statusCode: 502, body: JSON.stringify({ success: false, message: "Contato registrado, mas houve erro ao criar a oportunidade.", detalhe: dealData }) };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, person_id: personId, deal_id: dealData.data.id })
    };
  } catch (err) {
    console.error("Erro inesperado na integração PipeRun:", err);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: "Erro inesperado ao falar com o CRM." }) };
  }
};
