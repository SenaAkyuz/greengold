// DEFRA UK 2025 based approximate emission factors — update with the official set if precision is needed
const CF_FACTORS = {
  vehicle: { petrol: 0.165, diesel: 0.167, hybrid: 0.110, electric: 0.047 }, // kg CO2e / km
  electricity: 0.207,   // kg CO2e / kWh (UK grid)
  naturalGas: 0.183,    // kg CO2e / kWh
  waste: 0.500,         // kg CO2e / kg (general waste)
  flightShortPerKm: 0.151, // kg CO2e / passenger-km
  flightLongPerKm: 0.148,  // kg CO2e / passenger-km
};
const CF_FLIGHT = { basePerKm: 0.15, classMult: { economy: 1.0, premium: 1.6, business: 2.9, first: 4.0 } }; // kg CO2e/passenger-km (economy) + DEFRA class multipliers

  // ---------- Tabs (Bireysel / Kurumsal) — KALDIRILDI: header'daki SME/ENTERPRISE toggle yerine ESG Platform butonu kondu (13_esg). ----------
  // document.querySelectorAll('.seg button').forEach(btn=>{
  //   btn.addEventListener('click',()=>{
  //     document.querySelectorAll('.seg button').forEach(b=>b.classList.remove('active'));
  //     btn.classList.add('active');
  //   });
  // });

  // ---------- Mega Menu (open on hover + keep on click for touch; keyboard accessible) ----------
  const setLiAria = (l)=>{ const la=l.querySelector(':scope > a'); if(la && l.querySelector('.mega')) la.setAttribute('aria-expanded', l.classList.contains('open') ? 'true':'false'); };
  const closeOtherLis = (current)=>{ document.querySelectorAll('.nav>ul>li').forEach(o=>{ if(o!==current){ o.classList.remove('open'); setLiAria(o); } }); };
  document.querySelectorAll('.nav>ul>li').forEach(li=>{
    const hasMega = !!li.querySelector('.mega');
    let closeTimer;
    li.addEventListener('mouseenter',()=>{ clearTimeout(closeTimer); li.classList.add('open'); setLiAria(li); });
    li.addEventListener('mouseleave',()=>{
      if(hasMega){ closeTimer = setTimeout(()=>{ li.classList.remove('open'); setLiAria(li); }, 180); }  // grace period
      else { li.classList.remove('open'); }
    });
    const a = li.querySelector(':scope > a');
    if(a){
      a.addEventListener('click',e=>{
        if(hasMega){
          e.preventDefault();
          clearTimeout(closeTimer);
          closeOtherLis(li);
          li.classList.toggle('open');
          setLiAria(li);
        }
      });
      if(hasMega){
        a.addEventListener('keydown',e=>{
          if(e.key==='Enter' || e.key===' ' || e.key==='Spacebar'){
            e.preventDefault();
            clearTimeout(closeTimer);
            closeOtherLis(li);
            li.classList.toggle('open');
            setLiAria(li);
          } else if(e.key==='Escape'){
            li.classList.remove('open'); setLiAria(li); a.focus();
          }
        });
      }
    }
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('.nav')) document.querySelectorAll('.nav>ul>li.open').forEach(l=>{ l.classList.remove('open'); setLiAria(l); });
  });

  // ---------- Hero Slider ----------
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  const heroViewport = document.getElementById('heroViewport');
  if (heroViewport && heroPrev && heroNext) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.hero__dot');
    let cur = 0, timer;
    function go(i){
      cur = (i + slides.length) % slides.length;
      slides.forEach((s,idx)=>s.classList.toggle('active',idx===cur));
      dots.forEach((d,idx)=>d.classList.toggle('active',idx===cur));
    }
    function startAuto(){ timer = setInterval(()=>go(cur+1), 5500); }
    function resetAuto(){ clearInterval(timer); startAuto(); }
    dots.forEach(d=>d.addEventListener('click',()=>{ go(+d.dataset.go); resetAuto(); }));
    heroPrev.addEventListener('click',()=>{ go(cur-1); resetAuto(); });
    heroNext.addEventListener('click',()=>{ go(cur+1); resetAuto(); });
    heroViewport.addEventListener('mouseenter',()=>clearInterval(timer));
    heroViewport.addEventListener('mouseleave',startAuto);
    startAuto();
  }

  // ---------- Carbon Calculator ----------
  (function(){
    const GG_LOC = document.documentElement.lang === 'tr' ? 'tr-TR' : 'en-US';
    const fmtTr = (n, dec=0) => n.toLocaleString(GG_LOC,{minimumFractionDigits:dec,maximumFractionDigits:dec});
    const energySlider = document.getElementById('energySlider');
    const staffSlider = document.getElementById('staffSlider');
    const energyVal = document.getElementById('energyVal');
    const staffVal = document.getElementById('staffVal');
    const sectors = document.querySelectorAll('.sector');
    const periods = document.querySelectorAll('.period');
    const resEnergy = document.getElementById('resEnergy');
    const resStaff = document.getElementById('resStaff');
    const resPeriod = document.getElementById('resPeriod');
    const resTotal = document.getElementById('resTotal');
    const resPer = document.getElementById('resPer');

    if(!energySlider || !staffSlider) return;   // calculator not present (sub-pages) -> skip

    const periodLabels = GG_LOC === 'tr-TR'
      ? { '1':'yıllık', '0.5':'altı aylık', '0.25':'üç aylık', '0.0833':'aylık' }
      : { '1':'annual', '0.5':'semi-annual', '0.25':'quarterly', '0.0833':'monthly' };
    const defPeriod = GG_LOC === 'tr-TR' ? 'yıllık' : 'annual';

    function getActiveFactor(){
      const a = document.querySelector('.sector.active');
      return a ? parseFloat(a.dataset.factor) : 0.92;
    }
    function getActiveMult(){
      const a = document.querySelector('.period.active');
      return a ? parseFloat(a.dataset.mult) : 1;
    }
    function getPeriodLabel(){
      const a = document.querySelector('.period.active');
      return a ? (periodLabels[a.dataset.mult] || defPeriod) : defPeriod;
    }

    function recalc(){
      const energy = parseInt(energySlider.value, 10);   // kWh / year
      const staff  = parseInt(staffSlider.value, 10);
      const factor = getActiveFactor();                   // kg CO2e / kWh (by sector)
      const mult   = getActiveMult();

      // kg -> tonne CO2e, with period multiplier
      const totalT = (energy * factor / 1000) * mult;
      const perT   = totalT / Math.max(1,staff);

      energyVal.value = fmtTr(energy);
      staffVal.value  = fmtTr(staff);

      resEnergy.textContent = fmtTr(energy) + ' kWh';
      resStaff.textContent  = fmtTr(staff);
      resPeriod.textContent = getPeriodLabel();
      resTotal.innerHTML    = fmtTr(totalT, 1) + ' <span>tCO₂e</span>';
      resPer.innerHTML      = fmtTr(perT, 2)   + ' <span>tCO₂e</span>';
    }

    energySlider.addEventListener('input', recalc);
    staffSlider.addEventListener('input', recalc);
    sectors.forEach(s => s.addEventListener('click', () => {
      sectors.forEach(o => o.classList.remove('active'));
      s.classList.add('active');
      recalc();
    }));
    periods.forEach(p => p.addEventListener('click', () => {
      periods.forEach(o => o.classList.remove('active'));
      p.classList.add('active');
      recalc();
    }));
    recalc();
  })();

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq__item').forEach(it=>{
    it.querySelector('.faq__q').addEventListener('click',()=>{
      const wasOpen = it.classList.contains('open');
      document.querySelectorAll('.faq__item').forEach(o=>o.classList.remove('open'));
      if(!wasOpen) it.classList.add('open');
    });
  });

  // ---------- Stats Counter Animation ----------
  (function(){
    const GG_LOC = document.documentElement.lang === 'tr' ? 'tr-TR' : 'en-US';
    const fmtTr = (n, dec) => n.toLocaleString(GG_LOC,{minimumFractionDigits:dec,maximumFractionDigits:dec});
    const els = document.querySelectorAll('.stat__num[data-target]');
    if(!els.length) return;
    const animate = el => {
      const target = parseFloat(el.dataset.target);
      const dec = (el.dataset.target.includes('.')?1:0);
      const prefix = el.dataset.prefix || '';
      const small = el.querySelector('small');
      const tail = small ? small.outerHTML : '';
      let start = null, dur = 1600;
      function tick(t){
        if(!start) start = t;
        const p = Math.min(1,(t-start)/dur);
        const eased = 1 - Math.pow(1-p, 3);
        el.innerHTML = prefix + fmtTr(target * eased, dec) + tail;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); }
      });
    },{threshold:.4});
    els.forEach(el=>io.observe(el));
  })();

  // ---------- Carbon Footprint Calculator (page, DEFRA UK 2025) ----------
  (function(){
    const total = document.getElementById('cfcTotal');
    if(!total) return;                       // calculator not on this page
    const totalT = document.getElementById('cfcTotalT');
    let cfcChart = null;
    const CFC_TR = document.documentElement.lang === 'tr';
    const CFC_LOC = CFC_TR ? 'tr-TR' : 'en-US';
    const CFC_COLORS = ['#5cb85c','#f4d03f','#f5a623','#9aa0a6','#4a90e2'];
    const CFC_LABELS = CFC_TR ? ['Araç','Elektrik','Doğal Gaz','Atık','Uçuşlar'] : ['Car','Electricity','Natural Gas','Waste','Flights'];
    const num = id => { const el = document.getElementById(id); const v = el ? parseFloat(el.value) : 0; return (isFinite(v) && v > 0) ? v : 0; };
    const carType = () => { const el = document.getElementById('cfcCarType'); return el ? el.value : 'petrol'; };

    function initChart(){
      if(cfcChart || typeof Chart === 'undefined') return;
      const cv = document.getElementById('cfcChart'); if(!cv) return;
      cfcChart = new Chart(cv, {
        type: 'pie',
        data: { labels: CFC_LABELS, datasets: [{ data: [0,0,0,0,0], backgroundColor: CFC_COLORS, borderColor: '#fff', borderWidth: 2 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 12 } } },
            tooltip: { callbacks: { label: (c) => c.label + ': ' + Math.round(c.parsed).toLocaleString(CFC_LOC) + ' kg' } }
          }
        }
      });
    }

    function recalc(){
      const vehicle     = num('cfcCarKm') * (CF_FACTORS.vehicle[carType()] || 0);
      const electricity = num('cfcElec') * 12 * CF_FACTORS.electricity;
      const naturalGas  = num('cfcGas')  * 12 * CF_FACTORS.naturalGas;
      const waste       = num('cfcWaste') * 52 * CF_FACTORS.waste;
      let flights = 0;
      document.querySelectorAll('#cfcFlights .cfc-flight').forEach(row => {
        const kmEl = row.querySelector('.cfc-flight__km'), nEl = row.querySelector('.cfc-flight__n'), clsEl = row.querySelector('.cfc-flight__class');
        const km = parseFloat(kmEl && kmEl.value) || 0;
        const n  = parseFloat(nEl && nEl.value) || 0;
        const cls = clsEl ? clsEl.value : 'economy';
        if(km > 0 && n > 0) flights += km * n * CF_FLIGHT.basePerKm * (CF_FLIGHT.classMult[cls] || 1);
      });
      const kg = vehicle + electricity + naturalGas + waste + flights; // all categories summed
      total.textContent = Math.round(kg).toLocaleString(CFC_LOC);
      if(totalT) totalT.innerHTML = '≈ ' + (kg/1000).toLocaleString(CFC_LOC,{minimumFractionDigits:1,maximumFractionDigits:1}) + (CFC_TR ? ' t CO<sub>2</sub>/yıl' : ' t CO<sub>2</sub>/year');
      if(cfcChart){ cfcChart.data.datasets[0].data = [vehicle, electricity, naturalGas, waste, flights]; cfcChart.update(); }
    }

    document.querySelectorAll('.cfc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cfc-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected','true');
        const key = tab.dataset.cfcTab;
        document.querySelectorAll('.cfc-panel').forEach(p => p.classList.toggle('active', p.dataset.cfcPanel === key));
      });
    });
    document.querySelectorAll('.cfc-input, .cfc-select').forEach(el => {
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });
    // flights: multi-row add / remove / update
    const cfcFlights = document.getElementById('cfcFlights');
    function bindFlightRow(row){
      row.querySelectorAll('input, select').forEach(el => { el.addEventListener('input', recalc); el.addEventListener('change', recalc); });
      const rm = row.querySelector('.cfc-flight__rm');
      if(rm) rm.addEventListener('click', () => {
        if(cfcFlights.querySelectorAll('.cfc-flight').length > 1){ row.remove(); recalc(); }
      });
    }
    if(cfcFlights){
      cfcFlights.querySelectorAll('.cfc-flight').forEach(bindFlightRow);
      const addBtn = document.getElementById('cfcAddFlight');
      const updBtn = document.getElementById('cfcUpdate');
      if(addBtn) addBtn.addEventListener('click', () => {
        const tpl = cfcFlights.querySelector('.cfc-flight');
        const clone = tpl.cloneNode(true);
        clone.querySelectorAll('input').forEach(i => i.value = '');
        const sel = clone.querySelector('.cfc-flight__class'); if(sel) sel.value = 'economy';
        cfcFlights.appendChild(clone);
        bindFlightRow(clone);
        recalc();
      });
      if(updBtn) updBtn.addEventListener('click', recalc);
    }
    initChart();
    recalc();
  })();

  // ---------- Cookie Consent Banner ----------
  (function(){
    var banner = document.getElementById('cookieBanner');
    if(!banner) return;
    var KEY = 'gg_cookie_consent';

    function loadAnalytics(){
      // TODO Faz 8: GA4 / analytics scriptleri YALNIZ 'accept' onayında burada yüklenecek.
    }

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch(e){}
    if(saved === 'accept'){ loadAnalytics(); }
    if(!saved){ banner.hidden = false; }

    function choose(v){
      try { localStorage.setItem(KEY, v); } catch(e){}
      banner.hidden = true;
      if(v === 'accept'){ loadAnalytics(); }
    }
    var acc = document.getElementById('cookieAccept');
    var rej = document.getElementById('cookieReject');
    if(acc) acc.addEventListener('click', function(){ choose('accept'); });
    if(rej) rej.addEventListener('click', function(){ choose('reject'); });
  })();

  // ---------- Mobile hamburger menu (10B FIX 1) ----------
  (function(){
    var t = document.getElementById('navToggle');
    var nav = document.getElementById('primaryNav');
    if(!t || !nav) return;
    function setOpen(o){
      nav.classList.toggle('is-open', o);
      t.setAttribute('aria-expanded', o ? 'true':'false');
      t.setAttribute('aria-label', o ? 'Close menu':'Open menu');
    }
    t.addEventListener('click', function(){ setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function(e){ var a=e.target.closest('a'); if(a && a.getAttribute('href')) setOpen(false); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') setOpen(false); });
  })();

  // ---------- Language switcher (11a, 11d override-destekli) ----------
  (function(){
    var sw=document.querySelector('.lang-switch'); if(!sw) return;
    var p=location.pathname.replace(/\/index(\.html)?$/,'/').replace(/\.html$/,'');
    if(p==='') p='/';
    var isTR = p==='/tr' || p.indexOf('/tr/')===0;
    var en = sw.getAttribute('data-en-href') || (isTR ? (p.replace(/^\/tr/,'')||'/') : p);
    var tr = sw.getAttribute('data-tr-href') || (isTR ? p : (p==='/' ? '/tr' : '/tr'+p));
    var ea=sw.querySelector('[data-lang="en"]'), ta=sw.querySelector('[data-lang="tr"]');
    if(ea) ea.setAttribute('href', en);
    if(ta) ta.setAttribute('href', tr);
    (isTR?ta:ea) && (isTR?ta:ea).classList.add('is-active');
  })();
