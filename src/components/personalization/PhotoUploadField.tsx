"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { compressImageToDataUrl } from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

interface PhotoUploadFieldProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
}

export function PhotoUploadField({ value, onChange }: PhotoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Envie um arquivo de imagem (JPG ou PNG).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      onChange(dataUrl);
    } catch {
      setError("Não foi possível processar a foto. Tente outra imagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-ink">
        Foto da criança <span className="font-normal text-ink-soft">(opcional)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-cream p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Foto enviada" className="h-14 w-14 rounded-lg object-cover" />
          <span className="flex-1 text-sm text-ink-soft">Foto adicionada! Ela vai virar a capa da história.</span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
            aria-label="Remover foto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 bg-cream px-4 py-4 text-sm font-medium text-ink-soft transition-colors hover:border-primary hover:text-primary-dark",
          )}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          {loading ? "Processando foto..." : "Enviar uma foto"}
        </button>
      )}

      {error && <p className="text-xs text-primary-dark">{error}</p>}
    </div>
  );
}
