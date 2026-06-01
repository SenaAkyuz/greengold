  // ---------- Tabs (Bireysel / Kurumsal) ----------
  document.querySelectorAll('.seg button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.seg button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---------- Mega Menu (open on hover + keep on click for touch) ----------
  document.querySelectorAll('.nav>ul>li').forEach(li=>{
    li.addEventListener('mouseenter',()=>li.classList.add('open'));
    li.addEventListener('mouseleave',()=>li.classList.remove('open'));
    const a = li.querySelector(':scope > a');
    if(a){
      a.addEventListener('click',e=>{
        if(li.querySelector('.mega')){
          e.preventDefault();
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
  document.getElementById('heroPrev').addEventListener('click',()=>{ go(cur-1); resetAuto(); });
  document.getElementById('heroNext').addEventListener('click',()=>{ go(cur+1); resetAuto(); });
  document.getElementById('heroViewport').addEventListener('mouseenter',()=>clearInterval(timer));
  document.getElementById('heroViewport').addEventListener('mouseleave',startAuto);
  startAuto();

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

    const periodLabels = { '1':'yıllık', '0.5':'6 aylık', '0.25':'3 aylık', '0.0833':'aylık' };

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
      return a ? (periodLabels[a.dataset.mult] || 'yıllık') : 'yıllık';
    }

    function recalc(){
      const energy = parseInt(energySlider.value, 10);   // kWh / yıl
      const staff  = parseInt(staffSlider.value, 10);
      const factor = getActiveFactor();                   // kg CO2e / kWh (sektörel)
      const mult   = getActiveMult();

      // kg → ton CO2e, dönem çarpanıyla
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
