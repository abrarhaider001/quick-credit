type HomeOfferBannerProps = {
  eyebrow: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  ctaLabel?: string
  onCtaClick?: () => void
}

export function HomeOfferBanner({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  ctaLabel = 'Apply now',
  onCtaClick,
}: HomeOfferBannerProps) {
  return (
    <section className="home-offer" aria-labelledby="home-offer-title">
      <div className="home-offer__content">
        <p className="home-offer__eyebrow">{eyebrow}</p>
        <h2 id="home-offer-title" className="home-offer__title">
          {title}
        </h2>
        <p className="home-offer__desc">{description}</p>
        <button
          type="button"
          className="home-offer__cta qc-btn qc-btn--primary"
          onClick={onCtaClick}
        >
          {ctaLabel}
        </button>
      </div>
      <div className="home-offer__visual">
        <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
      </div>
    </section>
  )
}
