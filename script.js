// Aanhanger Huren Nijkerk: agenda en diashow. Start altijd bij foto-01.webp.
(() => {
  'use strict';
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const today = iso(new Date());
  const start = document.getElementById('start');
  const end = document.getElementById('end');
  const month = document.getElementById('month');
  const days = document.getElementById('days');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (start && end && month && days && prev && next) {
    start.min = end.min = today;
    let cursor = new Date(); cursor.setDate(1);
    let selectedStart = start.value || '', selectedEnd = end.value || '';
    function render() {
      month.textContent = cursor.toLocaleDateString('nl-NL', {month:'long', year:'numeric'});
      days.replaceChildren();
      const offset = (cursor.getDay()+6)%7;
      for (let i=0;i<offset;i++) days.append(document.createElement('span'));
      const total = new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();
      for (let n=1;n<=total;n++) {
        const date=iso(new Date(cursor.getFullYear(),cursor.getMonth(),n));
        const btn=document.createElement('button'); btn.type='button';btn.textContent=n;
        btn.disabled=date<today;btn.setAttribute('aria-label',date);
        if(date===selectedStart||date===selectedEnd||(selectedStart&&selectedEnd&&date>selectedStart&&date<selectedEnd))btn.classList.add('selected');
        btn.addEventListener('click',()=>{
          if(!selectedStart||selectedEnd||date<selectedStart){selectedStart=date;selectedEnd='';}
          else selectedEnd=date;
          start.value=selectedStart;end.value=selectedEnd||selectedStart;render();updatePrice();
        });days.append(btn);
      }
    }
    prev.addEventListener('click',()=>{const d=new Date(cursor.getFullYear(),cursor.getMonth()-1,1);const now=new Date();if(d>=new Date(now.getFullYear(),now.getMonth(),1)){cursor=d;render();}});
    next.addEventListener('click',()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1);render();});
    const sync=()=>{selectedStart=start.value;selectedEnd=end.value;render();};
    start.addEventListener('change',sync);end.addEventListener('change',sync);
    // Inclusieve kalenderdagen. Week = 7 opeenvolgende dagen (€149).
    // Weekend = zaterdag + zondag samen (€59); overige dagen €39.
    // Kies de goedkoopste geldige combinatie, zonder dubbeltelling.
    const euro = amount => new Intl.NumberFormat('nl-NL', {style:'currency', currency:'EUR'}).format(amount);
    function rentalPrice(from, to) {
      if (!from || !to || to < from) return null;
      const a = new Date(from + 'T12:00:00');
      const b = new Date(to + 'T12:00:00');
      const n = Math.round((b - a) / 86400000) + 1;
      if (n < 1 || n > 3660) return null;
      const dp = Array(n + 1).fill(Infinity);
      dp[n] = 0;
      for (let i = n - 1; i >= 0; i--) {
        const day = new Date(a.getFullYear(), a.getMonth(), a.getDate() + i, 12).getDay();
        dp[i] = 39 + dp[i + 1];
        if (day === 6 && i + 1 < n) dp[i] = Math.min(dp[i], 59 + dp[i + 2]);
        if (i + 7 <= n) dp[i] = Math.min(dp[i], 149 + dp[i + 7]);
      }
      return {days:n, rent:dp[0]};
    }
    function updatePrice() {
      const result = rentalPrice(start.value, end.value);
      const period = document.getElementById('price-period');
      const rental = document.getElementById('price-rental');
      const total = document.getElementById('price-total');
      if (!period || !rental || !total) return;
      period.textContent = result ? `${result.days} ${result.days === 1 ? 'dag' : 'dagen'}` : 'Kies je datums';
      rental.textContent = result ? euro(result.rent) : '—';
      total.textContent = result ? euro(result.rent + 100) : '—';
    }
    start.addEventListener('input', updatePrice);
    end.addEventListener('input', updatePrice);
    start.addEventListener('change', updatePrice);
    end.addEventListener('change', updatePrice);
    updatePrice();
    const form=document.getElementById('request');
    if(form)form.addEventListener('submit',e=>{
      const feedback=document.getElementById('feedback');
      if(!start.value||!end.value||start.value<today||end.value<start.value){e.preventDefault();if(feedback)feedback.textContent='Kies een geldige huurperiode.';}
      // Geldige aanvragen gaan rechtstreeks naar de bestaande Formspree-action.
    });
    render();
  }
  const image=document.getElementById('slide-image');
  const thumbs=document.getElementById('slide-thumbs');
  const count=document.getElementById('slide-count');
  const play=document.getElementById('slide-play');
  const back=document.querySelector('.slide-prev');
  const forward=document.querySelector('.slide-next');
  if(!image||!thumbs)return;
  const photos=Array.from({length:12},(_,i)=>`foto-${pad(i+1)}.webp`);
  let index=0, timer=null;
  function show(n){
    index=(n+photos.length)%photos.length;
    image.src=photos[index];image.alt=`Aanhanger te huur in Nijkerk – foto ${index+1} van ${photos.length}`;
    if(count)count.textContent=`Foto ${index+1} van ${photos.length}`;
    Array.from(thumbs.children).forEach((btn,i)=>{btn.classList.toggle('active',i===index);btn.setAttribute('aria-pressed',String(i===index));});
  }
  photos.forEach((src,i)=>{
    const btn=document.createElement('button');btn.type='button';btn.setAttribute('aria-label',`Bekijk foto ${i+1}`);
    const img=document.createElement('img');img.src=src;img.alt=`Miniatuur foto ${i+1}`;img.loading='lazy';img.decoding='async';
    btn.append(img);btn.addEventListener('click',()=>show(i));thumbs.append(btn);
  });
  if(back)back.addEventListener('click',()=>show(index-1));
  if(forward)forward.addEventListener('click',()=>show(index+1));
  if(play)play.addEventListener('click',()=>{
    if(timer){clearInterval(timer);timer=null;play.textContent='▶ Automatisch afspelen';}
    else{timer=setInterval(()=>show(index+1),4500);play.textContent='❚❚ Pauzeren';}
  });
  let touchX=null;
  image.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
  image.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1));touchX=null;},{passive:true});
  show(0);
})();
