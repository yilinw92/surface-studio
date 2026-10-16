"""Reproduce the standalone preview with only Python's standard library."""
import argparse
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOKEN = "@@SURFACE_STUDIO_FRAGMENT@@"


def build():
    fragment = (ROOT / "prototype/workbench.fragment.html").read_text(encoding="utf-8")
    template = (ROOT / "prototype/standalone.template.html").read_text(encoding="utf-8")
    if template.count(TOKEN) != 1:
        raise ValueError("standalone template must contain exactly one fragment slot")
    return template.replace(TOKEN, html.escape(fragment, quote=True))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    generated = build()
    output = ROOT / "index.html"
    if args.check:
        if not output.exists() or output.read_text(encoding="utf-8") != generated:
            raise SystemExit("Standalone build is stale; run python tools/build_preview.py")
        print("PASS: standalone build matches prototype source")
    else:
        output.write_text(generated, encoding="utf-8", newline="\n")
        print("Built index.html")


if __name__ == "__main__":
    main()
