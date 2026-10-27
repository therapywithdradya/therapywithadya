import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
    }

    // Size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit. Please upload an image under 10MB." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const bucketName = "practice-media";

    // Ensure bucket exists or create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucketName);

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: "10MB",
      });
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    const storagePath = `uploads/${Date.now()}-${cleanBaseName}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: `Storage upload failed: ${uploadError.message}. Make sure Supabase Storage is enabled.`,
        },
        { status: 500 },
      );
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: storagePath,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
