"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, type FormEvent } from "react";
import { toast } from "sonner";

export function UploadForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      toast.error("No file selected");
      return;
    }

    const file = inputFileRef.current.files[0];

    try {
      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      toast.loading("Validating file...");

      const validation = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }).then((res) => res.json());

      toast.success("File validated successfully!");
      console.log("Validation result:", validation);

      router.push("/overview");
    } catch (error) {
      toast.error("An error occurred during upload or validation.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="file" ref={inputFileRef} type="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}
