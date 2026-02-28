

# Förbättringsförslag för EthiCheck

Efter en genomgång av kodbasen identifierar jag följande förbättringar:

## 1. Dark mode-stöd
Projektet har redan dark mode CSS-variabler definierade i `index.css` och `darkMode: ["class"]` i tailwind-konfigurationen, men ingen möjlighet för användaren att växla tema. En theme toggle-knapp i navigationen skulle aktivera det som redan är förberett.

## 2. Skydd av rutter (Route guards)
Sidor som `/profile` hanterar oautentiserade användare genom att visa "sign in"-meddelanden inuti komponenten. En central `ProtectedRoute`-wrapper skulle ge ett mer konsekvent beteende och automatisk redirect till `/auth`.

## 3. Förbättrad felhantering och tomma tillstånd
- Company-sidan (`Company.tsx`) saknar error state — om API-anropet misslyckas visas bara "loading" för alltid.
- Feed-sidan saknar retry-logik vid misslyckade laddningar.

## 4. SEO och sidtitlar
Ingen sida sätter `document.title`. En enkel hook eller `useEffect` per sida skulle förbättra SEO och användarupplevelse i flikarna.

## 5. Tillgänglighet (a11y)
- Stjärnbetygen på Company-sidan är en `<button>` utan `aria-label`.
- Navigationslänkarna saknar `aria-current`.
- Badge-filtren på Companies-sidan är `<Badge>` med `onClick` men utan keyboard-stöd (borde vara knappar).

---

## Implementeringsplan

### Steg 1: Lägg till dark mode toggle
- Skapa en `ThemeProvider`-komponent som hanterar `class`-baserad dark mode med `localStorage`-persistens.
- Lägg till en sol/måne-ikon i `Navigation.tsx` som växlar tema.

### Steg 2: Förbättra felhantering
- Lägg till `isError`/`error`-hantering i Company-sidans query med retry-knapp.
- Gör samma sak i Feed-sidan.

### Steg 3: Lägg till dynamiska sidtitlar
- Skapa en `useDocumentTitle`-hook.
- Anropa den i varje sida med relevant titel (t.ex. "EthiCheck - Companies", "EthiCheck - [Company Name]").

### Steg 4: Tillgänglighetsfixar
- Lägg till `aria-label="Write a review"` på stjärnbetygsknappen i `Company.tsx`.
- Byt `Badge`-filter på Companies-sidan till `<button>`-element med lämpliga ARIA-attribut.
- Lägg till `aria-current="page"` på aktiva navigationslänkar.

### Steg 5: Skydda rutter
- Skapa en `ProtectedRoute`-komponent som kollar auth-status och redirectar till `/auth`.
- Wrappa `/profile` i `App.tsx` med denna.

