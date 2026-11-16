import {readFile,writeFile} from 'node:fs/promises';
const qa=JSON.parse(await readFile(new URL('./qa-why-live-results.json',import.meta.url),'utf8'));
const review={
 path:'/why-oxyhealth',reviewed_at:new Date().toISOString(),
 source_capture:'inspection/live-20261113/why-oxyhealth/capture.json',
 source_evidence_id:'ev_6d5b7b9ba22e85014f4a4a1aaaefbe876e243f8df1551cdc06e5b033ce3df79a',
 source_implementation:'inspection/live-20261113/why-source.js',
 widths:[1440,768,390],status:'verified_and_corrected',background_segmentation:'verified',palette:'verified',layout:'verified',was_placeholder:true,
 source_backgrounds:['#000000','#000000','#000000','#000000','#000000','#f5f5f7','#ffffff','#f5f5f7','#000000'],
 changes:[
  'Replaced six invented placeholder sections with all nine original sections and original text hierarchy/line-length constraints.',
  'Restored black 100svh hero with outlined 1997, five-chapter sticky image timeline and scroll counter.',
  'Restored all six credential cards, exact 560vh desktop scroll stack, source rotation/scale/seal formulas, progress indicators and mobile/reduced-motion stacked list.',
  'Restored manufacturer checklist, FDA comparison, trust section, seven FAQ disclosures and final CTA/product links.',
  'Kept shared accepted site header/footer and reused preview-only quote dialog.'
 ],
 files:['WhyPage.jsx','why-page.css','why-source.html','prepare-why.mjs','IndependentPages.jsx'],
 qa:{report:'qa-why-live-results.json',passed:qa.passed,checks:qa.checks.map(x=>({width:x.width,passed:x.passed,sections:x.sections.length,chapters:x.chapters,credentials:x.credentials,faqs:x.faqs,overflow:x.scrollWidth>x.width})),runtime_errors:qa.errors},
 limitations:[
  'Three live samples cover the initial rendered page at each width; original scroll scenes were additionally derived from the authorized source module.',
  'Source layout uses 1425/753/390px content widths within 1440/768/390px windows; local browser uses overlay scrollbars and may wrap a line differently.',
  'Image/logo replacement and accepted global shell differences are outside this correction.',
  'Scroll reveal wrappers are made readable by shared capture sanitizer; reduced-motion hero transform is normalized to zero.',
  'Full production build and complete QA/rebuild_check are owned by parent run.'
 ]
};
await writeFile(new URL('./inspection/live-20261113/why-review.json',import.meta.url),JSON.stringify(review,null,2));
console.log('Saved why-review.json');
