const landingEntries = [
 ['hyperbaric-chamber-for-sale','Hyperbaric Chambers for Sale','Explore chambers for your home or practice, with guidance from selection through setup.'],
 ['home-hyperbaric-chamber','Home Hyperbaric Chambers','Plan a comfortable space and explore chamber configurations for your home.'],
 ['portable-hyperbaric-chamber','Portable Hyperbaric Chambers','Compare portable designs, interior space, installation, and storage considerations.'],
 ['soft-shell-hyperbaric-chamber','Soft Shell Hyperbaric Chambers','Explore flexible chamber construction and the practical details of daily ownership.'],
 ['mild-hyperbaric-chamber','Mild Hyperbaric Chambers','Understand chamber specifications, pressure terminology, and the questions to discuss with your clinician.'],
 ['fda-cleared-hyperbaric-chamber','FDA Cleared Hyperbaric Chambers','Find the documentation to review when comparing equipment and its intended use.'],
 ['best-hyperbaric-chamber','Choosing the Best Hyperbaric Chamber','A useful comparison starts with your space, care setting, and support requirements.'],
 ['hyperbaric-chamber-comparison','Compare Hyperbaric Chambers','See the chamber family together and explore the differences between individual models.'],
 ['hyperbaric-chamber-buying-guide','Hyperbaric Chamber Buying Guide','Bring your questions together before choosing a chamber for a home or professional setting.'],
 ['hyperbaric-chamber-cost','Hyperbaric Chamber Cost','Consider equipment, delivery, installation, and ongoing care when planning your budget.'],
 ['hyperbaric-chamber-for-business','Hyperbaric Chambers for Business','Explore equipment, room planning, staff preparation, and continuing support for your business.'],
 ['hbot-for-your-practice','HBOT for Your Practice','A starting point for practices exploring equipment and the requirements of a hyperbaric service.'],
 ['hyperbaric-chamber-rental','Hyperbaric Chamber Rental','Discuss availability, rental terms, setup, and support with a product specialist.'],
 ['used-hyperbaric-chamber','Used Hyperbaric Chambers','Know which ownership, service, and model records to gather when evaluating pre-owned equipment.'],
 ['hyperbaric-chamber-prescription','Hyperbaric Chamber Prescription','Prepare questions about the documentation and professional oversight required for your equipment.'],
 ['hyperbaric-chamber-room-requirements','Hyperbaric Chamber Room Requirements','Plan the delivery route, operating space, utilities, and access around your chamber.'],
 ['genuine-oxyhealth-hyperbaric-chamber','Identify a Genuine OxyHealth Chamber','Gather model and serial information so the team can help verify your equipment.'],
 ['hyperbaric-chamber-benefits','Hyperbaric Chamber Benefits','Explore educational resources and the questions that connect research with clinical decisions.'],
 ['hyperbaric-chamber-side-effects','Hyperbaric Chamber Side Effects','Prepare questions for your clinician about suitability, monitoring, and individual risk.'],
 ['hyperbaric-chamber-insurance','Hyperbaric Chamber Insurance','Organize the questions and documentation to discuss with your care team and insurer.'],
 ['hyperbaric-research-library','Hyperbaric Research Library','Explore study records by pressure and examine the full protocol alongside each research question.'],
 ['hyperbaric-therapy-anti-aging','Hyperbaric Therapy and Longevity','Explore the research context, study design, and limits behind longevity discussions.'],
 ['hyperbaric-therapy-athletic-recovery','Hyperbaric Therapy and Athletic Recovery','Find a starting point for reading recovery research and discussing it with a qualified professional.'],
 ['hyperbaric-therapy-brain-health','Hyperbaric Therapy and Brain Health','Explore the questions researchers ask about brain health and hyperbaric environments.'],
 ['hyperbaric-therapy-inflammation','Hyperbaric Therapy and Inflammation','Read research in context, including the study population, protocol, and outcome measures.'],
 ['hyperbaric-therapy-long-covid','Hyperbaric Therapy and Long COVID','Explore published research questions and discuss how the evidence relates to individual care.'],
 ['hyperbaric-therapy-near-me','Find Hyperbaric Therapy Near You','Prepare questions about a provider’s equipment, professional supervision, and facilities.'],
 ['hyperbaric-therapy-veterinary','Veterinary Hyperbaric Therapy','A starting point for discussing hyperbaric equipment and care with a qualified veterinary team.'],
 ['hyperbaric-therapy-wound-healing','Hyperbaric Therapy and Wound Healing','Explore educational resources to discuss with a wound care specialist.'],
];
export const landingPages = landingEntries.map(([slug,title,description])=>({path:'/'+slug,title,description,template:slug==='hyperbaric-research-library'?'research-library':'landing'}));
export const chamberModels = [
 {slug:'vitaeris-320',name:'Vitaeris 320',type:'Portable',pressure:'1.3 ATA',diameter:'32 in',length:'90 in',weight:'Confirm with team',construction:'Flexible chamber',closure:'Two-zipper system',compressor:'1/3 hp',setup:'Portable configuration',image:'Vitarous320/renders/vitaeris-room-b1.webp'},
 {slug:'respiro-270',name:'Respiro 270',type:'Portable',pressure:'1.3 ATA',diameter:'27 in',length:'88 in',weight:'Confirm with team',construction:'Flexible chamber',closure:'Two-zipper system',compressor:'1/4 hp',setup:'Compact portable configuration',image:'homepage/updated/carousel-respiro-diana-lifestyle.webp'},
 {slug:'quamvis-320',name:'Quamvis 320',type:'Portable',pressure:'1.3 ATA',diameter:'32 in',length:'100 in',weight:'Confirm with team',construction:'Flexible chamber with protective jacket',closure:'Three-zipper system',compressor:'1/3 hp',setup:'External support frame',image:'Quamvis320/updated/quamvis-black-scene.webp'},
 {slug:'fortius-420',name:'Fortius 420',type:'Clinical',pressure:'Up to 4.0 ATA',diameter:'42 in',length:'91 in',weight:'1,250 lb',construction:'Coated steel vessel',closure:'See model details',compressor:'1/3 hp',setup:'Professional installation',image:'homepage/updated/carousel-fortius-420-product.webp'},
 {slug:'fortius-420-exp',name:'Fortius 420 EXP',type:'Clinical',pressure:'Up to 4.0 ATA',diameter:'42 in',length:'96 in overall',weight:'1,400 lb',construction:'Coated steel vessel',closure:'See model details',compressor:'1/3 hp',setup:'Modular delivery and professional installation',image:'homepage/updated/carousel-fortius-exp-render.webp'},
];
chamberModels.forEach(model=>{model.power='110–120V';});
export const comparisonPages = [
 {path:'/vitaeris-320-vs-respiro-270',title:'Vitaeris 320 vs Respiro 270',models:[0,1],difference:'Interior width and overall size are the main differences. Compare the room available and the space you prefer inside the chamber.'},
 {path:'/vitaeris-320-vs-quamvis-320',title:'Vitaeris 320 vs Quamvis 320',models:[0,2],difference:'Both models have a 32-inch interior. The Quamvis configuration adds an external frame and extra length.'},
 {path:'/fortius-420-vs-fortius-420-exp',title:'Fortius 420 vs Fortius 420 EXP',models:[3,4],difference:'Both models share a 42-inch interior and pressure range. The EXP separates into sections to help with delivery access.'},
].map(page=>({...page,title:page.title+': How These Hyperbaric Chambers Compare',template:'comparison'}));
export const documentPages = [
 {path:'/documents/safety',title:'Hyperbaric Safety',eyebrow:'Safety and Documentation',template:'document-safety'},
 {path:'/documents/terms-conditions',title:'Terms & Conditions',eyebrow:'Legal',template:'document-terms'},
 {path:'/documents/privacy-notice',title:'Privacy Policy',eyebrow:'Your Privacy',template:'document-privacy'},
 {path:'/documents/repair-exchange-policy',title:'Repair & Exchange Policy',eyebrow:'Service and Support',template:'document-repair'},
 {path:'/documents/fda',title:'FDA Statement and Legal Notice',eyebrow:'Regulatory Information',template:'document-fda'},
];
export const converterPage={path:'/hyperbaric-pressure-converter',title:'Hyperbaric Pressure Converter',template:'pressure-converter'};
export const extendedRoutes=[...landingPages,...comparisonPages,...documentPages,converterPage];
export function pressureValues(ata,oxygen=21) {
 if(!Number.isFinite(ata)||ata<1||ata>6||!Number.isFinite(oxygen)||oxygen<0||oxygen>100)return null;
 return {ata,psiGauge:(ata-1)*14.696,psiAbsolute:ata*14.696,kpa:ata*101.325,bar:ata*1.01325,mmHg:ata*760,feet:(ata-1)*33,oxygenATA:ata*oxygen/100,oxygenMmHg:ata*oxygen/100*760};
}
