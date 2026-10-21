'use client';
import { MapPin, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function LockerPicker(){
 const [code,setCode]=useState('');
 return <div className="locker-picker">
  <div className="locker-picker-heading"><span className="locker-picker-icon"><MapPin size={25}/></span><div><span className="eyebrow">TWOJA PACZKA. TWÓJ PACZKOMAT.</span><h3>Gdzie odbierasz swój absurd?</h3></div></div>
  <p>Znajdź najbliższy Paczkomat® na mapie InPost, a następnie wpisz jego kod poniżej. Mapa otworzy się w nowej karcie — Twój koszyk zostaje tutaj.</p>
  <a className="button locker-map-button" href="https://inpost.pl/znajdz-paczkomat" target="_blank" rel="noopener noreferrer">Otwórz mapę InPost <ExternalLink size={17}/></a>
  <label htmlFor="inpost-locker">Kod automatu Paczkomat®<input id="inpost-locker" name="locker" value={code} onChange={e=>setCode(e.target.value.toUpperCase().replace(/\s/g,''))} required minLength={3} maxLength={30} pattern="[A-Za-z0-9_-]{3,30}" placeholder="np. WAW01M" autoComplete="off" autoCapitalize="characters" spellCheck={false} aria-describedby="locker-help"/></label>
  <small id="locker-help">Przepisz dokładny kod z mapy, nie adres ulicy.</small>
 </div>;
}
