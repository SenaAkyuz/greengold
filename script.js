// DEFRA UK 2025 based approximate emission factors — update with the official set if precision is needed
const CF_FACTORS = {
  vehicle: { petrol: 0.165, diesel: 0.167, hybrid: 0.110, electric: 0.047 }, // kg CO2e / km
  electricity: 0.207,   // kg CO2e / kWh (UK grid)
  naturalGas: 0.183,    // kg CO2e / kWh
  waste: 0.500,         // kg CO2e / kg (general waste)
  flightShortPerKm: 0.151, // kg CO2e / passenger-km
  flightLongPerKm: 0.148,  // kg CO2e / passenger-km
};
const CF_FLIGHT_KM = { short: 1500, long: 6000 }; // representative one-way distance per flight (km)

  // ---------- Tabs (Bireysel / Kurumsal) ----------
  document.querySelectorAll('.seg button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.seg button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---------- Mega Menu (open on hover + keep on click for touch) ----------
  document.querySelectorAll('.nav>ul>li').forEach(li=>{
    const hasMega = !!li.querySelector('.mega');
    let closeTimer;
    li.addEventListener('mouseenter',()=>{ clearTimeout(closeTimer); li.classList.add('open'); });
    li.addEventListener('mouseleave',()=>{
      if(hasMega){ closeTimer = setTimeout(()=>li.classList.remove('open'), 180); }  // grace period
      else { li.classList.remove('open'); }
    });
    const a = li.querySelector(':scope > a');
    if(a){
      a.addEventListener('click',e=>{
        if(li.querySelector('.mega')){
          e.preventDefault();
          clearTimeout(closeTimer);
          document.querySelectorAll('.nav>ul>li').forEach(o=>{ if(o!==li) o.classList.remove('open'); });
          li.classList.toggle('open');
        }
      });
    }
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('.nav')) document.querySelectorAll('.nav>ul>li.open').forEach(l=>l.classList.remove('open'));
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
    const fmtTr = (n, dec=0) => n.toLocaleString('tr-TR',{minimumFractionDigits:dec,maximumFractionDigits:dec});
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

    const periodLabels = { '1':'annual', '0.5':'semi-annual', '0.25':'quarterly', '0.0833':'monthly' };

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
      return a ? (periodLabels[a.dataset.mult] || 'annual') : 'annual';
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
    const fmtTr = (n, dec) => n.toLocaleString('tr-TR',{minimumFractionDigits:dec,maximumFractionDigits:dec});
    const els = document.querySelectorAll('.stat__num[data-target]');
    if(!els.length) return;
    const animate = el => {
      const target = parseFloat(el.dataset.target);
      const dec = (el.dataset.target.includes('.')?1:0);
      const small = el.querySelector('small');
      const tail = small ? small.outerHTML : '';
      let start = null, dur = 1600;
      function tick(t){
        if(!start) start = t;
        const p = Math.min(1,(t-start)/dur);
        const eased = 1 - Math.pow(1-p, 3);
        el.innerHTML = fmtTr(target * eased, dec) + tail;
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

  // ---------- Carbon Footprint Calculator (modal, DEFRA UK 2025) ----------
  (function(){
    const opener = document.getElementById('cfcOpen');
    const modal  = document.getElementById('cfcModal');
    if(!opener || !modal) return;                 // only on pages that have the widget
    const closeBtn = modal.querySelector('.cfc-close');
    const overlay  = modal.querySelector('[data-cfc-overlay]');
    const total    = modal.querySelector('#cfcTotal');
    const totalT   = modal.querySelector('#cfcTotalT');
    let lastFocus = null;
    let cfcChart = null;
    const CFC_COLORS = ['#5cb85c','#f4d03f','#f5a623','#9aa0a6','#4a90e2'];
    const CFC_LABELS = ['Car','Electricity','Natural Gas','Waste','Flights'];

    const num = id => { const el = modal.querySelector('#'+id); const v = el ? parseFloat(el.value) : 0; return (isFinite(v) && v > 0) ? v : 0; };
    const carType = () => { const el = modal.querySelector('#cfcCarType'); return el ? el.value : 'petrol'; };

    function recalc(){
      const vehicle     = num('cfcCarKm') * (CF_FACTORS.vehicle[carType()] || 0);
      const electricity = num('cfcElec') * 12 * CF_FACTORS.electricity;
      const naturalGas  = num('cfcGas')  * 12 * CF_FACTORS.naturalGas;
      const waste       = num('cfcWaste') * 52 * CF_FACTORS.waste;
      const flights     = num('cfcShort') * CF_FLIGHT_KM.short * CF_FACTORS.flightShortPerKm
                        + num('cfcLong')  * CF_FLIGHT_KM.long  * CF_FACTORS.flightLongPerKm;
      const kg = vehicle + electricity + naturalGas + waste + flights; // all categories summed
      if(total)  total.textContent = Math.round(kg).toLocaleString('en-US');
      if(totalT) totalT.innerHTML = '≈ ' + (kg/1000).toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1}) + ' t CO<sub>2</sub>/year';
      if(cfcChart){ cfcChart.data.datasets[0].data = [vehicle, electricity, naturalGas, waste, flights]; cfcChart.update(); }
    }

    modal.querySelectorAll('.cfc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.cfc-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected','true');
        const key = tab.dataset.cfcTab;
        modal.querySelectorAll('.cfc-panel').forEach(p => p.classList.toggle('active', p.dataset.cfcPanel === key));
      });
    });
    modal.querySelectorAll('.cfc-input, .cfc-select').forEach(el => {
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });

    function initChart(){
      if(cfcChart || typeof Chart === 'undefined') return;
      const cv = modal.querySelector('#cfcChart');
      if(!cv) return;
      cfcChart = new Chart(cv, {
        type: 'pie',
        data: { labels: CFC_LABELS, datasets: [{ data: [0,0,0,0,0], backgroundColor: CFC_COLORS, borderColor: '#fff', borderWidth: 2 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 12 } } },
            tooltip: { callbacks: { label: (c) => c.label + ': ' + Math.round(c.parsed).toLocaleString('en-US') + ' kg' } }
          }
        }
      });
    }

    function onKey(e){
      if(e.key === 'Escape'){ closeModal(); return; }
      if(e.key === 'Tab'){
        const list = [...modal.querySelectorAll('button, select, input, a[href]')].filter(el => !el.disabled && el.offsetParent !== null);
        if(!list.length) return;
        const first = list[0], last = list[list.length - 1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    }
    function openModal(e){ if(e) e.preventDefault(); lastFocus = document.activeElement; modal.classList.add('open'); document.body.style.overflow = 'hidden'; initChart(); recalc(); if(closeBtn) closeBtn.focus(); document.addEventListener('keydown', onKey); }
    function closeModal(){ modal.classList.remove('open'); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); if(lastFocus) lastFocus.focus(); }

    opener.addEventListener('click', openModal);
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(overlay)  overlay.addEventListener('click', closeModal);
    recalc();
  })();
