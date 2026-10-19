import { Pool, PoolClient } from 'pg';
let pool:Pool|undefined;
/** Test-only injection. Production always constructs a PostgreSQL Pool. */
export function setTestDb(value: Pool) { if(process.env.NODE_ENV!=='test')throw new Error('Test database injection requires NODE_ENV=test');pool=value; }
export function db(){if(!pool&&!process.env.DATABASE_URL)throw new Error('Baza danych nie jest skonfigurowana. Ustaw DATABASE_URL i uruchom migrację.');return pool??=new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:10000});}
export async function transaction<T>(fn:(client:PoolClient)=>Promise<T>):Promise<T>{const client=await db().connect();try{await client.query('BEGIN');const result=await fn(client);await client.query('COMMIT');return result;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}
