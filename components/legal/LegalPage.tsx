import { defaultSettings } from '@/lib/shop-seed';
import { getSettings } from '@/lib/shop-service';
import Link from 'next/link';
import type { ReactNode } from 'react';
export async function legalSettings(){return process.env.DATABASE_URL ? getSettings() : defaultSettings;}
export const seller = 'Paweł Duszyński, ul. Północna 24/2, 44-335 Jastrzębie-Zdrój, Polska';
export const email = 'ulicznyabsurd@gmail.com';
export const legalLinks = [['regulamin','Regulamin'],['prywatnosc','Prywatność'],['cookies','Cookies'],['dostawa','Dostawa i płatności'],['zwroty','Zwroty'],['reklamacje','Reklamacje'],['kontakt','Kontakt'],['sprzedawca','Dane sprzedawcy'],['odstapienie','Formularz odstąpienia']];
export function LegalPage({title,children}:{title:string;children:ReactNode}){return <main className="legal"><Link href="/">← Uliczny Absurd — sklep</Link><h1>{title}</h1><p>Wersja: 20 października 2026 r.</p>{children}<nav aria-label="Informacje sklepu" style={{display:'flex',gap:16,flexWrap:'wrap',marginTop:40}}>{legalLinks.map(([slug,label])=><Link key={slug} href={'/'+slug}>{label}</Link>)}</nav></main>}
export async function Seller(){const settings=await legalSettings();return <><p><strong>ULICZNY ABSURD</strong><br/>{seller}<br/>Osoba fizyczna prowadząca sprzedaż w ramach działalności nierejestrowanej.<br/><a href={'mailto:'+email}>{email}</a>{settings.sellerPhone&&<><br/>Telefon: <a href={'tel:'+settings.sellerPhone}>{settings.sellerPhone}</a></>}</p>{!settings.sellerPhone&&<p><strong>Sprzedaż rzeczywista nie jest jeszcze aktywna.</strong> Wymagany numer telefonu sprzedawcy zostanie podany przed jej uruchomieniem.</p>}</>}
export function TestNotice(){return null;}
