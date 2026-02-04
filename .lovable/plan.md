

# Lägg till Redigering av Profilbild

## Översikt
Gör avataren på profilsidan klickbar så användaren kan ladda upp en egen profilbild. Bilden sparas i Supabase Storage och URL:en lagras i profiles-tabellen.

## Ändringar

### 1. Databasändringar
- Lägg till `avatar_url` kolumn i `profiles`-tabellen (text, nullable)
- Skapa en `avatars` storage bucket för profilbilder
- Konfigurera RLS-policies för bucketen:
  - Alla kan se bilder (public bucket)
  - Endast inloggade användare kan ladda upp till sin egen mapp
  - Endast ägaren kan ta bort sina bilder

### 2. Ny Komponent: AvatarUploadDialog
Skapa `src/components/AvatarUploadDialog.tsx` med:
- Filväljare för bilduppladdning (accepterar jpg, png, webp)
- Förhandsvisning av vald bild
- Uppladdningslogik till Supabase Storage
- Uppdatera `avatar_url` i profiles-tabellen
- Visa laddningsindikator under uppladdning
- Felhantering med toast-notifikationer

### 3. Uppdatera Profile.tsx
- Gör avataren klickbar med hover-effekt
- Lägg till en liten kameraikon som overlay för att indikera att bilden är redigerbar
- Öppna AvatarUploadDialog när användaren klickar
- Visa användarens uppladdade bild om `avatar_url` finns, annars fallback till DiceBear

### 4. Uppdatera useProfile.ts
- Inkludera `avatar_url` i Profile-interfacet
- Lägg till stöd för att uppdatera `avatar_url` i useUpdateProfile

### 5. Uppdatera UserProfile.tsx
- Visa andra användares uppladdade profilbilder (ej klickbar)

## Flöde

```text
┌─────────────────────────────────────────┐
│         Profilsidan                     │
│  ┌──────────┐                           │
│  │  Avatar  │ ← Klickbar med kamera-    │
│  │    📷    │   ikon som overlay        │
│  └──────────┘                           │
└─────────────────────────────────────────┘
          │
          ▼ (klick)
┌─────────────────────────────────────────┐
│    AvatarUploadDialog                   │
│  ┌────────────────────────────┐         │
│  │   Förhandsvisning          │         │
│  │   [Nuvarande bild]         │         │
│  └────────────────────────────┘         │
│                                         │
│  [Välj bild...]                         │
│                                         │
│  [Avbryt]              [Spara]          │
└─────────────────────────────────────────┘
          │
          ▼ (spara)
┌─────────────────────────────────────────┐
│  1. Ladda upp till Supabase Storage     │
│     → avatars/{user_id}/{filename}      │
│  2. Hämta public URL                    │
│  3. Uppdatera profiles.avatar_url       │
│  4. Invalidera profile query cache      │
└─────────────────────────────────────────┘
```

## UX-detaljer
- Hover-effekt på avatar: lätt mörkare med kameraikon
- Max filstorlek: 5MB
- Godkända format: JPG, PNG, WEBP
- Laddningsindikator under uppladdning
- Success/error toast efter operation

---

## Tekniska Detaljer

### Nya filer
- `src/components/AvatarUploadDialog.tsx`

### Modifierade filer
- `src/pages/Profile.tsx` - Klickbar avatar med overlay
- `src/pages/UserProfile.tsx` - Visa avatar_url
- `src/hooks/useProfile.ts` - Lägg till avatar_url i interface

### Databasmigration
```sql
-- Lägg till avatar_url kolumn
ALTER TABLE profiles ADD COLUMN avatar_url text;

-- Skapa avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- RLS för storage
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Beroenden
Använder befintliga komponenter:
- `Camera` ikon från lucide-react
- Dialog, Button, Input komponenter
- Supabase Storage API

