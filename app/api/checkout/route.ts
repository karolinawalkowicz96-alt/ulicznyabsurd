// Legacy single-product endpoint is deliberately closed; all orders use PostgreSQL.
export async function POST(){return Response.json({error:'Przejdź do /zamowienie, aby złożyć zamówienie.'},{status:410});}
