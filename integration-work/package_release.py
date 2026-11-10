from pathlib import Path
import shutil,json,hashlib,zipfile,importlib.util,re,argparse
from datetime import date
parser=argparse.ArgumentParser()
parser.add_argument('--name',default='honglou-dreamfood-'+date.today().isoformat())
args=parser.parse_args()
assert re.fullmatch(r'[A-Za-z0-9_-]+',args.name),'Release name must be a simple directory name'
src=Path('unified-site');out=Path('release')/args.name;out.mkdir(exist_ok=False)
allowed={'.html','.css','.js','.png','.jpg','.jpeg','.webp','.svg','.mp3','.wav','.ogg','.woff','.woff2'}
jsonfiles={'routes.json','release.json','garden-data.json','catalog/catalog.json'}
files=[]
for p in src.rglob('*'):
 if not p.is_file():continue
 rel=p.relative_to(src)
 if p.suffix.lower() not in allowed and str(rel) not in jsonfiles:continue
 d=out/rel;d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,d);files.append(str(rel))
# Reuse the link checker against the exact package, not the working preview.
spec=importlib.util.spec_from_file_location('links','integration-work/check_links.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);m.ROOT=out.resolve();m.check()
assert (out/'index.html').is_file()
assert 'original_context_records' in (out/'catalog/app.js').read_text()
assert '原著出处尚待确认' not in (out/'catalog/app.js').read_text()
for name in ['index.html','garden/index.html']:assert '小书匣' not in (out/name).read_text()
for p in out.rglob('*'):
 if p.suffix in {'.html','.js','.css','.json'}:
  s=p.read_text()
  assert not re.search(r'(?:file://|/Users/|/private/var/|localhost:\d|127\.0\.0\.1:\d)',s),str(p)
  assert not re.search(r'(?:sb_secret_|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)',s),str(p)
manifest=[{'file':f,'bytes':(out/f).stat().st_size,'sha256':hashlib.sha256((out/f).read_bytes()).hexdigest()} for f in sorted(files)]
(out.parent/(args.name+'-manifest.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
archive=out.with_suffix('.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for f in files:z.write(out/f,f)
with zipfile.ZipFile(archive) as z:assert z.testzip() is None;assert 'index.html' in z.namelist()
summary={'files':len(files),'uncompressed_bytes':sum(x['bytes'] for x in manifest),'zip_bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'link_check':'passed','archive_integrity':'passed','online_deployment':'not performed'}
(out.parent/(args.name+'-check.json')).write_text(json.dumps(summary,indent=2));print(summary)
