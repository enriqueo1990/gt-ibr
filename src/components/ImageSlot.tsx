/** Placeholder de imagen (reemplaza al <image-slot> del diseño).
 *  Si recibe `src`, muestra la foto real (object-fit cover); si no, el placeholder. */
export function ImageSlot({
  className = '',
  placeholder,
  src,
}: {
  className?: string
  placeholder?: string
  src?: string
}) {
  if (src) {
    return (
      <div className={`img-slot has-photo ${className}`.trim()}>
        <img src={src} alt="" referrerPolicy="no-referrer" />
      </div>
    )
  }
  return (
    <div className={`img-slot ${className}`.trim()} aria-hidden="true">
      {placeholder}
    </div>
  )
}
