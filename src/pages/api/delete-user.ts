import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { password, userId } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }


  try {
    // 3. Create Admin Client (Ensure env vars are set)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Delete User API - Missing Supabase environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });


    // 5. Delete the user from auth schema using Admin client
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error(`Delete User API - Error deleting auth user ${userId}:`, deleteUserError);
      return res.status(500).json({ error: 'Failed to delete user account data.' });
    }

    console.log(`Delete User API - Successfully deleted user: ${userId}`);
    // Client will handle sign-out and redirect after receiving success
    return res.status(200).json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete User API - Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected server error occurred.';
    return res.status(500).json({ error: message });
  }
}
