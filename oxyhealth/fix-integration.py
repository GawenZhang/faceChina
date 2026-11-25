from pathlib import Path
p=Path('Home.jsx');s=p.read_text(encoding='utf-8')
s=s.replace('className="manifesto"','className="manifesto" id="why"')
s=s.replace('href="#contact"','href="#get-started"')
s=s.replace('className={`product-card card-${i}`}','id={["series-420","portable-320","series-420-exp","professional-320","compact-270"][i]} className={`product-card card-${i}`}')
p.write_text(s,encoding='utf-8')
p=Path('home.css');s=p.read_text(encoding='utf-8')
s+='\n@media(min-width:768px){.lifestyle-grid{grid-template-columns:repeat(15,minmax(0,1fr));gap:16px}.lifestyle-copy{grid-column:span 6;height:454px;padding:48px}.lifestyle-main{grid-column:span 9}.lifestyle-main>.chamber-art{min-height:454px}.lifestyle-small{grid-column:span 5}.lifestyle-copy h2{font-size:36px}.lifestyle-copy p{font-size:16px}}\n@media(min-width:768px) and (max-width:1023px){.lifestyle-copy{height:440px;padding:32px}.lifestyle-copy h2{font-size:30px}.lifestyle-main>.chamber-art{min-height:440px}}\n'
p.write_text(s,encoding='utf-8')
