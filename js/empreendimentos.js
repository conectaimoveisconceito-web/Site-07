/* =====================================================
   PÁGINA INDIVIDUAL DE EMPREENDIMENTO
   Lê o id definido em window.EMP_ID (setado inline em cada
   página) e renderiza todas as seções a partir de EMPREENDIMENTOS.
   ===================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("emp-root");
    if (!root || !window.EMP_ID) return;
    var e = EMPREENDIMENTOS.find(function (x) { return x.id === window.EMP_ID; });
    if (!e) { root.innerHTML = "<p class='empty-state'>Empreendimento não encontrado.</p>"; return; }
    var regiao = REGIOES[e.regiaoId];
    var statusClass = "prop-card__status--" + slugify(e.status);

    document.title = e.nome + " | Conecta Imóveis Conceito";

    var imagens = e.imagens && e.imagens.length ? e.imagens : ["placeholder"];

    root.innerHTML =
      // HERO
      '<div class="prop-hero__media">' + mediaBox(imagens[0], e.nome, "21/9") + '</div>' +
      '<div class="wrap prop-hero__info">' +
        '<div class="prop-hero__card">' +
          '<div>' +
            '<span class="status-pill ' + statusClass + '">' + e.status + '</span>' +
            '<h1>' + e.nome + '</h1>' +
            '<p style="color:var(--ink-soft);margin-top:4px">' + e.bairro + ', ' + (regiao ? regiao.titulo : e.cidade) + '</p>' +
          '</div>' +
          '<div style="text-align:right">' +
            '<p class="prop-hero__price">' + campo(e.preco) + '</p>' +
            '<a class="btn btn--whatsapp mt-32" style="margin-top:10px" data-whatsapp-link="' + waMsg(e.nome) + '">Tenho interesse</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    var sections = document.getElementById("emp-sections");

    // GALERIA
    var galeriaHtml =
      '<section class="section section--tight" data-reveal><div class="wrap">' +
        '<h2 style="margin-bottom:20px">Galeria de fotos</h2>' +
        '<div class="gallery">' +
          '<div class="gallery__main">' + mediaBox(imagens[0], e.nome + " — foto principal", null) + '</div>' +
          '<div class="gallery__thumbs">' +
            imagens.slice(0, 4).map(function (img, i) {
              return '<button type="button" data-thumb="' + i + '">' + mediaBox(img, "Foto " + (i + 1), null) + '</button>';
            }).join("") +
          '</div>' +
        '</div>' +
      '</div></section>';

    // INFORMAÇÕES
    var specs = [
      ["Quartos", temDado(e.quartos) ? e.quartos : null],
      ["Suítes", temDado(e.suites) ? e.suites : null],
      ["Vagas", temDado(e.vagas) ? e.vagas : null],
      ["Metragem", e.metragem],
      ["Tipo", e.tipo],
      ["Construtora", e.construtora],
      ["Previsão de entrega", e.previsaoEntrega],
      ["Status", e.status]
    ];
    var infoHtml =
      '<section class="section section--tight" data-reveal><div class="wrap">' +
        '<h2 style="margin-bottom:20px">Informações do imóvel</h2>' +
        '<div class="spec-grid">' +
          specs.map(function (s) {
            return '<div class="spec-item"><span>' + s[0] + '</span><strong>' + campo(s[1]) + '</strong></div>';
          }).join("") +
        '</div>' +
      '</div></section>';

    // DESCRIÇÃO
    var descHtml =
      '<section class="section section--tight" data-reveal><div class="wrap" style="max-width:760px">' +
        '<h2 style="margin-bottom:16px">Descrição</h2>' +
        '<p style="color:var(--ink-soft);font-size:1.02rem;line-height:1.7">' + e.descricao + '</p>' +
      '</div></section>';

    // DIFERENCIAIS / ÁREA DE LAZER
    var diffHtml = "";
    if (e.diferenciais && e.diferenciais.length) {
      diffHtml =
        '<section class="section section--tight section--soft" data-reveal><div class="wrap">' +
          '<h2 style="margin-bottom:20px">Diferenciais e área de lazer</h2>' +
          '<div class="diff-grid">' +
            e.diferenciais.map(function (d) {
              return '<div class="diff-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>' + d + '</div>';
            }).join("") +
          '</div>' +
        '</div></section>';
    }

    // PLANTAS
    var plantasHtml =
      '<section class="section section--tight" data-reveal><div class="wrap">' +
        '<h2 style="margin-bottom:8px">Plantas e tipologias</h2>' +
        (e.plantas && e.plantas.length ?
          '<div class="planta-grid">' +
            e.plantas.map(function (p) {
              return '<div class="planta-card">' +
                '<div class="planta-card__media">' + mediaBox(p.imagem, p.nome || "Planta", null) + '</div>' +
                '<div class="planta-card__body">' +
                  '<h3>' + campo(p.nome) + '</h3>' +
                  (temDado(p.area) ? '<p class="planta-card__area">' + p.area + '</p>' : '') +
                  (p.pdf ? '<a class="btn btn--outline btn--sm mt-32" href="' + p.pdf + '" target="_blank" rel="noopener">Baixar PDF</a>' : '') +
                '</div>' +
              '</div>';
            }).join("") +
          '</div>'
        : e.tipologia ?
          '<p style="color:var(--ink-soft);margin-bottom:20px">' + e.tipologia.titulo + ' — ' + e.tipologia.area + '</p>' +
          '<div class="diff-grid">' + e.tipologia.ambientes.map(function (a) { return '<div class="diff-item">' + a + '</div>'; }).join("") + '</div>'
        : '<p class="empty-state">Plantas ainda não disponíveis para este empreendimento — <a data-whatsapp-link="' + waMsg(e.nome) + '">solicite pelo WhatsApp</a>.</p>') +
      '</div></section>';

    // PROXIMIDADES
    var proxHtml = "";
    if (e.proximidades && e.proximidades.length) {
      proxHtml =
        '<section class="section section--tight section--soft" data-reveal><div class="wrap" style="max-width:640px">' +
          '<h2 style="margin-bottom:16px">O que tem por perto</h2>' +
          '<ul class="prox-list">' + e.proximidades.map(function (p) {
            var parts = p.split(" — ");
            return '<li><span>' + parts[1] + '</span><span>' + parts[0] + '</span></li>';
          }).join("") + '</ul>' +
        '</div></section>';
    }

    // LOCALIZAÇÃO (mapa)
    var mapQuery = encodeURIComponent(e.bairro + ", " + e.cidade + ", Ceará");
    var localHtml =
      '<section class="section section--tight" data-reveal><div class="wrap">' +
        '<h2 style="margin-bottom:20px">Localização</h2>' +
        '<div class="map-embed"><iframe src="https://www.google.com/maps?q=' + mapQuery + '&output=embed" width="100%" height="100%" style="border:0" loading="lazy" title="Mapa de localização de ' + e.nome + '"></iframe></div>' +
      '</div></section>';

    // CONTATO
    var contatoHtml =
      '<section class="section section--tight section--soft" data-reveal><div class="wrap"><div class="detail-grid" style="grid-template-columns:1fr">' +
        '<div class="sticky-form" style="max-width:520px">' +
          '<h3>Quero saber mais sobre ' + e.nome + '</h3>' +
          '<p class="hint">Preencha e um corretor te chama em até 1 dia útil.</p>' +
          '<form data-lead-form data-lead-context="' + e.nome + '">' +
            '<div class="form-field"><label for="c-nome">Nome</label><input id="c-nome" name="nome" type="text" required></div>' +
            '<div class="form-field"><label for="c-tel">Telefone</label><input id="c-tel" name="telefone" type="tel" required></div>' +
            '<div class="form-field"><label for="c-email">E-mail</label><input id="c-email" name="email" type="email"></div>' +
            '<div class="form-field"><label for="c-msg">Mensagem</label><textarea id="c-msg" name="mensagem" rows="3">Tenho interesse no ' + e.nome + '</textarea></div>' +
            '<button class="btn btn--primary btn--block" type="submit">Enviar interesse</button>' +
          '</form>' +
        '</div>' +
      '</div></div></section>';

    sections.innerHTML = galeriaHtml + infoHtml + descHtml + diffHtml + plantasHtml + proxHtml + localHtml + contatoHtml;

    function waMsg(nome) {
      return 'Olá! Vi o empreendimento "' + nome + '" no site da Conecta Imóveis Conceito e gostaria de receber mais informações.';
    }

    // lightbox simples
    var lightbox = document.getElementById("lightbox");
    if (lightbox) {
      document.querySelectorAll("[data-thumb]").forEach(function (btn) {
        btn.addEventListener("click", function () { lightbox.classList.add("is-open"); });
      });
      lightbox.querySelector("[data-lightbox-close]").addEventListener("click", function () { lightbox.classList.remove("is-open"); });
      lightbox.addEventListener("click", function (ev) { if (ev.target === lightbox) lightbox.classList.remove("is-open"); });
    }

    // reativa reveal/whatsapp/contact-links para o conteúdo recém-injetado
    document.querySelectorAll("[data-whatsapp-link]").forEach(function (el) {
      el.href = whatsappLink(el.getAttribute("data-whatsapp-link") || "");
    });
    document.querySelectorAll("[data-lead-form]").forEach(function (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var data = new FormData(form);
        var nome = (data.get("nome") || "").toString().trim();
        var tel = (data.get("telefone") || "").toString().trim();
        var email = (data.get("email") || "").toString().trim();
        var msg = (data.get("mensagem") || "").toString().trim();
        if (!nome || !tel) return;
        var texto = 'Olá! Meu nome é ' + nome + ', tenho interesse em ' + e.nome + '. Telefone: ' + tel;
        enviarLeadCRM(nome, tel, email, msg, e.nome);
        window.open(whatsappLink(texto), "_blank", "noopener");
        form.reset();
      });
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); } });
      }, { threshold: 0.1 });
      document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
    }
  });
})();
