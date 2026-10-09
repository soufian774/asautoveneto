import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function CarGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (photos.length <= 1) {
    return (
      <img
        src={photos[0] ?? ""}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        className="aspect-[3/2] w-full rounded-2xl border object-cover"
      />
    );
  }

  return (
    <div>
      <Carousel setApi={setApi} opts={{ align: "start" }}>
        <CarouselContent className="ml-0">
          {photos.map((url, i) => (
            <CarouselItem key={url} className="pl-0">
              <img
                src={url}
                alt={`${alt} — foto ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                className="aspect-[3/2] w-full touch-pan-y rounded-2xl border object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 h-10 w-10 bg-background/90" />
        <CarouselNext className="right-3 h-10 w-10 bg-background/90" />
      </Carousel>
      <div className="mt-3 flex justify-center gap-2">
        {photos.map((url, i) => (
          <button
            key={url}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Vai alla foto ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${i === selected ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
