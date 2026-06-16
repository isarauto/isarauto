/* ===== Isar Auto Location — main.js ===== */
(function(){
  "use strict";

  /* ---------- Header scroll + hero parallax ---------- */
  const head = document.querySelector(".site-head");
  const heroBg = document.querySelector(".hero-bg");
  function onScroll(){
    if(head) head.classList.toggle("scrolled", window.scrollY > 24);
    if(heroBg && window.scrollY < window.innerHeight){
      heroBg.style.transform = "translateY(" + (window.scrollY * 0.32) + "px)";
    }
  }
  onScroll(); window.addEventListener("scroll", onScroll, {passive:true});

  /* ---------- Coverflow engine (reusable) ---------- */
  class Coverflow{
    constructor(root){
      this.root = root;
      this.stage = root.querySelector(".cf-stage");
      this.cards = Array.from(this.stage.children);
      this.N = this.cards.length;
      this.active = 0;
      this.dragMoved = false;
      this.spread = parseInt(root.dataset.spread || "240", 10);
      this._buildDots();
      this._bind();
      this.layout();
    }
    _buildDots(){
      const host = this.root.parentElement.querySelector(".cf-dots") || this.root.querySelector(".cf-dots");
      this.dots = [];
      if(!host) return;
      host.innerHTML = "";
      this.cards.forEach((_,i)=>{
        const d = document.createElement("div");
        d.className = "cf-dot";
        d.addEventListener("click",()=>this.goTo(i));
        host.appendChild(d);
        this.dots.push(d);
      });
    }
    _bind(){
      const prev = this.root.querySelector(".cf-prev");
      const next = this.root.querySelector(".cf-next");
      if(prev) prev.addEventListener("click",()=>this.go(-1));
      if(next) next.addEventListener("click",()=>this.go(1));
      this.cards.forEach((card,i)=>{
        card.addEventListener("click",(e)=>{
          if(e.target.closest("a,button")) return;
          if(!this.dragMoved) this.goTo(i);
        });
      });
      let down=false, startX=0;
      this.root.addEventListener("pointerdown",(e)=>{ down=true; this.dragMoved=false; startX=e.clientX; });
      this.root.addEventListener("pointermove",(e)=>{
        if(!down) return;
        const dx = e.clientX - startX;
        if(Math.abs(dx) > 55 && !this.dragMoved){ this.dragMoved=true; this.go(dx<0?1:-1); }
      });
      const end=()=>{ down=false; setTimeout(()=>{ this.dragMoved=false; },0); };
      this.root.addEventListener("pointerup",end);
      this.root.addEventListener("pointercancel",end);
      this.root.addEventListener("pointerleave",()=>{ down=false; });
    }
    layout(){
      const rtl = document.documentElement.getAttribute("dir")==="rtl" ? -1 : 1;
      this.cards.forEach((card,i)=>{
        let diff = i - this.active;
        if(diff >  this.N/2) diff -= this.N;
        if(diff < -this.N/2) diff += this.N;
        const abs = Math.abs(diff);
        if(abs > 2){
          card.style.opacity="0"; card.style.visibility="hidden"; card.style.pointerEvents="none";
          card.classList.remove("is-active"); return;
        }
        card.style.visibility="visible"; card.style.pointerEvents="auto";
        const tx = rtl * diff * this.spread;
        const tz = -abs * 130;
        const ry = rtl * -diff * 22;
        const sc = 1 - abs*0.15;
        card.style.transform = `translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`;
        card.style.opacity = abs===0 ? "1" : abs===1 ? ".58" : ".28";
        card.style.filter = abs===0 ? "none" : `blur(${abs*1.3}px)`;
        card.style.zIndex = String(20-abs);
        card.classList.toggle("is-active", abs===0);
      });
      if(this.dots) this.dots.forEach((d,i)=>d.classList.toggle("on", i===this.active));
    }
    goTo(i){ this.active = ((i % this.N)+this.N)%this.N; this.layout(); }
    go(dir){ this.goTo(this.active+dir); }
  }
  window.Coverflow = Coverflow;

  /* ---------- Render fleet ---------- */
  function renderFleet(){
    const stage = document.getElementById("fleetStage");
    if(!stage || !window.CARS) return;
    const lang = window.getLang();
    stage.innerHTML = "";
    window.CARS.forEach(c=>{
      const color = c.color[lang] || c.color.fr;
      const trans = window.t(c.trans==="auto"?"auto":"manual", lang);
      const fuel  = window.t(c.fuel, lang);
      const wa = window.waLink(`${window.t("hero.cta2",lang)} — ${c.model} (${color}, 2025)`);
      const card = document.createElement("div");
      card.className = "cf-card fcard";
      card.innerHTML = `
        <div class="ph"><image-slot id="${c.slug}" src="cars/img/${c.slug}.webp" shape="rect" placeholder="${c.model} · ${color}"></image-slot></div>
        <div class="grad"></div>
        <span class="tag"><span class="sw" style="background:${c.hex}"></span>${color} · 2025</span>
        <div class="meta">
          <div class="nm">${c.model}</div>
          <div class="specrow">
            <span class="chip${c.trans==='manual'?' diesel':''}">${trans}</span>
            <span class="chip${c.fuel==='diesel'?' diesel':''}">${fuel}</span>
            <span class="chip">${c.seats} <span data-i18n="spec.seats">${window.t("spec.seats",lang)}</span></span>
          </div>
          <div class="price"><span>${window.t("from",lang)}</span> <b>${c.price} MAD</b> ${window.t("perday",lang)}</div>
          <div class="acts">
            <a class="a-detail" href="cars/${c.slug}.html">${window.t("fleet.details",lang)}</a>
            <a class="a-wa" href="${wa}" target="_blank" rel="noopener">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.546 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.94-5.359 11.943-11.893a11.821 11.821 0 00-3.487-8.413z"/></svg>${window.t("fleet.book",lang)}</a>
          </div>
        </div>`;
      stage.appendChild(card);
    });
  }

  /* ---------- Render testimonials ---------- */
  function renderTestimonials(){
    const stage = document.getElementById("tstStage");
    if(!stage || !window.TESTIMONIALS) return;
    const lang = window.getLang();
    const list = window.TESTIMONIALS[lang] || window.TESTIMONIALS.fr;
    stage.innerHTML = "";
    list.forEach(t=>{
      const initial = t.n.trim().charAt(0);
      const card = document.createElement("div");
      card.className = "cf-card tcard";
      card.innerHTML = `
        <div class="quote">&ldquo;</div>
        <div class="stars">★★★★★</div>
        <p class="q">${t.q}</p>
        <div class="who">
          <div class="av">${initial}</div>
          <div><div class="nm">${t.n}</div><div class="ct">${t.c}</div></div>
        </div>`;
      stage.appendChild(card);
    });
  }

  /* ---------- Language switcher UI ---------- */
  function buildLangMenus(){
    const lang = window.getLang();
    document.querySelectorAll(".lang-menu").forEach(menu=>{
      menu.innerHTML = "";
      window.LANGS.forEach(L=>{
        const b = document.createElement("button");
        b.className = "lang" + (L.code===lang?" active":"") ;
        b.classList.toggle("active", L.code===lang);
        b.innerHTML = `<span>${L.label}</span><span class="lc">${L.short}</span>`;
        b.addEventListener("click",()=>{ setLang(L.code); });
        menu.appendChild(b);
      });
    });
    document.querySelectorAll(".lang-current").forEach(el=>{
      const L = window.LANGS.find(x=>x.code===lang);
      el.textContent = L ? L.short : "FR";
    });
    // overlay langs
    document.querySelectorAll(".ov-langs").forEach(host=>{
      host.innerHTML="";
      window.LANGS.forEach(L=>{
        const b=document.createElement("button");
        b.textContent=L.short; b.classList.toggle("active",L.code===lang);
        b.addEventListener("click",()=>setLang(L.code));
        host.appendChild(b);
      });
    });
  }

  function setLang(code){
    window.applyLang(code);
    buildLangMenus();
    renderFleet(); renderTestimonials();
    initCarousels();
    document.querySelectorAll(".lang").forEach(l=>l.classList.remove("open"));
    closeOverlay();
  }
  window.setLang = setLang;

  /* ---------- Lang dropdown toggle ---------- */
  document.addEventListener("click",(e)=>{
    const btn = e.target.closest(".lang-btn");
    if(btn){
      const lang = btn.closest(".lang");
      const wasOpen = lang.classList.contains("open");
      document.querySelectorAll(".lang").forEach(l=>l.classList.remove("open"));
      lang.classList.toggle("open", !wasOpen);
      e.stopPropagation();
      return;
    }
    if(!e.target.closest(".lang-menu")){
      document.querySelectorAll(".lang").forEach(l=>l.classList.remove("open"));
    }
  });

  /* ---------- Mobile overlay ---------- */
  const overlay = document.querySelector(".nav-overlay");
  function openOverlay(){ if(overlay){ overlay.classList.add("open"); document.body.style.overflow="hidden"; } }
  function closeOverlay(){ if(overlay){ overlay.classList.remove("open"); document.body.style.overflow=""; } }
  const burger = document.querySelector(".burger");
  if(burger) burger.addEventListener("click", openOverlay);
  document.querySelectorAll(".ov-close, .nav-overlay a").forEach(el=>el.addEventListener("click", closeOverlay));

  /* ---------- Reveal on scroll ---------- */
  function initReveal(){
    const els = document.querySelectorAll(".reveal");
    if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    },{threshold:.16});
    els.forEach(e=>io.observe(e));
  }

  /* ---------- Init carousels ---------- */
  function initCarousels(){
    const fleetRoot = document.getElementById("fleetCF");
    const tstRoot = document.getElementById("tstCF");
    if(fleetRoot){ window._fleetCF = new Coverflow(fleetRoot); window._fleetCFroot=true; }
    if(tstRoot){ window._tstCF = new Coverflow(tstRoot); }
  }

  /* ---------- Boot ---------- */
  function boot(){
    window.applyLang(window.getLang());
    buildLangMenus();
    renderFleet();
    renderTestimonials();
    initCarousels();
    initReveal();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
