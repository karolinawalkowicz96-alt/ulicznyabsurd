import {rateLimit} from '@/lib/shop-auth';
import {json,readBody,sameOrigin,sha256} from '@/lib/server';
export async function POST(r:Request){
 if(!sameOrigin(r))return json({error:'Niedozwolone źródło żądania.'},403);
 let d;try{d=await readBody(r,12000);}catch{return json({error:'Nieprawidłowe dane formularza.'},400);}
 if(!d||typeof d!=='object')return json({error:'Nieprawidłowe dane.'},400);
 const {name,email,subject,message,website}=d;
 if(website)return json({error:'Wiadomość została zatrzymana przez ochronę antyspamową.'},400);
 if(typeof name!=='string'||name.trim().length<1||name.length>120||typeof email!=='string'||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||/[\r\n]/.test(email)||!['Współpraca z marką','Pytanie o koszulkę','Inna sprawa'].includes(subject)||typeof message!=='string'||message.trim().length<10||message.length>5000)return json({error:'Sprawdź imię, poprawny e-mail, temat i wiadomość (10–5000 znaków).'},400);
 if(process.env.CONTACT_ENABLED!=='true'||!process.env.RESEND_API_KEY||!process.env.CONTACT_TO||!process.env.CONTACT_FROM||!process.env.DATABASE_URL)return json({error:'Wysyłka nie jest jeszcze aktywna. Wiadomość nie została wysłana. Wróć po uruchomieniu kontaktu.'},503);
 try{
  const ip=r.headers.get('x-vercel-forwarded-for')||r.headers.get('cf-connecting-ip')||'unknown';const key=await sha256(ip);
  try{await rateLimit(`contact-ip:${key}`,5,3600);await rateLimit(`contact-email:${await sha256(email.toLowerCase())}`,3,3600);await rateLimit('contact-global',100,3600);}catch{return json({error:'Za dużo prób. Spróbuj ponownie później.'},429);}
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_FROM,to:[process.env.CONTACT_TO],reply_to:email,subject:`[Uliczny Absurd] ${subject}`,text:`Od: ${name.trim()} <${email}>\n\n${message.trim()}`}),signal:AbortSignal.timeout(10000)});
  const result=await response.json() as {id?:string};if(!response.ok||!result.id)return json({error:'Poczta nie przyjęła wiadomości. Spróbuj ponownie później.'},502);
  return json({accepted:true});
 }catch{return json({error:'Nie udało się potwierdzić wysłania wiadomości. Spróbuj ponownie później.'},503);}
}
