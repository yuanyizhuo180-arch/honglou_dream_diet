"""Phone-only frame; original desktop renderers and game logic stay unchanged."""
from pathlib import Path
import shutil,re,json
SOURCE=Path(__file__).resolve().parent/'mobile-source'
STAMP='20261110-smooth-v6'
def apply(root):
 for name in ['phone-reading.js','phone-core.js','phone-entry.js','phone-frame.css','phone-frame.js','phone-shell.js']:shutil.copy2(SOURCE/name,root/name)
 (root/'mobile').mkdir(exist_ok=True);shutil.copy2(SOURCE/'phone-shell.html',root/'mobile/index.html')
 pages={'index.html':'home','garden/index.html':'map','catalog/index.html':'catalog'}
 for place,route in json.loads((root/'routes.json').read_text()).items():
  for kind in ['story','game','note']:
   pages[route[kind].split('?')[0].lstrip('/')]=kind if kind!='game' else ('catch' if place in ['xiaoxiang','yihong','ouxiang'] else 'kitchen' if place=='qiushuang' else 'cabinet')
 for name,kind in pages.items():
  p=root/name;s=p.read_text()
  # Clean old phone helpers if applying over a previous review build.
  s=re.sub(r'<link[^>]+href="/mobile-play.css[^>]+>','',s)
  s=re.sub(r'<script[^>]+src="/(?:mobile-play|catch-input).js[^>]+></script>','',s)
  s=re.sub(r'\sdata-mobile-kind="[^"]*"','',s)
  s=re.sub(r'<body\b',f'<body data-mobile-kind="{kind}"',s,count=1)
  s=re.sub(r'(<script src="/phone-(?:core|entry)\.js)\?v=[^"]+',r'\1?v='+STAMP,s)
  if '/phone-entry.js' not in s:s=s.replace('<head>','<head><script src="/phone-core.js?v='+STAMP+'"></script><script src="/phone-entry.js?v='+STAMP+'"></script>',1)
  p.write_text(s)
