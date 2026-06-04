"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const ext = file.name.split(".").pop() || "jpg";
      const sanitized = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();
      const filename = `${timestamp}-${sanitized}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filename);

      return publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
