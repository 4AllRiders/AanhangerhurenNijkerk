const z=n=>String(n).padStart(2,'0'),iso=d=>`${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`,today=iso(new Date());let cursor=new Date();cursor.setDate(1);let a='',b='';const start=document.querySelector('#start'),end=document.querySelector('#end');start.min=end.min=today;document.querySelector('#year').textContent=new Date().getFullYear();function render(){document.querySelector('#month').textContent=cursor.toLocaleDateString('nl-NL',{month:'long',year:'numeric'});const days=document.querySelector('#days');days.innerHTML='';const first=(cursor.getDay()+6)%7;for(let i=0;i<first;i++)days.append(document.createElement('span'));const count=new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();for(let n=1;n<=count;n++){const d=iso(new Date(cursor.getFullYear(),cursor.getMonth(),n)),el=document.createElement('button');el.textContent=n;el.type='button';el.disabled=d<today;el.setAttribute('aria-label',d);if(d===a||d===b||a&&b&&d>a&&d<b)el.classList.add('selected');el.onclick=()=>{if(!a||b||d<a){a=d;b=''}else b=d;start.value=a;end.value=b||a;render()};days.append(el)}}document.querySelector('#prev').onclick=()=>{let d=new Date(cursor.getFullYear(),cursor.getMonth()-1,1);if(d>=new Date(new Date().getFullYear(),new Date().getMonth(),1)){cursor=d;render()}};document.querySelector('#next').onclick=()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1);render()};start.onchange=end.onchange=()=>{a=start.value;b=end.value;render()};const requestForm=document.querySelector('#request');
requestForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const feedback=document.querySelector('#feedback');
  const button=requestForm.querySelector('button[type="submit"]');
  const formData=new FormData(requestForm);
  const from=String(formData.get('start')||'');
  const to=String(formData.get('end')||'');
  if(!from||!to||from<today||to<from){
    feedback.textContent='Kies een geldige huurperiode. De einddatum mag niet vóór de begindatum liggen.';
    return;
  }
  if(!requestForm.reportValidity())return;
  button.disabled=true;
  button.textContent='Aanvraag versturen…';
  feedback.textContent='Je aanvraag wordt verstuurd…';
  try {
    const response=await fetch(requestForm.action,{
      method:'POST',body:formData,headers:{'Accept':'application/json'}
    });
    if(!response.ok)throw new Error('Verzenden mislukt');
    feedback.textContent='Bedankt! Je aanvraag is verstuurd. We nemen contact met je op. De reservering is pas definitief na onze bevestiging.';
    requestForm.reset();
    a='';b='';render();
  }catch(error){
    feedback.textContent='Versturen is niet gelukt. Probeer het opnieuw of mail naar info@aanhangerhurennijkerk.nl.';
  }finally{
    button.disabled=false;
    button.textContent='Reservering aanvragen →';
  }
});
render();
(()=>{const photos=[{"src": "foto-01.webp", "alt": "Aanhanger in Nijkerk, origineel fotoaanzicht (foto 1)"}, {"src": "foto-02.webp", "alt": "Aanhangerverhuur Nijkerk, foto van de aanhanger (foto 2)"}, {"src": "foto-03.webp", "alt": "Aanhanger met gegalvaniseerd frame en zwarte zijpanelen (foto 3)"}, {"src": "foto-04.webp", "alt": "Ruime aanhanger te huur in Nijkerk (foto 4)"}, {"src": "foto-01.webp", "alt": "Laadbak en details van de aanhanger (foto 5)"}, {"src": "foto-06.webp", "alt": "Aanhanger in Nijkerk, origineel fotoaanzicht (foto 6)"}, {"src": "foto-07.webp", "alt": "Aanhangerverhuur Nijkerk, foto van de aanhanger (foto 7)"}, {"src": "foto-08.webp", "alt": "Aanhanger met gegalvaniseerd frame en zwarte zijpanelen (foto 8)"}, {"src": "foto-09.webp", "alt": "Ruime aanhanger te huur in Nijkerk (foto 9)"}, {"src": "foto-10.webp", "alt": "Laadbak en details van de aanhanger (foto 10)"}, {"src": "foto-11.webp", "alt": "Aanhanger in Nijkerk, origineel fotoaanzicht (foto 11)"}, {"src": "foto-12.webp", "alt": "Aanhangerverhuur Nijkerk, foto van de aanhanger (foto 12)"}, {"src": "foto-13.webp", "alt": "Aanhanger met gegalvaniseerd frame en zwarte zijpanelen (foto 13)"}, {"src": "foto-14.webp", "alt": "Ruime aanhanger te huur in Nijkerk (foto 14)"}];let current=4,timer=null;const image=document.querySelector('#slide-image'),count=document.querySelector('#slide-count'),thumbs=document.querySelector('#slide-thumbs'),play=document.querySelector('#slide-play'),stage=document.querySelector('.slide-stage');if(!image)return;function show(n){current=(n+photos.length)%photos.length;image.src=photos[current].src;image.alt=photos[current].alt;count.textContent=`Foto ${current+1} van ${photos.length}`;thumbs.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===current);b.setAttribute('aria-pressed',String(i===current))});}photos.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Bekijk foto ${i+1}`);const im=document.createElement('img');im.src=p.src;im.alt='';im.loading='lazy';b.append(im);b.addEventListener('click',()=>{stop();show(i)});thumbs.append(b)});document.querySelector('.slide-prev').addEventListener('click',()=>{stop();show(current-1)});document.querySelector('.slide-next').addEventListener('click',()=>{stop();show(current+1)});function stop(){clearInterval(timer);timer=null;play.textContent='▶ Automatisch afspelen';play.setAttribute('aria-pressed','false')}play.addEventListener('click',()=>{if(timer){stop()}else{timer=setInterval(()=>show(current+1),4500);play.textContent='❚❚ Pauzeren';play.setAttribute('aria-pressed','true')}});document.addEventListener('keydown',e=>{if(document.activeElement?.closest('.slideshow')){if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1)}});show(4)})();
// Veegbediening en mobiel menu
(()=>{const stage=document.querySelector(".slide-stage");let x=null;if(stage){stage.addEventListener("touchstart",e=>{x=e.changedTouches[0].screenX},{passive:true});stage.addEventListener("touchend",e=>{if(x===null)return;const d=e.changedTouches[0].screenX-x;x=null;if(Math.abs(d)>45)document.querySelector(d<0?".slide-next":".slide-prev").click()},{passive:true})}const menu=document.querySelector(".menu-toggle");if(menu){menu.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")!=="true";menu.setAttribute("aria-expanded",String(open));menu.textContent=open?"✕":"☰"});document.querySelector("#main-nav").addEventListener("click",e=>{if(e.target.closest("a")){menu.setAttribute("aria-expanded","false");menu.textContent="☰"}})}})();
