-- Update avatar upload policy to restrict file types
DROP POLICY IF EXISTS "Authenticated users can upload their own avatar" ON storage.objects;

CREATE POLICY "Authenticated users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  (LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp'))
);