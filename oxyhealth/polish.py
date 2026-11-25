from pathlib import Path
p=Path('home.css');s=p.read_text().replace('#000b3','#000b');s+='\n@media(max-width:767px){.hero-room .chamber-art{height:auto;aspect-ratio:2000/1317}}\n';p.write_text(s)
p=Path('Home.jsx');s=p.read_text(encoding='utf-8').replace(' translateY(-42%)','').replace('import HomeLower',"import {Icon} from './Shell.jsx';\nimport HomeLower").replace('♧ <span>','<Icon name="phone"/> <span>').replace('♧ Talk to a Specialist','<Icon name="phone"/> Talk to a Specialist');p.write_text(s,encoding='utf-8')
