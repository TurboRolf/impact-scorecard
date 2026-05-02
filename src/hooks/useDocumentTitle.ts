import { useEffect } from "react";

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | Ethisay` : "Ethisay";
    return () => { document.title = prev; };
  }, [title]);
};
