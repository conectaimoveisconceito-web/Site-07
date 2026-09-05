/* =====================================================
   CONECTA IMÓVEIS CONCEITO — APP.JS
   Utilitários compartilhados por todas as páginas do portal.
   Depende de js/data.js estar carregado antes.
   ===================================================== */

(function () {
  "use strict";

  /* ---------- helpers de caminho relativo ---------- */
  // Detecta a profundidade da página atual para gerar caminhos
  // relativos corretos para header/menu/imagens em qualquer nível.
  var DEPTH = (function () {
    var path = window.location.pathname.replace(/\/index\.html$/, "/");
    var parts = path.split("/").filter(Boolean);
    return parts.length;
  })();
  var ROOT = DEPTH > 0 ? "../".repeat(DEPTH) : "./";
  window.ROOT = ROOT;

  function href(p) { return ROOT + p; }

  /* ---------- WhatsApp ---------- */
  function whatsappLink(mensagem) {
    var msg = mensagem || SITE.mensagemPadraoWhatsapp;
    return "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(msg);
  }
  window.whatsappLink = whatsappLink;

  function whatsappEmpreendimento(nome) {
    return whatsappLink('Olá! Vi o empreendimento "' + nome + '" no site da Conecta Imóveis Conceito e gostaria de receber mais informações.');
  }
  window.whatsappEmpreendimento = whatsappEmpreendimento;

  /* ---------- campo seguro (nunca inventa dado) ---------- */
  // Retorna o valor se existir, ou marcador "A definir" com classe
  // própria para estilização discreta (evita parecer erro).
  function campo(valor, sufixo) {
    if (valor === null || valor === undefined || valor === "" || valor === "A definir") {
      return '<span class="a-definir">A definir</span>';
    }
    return valor + (sufixo || "");
  }
  window.campo = campo;

  function temDado(valor) {
    return !(valor === null || valor === undefined || valor === "" || valor === "A definir");
  }
  window.temDado = temDado;

  /* ---------- placeholder visual de imagem ---------- */
  // Usado em todo o site enquanto as fotos reais não são enviadas.
  // Assim que uma imagem existir em /images/..., basta trocar o
  // <div class="ph-img"> pelo <img> correspondente — a estrutura
  // (classe, proporção) já fica pronta.
  function phImg(label, ratio) {
    return '<div class="ph-img" style="' + (ratio ? "aspect-ratio:" + ratio + ";" : "") + '" role="img" aria-label="' + label + '">' +
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5.5-5.5L9 17"/></svg>' +
      '<span>' + label + '</span></div>';
  }
  window.phImg = phImg;

  /* ---------- imagem real com fallback automático pro placeholder ---------- */
  // Use esta função (não phImg diretamente) sempre que houver um campo de
  // caminho de imagem vindo dos dados (data.js). Se o arquivo existir, ele
  // aparece; se não existir (404), o placeholder aparece automaticamente —
  // não precisa trocar nada no HTML quando as fotos reais forem enviadas.
  function escapeAttr(s) {
    return (s || "").toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function mediaBox(src, label, ratio) {
    if (!src) return phImg(label, ratio);
    var resolved = /^([a-z]+:)?\/\//i.test(src) || src.indexOf("data:") === 0 ? src : ROOT + src;
    var styleAttr = ratio ? ' style="aspect-ratio:' + ratio + ';"' : "";
    var ratioAttr = ratio ? ' data-ratio="' + ratio + '"' : "";
    return '<div class="media-box"' + styleAttr + ratioAttr + ' data-fallback-label="' + escapeAttr(label) + '">' +
      '<img src="' + escapeAttr(resolved) + '" alt="' + escapeAttr(label) + '" loading="lazy" onerror="mediaBoxFallback(this)">' +
      '</div>';
  }
  window.mediaBox = mediaBox;
  window.mediaBoxFallback = function (img) {
    var wrap = img.parentElement;
    wrap.outerHTML = phImg(wrap.getAttribute("data-fallback-label") || "", wrap.getAttribute("data-ratio"));
  };

  /* ---------- card de empreendimento (reutilizado em Home, /imoveis/, /lancamentos/, /regioes/) ---------- */
  function empreendimentoCard(e) {
    var regiao = REGIOES[e.regiaoId];
    var link = href("empreendimentos/" + e.id + "/");
    return (
      '<a class="prop-card" href="' + link + '" aria-label="Ver detalhes de ' + e.nome + '">' +
        '<div class="prop-card__media">' +
          mediaBox(e.imagens && e.imagens[0], e.nome, null) +
          '<span class="prop-card__status prop-card__status--' + slugify(e.status) + '">' + e.status + '</span>' +
        '</div>' +
        '<div class="prop-card__body">' +
          '<p class="prop-card__loc">' + e.bairro + ', ' + (regiao ? regiao.titulo : e.cidade) + '</p>' +
          '<h3 class="prop-card__title">' + e.nome + '</h3>' +
          '<p class="prop-card__builder">' + campo(e.construtora) + '</p>' +
          '<ul class="prop-card__specs">' +
            (temDado(e.quartos) ? '<li>' + e.quartos + ' quartos</li>' : '') +
            (temDado(e.vagas) ? '<li>' + e.vagas + ' vagas</li>' : '') +
            '<li>' + campo(e.metragem) + '</li>' +
          '</ul>' +
          '<div class="prop-card__foot">' +
            '<span class="prop-card__price">' + campo(e.preco) + '</span>' +
            '<span class="prop-card__cta">Ver detalhes →</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }
  window.empreendimentoCard = empreendimentoCard;

  function slugify(s) {
    return (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  window.slugify = slugify;

  /* ---------- header / menu mobile ---------- */
  function initHeader() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("no-scroll", open);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      });
    });

    var header = document.querySelector("[data-header]");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------- preencher links de WhatsApp/telefone/instagram estáticos ---------- */
  function initContactLinks() {
    document.querySelectorAll("[data-whatsapp-link]").forEach(function (el) {
      el.href = whatsappLink(el.getAttribute("data-whatsapp-link") || "");
    });
    document.querySelectorAll("[data-instagram-link]").forEach(function (el) { el.href = SITE.instagram; });
    document.querySelectorAll("[data-email-link]").forEach(function (el) { el.href = "mailto:" + SITE.email; });
    document.querySelectorAll("[data-tel-link]").forEach(function (el) { el.href = "tel:+" + SITE.whatsapp; });
    document.querySelectorAll("[data-fill='telefoneExibicao']").forEach(function (el) { el.textContent = SITE.telefoneExibicao; });
    document.querySelectorAll("[data-fill='email']").forEach(function (el) { el.textContent = SITE.email; });
    document.querySelectorAll("[data-fill='creci']").forEach(function (el) { el.textContent = SITE.creci; });
    document.querySelectorAll("[data-fill='ano']").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- reveal on scroll (único, discreto) ---------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- formulário de lead genérico ---------- */
  // Sem back-end configurado: por ora, envia o resumo pelo WhatsApp.
  // Quando houver um endpoint real, troque o corpo desta função pelo fetch().
  function initLeadForms() {
    document.querySelectorAll("[data-lead-form]").forEach(function (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var data = new FormData(form);
        var nome = (data.get("nome") || "").toString().trim();
        var tel = (data.get("telefone") || "").toString().trim();
        var email = (data.get("email") || "").toString().trim();
        var msg = (data.get("mensagem") || "").toString().trim();
        var contexto = form.getAttribute("data-lead-context") || "";

        if (!nome || !tel) {
          showFormFeedback(form, "Preencha nome e telefone para continuar.", true);
          return;
        }

        var texto = "Olá! Meu nome é " + nome + (contexto ? ", tenho interesse em " + contexto : "") +
          ". Telefone: " + tel + (email ? " | E-mail: " + email : "") + (msg ? " | Mensagem: " + msg : "");

        showFormFeedback(form, "Obrigado! Vamos te chamar no WhatsApp agora.", false);
        window.open(whatsappLink(texto), "_blank", "noopener");
        form.reset();
      });
    });
  }

  function showFormFeedback(form, texto, erro) {
    var el = form.querySelector("[data-form-feedback]");
    if (!el) {
      el = document.createElement("p");
      el.setAttribute("data-form-feedback", "");
      form.appendChild(el);
    }
    el.textContent = texto;
    el.className = "form-feedback " + (erro ? "form-feedback--error" : "form-feedback--ok");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initContactLinks();
    initReveal();
    initLeadForms();
  });
})();
