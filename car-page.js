/* ===== Car detail page renderer ===== */
(function(){
  "use strict";
  function car(){ return (window.CARS||[]).find(c=>c.slug===window.CAR_SLUG); }

  function render(){
    const c = car();
    if(!c) return;
    const lang = window.getLang();
    const color = c.color[lang] || c.color.fr;
    const trans = window.t(c.trans==="auto"?"auto":"manual", lang);
    const fuel  = window.t(c.fuel, lang);

    const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
    document.title = `${c.model} ${color} 2025 — ${window.t("hero.kicker", lang)} | Isar Auto`;
    set("carName", c.model);
    set("carColor", `${color} · 2025`);
    set("specTrans", trans);
    set("specFuel", fuel);
    set("specSeats", c.seats);
    set("specDoors", c.doors);
    set("carPrice", c.price + " MAD");

    // highlight the diesel/manual exception
    const tEl = document.getElementById("specTrans");
    const fEl = document.getElementById("specFuel");
    if(tEl) tEl.classList.toggle("hl", c.trans==="manual");
    if(fEl) fEl.classList.toggle("hl", c.fuel==="diesel");

    // image slot id
    const slot = document.getElementById("carSlot");
    if(slot && slot.id!==c.slug){ slot.setAttribute("id", c.slug); slot.setAttribute("placeholder", `${c.model} · ${color}`); }

    // related cars (internal linking)
    const rel = document.getElementById("relatedCars");
    if(rel){
      rel.innerHTML = "";
      (window.CARS||[]).filter(x=>x.slug!==c.slug).forEach(x=>{
        const col = x.color[lang] || x.color.fr;
        const a = document.createElement("a");
        a.className = "lp-car";
        a.href = x.slug + ".html";
        a.innerHTML = `<img src="img/${x.slug}.webp" alt="${x.model} ${col} 2025" loading="lazy" /><span class="nm">${x.model} · ${col}</span><span class="pr">${window.t("from",lang)} ${x.price} MAD ${window.t("perday",lang)}</span>`;
        rel.appendChild(a);
      });
    }

    // back link & wa send
    const send = document.getElementById("bookSend");
    if(send){
      send.onclick = function(e){
        e.preventDefault();
        const nm = (document.getElementById("fName")||{}).value || "";
        const dt = (document.getElementById("fDates")||{}).value || "";
        const ms = (document.getElementById("fMsg")||{}).value || "";
        let msg = `${window.t("car.book.title",lang)} — ${c.model} (${color}, 2025).`;
        if(nm) msg += ` ${window.t("car.name",lang)}: ${nm}.`;
        if(dt) msg += ` ${window.t("car.dates",lang)}: ${dt}.`;
        if(ms) msg += ` ${ms}`;
        window.open(window.waLink(msg), "_blank");
      };
    }
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
