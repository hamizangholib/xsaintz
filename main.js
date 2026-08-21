/* =========================================================================
   XSaintZ — main.js
   Satu dependency: Lenis (smooth scroll, via CDN). Sisanya ditulis tangan.
   Data satu-satunya: tools.json.
   ========================================================================= */
(function () {
  "use strict";

  var doc = document.documentElement;
  var grid = document.getElementById("grid");
  var wash = document.getElementById("wash");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  // Menandai bahwa JS hidup. Semua keadaan awal yang menyembunyikan teks
  // digantung pada kelas ini, jadi kalau JS gagal tidak ada yang tak terlihat.
  if (!reduced) doc.classList.add("js");

  var ARROW =
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
    '<path d="M3 11L11 3M11 3H4.5M11 3v6.5" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* Membungkus teks dalam mask supaya bisa naik dari balik garis potong. */
  function masked(tag, cls, text, delay) {
    var outer = el(tag, cls);
    var m = el("span", "mask");
    var inner = el("span", "mask__in", text);
    if (delay) inner.style.setProperty("--d", delay + "ms");
    m.appendChild(inner);
    outer.appendChild(m);
    return outer;
  }


  /* --- render ----------------------------------------------------------- */
  function render(tools) {
    grid.textContent = "";
    grid.removeAttribute("aria-busy");

    tools.forEach(function (t, i) {
      var accent = t.accent || "#3D2BFF";

      var cell = el("li", "cell");
      cell.style.setProperty("--accent", accent);
      cell.style.setProperty("--d", i * 80 + "ms");
      cell.dataset.accent = accent;

      var card = el("a", "card");
      card.href = t.href;
      card.rel = "noopener";
      card.dataset.cursor = t.action || "Buka";
      card.setAttribute("aria-label", t.name + " — " + (t.tagline || ""));

      // Baris kepala: logo dan judul di kiri, nomor di kanan. Label kind
      // sengaja tidak ikut ke sini — kalau masuk, baseline flex mengunci ke
      // baris kecil itu dan nomornya melayang di atas judul. Ia juga bagian
      // isi yang baru muncul saat kartu terbuka.
      var head = el("div", "card__head");
      var titles = el("div", "card__titles");

      if (t.logo) {
        var logo = document.createElement("img");
        logo.className = "card__logo";
        logo.src = t.logo;
        logo.alt = "";               // nama tool sudah dibacakan judulnya
        logo.setAttribute("aria-hidden", "true");
        logo.loading = "lazy";
        logo.decoding = "async";
        logo.onerror = function () { this.remove(); };
        titles.appendChild(logo);
      }

      var titleText = el("div", "card__titletext");
      if (t.kind) titleText.appendChild(el("p", "card__kind", t.kind));
      titleText.appendChild(masked("h3", "card__name", t.name, 120));
      titles.appendChild(titleText);
      head.appendChild(titles);

      var num = el("span", "card__index", String(i + 1).padStart(2, "0"));
      num.setAttribute("aria-hidden", "true");
      head.appendChild(num);
      card.appendChild(head);

      // Semua isi selain kepala tinggal di dalam satu pembungkus supaya bisa
      // dimunculkan sekaligus saat kartu terbuka.
      var body = el("div", "card__body");
      if (t.tagline) body.appendChild(el("p", "card__tagline", t.tagline));
      if (t.description) body.appendChild(el("p", "card__desc", t.description));

      if (Array.isArray(t.meta) && t.meta.length) {
        var meta = el("div", "card__meta");
        t.meta.forEach(function (m) { meta.appendChild(el("span", null, m)); });
        body.appendChild(meta);
      }

      if (t.note) body.appendChild(el("p", "card__note", t.note));

      var go = el("span", "card__go");
      go.appendChild(el("span", null, (t.action || "Buka") + " " + t.name));
      go.insertAdjacentHTML("beforeend", ARROW);
      body.appendChild(go);

      card.appendChild(body);
      cell.appendChild(card);

      // <a> tidak boleh bersarang di <a>, jadi strip unduh adalah adik .card.
      if (Array.isArray(t.downloads) && t.downloads.length) {
        var dl = el("div", "card__dl");
        t.downloads.forEach(function (d) {
          var a = el("a", null);
          a.href = d.href;
          a.rel = "noopener";
          a.setAttribute("data-stick", "");
          a.appendChild(el("span", null, d.label));
          a.insertAdjacentHTML("beforeend", ARROW);
          dl.appendChild(a);
        });
        cell.appendChild(dl);
      }

      // Grafis dekoratif di kanan. Polanya murni CSS dan dipilih lewat
      // nth-child, jadi tool baru otomatis kebagian.
      cell.appendChild(el("div", "card__art"));
      cell.lastChild.setAttribute("aria-hidden", "true");

      grid.appendChild(cell);
    });

    buildMarquee(tools);

    var count = document.getElementById("cue-count");
    if (count) count.textContent = String(tools.length).padStart(2, "0") + " TOOLS";

    setupReveal();
    setupOpen();
    setupInteraction();
    if (fine && !reduced) setupCursor();
    if (setupScroll.remeasure) requestAnimationFrame(setupScroll.remeasure);
  }

  /* --- pita berjalan ----------------------------------------------------- */
  /* Dua grup identik. Animasi CSS menggeser track sejauh -50%, yaitu tepat
     selebar satu grup, jadi perulangannya tidak terlihat sambungannya. */
  function buildMarquee(tools) {
    var track = document.getElementById("marquee");
    if (!track || !tools.length) return;

    function group() {
      var g = el("div", "marquee__group");
      tools.forEach(function (t) {
        g.appendChild(el("span", "marquee__item", t.name));
        g.appendChild(el("span", "marquee__dot"));
      });
      return g;
    }

    track.appendChild(group());
    track.appendChild(group());
  }

  /* --- buka bertahap ------------------------------------------------------ */
  /* Tinggi terlipat dan tinggi penuh diukur sekali lalu disimpan sebagai
     variabel CSS. Transisi tingginya kemudian ditangani CSS — satu kali per
     kartu, bukan penulisan height tiap frame scroll. */
  function measureHeights() {
    if (reduced) return;

    grid.querySelectorAll(".cell").forEach(function (cell) {
      var head = cell.querySelector(".card__head");
      if (!head) return;

      cell.classList.add("is-measuring");
      var full = cell.offsetHeight;
      var cs = getComputedStyle(cell);
      var collapsed = head.offsetHeight +
                      parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      cell.classList.remove("is-measuring");

      cell.style.setProperty("--h-full", Math.ceil(full) + "px");
      cell.style.setProperty("--h-collapsed", Math.ceil(collapsed) + "px");
    });
  }

  function setupOpen() {
    measureHeights();

    // Logo dimuat belakangan dan font bisa berganti setelah render, dua-duanya
    // mengubah tinggi kartu. Ukur ulang saat keduanya selesai.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { measureHeights(); });
    }
    grid.querySelectorAll(".card__logo").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", measureHeights, { once: true });
    });
    window.addEventListener("load", measureHeights);

    if (reduced) {
      grid.querySelectorAll(".cell").forEach(function (c) { c.classList.add("is-open"); });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      grid.querySelectorAll(".cell").forEach(function (c) { c.classList.add("is-open"); });
      return;
    }

    // Terbuka setelah kartu masuk cukup dalam, bukan begitu ujungnya menyentuh
    // layar — supaya gerak membukanya benar-benar terlihat.
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        fired = true;
        e.target.classList.add("is-open");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -28% 0px", threshold: 0 });

    grid.querySelectorAll(".cell").forEach(function (c) { io.observe(c); });

    // Kartu yang membuka menggeser kartu di bawahnya, jadi posisi yang dipakai
    // parallax jadi basi. Ukur ulang begitu transisi tingginya selesai.
    grid.addEventListener("transitionend", function (e) {
      if (e.propertyName === "height" && setupScroll.remeasure) setupScroll.remeasure();
    });

    // Jaring pengaman: hanya kalau observer tidak pernah menembak PADAHAL ada
    // kartu yang sudah melewati garis pemicu. Tanpa syarat kedua, saat halaman
    // baru dimuat (semua kartu masih di bawah layar) jaring ini akan membuka
    // semuanya dan efek membukanya hilang sama sekali.
    setTimeout(function () {
      if (fired) return;
      var vh = window.innerHeight;
      var due = Array.prototype.some.call(grid.querySelectorAll(".cell"), function (c) {
        var r = c.getBoundingClientRect();
        return r.top < vh * 0.72 && r.bottom > 0;
      });
      if (!due) return;
      io.disconnect();
      grid.querySelectorAll(".cell").forEach(function (c) { c.classList.add("is-open"); });
    }, 2500);
  }

  /* --- reveal ----------------------------------------------------------- */
  function revealAll() {
    grid.classList.remove("js-reveal");
    grid.querySelectorAll(".cell").forEach(function (c) { c.classList.add("is-in"); });
  }

  function setupReveal() {
    var hero = document.getElementById("hero");

    if (reduced || !("IntersectionObserver" in window)) {
      if (hero) hero.classList.add("is-in");
      revealAll();
      return;
    }

    // Hero tampil segera; menundanya hanya menahan konten tanpa alasan.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add("is-in"); });
    });

    grid.classList.add("js-reveal");

    var fired = false;
    var total = grid.querySelectorAll(".cell").length;
    var shown = 0;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        fired = true;
        e.target.classList.add("is-in");
        io.unobserve(e.target);

        // Stagger hanya untuk kemunculan. Kalau --d dibiarkan, transition-delay
        // ikut menempel di hover dan kartu keempat baru terangkat 240ms setelah
        // pointer masuk — terasa seperti halaman yang lambat.
        (function (cell) {
          setTimeout(function () { cell.style.setProperty("--d", "0ms"); }, 1200);
        })(e.target);

        // Setelah kartu terakhir tampil, kelas .js-reveal dilepas. Nilai
        // --rev/--revs di keadaan is-in identik dengan default, jadi tidak ada
        // lompatan; yang hilang cuma transition-delay stagger, supaya hover
        // sesudahnya bereaksi seketika, bukan tertunda 320ms.
        if (++shown >= total) {
          setTimeout(function () { grid.classList.remove("js-reveal"); }, 1400);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });

    grid.querySelectorAll(".cell").forEach(function (c) { io.observe(c); });

    // Pengaman: kalau observer tidak pernah menembak padahal ada kartu di
    // viewport, tampilkan semuanya. Lebih baik kehilangan animasi daripada
    // meninggalkan link yang tidak pernah terlihat.
    setTimeout(function () {
      if (fired) return;
      var vh = window.innerHeight;
      var visible = Array.prototype.some.call(grid.querySelectorAll(".cell"), function (c) {
        var r = c.getBoundingClientRect();
        return r.top < vh && r.bottom > 0;
      });
      if (visible) { io.disconnect(); revealAll(); }
    }, 1500);
  }

  /* --- ink fill + ambient wash ------------------------------------------ */
  function lift(cell, washX) {
    cell.classList.add("is-active");
    wash.style.setProperty("--wc", cell.dataset.accent);
    wash.style.setProperty("--wx", washX + "%");
    wash.style.setProperty("--wy", "45%");
    wash.classList.add("is-lit");
  }

  function drop(cell) {
    cell.classList.remove("is-active");
    wash.classList.remove("is-lit");
  }

  /* Titik asal ink fill + diameter yang dijamin menutup seluruh kartu.
     Jarak terjauh dari titik mana pun di dalam kotak ke sudut seberang adalah
     panjang diagonal, jadi diameter = 2x diagonal selalu aman. */
  function setInk(cell, xPct, yPct, rect) {
    var r = rect || cell.getBoundingClientRect();
    cell.style.setProperty("--px", xPct + "%");
    cell.style.setProperty("--py", yPct + "%");
    cell.style.setProperty("--ink", Math.ceil(Math.sqrt(r.width * r.width + r.height * r.height) * 2) + "px");
  }

  function centerPct(cell) {
    var r = cell.getBoundingClientRect();
    return Math.round((r.left + r.width / 2) / window.innerWidth * 100);
  }

  function setupInteraction() {
    var cells = Array.prototype.slice.call(grid.querySelectorAll(".cell"));

    cells.forEach(function (cell) {
      // Titik masuk pointer jadi pusat mekarnya ink fill.
      function origin(e) {
        var r = cell.getBoundingClientRect();
        setInk(cell,
          (e.clientX - r.left) / r.width * 100,
          (e.clientY - r.top) / r.height * 100, r);
      }

      cell.addEventListener("mouseenter", function (e) {
        origin(e);
        lift(cell, centerPct(cell));
      });
      cell.addEventListener("mouseleave", function (e) {
        origin(e);
        drop(cell);
      });

      // Fokus keyboard mendapat umpan balik yang sama dengan hover.
      cell.addEventListener("focusin", function () {
        setInk(cell, 50, 50);
        lift(cell, centerPct(cell));
      });
      cell.addEventListener("focusout", function () { drop(cell); });
    });

    if (fine || !("IntersectionObserver" in window)) return;

    // Sentuh: kartu yang sedang di tengah viewport yang mewarnai halaman,
    // supaya signature-nya tetap hidup di HP.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          setInk(e.target, 50, 50);
          lift(e.target, 50);
        } else {
          e.target.classList.remove("is-active");
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px" });

    grid.querySelectorAll(".cell").forEach(function (c) { io.observe(c); });
  }

  /* --- cursor: melar mengikuti kecepatan, menempel ke elemen kecil ------- */
  function setupCursor() {
    var cursor = document.getElementById("cursor");
    var blob = document.getElementById("cursor-blob");
    var labelBox = document.getElementById("cursor-label");
    var labelText = labelBox.querySelector("span");

    cursor.classList.add("is-on");
    document.body.classList.add("has-cursor");

    var tx = -200, ty = -200;   // posisi pointer
    var cx = -200, cy = -200;   // posisi blob (tertinggal)
    var stick = null;           // elemen yang sedang ditempeli

    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      labelBox.style.setProperty("--x", tx + "px");
      labelBox.style.setProperty("--y", ty + "px");
      kick();
    }, { passive: true });

    var running = false;
    var idle = 0;

    function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }

    function loop() {
      var gx = tx, gy = ty;

      if (stick) {
        // Menempel: tertarik ke pusat elemen, masih menyisakan sedikit tarikan
        // ke arah pointer supaya terasa magnetik, bukan mati.
        var r = stick.getBoundingClientRect();
        gx = r.left + r.width / 2 + (tx - (r.left + r.width / 2)) * 0.22;
        gy = r.top + r.height / 2 + (ty - (r.top + r.height / 2)) * 0.22;
      }

      var px = cx, py = cy;
      cx += (gx - cx) * (stick ? 0.22 : 0.17);
      cy += (gy - cy) * (stick ? 0.22 : 0.17);

      // Melar searah gerak: makin cepat, makin lonjong.
      var dx = cx - px, dy = cy - py;
      var speed = Math.min(Math.sqrt(dx * dx + dy * dy), 42);
      var stretch = stick ? 0 : speed / 42;

      blob.style.setProperty("--x", cx.toFixed(2) + "px");
      blob.style.setProperty("--y", cy.toFixed(2) + "px");
      blob.style.setProperty("--sx", (1 + stretch * 0.55).toFixed(3));
      blob.style.setProperty("--sy", (1 - stretch * 0.32).toFixed(3));
      if (speed > 0.6) {
        blob.style.setProperty("--rot", (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1) + "deg");
      }

      // Berhenti total kalau pointer diam dan blob sudah menyusul. rAF yang
      // terus berputar tanpa ada yang berubah membuat laptop bekerja sia-sia.
      var settled = Math.abs(gx - cx) < 0.25 && Math.abs(gy - cy) < 0.25;
      if (settled && !stick) {
        if (++idle > 8) { running = false; return; }
      } else {
        idle = 0;
      }
      requestAnimationFrame(loop);
    }

    kick();

    document.addEventListener("mouseover", function (e) {
      var s = e.target.closest("[data-stick]");
      if (s) {
        var r = s.getBoundingClientRect();
        stick = s;
        cursor.classList.add("is-stuck");
        cursor.classList.remove("is-label");
        kick();
        blob.style.setProperty("--sw", r.width + 14 + "px");
        blob.style.setProperty("--sh", r.height + 14 + "px");
        blob.style.setProperty("--sr", getComputedStyle(s).borderRadius);
        return;
      }

      var c = e.target.closest("[data-cursor]");
      if (c) {
        labelText.textContent = c.dataset.cursor;
        var cellAccent = c.closest(".cell");
        labelBox.style.background = cellAccent ? cellAccent.dataset.accent : "";
        cursor.classList.add("is-label");
        cursor.classList.remove("is-stuck");
        stick = null;
      }
    });

    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("[data-stick]")) {
        stick = null;
        cursor.classList.remove("is-stuck");
      }
      if (e.target.closest("[data-cursor]")) cursor.classList.remove("is-label");
    });
  }

  /* --- smooth scroll + parallax ----------------------------------------- */
  /* Semua efek scroll dijalankan satu rAF, dan hanya menyentuh transform.
     Posisi elemen dihitung sekali lalu disimpan; memanggil
     getBoundingClientRect tiap frame memaksa layout ulang terus-menerus. */
  function setupScroll() {
    var lenis = null;

    if (!reduced && typeof window.Lenis === "function") {
      lenis = new window.Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.6 });
    }

    // Anchor harus lewat Lenis, kalau tidak halaman melompat keras.
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -20 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });

    if (reduced) return;

    var progress = document.getElementById("progress");
    var heroTitle = document.querySelector(".hero__title");
    var heroLede = document.querySelector(".hero__lede");
    var brand = document.getElementById("foot-brand");

    var gridEl = grid;
    var shift = document.getElementById("marquee-shift");

    var items = [];   // {cell, index, mid, rate}
    var brandTop = 0;
    var vh = window.innerHeight;
    var maxScroll = 1;

    var lastY = window.scrollY || 0;
    var vel = 0;      // kecepatan scroll yang sudah dihaluskan
    var mx = 0;       // geseran pita yang menumpuk lalu meluruh

    function measure() {
      vh = window.innerHeight;
      maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
      var y = window.scrollY || 0;

      items = Array.prototype.map.call(grid.querySelectorAll(".cell"), function (cell, i) {
        var r = cell.getBoundingClientRect();
        return {
          cell: cell,
          index: cell.querySelector(".card__index"),
          mid: r.top + y + r.height / 2,
          rate: i % 2 ? 0.055 : 0.028   // kolom bergerak beda laju
        };
      });

      if (brand) brandTop = brand.getBoundingClientRect().top + y;
    }

    function clamp(v, lim) { return v < -lim ? -lim : (v > lim ? lim : v); }

    var raf = 0;

    function frame() {
      raf = 0;
      var y = window.scrollY || 0;
      var mid = y + vh / 2;

      // Kecepatan scroll dihaluskan, lalu meluruh sendiri ke nol. Loop ini
      // berhenti begitu diam, jadi tidak ada rAF yang berputar sia-sia.
      var raw = y - lastY;
      lastY = y;
      vel += (raw - vel) * 0.18;
      if (Math.abs(vel) < 0.06) vel = 0;

      // Grid miring sedikit searah gerak — dibatasi 2.2 derajat supaya teks
      // tetap enak dibaca.
      gridEl.style.setProperty("--skew", clamp(vel * 0.05, 2.2).toFixed(3) + "deg");

      // Pita ikut tertarik saat scroll, lalu balik pelan ke posisi semula.
      if (shift) {
        mx = clamp(mx + raw * 1.1, 160) * 0.92;
        shift.style.setProperty("--mx", mx.toFixed(1) + "px");
      }

      if (progress) progress.style.setProperty("--p", (y / maxScroll).toFixed(4));

      if (heroTitle && y < vh * 1.2) {
        var hy = (y * 0.14).toFixed(1) + "px";
        heroTitle.style.setProperty("--hy", hy);
        if (heroLede) heroLede.style.setProperty("--hy", (y * 0.07).toFixed(1) + "px");
      }

      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var d = it.mid - mid;
        if (d > vh * 1.4 || d < -vh * 1.4) continue;   // di luar jangkauan, lewati
        it.cell.style.setProperty("--par", clamp(d * it.rate, 26).toFixed(1) + "px");
        if (it.index) it.index.style.setProperty("--ip", clamp(d * -0.06, 20).toFixed(1) + "px");
      }

      if (brand) {
        var p = 1 - Math.min(Math.max((brandTop - y) / vh, 0), 1);
        brand.style.transform = "translate3d(" + (p * -7).toFixed(2) + "%,0,0)";
      }

      // Terus berjalan selama masih ada sisa gerak yang harus diluruhkan.
      if (vel !== 0 || Math.abs(mx) > 0.5) onScroll();
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measureHeights();   // tinggi kartu ikut berubah saat lebar berubah
        measure();
        frame();
      }, 150);
    }, { passive: true });

    window.addEventListener("scroll", onScroll, { passive: true });

    // Dipanggil ulang oleh render() setelah kartu ada di DOM.
    setupScroll.remeasure = function () { measure(); frame(); };
    measure();
    frame();
  }

  /* --- notice khusus file:// -------------------------------------------- */
  function showFileNotice() {
    grid.textContent = "";
    grid.removeAttribute("aria-busy");

    var n = el("li", "notice");
    n.appendChild(el("h3", null, "Daftar tools tidak bisa dimuat dari file://"));
    n.appendChild(el("p", null,
      "Halaman ini membaca daftar tools dari tools.json. Saat dibuka langsung " +
      "sebagai berkas lokal, browser memblokir pembacaan itu karena aturan CORS — " +
      "ini batas keamanan browser, bukan bug di halaman ini."));
    n.appendChild(el("p", null,
      "Di xsaintz.my.id dan GitHub Pages semuanya jalan normal. Untuk melihat " +
      "versi lokal, jalankan server kecil dari folder ini lalu buka " +
      "http://localhost:8000 :"));
    n.appendChild(el("code", null, "python -m http.server 8000"));
    grid.appendChild(n);
  }

  /* --- boot ------------------------------------------------------------- */
  setupScroll();

  fetch("tools.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(render)
    .catch(function (err) {
      var hero = document.getElementById("hero");
      if (hero) hero.classList.add("is-in");
      if (location.protocol === "file:") showFileNotice();
      else {
        grid.textContent = "";
        grid.appendChild(el("li", "notice", "Gagal memuat tools.json — " + err.message));
      }
    });
})();
