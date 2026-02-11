-- Enable RLS on the table
ALTER TABLE "results" ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow Public Read Access (for sharing results)
-- Anyone can SELECT any row.
CREATE POLICY "Enable Read Access for All"
ON "results"
FOR SELECT
USING (true);

-- Policy 2: Restrict Write Access to Service Role Only
-- By default, if no policy enables INSERT/UPDATE/DELETE for 'anon' or 'authenticated',
-- they are denied. So we don't strictly need a "Deny" policy if we just don't create an "Allow" one.
-- However, we must ensure the Service Role (which bypasses RLS) can write.
-- Service Role bypasses RLS automatically, so no policy needed for it.
-- Thus, by enabling RLS and ONLY adding the SELECT policy above, we effectively restrict writes to Server-Side only.

-- Verify:
-- 1. Client-side 'supabase.from("results").insert(...)' should now FAIL with 401/403.
-- 2. API route 'supabaseAdmin.from("results").insert(...)' should SUCCEED.
