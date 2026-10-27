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
          start.value=selectedStart;end.value=selectedEnd||selectedStart;render();
        });days.append(btn);
      }
    }
    prev.addEventListener('click',()=>{const d=new Date(cursor.getFullYear(),cursor.getMonth()-1,1);const now=new Date();if(d>=new Date(now.getFullYear(),now.getMonth(),1)){cursor=d;render();}});
    next.addEventListener('click',()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1);render();});
    const sync=()=>{selectedStart=start.value;selectedEnd=end.value;render();};
    start.addEventListener('change',sync);end.addEventListener('change',sync);
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
