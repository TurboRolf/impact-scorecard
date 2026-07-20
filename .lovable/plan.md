Plan:

1. Verify the reset route is correctly wired in the app
   - Check that `/reset-password` exists in the React router and remains a public route.
   - Keep the existing reset form behavior: request link first, then set new password when the Supabase recovery session is present.

2. Fix the URL problem behind the email link
   - The 404 indicates the email link is redirecting to a Lovable URL that is not serving the app publicly.
   - Use a published app URL instead of the preview-only URL for password reset links.
   - After publishing, update the Supabase redirect configuration so recovery emails allow:
     - the published app root
     - the published `/reset-password` route

3. Update the app’s reset-link generation if needed
   - Ensure `resetPasswordForEmail()` sends users to `${window.location.origin}/reset-password` so production emails use the published domain automatically.
   - Avoid hardcoding preview URLs in code.

4. Test the complete flow
   - Request a fresh password reset email.
   - Open the link on desktop and mobile.
   - Confirm it lands on “Set New Password”, not Lovable login, not 404, and not the “send reset link” screen again.

Technical details:
- No database changes are needed.
- The core issue is URL/hosting configuration, not user accounts or passwords.
- Old reset emails should be ignored because recovery links are one-time-use; testing must use a newly requested email.