"""Keep the latin, latin-ext, cyrillic and cyrillic-ext faces of a Google Fonts css2 file, download their woff2 and point the CSS at the local copies.
localfonts.py <google.css> <outdir>"""
import re, sys, os, urllib.request
src, out = sys.argv[1], sys.argv[2]
css = open(src, encoding='utf-8').read()
keep, seen = [], {}
for sub, block in re.findall(r'/\* ([a-z-]+) \*/\s*(@font-face \{.*?\})', css, re.S):
    if sub not in ('latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'): continue
    url = re.search(r'url\((https://[^)]+\.woff2)\)', block).group(1)
    if url not in seen:
        name = f'Montserrat-{sub}.woff2'
        urllib.request.urlretrieve(url, os.path.join(out, name)); seen[url] = name
    keep.append(f'/* {sub} */\n' + block.replace(url, seen[url]))
open(os.path.join(out, 'fonts.css'), 'w', encoding='utf-8').write('\n'.join(keep) + '\n')
print(len(keep), 'faces;', sorted(seen.values()))
