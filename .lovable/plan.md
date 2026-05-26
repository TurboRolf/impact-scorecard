## Problem

Nuvarande `src/assets/ethisay-logo-v4-dark.png` har två fel:
1. "Ethisay"-texten är endast en tunn vit **kontur** runt bokstäverna istället för solid vit fyllning — bokstäverna ser ihåliga/ofyllda ut
2. **Pricken över "i" saknas helt**
3. Synliga artefakter/halo runt bokstäverna från background removal

## Åtgärd

Regenerera dark mode-varianten från originalloggan (`src/assets/ethisay-logo-v4.png`) med `imagegen--edit_image`, med tydliga krav:

- Behåll E-ikonen och bocken i exakt samma blå färg och position
- Byt **endast** wordmark "Ethisay" från mörk till **solid, helt fylld ren vit** (#FFFFFF) — inte outline, inte kontur
- Säkerställ att **pricken över "i"** finns och är centrerad horisontellt över i-stapeln
- Behåll exakt samma typsnitt, kerning, proportioner, storlek och spacing
- Transparent bakgrund, rena kanter, inget glow/halo/skugga
- Aspect ratio 4:1 för att matcha originalet

Filsökväg: skriver över `src/assets/ethisay-logo-v4-dark.png`. Ingen kodändring behövs i `Navigation.tsx` (importen är redan på plats).

## Verifiering

Efter generering: zooma in på filen för att bekräfta att texten är solid vit och att i-pricken finns innan jag rapporterar klart.
