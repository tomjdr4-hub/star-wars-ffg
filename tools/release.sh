#!/bin/bash
# Publie une version : vérifie l'arbre et la version, pousse, construit le zip
# et crée la release GitHub sur le commit courant.
# Usage : tools/release.sh vX.Y.Z "Titre" "Notes"
set -e
cd "$(dirname "$0")/.."
test -z "$(git status --porcelain)" || { echo "Arbre non propre, abandon"; exit 1; }
grep -q "\"version\": \"${1#v}\"" system.json || { echo "La version de system.json ne correspond pas à $1"; exit 1; }
npm test >/dev/null
git push -q origin main
rm -f star-wars-ffg.zip
python - star-wars-ffg.zip <<'PY'
import sys, zipfile, os
with zipfile.ZipFile(sys.argv[1], "w", zipfile.ZIP_DEFLATED) as z:
    for root in ["system.json", "star-wars-ffg.mjs", "README.md", "module", "templates", "styles", "lang", "assets", "packs"]:
        if os.path.isfile(root):
            z.write(root)
            continue
        for dp, _, fs in os.walk(root):
            for f in fs:
                if f != "LOCK":
                    z.write(os.path.join(dp, f).replace("\\", "/"))
    print(len(z.namelist()), "fichiers dans le zip")
PY
gh release create "$1" star-wars-ffg.zip system.json --repo tomjdr4-hub/star-wars-ffg --target "$(git rev-parse HEAD)" --title "$2" --notes "$3"
rm -f star-wars-ffg.zip
echo "Tag distant : $(git ls-remote --tags origin "$1" | cut -c1-7) / HEAD : $(git rev-parse --short HEAD)"
