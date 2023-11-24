"use client";

import { upload } from "@vercel/blob/client";
import { useRef, type FormEvent } from "react";

export function UploadForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      console.error("No file selected");
      return;
    }

    const file = inputFileRef.current.files[0];

    try {
      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      console.log("Uploaded file URL:", url);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="file" ref={inputFileRef} type="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}
