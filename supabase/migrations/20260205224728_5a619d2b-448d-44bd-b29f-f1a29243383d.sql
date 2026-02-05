-- Allow organizers to delete their own boycotts
CREATE POLICY "Organizers can delete their boycotts"
ON public.boycotts
FOR DELETE
TO authenticated
USING (auth.uid() = organizer_id);

-- Also need to allow cascade delete of participants when boycott is deleted
-- The foreign key already has ON DELETE CASCADE behavior