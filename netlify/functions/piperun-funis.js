// =====================================================
// FUNÇÃO AUXILIAR — só para descobrir pipeline_id e stage_id
// Acesse https://SEUSITE.netlify.app/.netlify/functions/piperun-funis
// no navegador (depois de configurar PIPERUN_TOKEN nas variáveis de
// ambiente da Netlify) para ver a lista de funis e etapas da sua conta,
// com os respectivos IDs. Depois de anotar os IDs certos, pode até
// apagar este arquivo — ele não é necessário para o site funcionar.
// =====================================================

exports.handler = async function (event) {
  const token = process.env.PIPERUN_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "PIPERUN_TOKEN não configurado nas variáveis de ambiente da Netlify." })
    };
  }

  try {
    const resp = await fetch("https://api.pipe.run/v1/pipelines?with=stages", {
      headers: { token }
    });
    const data = await resp.json();

    if (!data.success) {
      return { statusCode: 400, body: JSON.stringify(data) };
    }

    // monta uma lista simples e legível: nome do funil, id do funil,
    // e as etapas com nome + id de cada uma.
    const resumo = (data.data || []).map(function (pipeline) {
      return {
        funil: pipeline.name,
        pipeline_id: pipeline.id,
        etapas: (pipeline.stages || []).map(function (stage) {
          return { nome: stage.name, stage_id: stage.id };
        })
      };
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(resumo, null, 2)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ erro: String(err) }) };
  }
};
