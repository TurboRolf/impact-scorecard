Ändra dark mode-bakgrunden i `src/index.css` så att den inte är så mörk.

Just nu:
- `--background: 222.2 84% 4.9%` (nästan svart)
- `--card` och `--popover` samma värde

Förslag på ändring:
- `--background: 222 20% 14%` (mjukare mörkgrå istället för nästan svart)
- `--card: 222 20% 17%` (lite ljusare än bakgrund så kort syns)
- `--popover: 222 20% 17%`
- Justera `--secondary`, `--muted`, `--accent`, `--border`, `--input` ett par steg ljusare så hierarkin behålls

Inga andra filer behöver röras — alla komponenter använder semantiska tokens.