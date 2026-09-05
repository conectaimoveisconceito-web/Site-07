/* =====================================================
   /IMOVEIS/ — catálogo com busca, filtros combinados e
   carregamento progressivo.
   ===================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("catalog-grid");
    var empty = document.getElementById("catalog-empty");
    var countEl = document.getElementById("catalog-count");
    var loadMoreBtn = document.getElementById("load-more");
    if (!grid) return;

    var PAGE_SIZE = 9;
    var visibleCount = PAGE_SIZE;

    var els = {
      q: document.getElementById("f-q"),
      regiao: document.getElementById("f-regiao"),
      cidade: document.getElementById("f-cidade"),
      bairro: document.getElementById("f-bairro"),
      construtora: document.getElementById("f-construtora"),
      tipo: document.getElementById("f-tipo"),
      quartos: document.getElementById("f-quartos"),
      status: document.getElementById("f-status"),
      ordenar: document.getElementById("f-ordenar"),
      limpar: document.getElementById("f-limpar")
    };

    // popular selects dinamicamente a partir dos dados reais
    function fillSelect(el, values) {
      values.forEach(function (v) {
        var o = document.createElement("option");
        o.value = v; o.textContent = v;
        el.appendChild(o);
      });
    }
    fillSelect(els.regiao, Object.values(REGIOES).map(function (r) { return r.titulo; }));
    fillSelect(els.cidade, Array.from(new Set(EMPREENDIMENTOS.map(function (e) { return e.cidade; }))).sort());
    fillSelect(els.bairro, Array.from(new Set(EMPREENDIMENTOS.map(function (e) { return e.bairro; }))).sort());
    fillSelect(els.tipo, Array.from(new Set(EMPREENDIMENTOS.map(function (e) { return e.tipo; }))).sort());
    var construtorasReais = Array.from(new Set(EMPREENDIMENTOS.map(function (e) { return e.construtora; }).filter(temDado)));
    fillSelect(els.construtora, construtorasReais.length ? construtorasReais : []);

    // ler parâmetros da URL (vindos da busca do Hero da Home)
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) els.q.value = params.get("q");
    if (params.get("regiao")) {
      var r = REGIOES[params.get("regiao")];
      if (r) els.regiao.value = r.titulo;
    }
    if (params.get("status")) els.status.value = params.get("status");
    if (params.get("tipo")) els.tipo.value = params.get("tipo");

    function statusSlug(s) { return slugify(s); }

    function norm(s) {
      return (s || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function applyFilters() {
      var q = norm(els.q.value.trim());
      var list = EMPREENDIMENTOS.filter(function (e) {
        if (q && !(norm(e.nome).includes(q) || norm(e.bairro).includes(q) || norm(e.cidade).includes(q))) return false;
        if (els.regiao.value && (REGIOES[e.regiaoId] || {}).titulo !== els.regiao.value) return false;
        if (els.cidade.value && e.cidade !== els.cidade.value) return false;
        if (els.bairro.value && e.bairro !== els.bairro.value) return false;
        if (els.construtora.value && e.construtora !== els.construtora.value) return false;
        if (els.tipo.value && e.tipo !== els.tipo.value) return false;
        if (els.status.value && statusSlug(e.status) !== els.status.value) return false;
        if (els.quartos.value && String(e.quartos || "") !== els.quartos.value) return false;
        return true;
      });

      if (els.ordenar.value === "nome-az") list.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
      if (els.ordenar.value === "nome-za") list.sort(function (a, b) { return b.nome.localeCompare(a.nome); });

      countEl.textContent = list.length;
      empty.style.display = list.length ? "none" : "block";
      grid.innerHTML = list.slice(0, visibleCount).map(empreendimentoCard).join("");
      loadMoreBtn.style.display = list.length > visibleCount ? "inline-flex" : "none";
    }

    Object.keys(els).forEach(function (k) {
      if (k === "limpar" || !els[k]) return;
      els[k].addEventListener("input", function () { visibleCount = PAGE_SIZE; applyFilters(); });
      els[k].addEventListener("change", function () { visibleCount = PAGE_SIZE; applyFilters(); });
    });

    els.limpar.addEventListener("click", function () {
      Object.values(els).forEach(function (el) { if (el && el.tagName !== "BUTTON") el.value = ""; });
      visibleCount = PAGE_SIZE;
      applyFilters();
    });

    loadMoreBtn.addEventListener("click", function () {
      visibleCount += PAGE_SIZE;
      applyFilters();
    });

    applyFilters();
  });
})();
