import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostImageGridProps {
  images: string[];
}

const PostImageGrid = ({ images }: PostImageGridProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const count = images.length;
  if (count === 0) return null;

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + count) % count));
  const next = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % count));

  const Img = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <button
      type="button"
      onClick={() => open(images.indexOf(src))}
      className={`block w-full h-full overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-ring ${className ?? ""}`}
      aria-label="Open image"
    >
      <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
    </button>
  );

  const HEIGHT = "h-64 md:h-80"; // ~256 / 320 px

  let grid: JSX.Element;
  if (count === 1) {
    grid = (
      <div className={`${HEIGHT} w-full`}>
        <Img src={images[0]} alt="Post image" />
      </div>
    );
  } else if (count === 2) {
    grid = (
      <div className={`${HEIGHT} w-full grid grid-cols-2 gap-0.5`}>
        <Img src={images[0]} alt="Post image 1" />
        <Img src={images[1]} alt="Post image 2" />
      </div>
    );
  } else if (count === 3) {
    grid = (
      <div className={`${HEIGHT} w-full grid grid-cols-2 gap-0.5`}>
        <div className="row-span-2 h-full"><Img src={images[0]} alt="Post image 1" /></div>
        <div className="h-full"><Img src={images[1]} alt="Post image 2" /></div>
        <div className="h-full"><Img src={images[2]} alt="Post image 3" /></div>
      </div>
    );
  } else {
    grid = (
      <div className={`${HEIGHT} w-full grid grid-cols-2 grid-rows-2 gap-0.5`}>
        <Img src={images[0]} alt="Post image 1" />
        <Img src={images[1]} alt="Post image 2" />
        <Img src={images[2]} alt="Post image 3" />
        <Img src={images[3]} alt="Post image 4" />
      </div>
    );
  }

  return (
    <div className="mb-3 md:mb-4 rounded-lg overflow-hidden border">
      {grid}
      <Dialog open={lightboxIndex !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-background/95 border-0">
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center">
              <img
                src={images[lightboxIndex]}
                alt={`Image ${lightboxIndex + 1} of ${count}`}
                className="max-h-[85vh] w-auto mx-auto object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={close}
                aria-label="Close"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
              >
                <X className="h-4 w-4" />
              </Button>
              {count > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-background/80">
                    {lightboxIndex + 1} / {count}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostImageGrid;