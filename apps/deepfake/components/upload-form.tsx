"use client";

import { useRef, type FormEvent } from "react";

export function UploadForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="file" ref={inputFileRef} type="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}
