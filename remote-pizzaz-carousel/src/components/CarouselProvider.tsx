import React from "react";
import "./ProviderComponent.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import markers from "./markers.json";

export type CarouselPlace = {
  id: string;
  name: string;
  description?: string;
  rating: number;
  price?: string;
  city?: string;
  thumbnail: string;
};

type CarouselProps = {
  places: CarouselPlace[];
  title?: string;
  ctaLabel?: string;
};

function PlaceCard({ place }: { place: CarouselPlace }) {
  return (
    <div className="min-w-[220px] max-w-[220px] w-[65vw] sm:w-[220px] self-stretch flex flex-col">
      <div className="w-full">
        <img
          src={place.thumbnail}
          alt={place.name}
          className="w-full aspect-square rounded-2xl object-cover ring ring-black/5 shadow-[0px_2px_6px_rgba(0,0,0,0.06)]"
        />
      </div>
      <div className="mt-3 flex flex-col flex-1">
        <div className="text-base font-medium truncate line-clamp-1">
          {place.name}
        </div>
        <div className="text-xs mt-1 text-black/60 flex items-center gap-2">
          <span>{place.rating?.toFixed ? place.rating.toFixed(1) : place.rating}</span>
          {place.price ? <span>· {place.price}</span> : null}
          {place.city ? <span>· {place.city}</span> : null}
        </div>
        {place.description ? (
          <div className="text-sm mt-2 text-black/80 flex-auto">
            {place.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CarouselProvider(
  props: Partial<CarouselProps> & { places?: CarouselPlace[] }
) {
  const fallback: CarouselProps = {
    places: markers?.places ?? [],
    title: "Featured Pizzerias",
    ctaLabel: "Save Picks",
  };
  const merged = { ...fallback, ...props };
  const { places, title, ctaLabel } = merged;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    containScroll: "trimSnaps",
    slidesToScroll: "auto",
  });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;
    const updateButtons = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi]);

  if (!places?.length) {
    return (
      <div className="antialiased relative w-full text-black py-5 bg-white">
        <div className="text-center text-black/60 text-sm">No results.</div>
      </div>
    );
  }

  return (
    <div className="antialiased relative w-full text-black py-5 bg-white">
      <div className="px-5 pb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        {ctaLabel ? (
          <button
            type="button"
            className="cursor-pointer inline-flex items-center rounded-full bg-[#F46C21] text-white px-4 py-1.5 text-sm font-medium hover:opacity-90 active:opacity-100"
          >
            {ctaLabel}
          </button>
        ) : null}
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 max-sm:mx-5 items-stretch">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
      {canPrev && (
        <button
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-black shadow-lg ring ring-black/5 hover:bg-white"
          onClick={() => emblaApi && emblaApi.scrollPrev()}
          type="button"
        >
          <ArrowLeft strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      )}
      {canNext && (
        <button
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-black shadow-lg ring ring-black/5 hover:bg-white"
          onClick={() => emblaApi && emblaApi.scrollNext()}
          type="button"
        >
          <ArrowRight strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
