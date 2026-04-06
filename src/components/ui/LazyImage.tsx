import type { ImgHTMLAttributes } from 'react'

type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  caption?: string
}

/**
 * Lazy-loaded image with async decoding — use for illustrations & hero art.
 */
export function LazyImage({ caption, className, alt, ...rest }: LazyImageProps) {
  return (
    <figure className={`qc-figure ${className ?? ''}`.trim()}>
      <img loading="lazy" decoding="async" alt={alt ?? ''} {...rest} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
