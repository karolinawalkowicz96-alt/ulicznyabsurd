import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validCart } from '../lib/catalog';
import { passwordHash,passwordMatches,assertOrigin } from '../lib/shop-auth';
import { orderInput } from '../lib/shop-service';
import { shopSizes } from '../lib/shop-types';

test('cart keeps multiple products and sizes, merges quantities, rejects malformed items',()=>{
 assert.deepEqual(validCart([{id:'oko-01',size:'M',quantity:2},{id:'oko-01',size:'M',quantity:1},{id:'oko-01',size:'XL',quantity:1},{id:'glowka-04',size:'S',quantity:1},{id:'x',size:'XS',quantity:1},{id:'x',size:'M',quantity:-1}]),[{id:'oko-01',size:'M',quantity:3},{id:'oko-01',size:'XL',quantity:1},{id:'glowka-04',size:'S',quantity:1}]);
 assert.deepEqual(validCart([{id:'Admin_NEW_01',size:'M',quantity:1}]),[{id:'Admin_NEW_01',size:'M',quantity:1}]);assert.deepEqual(validCart(null),[]);assert.equal(validCart([{id:'x',size:'M',quantity:100}])[0].quantity,10);
 assert.deepEqual(shopSizes,['S','M','L','XL','XXL']);
});
test('password hashes salted and incorrect/malformed passwords rejected',()=>{const a=passwordHash('a long private test password'),b=passwordHash('a long private test password');assert.notEqual(a,b);assert(passwordMatches('a long private test password',a));assert(!passwordMatches('incorrect',a));assert(!passwordMatches('x','malformed'));});
test('state changes reject cross-origin and absent Origin',()=>{process.env.APP_URL='https://www.ulicznyabsurd.pl';assert.throws(()=>assertOrigin(new Request('https://www.ulicznyabsurd.pl/api/shop/orders')));assert.throws(()=>assertOrigin(new Request('https://www.ulicznyabsurd.pl/api/shop/orders',{headers:{origin:'https://evil.example'}})));assert.doesNotThrow(()=>assertOrigin(new Request('https://www.ulicznyabsurd.pl/api/shop/orders',{headers:{origin:process.env.APP_URL!}})));});
test('order schema rejects empty cart, missing terms, XS and invalid personal data',()=>{const base={idempotencyKey:'5cce6292-eaef-4d6b-8a9e-5b59bcecfabc',items:[{id:'oko-01',size:'M',quantity:1}],customer:{firstName:'Jan',lastName:'Testowy',email:'jan@example.com',phone:'123456789',country:'PL',street:'Testowa 1',postalCode:'00-001',city:'Warszawa'},delivery:'courier',payment:'cod',acceptedTerms:true};assert(orderInput.safeParse(base).success);for(const patch of [{items:[]},{acceptedTerms:false},{items:[{id:'x',size:'XS',quantity:1}]},{customer:{...base.customer,email:'bad'}},{payment:'invalid'}])assert(!orderInput.safeParse({...base,...patch}).success);});
test('Stripe HMAC rejects tampering, wrong secret and expired timestamp',async()=>{const {verifySignature}=await import('../lib/checkout');const {createHmac}=await import('node:crypto');const timestamp=Math.floor(Date.now()/1000),body='{"type":"checkout.session.completed"}',secret='unit-test-secret';const signature=createHmac('sha256',secret).update(`${timestamp}.${body}`).digest('hex');const header=`t=${timestamp},v1=${signature}`;assert(await verifySignature(body,header,secret));assert(!await verifySignature(body+' ',header,secret));assert(!await verifySignature(body,header,'wrong-secret'));assert(!await verifySignature(body,header,secret,Date.now()+301000));});
