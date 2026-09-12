/* eslint-disable @next/next/no-img-element -- images come from arbitrary user URLs and local uploads */

type ProposalImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
};

export function ProposalImage({ src, alt, className = "" }: ProposalImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid place-items-center bg-gradient-to-br from-butter via-blush to-lilac bg-map-grid text-4xl ${className}`}
      >
        <span aria-hidden>🏙️</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}
