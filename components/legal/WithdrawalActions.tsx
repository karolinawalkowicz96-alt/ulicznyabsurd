'use client';
export default function WithdrawalActions(){return <div className="withdrawal-actions"><button className="button dark" type="button" onClick={()=>window.print()}>Drukuj / zapisz jako PDF</button><a className="button" href="/formularz-odstapienia.txt" download>Pobierz formularz TXT</a></div>}
