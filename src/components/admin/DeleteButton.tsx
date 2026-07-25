"use client";

import { Trash2 } from "lucide-react";

/** Onay soran silme butonu. Bir server action'ı form ile tetikler. */
export function DeleteButton({
  action,
  id,
  confirmText = "Silmek istediğinize emin misiniz?",
}: {
  action: (formData: FormData) => void;
  id: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Sil">
        <Trash2 size={15} />
      </button>
    </form>
  );
}
