import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/api/with-auth';
import { apiResponse, apiError } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';

export const POST = withAuth(async (request: NextRequest, user: any, context: { params: { id: string } }) => {
  const supabase = createClient();
  const demoId = context.params.id;

  // Verify demo ownership
  const { data: demo, error: demoError } = await supabase
    .from('demos')
    .select('id, user_id')
    .eq('id', demoId)
    .eq('user_id', user.id)
    .single();

  if (demoError || !demo) {
    return apiError('Demo not found', 404);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const assetType = formData.get('type') as string;
    const stepId = formData.get('stepId') as string;

    if (!file) {
      return apiError('No file provided', 400);
    }

    if (!assetType || !['screenshot', 'dom_snapshot', 'video'].includes(assetType)) {
      return apiError('Invalid asset type', 400);
    }

    // Generate file path
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop() || 'bin';
    const fileName = `${assetType}_${timestamp}.${fileExt}`;
    const filePath = `demos/${demoId}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('demo-assets')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return apiError('Failed to upload file', 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('demo-assets')
      .getPublicUrl(filePath);

    // Store asset metadata in database
    const { data: assetRecord, error: dbError } = await supabase
      .from('demo_assets')
      .insert({
        demo_id: demoId,
        step_id: stepId || null,
        asset_type: assetType,
        file_name: fileName,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        public_url: urlData.publicUrl,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      // Cleanup uploaded file if database insert fails
      await supabase.storage.from('demo-assets').remove([filePath]);
      console.error('Database insert error:', dbError);
      return apiError('Failed to save asset metadata', 500);
    }

    return apiResponse({
      asset: {
        id: assetRecord.id,
        url: urlData.publicUrl,
        type: assetType,
        fileName: fileName,
        size: file.size,
      }
    });

  } catch (error) {
    console.error('Asset upload error:', error);
    return apiError('Failed to process file upload', 500);
  }
});

export const GET = withAuth(async (request: NextRequest, user: any, context: { params: { id: string } }) => {
  const supabase = createClient();
  const demoId = context.params.id;

  // Verify demo ownership
  const { data: demo, error: demoError } = await supabase
    .from('demos')
    .select('id, user_id')
    .eq('id', demoId)
    .eq('user_id', user.id)
    .single();

  if (demoError || !demo) {
    return apiError('Demo not found', 404);
  }

  // Get demo assets
  const { data: assets, error: assetsError } = await supabase
    .from('demo_assets')
    .select('*')
    .eq('demo_id', demoId)
    .order('created_at', { ascending: false });

  if (assetsError) {
    return apiError('Failed to fetch demo assets', 500);
  }

  return apiResponse({ assets: assets || [] });
});