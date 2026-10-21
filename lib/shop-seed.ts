import { ShopProduct, ShopSettings, shopSizes } from './shop-types';
const entries=[['oko-01','nie-widze-sie-w-pracy','Nie widzę się w pracy','/koszulka.webp','Mam problem ze wzrokiem. Nie widzę się dzisiaj w pracy. Humor na dzień, w którym myślami jesteś już poza biurem.'],['glowka-04','glowka-pracuje','Główka pracuje','/products/glowka-pracuje.webp','Pomysłowość nie zna granic. Koszulka z przymrużeniem oka dla mistrzów codziennej przedsiębiorczości.'],['dom-06','moglem-zostac-w-domu','Mogłem zostać w domu','/products/moglem-zostac-w-domu.webp','Dla tych, którzy po wyjściu od razu tęsknią za kanapą. Gotowy wzór pełen codziennego absurdu.'],['zawodowcy-05','zawodowcy-trenuja-codziennie','Zawodowcy trenują codziennie','/products/zawodowcy-trenuja-fiolet.webp','Żartobliwy nadruk o konsekwencji i treningu po swojemu. Koszulka dla dorosłych z dystansem.'],['noc-02','nie-spimy-lecimy','Nie śpimy, lecimy','/products/nie-spimy-lecimy.webp','Wieczór dopiero się zaczyna. Imprezowy wzór dla tych, którzy zawsze mają jeszcze jeden plan.'],['ceny-08','ceny-leca-w-gore','Ceny lecą w górę','/products/ceny-leca-w-gore.webp','Komentarz do codziennych zakupów w stylu Ulicznego Absurdu. Humor, który widać bez paragonu.'],['paliwko-07','piwko-to-moje-paliwko','Piwko to moje paliwko','/products/piwko-paliwko.webp','Żartobliwy wzór dla dorosłych miłośników odpoczynku i niepoważnych haseł.'],['szef-03','szef-imprezy','Szef imprezy','/products/szef-imprezy-brzoskwinia.webp','Nie trzeba wizytówki, kiedy wszystko mówi koszulka. Wyrazisty wzór na spotkania w dobrym towarzystwie.']];
export const seedProducts:ShopProduct[]=entries.map(([id,slug,name,image,description])=>({
  id,slug,name,image,description,images:[image],price:7999,priceApproved:true,active:true,hidden:false,soldOut:false,sortOrder:['oko-01','glowka-04','paliwko-07','zawodowcy-05','noc-02','ceny-08','szef-03','dom-06'].indexOf(id),bestseller:false,isNew:false,
  seoTitle:`${name} — koszulka z nadrukiem | Uliczny Absurd`,seoDescription:description,
  material:'100% bawełna · 185 g/m²',care:'Pranie do 40°C. Prasowanie i suszenie w suszarce bębnowej zgodnie z metką produktu. Nadruk prasuj na lewej stronie, unikając bezpośredniego kontaktu z żelazkiem.',
  manufacturer:'',manufacturerAddress:'',manufacturerEmail:'',manufacturerCountry:'',responsiblePerson:'',responsiblePersonAddress:'',responsiblePersonEmail:'',composition:'100% bawełna; gramatura 185 g/m² (biała koszulka)',safetyInfo:'',gpsrReady:false,
  variants:shopSizes.map(size=>({size,stock:null}))
})).sort((a,b)=>a.sortOrder-b.sortOrder);
export const defaultSettings:ShopSettings={
  sellerPhone:'+48 513 258 296',fulfillmentDays:7,legalReady:false,sizeChartApproved:true,shippingReady:false,
  testMode:false,salesActive:false,codActive:false,stripeActive:false,
  courierActive:true,lockerActive:true,courierPrice:1899,lockerPrice:1499,
  courierCodConfirmed:false,lockerCodConfirmed:false,internationalCodConfirmed:false,codSurcharge:0,
  quarterlyLimit:1081350,instagram:4000,facebook:32100,youtube:800,tiktok:27000,views:30000000,statsUpdated:'2026-10-20'
};
