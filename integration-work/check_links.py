from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,json
ROOT=Path(__file__).resolve().parent.parent/'unified-site'
class Links(HTMLParser):
 def __init__(self): super().__init__();self.urls=[];self.anchors=set()
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.anchors.add(d['id'])
  for key in ['href','src']:
   if d.get(key):self.urls.append(d[key])
def check():
 errors=[];total=0
 assert (ROOT/'routes.json').exists(), '统一网站和路由清单尚未建立'
 for f in ROOT.rglob('*'):
  if f.suffix not in ['.html','.css']:continue
  content=f.read_text()
  if f.suffix=='.html':
   p=Links();p.feed(content);urls=p.urls
  else:urls=re.findall(r'url\([\'"]?([^\)\'\"]+)',content)
  for u in urls:
   parsed=urlsplit(u)
   if parsed.scheme or parsed.netloc or not parsed.path:continue
   target=(ROOT/parsed.path.lstrip('/') if parsed.path.startswith('/') else f.parent/parsed.path).resolve()
   if target.is_dir():target=target/'index.html'
   total+=1
   if not target.is_file():errors.append(f'{f.relative_to(ROOT)} -> {u}')
   if parsed.fragment and target.is_file() and target.suffix=='.html':
    p=Links();p.feed(target.read_text())
    if unquote(parsed.fragment) not in p.anchors and '=' not in parsed.fragment:errors.append(f'缺少锚点: {f.relative_to(ROOT)} -> {u}')
 for f in ROOT.rglob('*.html'):
  for href,text in re.findall(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>',f.read_text(),re.S):
   if re.search('返回大观园|返回地图',text) and not href.startswith('/garden/'):
    errors.append(f'错误地图返回: {f.relative_to(ROOT)} {href}')
 assert not errors,'\n'.join(errors)
 print(f'PASS {total} HTML/CSS本地引用；剧情与食笺返回指向/garden/；游戏退出另按B1规则测试')
if __name__=='__main__':check()
