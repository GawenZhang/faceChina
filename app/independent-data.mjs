export const independentRoutes = [
  {path:'/contact',title:'Contact OxyHealth',template:'contact'},
  {path:'/support',title:'Service & Support | OxyHealth',template:'support'},
  {path:'/partners',title:'Build Your Hyperbaric Practice | OxyHealth',template:'partners'},
  {path:'/why-oxyhealth',title:'Why OxyHealth',template:'why-oxyhealth'},
  {path:'/finance',title:'Hyperbaric Chamber Financing | OxyHealth',template:'finance'},
  {path:'/about',title:'About OxyHealth',template:'about'},
  {path:'/events/events',title:'OxyHealth Events & Conferences',template:'event-list'},
];

export const independentReferenceNotes = {
  checked:'2026-11-12',
  sources:['https://www.oxyhealth.com/contact','https://www.oxyhealth.com/support','https://www.oxyhealth.com/partners','https://www.oxyhealth.com/finance','https://www.oxyhealth.com/about','https://www.oxyhealth.com/events/events'],
  evidence:'Primary-site web text extraction confirmed heading order, contact data, form field groups, support and partner FAQs, event categories, and existing event-detail destination. Body copy and unavailable artwork may be placeholders under ACCEPTANCE-CHECKLIST.md.',
  unknowns:['Original /why-oxyhealth was unavailable in web extraction (cache miss); search did not return this page. Its provisional structure follows the existing home Why/Proof sections, and original-page structural parity remains unverified.','Exact original widths, spacing and image positions for these seven new pages have not been captured; text structure evidence alone does not verify visual parity.','Forms are local previews; CRM submission, CAPTCHA and delivery have no backend.'],
};
