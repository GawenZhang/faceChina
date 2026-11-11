(function () {
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var names = {
    zh: "简体中文",
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    it: "Italiano",
    ja: "日本語",
    ko: "한국어"
  };

  var pack = {
    en: {
      "nav-home": "Home", "nav-blog": "Blog", "nav-products": "Products", "nav-about": "About",
      "cta-contact": "Contact us", "cta-quote": "Get a factory quote", "cta-more": "More posts →",
      "cta-start": "Start your project", "cta-submit": "Submit", "cta-subscribe": "Subscribe",
      "cta-expand": "Read more", "cta-collapse": "Show less", "cta-detail": "View details",
      "footer-products": "Products", "footer-support": "Support", "footer-legal": "Legal",
      "privacy": "Privacy policy", "terms": "Terms of service",
      "ph-name": "Name", "ph-email": "Email", "ph-phone": "Phone", "ph-message": "Message",
      "ph-search": "Search articles", "menu": "Menu",
      "quote-title": "Contact us", "quote-lead": "We look forward to hearing from you",
      "sent": "Received. This preview keeps your note in the browser only.",
      "subscribe-ok": "Subscribed in this browser.",
      "empty-page": "No further posts on this page.",
      "no-result": "No matching posts."
    },
    es: {
      "nav-home": "Inicio", "nav-blog": "Blog", "nav-products": "Productos", "nav-about": "Nosotros",
      "cta-contact": "Contáctenos", "cta-quote": "Pedir cotización", "cta-more": "Más artículos →",
      "cta-start": "Iniciar proyecto", "cta-submit": "Enviar", "cta-subscribe": "Suscribirse",
      "cta-expand": "Leer más", "cta-collapse": "Ocultar", "cta-detail": "Ver detalle",
      "footer-products": "Productos", "footer-support": "Soporte", "footer-legal": "Legal",
      "privacy": "Privacidad", "terms": "Términos",
      "ph-name": "Nombre", "ph-email": "Correo", "ph-phone": "Teléfono", "ph-message": "Mensaje",
      "ph-search": "Buscar artículos", "menu": "Menú",
      "quote-title": "Contáctenos", "quote-lead": "Esperamos su mensaje",
      "sent": "Recibido. Esta vista solo lo guarda en el navegador.",
      "subscribe-ok": "Suscripción guardada en este navegador.",
      "empty-page": "No hay más artículos en esta página.",
      "no-result": "Sin resultados."
    },
    fr: {
      "nav-home": "Accueil", "nav-blog": "Blog", "nav-products": "Produits", "nav-about": "À propos",
      "cta-contact": "Nous contacter", "cta-quote": "Devis usine", "cta-more": "Plus d'articles →",
      "cta-start": "Démarrer", "cta-submit": "Envoyer", "cta-subscribe": "S'abonner",
      "cta-expand": "Lire la suite", "cta-collapse": "Réduire", "cta-detail": "Voir",
      "footer-products": "Produits", "footer-support": "Support", "footer-legal": "Mentions",
      "privacy": "Confidentialité", "terms": "Conditions",
      "ph-name": "Nom", "ph-email": "E-mail", "ph-phone": "Téléphone", "ph-message": "Message",
      "ph-search": "Rechercher", "menu": "Menu",
      "quote-title": "Nous contacter", "quote-lead": "Nous attendons votre message",
      "sent": "Bien reçu. Cet aperçu reste dans le navigateur.",
      "subscribe-ok": "Abonnement enregistré dans ce navigateur.",
      "empty-page": "Aucun autre article sur cette page.",
      "no-result": "Aucun résultat."
    },
    de: {
      "nav-home": "Start", "nav-blog": "Blog", "nav-products": "Produkte", "nav-about": "Über uns",
      "cta-contact": "Kontakt", "cta-quote": "Werksangebot", "cta-more": "Mehr Artikel →",
      "cta-start": "Projekt starten", "cta-submit": "Senden", "cta-subscribe": "Abonnieren",
      "cta-expand": "Weiterlesen", "cta-collapse": "Weniger", "cta-detail": "Details",
      "footer-products": "Produkte", "footer-support": "Support", "footer-legal": "Rechtliches",
      "privacy": "Datenschutz", "terms": "AGB",
      "ph-name": "Name", "ph-email": "E-Mail", "ph-phone": "Telefon", "ph-message": "Nachricht",
      "ph-search": "Artikel suchen", "menu": "Menü",
      "quote-title": "Kontakt", "quote-lead": "Wir freuen uns auf Ihre Nachricht",
      "sent": "Erhalten. Diese Vorschau speichert nur im Browser.",
      "subscribe-ok": "In diesem Browser abonniert.",
      "empty-page": "Keine weiteren Beiträge auf dieser Seite.",
      "no-result": "Keine Treffer."
    },
    pt: {
      "nav-home": "Início", "nav-blog": "Blog", "nav-products": "Produtos", "nav-about": "Sobre",
      "cta-contact": "Fale conosco", "cta-quote": "Cotação", "cta-more": "Mais artigos →",
      "cta-start": "Começar projeto", "cta-submit": "Enviar", "cta-subscribe": "Assinar",
      "cta-expand": "Ler mais", "cta-collapse": "Recolher", "cta-detail": "Ver detalhes",
      "footer-products": "Produtos", "footer-support": "Suporte", "footer-legal": "Legal",
      "privacy": "Privacidade", "terms": "Termos",
      "ph-name": "Nome", "ph-email": "E-mail", "ph-phone": "Telefone", "ph-message": "Mensagem",
      "ph-search": "Buscar artigos", "menu": "Menu",
      "quote-title": "Fale conosco", "quote-lead": "Aguardamos sua mensagem",
      "sent": "Recebido. Esta prévia fica só no navegador.",
      "subscribe-ok": "Inscrição salva neste navegador.",
      "empty-page": "Não há mais artigos nesta página.",
      "no-result": "Nenhum resultado."
    },
    it: {
      "nav-home": "Home", "nav-blog": "Blog", "nav-products": "Prodotti", "nav-about": "Chi siamo",
      "cta-contact": "Contattaci", "cta-quote": "Preventivo", "cta-more": "Altri articoli →",
      "cta-start": "Avvia progetto", "cta-submit": "Invia", "cta-subscribe": "Iscriviti",
      "cta-expand": "Leggi di più", "cta-collapse": "Chiudi", "cta-detail": "Dettagli",
      "footer-products": "Prodotti", "footer-support": "Supporto", "footer-legal": "Note legali",
      "privacy": "Privacy", "terms": "Termini",
      "ph-name": "Nome", "ph-email": "Email", "ph-phone": "Telefono", "ph-message": "Messaggio",
      "ph-search": "Cerca articoli", "menu": "Menu",
      "quote-title": "Contattaci", "quote-lead": "Aspettiamo il tuo messaggio",
      "sent": "Ricevuto. Questa anteprima resta nel browser.",
      "subscribe-ok": "Iscrizione salvata in questo browser.",
      "empty-page": "Nessun altro articolo in questa pagina.",
      "no-result": "Nessun risultato."
    },
    ja: {
      "nav-home": "ホーム", "nav-blog": "ブログ", "nav-products": "製品", "nav-about": "会社情報",
      "cta-contact": "お問い合わせ", "cta-quote": "工場見積", "cta-more": "記事をもっと見る →",
      "cta-start": "プロジェクトを開始", "cta-submit": "送信", "cta-subscribe": "登録",
      "cta-expand": "続きを読む", "cta-collapse": "閉じる", "cta-detail": "詳細",
      "footer-products": "製品", "footer-support": "サポート", "footer-legal": "法務",
      "privacy": "プライバシー", "terms": "利用規約",
      "ph-name": "お名前", "ph-email": "メール", "ph-phone": "電話", "ph-message": "メッセージ",
      "ph-search": "記事を検索", "menu": "メニュー",
      "quote-title": "お問い合わせ", "quote-lead": "ご連絡をお待ちしています",
      "sent": "受け付けました。このプレビューはブラウザ内だけに残します。",
      "subscribe-ok": "このブラウザに登録しました。",
      "empty-page": "このページに続きの記事はありません。",
      "no-result": "一致する記事がありません。"
    },
    ko: {
      "nav-home": "홈", "nav-blog": "블로그", "nav-products": "제품", "nav-about": "회사 소개",
      "cta-contact": "문의하기", "cta-quote": "공장 견적", "cta-more": "글 더 보기 →",
      "cta-start": "프로젝트 시작", "cta-submit": "제출", "cta-subscribe": "구독",
      "cta-expand": "더 보기", "cta-collapse": "접기", "cta-detail": "자세히",
      "footer-products": "제품", "footer-support": "지원", "footer-legal": "법적 고지",
      "privacy": "개인정보", "terms": "이용약관",
      "ph-name": "이름", "ph-email": "이메일", "ph-phone": "전화", "ph-message": "메시지",
      "ph-search": "글 검색", "menu": "메뉴",
      "quote-title": "문의하기", "quote-lead": "연락을 기다립니다",
      "sent": "접수했습니다. 이 미리보기는 브라우저에만 남습니다.",
      "subscribe-ok": "이 브라우저에 구독했습니다.",
      "empty-page": "이 페이지에는 더 이상 글이 없습니다.",
      "no-result": "일치하는 글이 없습니다."
    }
  };

  var zh = {};
  $$("[data-i18n]").forEach(function (el) { zh[el.getAttribute("data-i18n")] = el.textContent; });
  $$("[data-i18n-placeholder]").forEach(function (el) { zh[el.getAttribute("data-i18n-placeholder")] = el.getAttribute("placeholder") || ""; });
  pack.zh = zh;
  var fallback = {
    "empty-page": "这一页没有更多文章。",
    "no-result": "没有匹配的文章。",
    sent: "已收到。这份预览只把内容留在浏览器里。",
    "subscribe-ok": "已在此浏览器记录订阅。"
  };
  Object.keys(fallback).forEach(function (key) {
    if (!pack.zh[key]) pack.zh[key] = fallback[key];
  });

  function text(key) {
    var code = document.documentElement.getAttribute("data-lang") || "zh";
    var table = pack[code] || {};
    return table[key] || zh[key] || "";
  }

  function applyLang(code) {
    if (!names[code]) code = "zh";
    document.documentElement.setAttribute("data-lang", code);
    document.documentElement.lang = code === "zh" ? "zh-CN" : code;
    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (el.hasAttribute("data-live")) return;
      el.textContent = (pack[code] && pack[code][key]) || zh[key] || el.textContent;
    });
    $$("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      el.placeholder = (pack[code] && pack[code][key]) || zh[key] || "";
    });
    var label = $(".lang-label");
    if (label) label.textContent = names[code];
    $$(".lang-menu [data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-selected", btn.getAttribute("data-lang") === code ? "true" : "false");
    });
    try { localStorage.setItem("ihave-lang", code); } catch (err) {}
    $$("[data-live]").forEach(function (el) {
      el.textContent = text(el.getAttribute("data-i18n"));
    });
  }

  var langBtn = $(".lang-btn");
  var langMenu = $(".lang-menu");
  if (langBtn && langMenu) {
    langBtn.addEventListener("click", function () {
      var open = langMenu.hasAttribute("hidden");
      if (open) langMenu.removeAttribute("hidden");
      else langMenu.setAttribute("hidden", "");
      langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    langMenu.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-lang]");
      if (!btn) return;
      applyLang(btn.getAttribute("data-lang"));
      langMenu.setAttribute("hidden", "");
      langBtn.setAttribute("aria-expanded", "false");
    });
  }

  var navToggle = $(".nav-toggle");
  var nav = $(".primary-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("click", function (event) {
    if (langMenu && !event.target.closest(".lang")) {
      langMenu.setAttribute("hidden", "");
      if (langBtn) langBtn.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (langMenu) langMenu.setAttribute("hidden", "");
    if (langBtn) langBtn.setAttribute("aria-expanded", "false");
    if (nav) nav.classList.remove("is-open");
    var dialog = $("dialog[open]");
    if (dialog) dialog.close();
  });

  var header = $(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 4); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  $$(".faq").forEach(function (group) {
    group.addEventListener("click", function (event) {
      var btn = event.target.closest("button[aria-expanded]");
      if (!btn || !group.contains(btn)) return;
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var willOpen = btn.getAttribute("aria-expanded") !== "true";
      $$("button[aria-expanded]", group).forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        var otherPanel = document.getElementById(other.getAttribute("aria-controls"));
        if (otherPanel) otherPanel.hidden = true;
      });
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (panel) panel.hidden = !willOpen;
    });
  });

  var tablist = $(".tabs");
  if (tablist) {
    tablist.addEventListener("click", function (event) {
      var tab = event.target.closest("[role='tab']");
      if (!tab) return;
      $$("[role='tab']", tablist).forEach(function (item) {
        item.setAttribute("aria-selected", item === tab ? "true" : "false");
      });
      $$(".strength-panel").forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === tab.getAttribute("aria-controls"));
      });
    });
  }

  var expand = $("[data-expand]");
  if (expand) {
    expand.addEventListener("click", function () {
      var more = document.getElementById(expand.getAttribute("aria-controls"));
      var open = expand.getAttribute("aria-expanded") === "true";
      expand.setAttribute("aria-expanded", open ? "false" : "true");
      if (more) more.hidden = open;
      expand.setAttribute("data-i18n", open ? "cta-expand" : "cta-collapse");
      expand.textContent = text(open ? "cta-expand" : "cta-collapse");
    });
  }

  var slides = $$(".slide");
  var dots = $$(".hero-dots button");
  var slideIndex = 0;
  function showSlide(index) {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.classList.toggle("is-active", i === slideIndex); });
    dots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === slideIndex); });
  }
  dots.forEach(function (dot, i) { dot.addEventListener("click", function () { showSlide(i); }); });
  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(function () { showSlide(slideIndex + 1); }, 6000);
  }

  var dialog = $("#quote-dialog");
  $$("[data-open-quote]").forEach(function (btn) {
    btn.addEventListener("click", function () { if (dialog && dialog.showModal) dialog.showModal(); });
  });
  if (dialog) {
    var closer = $(".dialog-close", dialog);
    if (closer) closer.addEventListener("click", function () { dialog.close(); });
  }

  function bindForm(form) {
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var note = $(".form-note", form);
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (note) note.textContent = text("sent");
      form.reset();
    });
  }
  $$("form.js-contact").forEach(bindForm);

  var subscribe = $(".js-subscribe");
  if (subscribe) {
    subscribe.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!subscribe.checkValidity()) { subscribe.reportValidity(); return; }
      var note = $(".form-note", subscribe);
      if (note) note.textContent = text("subscribe-ok");
      subscribe.reset();
    });
  }

  var cards = $$("[data-article]");
  var pager = $(".pager");
  var empty = $(".empty");
  var search = $(".js-search");
  var query = "";
  var page = 1;
  var tag = "";

  function renderArticles() {
    if (!cards.length) return;
    var shown = 0;
    cards.forEach(function (card) {
      var hay = (card.getAttribute("data-article") || "").toLowerCase();
      var tags = card.getAttribute("data-tags") || "";
      var match = (!query || hay.indexOf(query) !== -1) && (!tag || tags.indexOf(tag) !== -1);
      var onPage = !query && !tag ? card.getAttribute("data-page") === String(page) : match;
      var visible = match && onPage;
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    if (empty) {
      empty.hidden = shown !== 0;
      empty.textContent = query || tag ? text("no-result") : text("empty-page");
    }
  }
  if (pager) {
    pager.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-page]");
      if (!btn) return;
      var next = btn.getAttribute("data-page");
      if (next === "prev") page = Math.max(1, page - 1);
      else if (next === "next") page = Math.min(5, page + 1);
      else page = Number(next);
      $$("[data-page]", pager).forEach(function (item) {
        if (item.getAttribute("data-page") === String(page)) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
      query = "";
      tag = "";
      if (search) search.value = "";
      renderArticles();
    });
  }
  if (search) {
    search.addEventListener("input", function () {
      query = search.value.trim().toLowerCase();
      renderArticles();
    });
  }
  $$(".tags button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      tag = btn.getAttribute("data-tag") || "";
      query = "";
      if (search) search.value = "";
      renderArticles();
    });
  });
  $$(".readmore").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".article-card");
      if (card) card.classList.toggle("is-open");
    });
  });
  renderArticles();

  $$(".thumbs button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$(".thumbs button").forEach(function (item) { item.setAttribute("aria-selected", item === btn ? "true" : "false"); });
      var main = $(".gallery-main");
      if (!main) return;
      main.setAttribute("data-tone", btn.getAttribute("data-tone") || "1");
      var shot = btn.querySelector(".slot-photo");
      if (!shot) return;
      var existing = main.querySelector(":scope > .slot-photo");
      if (!existing) {
        existing = document.createElement("img");
        existing.className = "slot-photo";
        existing.alt = "";
        main.classList.add("has-photo");
        main.insertBefore(existing, main.firstChild);
      }
      existing.src = shot.src;
    });
  });

  mountPhotos();

  var saved = "zh";
  try { saved = localStorage.getItem("ihave-lang") || "zh"; } catch (err) {}
  applyLang(saved);

  function asset(path) {
    var script = document.querySelector("script[src*='site.js']");
    return new URL("../" + path, script.src).href;
  }

  function fill(el, url) {
    if (!el) return;
    var probe = new Image();
    probe.onload = function () {
      var pic = document.createElement("img");
      pic.className = "slot-photo";
      pic.alt = "";
      pic.src = url;
      el.classList.add("has-photo");
      el.insertBefore(pic, el.firstChild);
    };
    probe.src = url;
  }

  function fillVideo(el, base) {
    if (!el) return;
    var video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("playsinline", "");
    video.onloadeddata = function () {
      video.className = "slot-photo";
      el.classList.add("has-photo");
      el.insertBefore(video, el.firstChild);
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
    };
    video.onerror = function () { fill(el, asset(base + ".jpg")); };
    video.src = asset(base + ".mp4");
  }

  function mountPhotos() {
    var parts = location.pathname.split("/").filter(function (part) {
      return part && part !== "index.html";
    });
    var productAt = parts.indexOf("products");
    var productSlug = productAt >= 0 && parts[productAt + 1] ? decodeURIComponent(parts[productAt + 1]) : "";

    $$(".hero-art").forEach(function (el, index) {
      fill(el, asset("img/home/hero-" + (index + 1) + ".jpg"));
    });
    ["toothbrush", "pet", "brush", "more"].forEach(function (name, index) {
      fill($$(".cat-art")[index], asset("img/home/cat-" + name + ".jpg"));
    });
    $$(".panel-art").forEach(function (el, index) {
      var n = index + 1;
      fill(el, asset("img/home/strength-0" + n + ".jpg"));
    });
    ["uvc", "photo", "ion"].forEach(function (name, index) {
      fillVideo($$(".orb")[index], "img/home/tech-" + name);
    });
    fill($(".about-photo"), asset("img/home/about.jpg"));
    $$(".frame").forEach(function (el, index) {
      fill(el, asset("img/home/growth-" + (index + 1) + ".jpg"));
    });
    $$(".cert").forEach(function (el) {
      var name = (el.textContent || "").replace(/证书/g, "").trim().toLowerCase();
      if (name) fill(el, asset("img/certs/" + name + ".png"));
    });
    $$(".platform").forEach(function (el) {
      var title = el.querySelector("h3");
      if (title) fill(el.querySelector(".mark"), asset("img/platforms/" + title.textContent.trim().toLowerCase() + ".png"));
    });
    $$(".posts .post").forEach(function (post, index) {
      var n = index + 1 < 10 ? "0" + (index + 1) : String(index + 1);
      var url = asset("img/articles/" + n + ".jpg");
      var probe = new Image();
      probe.onload = function () {
        var cover = document.createElement("div");
        cover.className = "post-cover";
        var pic = document.createElement("img");
        pic.src = url;
        pic.alt = "";
        cover.appendChild(pic);
        post.insertBefore(cover, post.firstChild);
      };
      probe.src = url;
    });
    $$(".article-card .cover").forEach(function (el, index) {
      var n = index + 1 < 10 ? "0" + (index + 1) : String(index + 1);
      fill(el, asset("img/articles/" + n + ".jpg"));
    });
    $$(".shot").forEach(function (shot) {
      var link = shot.closest("a");
      if (!link) return;
      var match = (link.getAttribute("href") || "").match(/products\/([^/]+)/);
      if (match) fill(shot, asset("img/products/" + match[1] + ".jpg"));
    });
    if (productSlug) {
      fill($(".gallery-main"), asset("img/products/" + productSlug + ".jpg"));
      $$(".thumbs button").forEach(function (btn, index) {
        var file = index === 0
          ? "img/products/" + productSlug + ".jpg"
          : "img/products/" + productSlug + "-" + (index + 1) + ".jpg";
        fill(btn, asset(file));
      });
    }
    if (parts.indexOf("about") !== -1) {
      var aboutHero = $("main .hero");
      var heroUrl = asset("img/about/hero.jpg");
      var heroProbe = new Image();
      heroProbe.onload = function () {
        if (!aboutHero) return;
        aboutHero.classList.add("has-photo");
        aboutHero.style.backgroundImage = "linear-gradient(90deg, rgba(6,32,51,.55), rgba(6,32,51,.18)), url('" + heroUrl + "')";
        aboutHero.style.backgroundSize = "cover";
        aboutHero.style.backgroundPosition = "center";
      };
      heroProbe.src = heroUrl;
      ["rd", "factory", "qc", "quality", "mission"].forEach(function (name, index) {
        fill($$(".photo")[index], asset("img/about/" + name + ".jpg"));
      });
    }

    var logo = $(".site-header .logo");
    if (!logo) return;
    var svgUrl = asset("img/brand/logo.svg");
    var pngUrl = asset("img/brand/logo.png");
    function swapLogo(url) {
      var pic = document.createElement("img");
      pic.className = "logo-img";
      pic.alt = "iHave";
      pic.src = url;
      var mark = logo.querySelector("svg");
      if (mark) mark.replaceWith(pic);
      else logo.insertBefore(pic, logo.firstChild);
    }
    var logoSvg = new Image();
    logoSvg.onload = function () { swapLogo(svgUrl); };
    logoSvg.onerror = function () {
      var logoPng = new Image();
      logoPng.onload = function () { swapLogo(pngUrl); };
      logoPng.src = pngUrl;
    };
    logoSvg.src = svgUrl;
  }
})();
