

# Ytterligare förbättringar för EthiCheck

Efter en djupare genomgång av hela kodbasen hittar jag följande förbättringsmöjligheter:

## 1. Optimistiska uppdateringar för likes och follow
`useToggleLike` och `useFollowUser`/`useUnfollowUser` väntar på serverrespons innan UI:t uppdateras. Optimistiska uppdateringar via React Query's `onMutate`/`onError`/`onSettled` skulle ge omedelbar feedback.

## 2. Paginering/infinite scroll på Feed
Alla inlägg laddas i ett enda anrop. Vid tillväxt blir detta långsamt. Implementera `useInfiniteQuery` med cursor-baserad paginering och en "Load more"-knapp eller infinite scroll.

## 3. Saknad `useDocumentTitle` på UserProfile och Auth
`UserProfile.tsx` och `Auth.tsx` sätter inte sidtitel trots att hooken redan finns. Bör läggas till för konsekvens.

## 4. Förbättrad Auth-sida
- Ingen lösenordsvalidering (minimikrav) vid registrering.
- Saknar "glömt lösenord"-funktionalitet.
- Delat state för `email`/`password` mellan Sign In och Sign Up-flikarna — att byta flik behåller formulärdata, vilket kan vara förvirrande.

## 5. Bättre empty states
- Companies-sidan visar bara "No companies found matching your criteria" utan illustration eller uppmaning att rensa filter.
- Creators-sidan saknar visuell illustration vid tomt resultat.

## 6. Skeleton loading istället för spinner
Alla sidor använder `LoadingScreen` (spinner). Skeleton-loaders som matchar layouten ger en bättre upplevd prestanda.

## 7. Bildoptimering
Avatar-bilder från DiceBear laddas utan `loading="lazy"`. Company-logotyper i `CompanyCard` saknar också lazy loading.

---

## Implementeringsplan

### Steg 1: Lägg till `useDocumentTitle` på saknade sidor
- `UserProfile.tsx`: `useDocumentTitle(profile?.display_name || profile?.username || "User Profile")`
- `Auth.tsx`: `useDocumentTitle("Sign In")`

### Steg 2: Separera formulärstate i Auth
- Ge Sign In och Sign Up separata `email`/`password`-state så att byte av flik rensar formuläret.
- Lägg till lösenordskrav-text (min 6 tecken) vid registrering.

### Steg 3: Förbättra empty states
- Lägg till en "Clear filters"-knapp i Companies-sidan vid tomt sökresultat.
- Lägg till enkel illustration/ikon i tomma tillstånd.

### Steg 4: Lazy loading på bilder
- Lägg till `loading="lazy"` på alla `<img>`-element i `CompanyCard`, `Company.tsx` och avatar-bilder.

### Steg 5: Optimistiska uppdateringar för likes
- Uppdatera `useToggleLike` med `onMutate` för att direkt visa liked-state och räkna om likes-count, med rollback vid fel.

