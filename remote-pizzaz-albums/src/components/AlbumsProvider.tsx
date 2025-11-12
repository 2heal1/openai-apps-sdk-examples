import React from "react";
import "./ProviderComponent.css";
import useEmblaCarousel from "embla-carousel-react";
import albumsData from "./markers.json";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Photo = {
  id: string;
  title?: string;
  url: string;
};

export type Album = {
  id: string;
  title: string;
  cover: string;
  photos: Photo[];
};

type ProviderProps = {
  headline?: string;
  albums: Album[];
  ctaLabel?: string;
};

function AlbumCard({
  album,
  onSelect,
}: {
  album: Album;
  onSelect: (album: Album) => void;
}) {
  return (
    <button
      type="button"
      className="group relative cursor-pointer flex-shrink-0 w-[272px] bg-white text-left"
      onClick={() => onSelect(album)}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
        <img
          src={album.cover}
          alt={album.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="pt-3 px-1.5">
        <div className="text-base font-medium truncate">{album.title}</div>
        <div className="text-sm text-black/60 mt-0.5">
          {album.photos.length} photos
        </div>
      </div>
    </button>
  );
}

function FilmStrip({
  album,
  selectedIndex,
  onSelect,
}: {
  album: Album;
  selectedIndex: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="h-full w-full overflow-auto flex flex-col items-center justify-center p-5 space-y-5">
      {album.photos.map((photo, idx) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onSelect(idx)}
          className={
            "block w-full p-[1px] pointer-events-auto rounded-[10px] cursor-pointer border transition-[colors,opacity] " +
            (idx === selectedIndex
              ? "border-black"
              : "border-black/0 hover:border-black/30 opacity-60 hover:opacity-100")
          }
        >
          <div className="aspect-[5/3] rounded-lg overflow-hidden w-full">
            <img
              src={photo.url}
              alt={photo.title || `Photo ${idx + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </button>
      ))}
    </div>
  );
}

export default function AlbumsProvider(
  props: Partial<ProviderProps> & { albums?: Album[] }
) {
  const fallback: ProviderProps = {
    albums: (albumsData as { albums: Album[] }).albums ?? [],
    headline: "Pizza Albums",
    ctaLabel: "View Album",
  };
  const merged = { ...fallback, ...props };
  const { albums, headline, ctaLabel } = merged;
  const [selectedAlbum, setSelectedAlbum] = React.useState<Album | null>(
    albums[0] ?? null
  );
  const [selectedPhotoIdx, setSelectedPhotoIdx] = React.useState(0);
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

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setSelectedPhotoIdx(0);
  };

  if (!albums.length) {
    return (
      <div className="antialiased relative w-full text-black py-5 bg-white">
        <div className="text-center text-black/60 text-sm">
          No albums available.
        </div>
      </div>
    );
  }

  const activePhoto = selectedAlbum?.photos?.[selectedPhotoIdx];

  return (
    <div className="relative antialiased w-full bg-white text-black rounded-2xl sm:rounded-3xl overflow-hidden border border-black/10">
      <div className="px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">{headline}</h3>
        {ctaLabel ? (
          <button
            className="rounded-full bg-[#F46C21] text-white px-4 py-1.5 text-sm font-medium hover:opacity-90 active:opacity-100"
            type="button"
          >
            {ctaLabel}
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 items-stretch px-5 pb-5">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} onSelect={handleSelectAlbum} />
          ))}
        </div>
      </div>

      {canPrev && (
        <button
          aria-label="Previous"
          className="absolute left-3 top-36 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-black shadow-lg ring ring-black/5 hover:bg-white"
          onClick={() => emblaApi?.scrollPrev()}
          type="button"
        >
          <ArrowLeft strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      )}
      {canNext && (
        <button
          aria-label="Next"
          className="absolute right-3 top-36 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-black shadow-lg ring ring-black/5 hover:bg-white"
          onClick={() => emblaApi?.scrollNext()}
          type="button"
        >
          <ArrowRight strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      )}

      {selectedAlbum && activePhoto ? (
        <div className="px-5 pb-5">
          <div className="rounded-3xl border border-black/10 bg-white shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-[auto,300px]">
              <div className="relative bg-black/5 flex items-center justify-center p-4">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title || selectedAlbum.title}
                  className="rounded-2xl max-h-[360px] w-full object-cover shadow-md border border-black/5 bg-white"
                />
              </div>
              <div className="border-t md:border-t-0 md:border-l border-black/10 bg-white">
                <FilmStrip
                  album={selectedAlbum}
                  selectedIndex={selectedPhotoIdx}
                  onSelect={setSelectedPhotoIdx}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
