"""Merge overlapping contours in a static font, so stroked (outlined) text shows only the outer shapes:
merge_overlaps.py <in.woff> <out.woff2>"""
import sys
from fontTools.ttLib import TTFont
from fontTools.ttLib.removeOverlaps import removeOverlaps
f = TTFont(sys.argv[1])
removeOverlaps(f)
f.flavor = 'woff2'
f.save(sys.argv[2])
print('merged', len(f.getGlyphOrder()), 'glyphs')
