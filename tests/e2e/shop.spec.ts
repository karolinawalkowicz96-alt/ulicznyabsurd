import {test,expect} from '@playwright/test';
// Requires a separately running app using an isolated migrated/seeded TEST database.
// No webServer here: never starts or touches production automatically.
test('multi-product cart survives refresh and complete COD checkout persists',async({page,request})=>{
 const catalog=await (await request.get('/api/shop/catalog')).json();
 expect(catalog.configured,'Configure test database before E2E').toBeTruthy();
 expect(catalog.settings.testMode,'E2E may only write test orders').toBe(true);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/produkt/nie-widze-sie-w-pracy');
 await page.getByRole('button',{name:'Do koszyka',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('wybierz rozmiar');
 await page.getByRole('button',{name:'M',exact:true}).click();
 await page.getByRole('button',{name:'Do koszyka',exact:true}).click();
 await page.getByRole('button',{name:'Kontynuuj zakupy'}).click();
 await page.goto('/produkt/glowka-pracuje');
 await page.getByRole('button',{name:'XL',exact:true}).click();
 await page.getByRole('button',{name:'Do koszyka',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await dialog.getByRole('button',{name:'Zwiększ ilość'}).first().click();
 await page.reload();
 await page.getByRole('button',{name:/Koszyk: 3 produktów/}).click();
 await page.getByRole('link',{name:/Przejdź do zamówienia/}).click();
 for(const [label,value] of [['Imię','Jan'],['Nazwisko','Testowy'],['E-mail','e2e@example.com'],['Telefon','123456789'],['Ulica, numer budynku / lokalu','Testowa 1'],['Kod pocztowy','00-001'],['Miasto','Warszawa']])await page.getByLabel(label,{exact:true}).fill(value);
 await page.getByLabel('Metoda dostawy').selectOption('courier');
 await page.locator('input[name="acceptedTerms"]').check();
 await page.getByRole('button',{name:'Zamawiam i płacę',exact:true}).click();
 await expect(page.getByRole('heading',{name:'TEST ZAKOŃCZONY.'})).toBeVisible();
 await expect(page.getByText('nieopłacone',{exact:true})).toBeVisible();
 await expect(page.getByText(/TEST-\d{8}-/)).toBeVisible();
 await page.reload();await expect(page.getByRole('heading',{name:'TEST ZAKOŃCZONY.'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
test('admin APIs do not expose orders without session; empty cart and SEO',async({page,request})=>{
 const response=await request.get('/api/admin/orders');expect([401,403]).toContain(response.status());
 await page.goto('/zamowienie');await expect(page.getByText('Koszyk jest pusty.',{exact:false})).toBeVisible();
 await page.goto('/produkt/nie-widze-sie-w-pracy');await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.ulicznyabsurd.pl/produkt/nie-widze-sie-w-pracy');
 await page.getByRole('button',{name:/Tabela rozmiarów/}).click();await expect(page.getByRole('dialog')).toContainText('44 cm');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
