from pypdf import PdfReader

reader = PdfReader(r"C:\Users\iris\Downloads\Tradecraft-Primer-apr09.pdf")
page = reader.pages[0]
items = []

def visit(text, cm, tm, font, size):
    clean = " ".join(text.split())
    if clean:
        items.append((clean, float(tm[4]), float(tm[5]), float(size)))

page.extract_text(visitor_text=visit)
print("mediabox", tuple(float(v) for v in page.mediabox))
for text, x, y, size in items:
    if any(key in text for key in (
        "Tradecraft", "Structured Analytic", "Improving Intelligence",
        "Prepared by the US Government", "March 2009"
    )):
        print(repr(text), "x=", round(x, 2), "y=", round(y, 2), "size=", round(size, 2))