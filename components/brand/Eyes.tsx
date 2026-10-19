'use client';
import {useEffect,useRef} from 'react';
export default function Eyes(){
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const el=ref.current;if(!el)return;
  const move=(e:PointerEvent)=>{el.querySelectorAll<HTMLElement>('.eye-ball').forEach(eye=>{const b=eye.getBoundingClientRect();const dx=e.clientX-b.left-b.width/2,dy=e.clientY-b.top-b.height/2;const d=Math.hypot(dx,dy)||1;const limit=Math.min(b.width*.18,d*.12);eye.style.setProperty('--ex',`${dx/d*limit}px`);eye.style.setProperty('--ey',`${dy/d*limit}px`);});};
  const reset=()=>el.querySelectorAll<HTMLElement>('.eye-ball').forEach(eye=>{eye.style.setProperty('--ex','0px');eye.style.setProperty('--ey','0px');});
  el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);
  return()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);};
 },[]);
 useEffect(()=>{const nodes=document.querySelectorAll('.section-heading h2,.feature-heading h2,.collection-grid-heading h2,.footer-wordmark');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('arrived');io.unobserve(e.target);}}),{threshold:.1});nodes.forEach(n=>{n.classList.add('reveal-heading');io.observe(n);});return()=>{io.disconnect();nodes.forEach(n=>n.classList.remove('reveal-heading'));};},[]);
 return <section className="eyes-section" ref={ref}><span className="eyebrow">POZNAJMY SIĘ BEZ FILTRA</span><div className="eyes-layout"><h2>Świat jest wystarczająco poważny. <em>My nie musimy.</em></h2><div className="eye-pair" aria-hidden="true">{[0,1].map(i=><div className="eye-ball" key={i}><div className="eye-iris"><div className="eye-pupil"/></div></div>)}</div></div><div className="eyes-footer"><p>Ulica. Kamera. I to, czego nie da się wymyślić.</p><p>Łapiemy momenty, które chcesz wysłać znajomym.<br/>Teraz przenosimy ten sam dystans poza ekran.</p></div></section>;
}
