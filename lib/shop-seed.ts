import { ShopProduct, ShopSettings, shopSizes } from './shop-types';
const entries=[['oko-01','nie-widze-sie-w-pracy','Nie widzę się w pracy','/koszulka.webp','Mam problem ze wzrokiem. Nie widzę się dzisiaj w pracy. Humor na dzień, w którym myślami jesteś już poza biurem.'],['glowka-04','glowka-pracuje','Główka pracuje','/products/glowka-pracuje.webp','Pomysłowość nie zna granic. Koszulka z przymrużeniem oka dla mistrzów codziennej przedsiębiorczości.'],['dom-06','moglem-zostac-w-domu','Mogłem zostać w domu','/products/moglem-zostac-w-domu.webp','Dla tych, którzy po wyjściu od razu tęsknią za kanapą. Gotowy wzór pełen codziennego absurdu.'],['zawodowcy-05','zawodowcy-trenuja-codziennie','Zawodowcy trenują codziennie','/products/zawodowcy-trenuja-fiolet.webp','Żartobliwy nadruk o konsekwencji i treningu po swojemu. Koszulka dla dorosłych z dystansem.'],['noc-02','nie-spimy-lecimy','Nie śpimy, lecimy','/products/nie-spimy-lecimy.webp','Wieczór dopiero się zaczyna. Imprezowy wzór dla tych, którzy zawsze mają jeszcze jeden plan.'],['ceny-08','ceny-leca-w-gore','Ceny lecą w górę','/products/ceny-leca-w-gore.webp','Komentarz do codziennych zakupów w stylu Ulicznego Absurdu. Humor, który widać bez paragonu.'],['paliwko-07','piwko-to-moje-paliwko','Piwko to moje paliwko','/products/piwko-paliwko.webp','Żartobliwy wzór dla dorosłych miłośników odpoczynku i niepoważnych haseł.'],['szef-03','szef-imprezy','Szef imprezy','/products/szef-imprezy-brzoskwinia.webp','Nie trzeba wizytówki, kiedy wszystko mówi koszulka. Wyrazisty wzór na spotkania w dobrym towarzystwie.']];
export const seedProducts:ShopProduct[]=entries.map(([id,slug,name,image,description],i)=>({
  id,slug,name,image,description,images:[image],price:i===0?12900:null,priceApproved:i===0,active:true,hidden:false,soldOut:false,sortOrder:i,bestseller:false,isNew:false,
  seoTitle:`${name} — koszulka z nadrukiem | Uliczny Absurd`,seoDescription:description,
  material:'Skład i materiał wymagają potwierdzenia na podstawie dokumentacji lub metki produktu.',care:'Pielęgnację należy uzupełnić zgodnie z metką producenta.',
  manufacturer:'',manufacturerAddress:'',manufacturerEmail:'',manufacturerCountry:'',responsiblePerson:'',responsiblePersonAddress:'',responsiblePersonEmail:'',composition:'',safetyInfo:'',gpsrReady:false,
  variants:shopSizes.map(size=>({size,stock:null}))
}));
export const defaultSettings:ShopSettings={
  sellerPhone:'',fulfillmentDays:0,legalReady:false,sizeChartApproved:false,shippingReady:false,
  testMode:true,salesActive:false,codActive:false,stripeActive:false,
  courierActive:false,lockerActive:false,courierPrice:0,lockerPrice:0,
  courierCodConfirmed:false,lockerCodConfirmed:false,internationalCodConfirmed:false,codSurcharge:0,
  quarterlyLimit:1081350,instagram:4000,facebook:32100,youtube:800,tiktok:27000,views:30000000,statsUpdated:'2026-10-20'
};
