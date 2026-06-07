#!/bin/bash

ordner="$(cd "$(dirname "$0")" && pwd)"
zaehler=1

for datei in "$ordner"/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}; do
    [ -e "$datei" ] || continue

    endung="${datei##*.}"
    neuer_name="$ordner/galerie_$zaehler.$endung"

    mv "$datei" "$neuer_name"
    ((zaehler++))
done

echo "Fertig: $((zaehler - 1)) Bilder umbenannt."