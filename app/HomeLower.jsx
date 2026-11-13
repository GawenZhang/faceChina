import React, { useEffect, useRef, useState } from 'react';
import './home-lower.css';

const questions = [
  ['How long do OxyHealth hyperbaric chambers last?', 'A well-maintained chamber can provide many years of service. Its working life depends on the materials, how it is used, and its maintenance history. Ask about expected service life, available parts, warranty coverage, and scheduled inspections so you can plan for dependable use over the years ahead.'],
  ['Which hyperbaric chamber brand do home and clinic buyers choose?', 'Home and clinic buyers look for experience, dependable service, and documented safety credentials. Compare model-specific engineering records and ask about FDA 510(k), ASME PVHO-1, ISO 13485, and electrical certification. Review the paperwork alongside the features of each chamber.'],
  ['Are OxyHealth hyperbaric chambers built to recognized safety standards?', 'Safety starts with engineering and certification. Ask about ASME PVHO standards, FDA 510(k) clearance, ISO 13485 quality management, and electrical safety certification. A specialist can explain the records for your model.'],
  ['Are OxyHealth hyperbaric chambers FDA cleared?', 'FDA clearance and company registration describe different things. Ask for the model’s 510(k) reference and intended use so that you can review its status. A registration alone does not mean a device has received clearance. Your clinician can help you understand the documentation and suitability for your needs.'],
  ['What certifications should a hyperbaric chamber have?', 'Ask about FDA 510(k) clearance, pressure vessel standards such as ASME PVHO-1, a documented quality system, and electrical safety certification. Verify the records for the exact model you plan to purchase.'],
  ['Where can I buy a hyperbaric chamber for home use?', 'Start with a manufacturer or an authorized supplier that can explain the equipment, installation requirements, training, and long-term service. Compare portable and fixed systems, discuss your needs with your clinician, and request a complete written quotation.'],
  ['Why are OxyHealth chambers more expensive than competitors?', 'Materials, pressure capabilities, engineering, accessories, installation, and continuing support all influence the price. Compare the full ownership cost, including maintenance and expected service life, rather than the initial purchase price alone. A detailed quotation makes these differences easier to evaluate.'],
  ['How much does a hyperbaric chamber cost?', 'The total depends on the model, configuration, delivery, and installation. Request a personalized estimate and compare the available payment arrangements before deciding.'],
];
const guidePaths = ['/hyperbaric-chamber-for-sale','/home-hyperbaric-chamber','/portable-hyperbaric-chamber','/best-hyperbaric-chamber','/hyperbaric-chamber-comparison','/hyperbaric-chamber-buying-guide','/why-oxyhealth','/hyperbaric-chamber-cost','/hyperbarics','/hyperbaric-therapy-athletic-recovery','/hyperbaric-therapy-anti-aging'];
const guideLinks = ['Hyperbaric Chambers for Sale', 'Home Hyperbaric Chambers', 'Portable Hyperbaric Chambers', 'Choosing a Hyperbaric Chamber', 'Compare Hyperbaric Chambers', 'Buying Guide', 'Why OxyHealth', 'Pricing Guide', 'What is HBOT?', 'Athletic Recovery', 'Longevity Research'];

function Arrow({ open = false }) {
  return <svg className={open ? 'hl-arrow hl-down' : 'hl-arrow'} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M12 5l7 7-7 7" /></svg>;
}
function Icon({ type = 'phone' }) {
  return <svg className="hl-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">{type === 'phone' ? <path d="M6 3h4l1 5-3 2c2 3 3 4 6 6l2-3 5 1v4c0 2-2 3-4 2C10 18 5 13 3 6c-1-2 1-3 3-3Z" /> : type === 'mail' ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></> : type === 'pin' ? <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></> : <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>}</svg>;
}
function SectionHeading({ id, eyebrow, title, children }) {
  return <div className="hl-heading"><p className="hl-eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2>{children && <p className="hl-intro">{children}</p>}</div>;
}
function ChamberScene({ className = '', banner = false }) {
  const source = banner ? '/OxyImages/homepage/updated/fortius-anna-lifestyle-banner.webp' : '/OxyImages/Vitarous320/renders/vitaeris-room-c2.webp';
  const description = banner ? 'Woman entering an OxyHealth Fortius 420 chamber' : 'OxyHealth Vitaeris 320 chamber in a bright penthouse interior';
  return <div className={`hl-scene ${className}`}><img src={`https://www.oxyhealth.com${source}`} alt={description} loading="eager" decoding="async" /></div>;
}

function Inquiry({ close }) {
  const [sent, setSent] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keyHandler = event => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const controls = dialog.current?.querySelectorAll('button,input,select,textarea,a[href]');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keyHandler); previous?.focus(); };
  }, []);
  return <div className="hl-dialog-backdrop" onClick={close}><div ref={dialog} className="hl-dialog" role="dialog" aria-modal="true" aria-labelledby="hl-dialog-title" onClick={e => e.stopPropagation()}><button className="hl-close" aria-label="Close inquiry" onClick={close}>×</button><h2 id="hl-dialog-title">Let’s find your chamber.</h2><p>Tell us a little about your needs.</p>{sent ? <div className="hl-form-status" role="status">Your inquiry is ready. This demonstration does not send information to a sales team.</div> : <form onSubmit={e => { e.preventDefault(); setSent(true); }}><label>Name<input autoFocus required autoComplete="name" name="name" /></label><label>Email<input required type="email" autoComplete="email" name="email" /></label><label>Phone<input type="tel" autoComplete="tel" name="phone" /></label><label>Interested in<select name="model"><option>Help me choose</option><option>Home chamber</option><option>Clinical chamber</option><option>Portable chamber</option></select></label><label>How can we help?<textarea rows="3" name="message" /></label><button className="hl-button" type="submit">Prepare Inquiry <Arrow /></button></form>}</div></div>;
}

export default function HomeLower() {
  const [inquiry, setInquiry] = useState(false);
  const openInquiry = () => setInquiry(true);
  const downloadGuide = () => {
    const copy = 'OxyHealth — Chamber buying checklist\n\n' + ['1. Review the exact model’s intended use.', '2. Ask your clinician about suitability.', '3. Request regulatory clearance documents.', '4. Review pressure vessel standards.', '5. Check electrical safety records.', '6. Ask about the quality management system.', '7. Compare working pressure ranges.', '8. Check materials and cleaning guidance.', '9. Measure the installation space.', '10. Confirm delivery access.', '11. Ask about operator training.', '12. Review maintenance requirements.', '13. Read warranty exclusions.', '14. Confirm parts and service availability.', '15. Compare the full cost of ownership.'].join('\n');
    const url = URL.createObjectURL(new Blob([copy], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'OxyHealth-chamber-checklist.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="home-lower">
    <section className="hl-buyer hl-section" aria-labelledby="buyers-checklist-heading"><div className="hl-container"><div className="hl-buyer-inner"><p className="hl-blue-eyebrow">Complimentary Guide</p><h2 id="buyers-checklist-heading">15 Things to Check Before Choosing Your Hyperbaric Chamber</h2><p className="hl-buyer-copy">Small differences in construction and support can make a big difference to ownership. Use this practical buying checklist to compare safety documentation, materials, and service with confidence.</p><ul className="hl-check-list">{['How device clearance differs from company registration', 'Pressure vessel, quality system, and electrical safety documents', 'Warranty protection, servicing, and long-term support', 'Planning delivery, installation, and a comfortable setup'].map(t => <li key={t}><span aria-hidden="true">✓</span>{t}</li>)}</ul><button className="hl-button" onClick={downloadGuide}><Icon type="download" />Download Free Checklist</button></div></div></section>

    <section className="hl-finance hl-section" id="finance" aria-labelledby="financing-heading"><div className="hl-container hl-finance-grid"><div><p className="hl-eyebrow">Flexible Payment Options</p><h2 id="financing-heading">Bring It Within Reach</h2><p className="hl-finance-copy">Plan your purchase with monthly payments and flexible terms. Ask a specialist about financing and the total cost.</p><div className="hl-finance-stats"><div><strong>Flexible</strong><span>Monthly payments</span></div><div><strong>100%</strong><span>Financing options</span></div><div><strong>24–60</strong><span>Month terms</span></div></div><a className="hl-button" href="/finance">Explore Payment Options <Arrow /></a></div><ChamberScene className="hl-finance-scene" /></div></section>

    <section className="hl-journey hl-section" aria-labelledby="steps-heading"><div className="hl-container"><SectionHeading id="steps-heading" eyebrow="Getting Started" title="Your Journey with OxyHealth">From the first conversation to setup and ongoing care, find guidance at each stage of ownership.</SectionHeading><div className="hl-steps">{[
      ['Talk with a Chamber Specialist', 'Begin with your questions. Discuss your goals, compare the different systems, and understand the practical details of owning a chamber. Our team can help you explore the options for your home or professional space.'],
      ['Build the Right Configuration', 'Once you have chosen a model, plan the details around it. Consider accessories, payment arrangements, delivery access, and operator training together, so your system is ready for the way you intend to use it.'],
      ['Delivery, Setup & Training', 'Coordinate the arrival of your chamber and get familiar with its operation. Clear setup instructions and practical training help you prepare your space and understand the steps for using and caring for the equipment.'],
      ['Support for the Years Ahead', 'Ownership continues well beyond installation. Keep access to technical guidance, replacement parts, regular maintenance, and service information, with a team that understands your equipment throughout its working life.'],
    ].map(([title, copy], i) => <article className="hl-step" key={title}><div className="hl-step-number"><b>{i + 1}</b><span>Step {i + 1}</span></div><h3>{title}</h3><p>{copy}</p>{i === 0 && <div className="hl-step-actions"><a className="hl-button" href="tel:562-906-8888"><Icon />Speak to a Specialist</a><a className="hl-button hl-outline" href="mailto:information@oxyhealth.com"><Icon type="mail" />Email Us</a><button className="hl-button hl-outline" onClick={openInquiry}>Submit an Inquiry</button></div>}</article>)}</div></div></section>

    <section className="hl-faq hl-section" id="faq" aria-labelledby="home-faq-heading"><div className="hl-container"><SectionHeading id="home-faq-heading" eyebrow="Common Questions" title="Frequently Asked Questions">Helpful answers to the most common questions about hyperbaric chambers and OxyHealth</SectionHeading><div className="hl-questions">{questions.map(([q, a], i) => <details className="hl-question" key={q}><summary id={`hl-question-${i}`}><span>{q}</span><Arrow /></summary><div id={`hl-answer-${i}`} role="region" aria-labelledby={`hl-question-${i}`}><p>{a}</p></div></details>)}</div><nav className="hl-guide-links" aria-label="Chamber buying resources">{guideLinks.map((t, i) => <a href={guidePaths[i]} key={t}>{t}</a>)}</nav></div></section>

    <section className="hl-event" aria-labelledby="event-cta-heading"><div className="hl-container hl-event-grid"><a href="/events/a4m-longevity-fest" className="hl-event-art" aria-label="Explore the longevity event"><img src="https://www.oxyhealth.com/OxyImages/events/a4m-2026.webp" alt="A4M Longevityfest 2026, December 11?13 in Las Vegas" width="600" height="250" /></a><div><p className="hl-blue-eyebrow">Meet Us in Person</p><h2 id="event-cta-heading">Meet OxyHealth at A4M Longevityfest 2026</h2><p className="hl-event-copy">Explore hyperbaric technology at the longevity medicine gathering in Las Vegas. See portable chamber demonstrations, speak with product specialists, and learn how different systems can fit a home or professional setting.</p><div className="hl-event-meta"><span>▣ December 11–13</span><span>⌖ Las Vegas, NV</span></div><div className="hl-event-actions"><a className="hl-button" href="/events/a4m-longevity-fest">Learn More <Arrow /></a><a className="hl-button hl-outline" href="https://www.a4m.com/longevity-fest-2026/index.html" target="_blank" rel="noopener noreferrer">Plan Your Visit</a></div></div></div></section>

    <section className="hl-blog" aria-labelledby="latest-blog-heading"><div className="hl-container"><div className="hl-blog-heading"><div><p className="hl-eyebrow">From the OxyHealth Journal</p><h2 id="latest-blog-heading">Latest articles</h2></div><a href="/blog">View all articles <Arrow /></a></div><div className="hl-articles">{[
      ['New · Safety and Regulation · November 5, 2026', 'Understanding the Rules for Hyperbaric Chambers Sold for Wellness', 'Explore the difference between medical device clearance and wellness marketing, and learn which documents to review when evaluating a chamber.'],
      ['Research · September 17, 2026', 'Longevity and Hyperbaric Oxygen: A Look at the Research', 'An introduction to published studies exploring hyperbaric oxygen, aging, and the questions researchers are still investigating.'],
      ['Research · September 17, 2026', 'What Brain Injury Studies Tell Us About HBOT', 'A guide to reading clinical research on hyperbaric oxygen and traumatic brain injury, including the limitations of current evidence.'],
    ].map(([date, title, copy], i) => <a href={["/blog/fda-hyperbaric-chambers-wellness-devices-not-exempt","/post/hyperbaric-oxygen-therapy-for-longevity","/post/hbot-for-brain-injury-what-clinical-trials-show"][i]} key={title}><article><p className="hl-article-date">{date}</p><h3>{title}</h3><p className="hl-article-copy">{copy}</p><span className="hl-read">Read article <Arrow /></span></article></a>)}</div></div></section>

    <section className="hl-banner" aria-label="OxyHealth hyperbaric therapy lifestyle"><ChamberScene banner /><div className="hl-container"><div><h2>Thoughtfully designed for the places you live and work.</h2><p>Explore chamber systems that bring comfort, considered engineering, and continuing support into everyday spaces.</p></div></div></section>

    <section className="hl-contact hl-section" id="get-started" aria-labelledby="contact-heading"><div className="hl-container"><SectionHeading id="contact-heading" eyebrow="Ready for the Next Step?" title="Begin Your Hyperbaric Journey with Confidence">Whether you are planning a clinical installation or comparing chambers for your home, get help choosing a system and understanding every step of ownership.</SectionHeading><div className="hl-contact-actions"><a className="hl-button" href="tel:562-906-8888"><Icon />Talk to a Specialist</a><button className="hl-button hl-outline" onClick={openInquiry}>Submit an Inquiry</button></div><div className="hl-contact-cards"><a href="tel:562-906-8888"><Icon /><small>Let’s Talk</small><strong>Speak with our team</strong></a><div><Icon type="pin" /><small>Visit Us</small><p>Arrange a showroom visit<br />Meet your chamber in person</p><small>Monday–Friday, by appointment</small></div></div><div className="hl-map" role="img" aria-label="Illustrated showroom location map"><div className="hl-map-river" /><div className="hl-map-grid" /><div className="hl-map-marker"><Icon type="pin" /><strong>OxyHealth showroom</strong></div><span>Location preview</span></div></div></section>
    {inquiry && <Inquiry close={() => setInquiry(false)} />}
  </div>;
}
