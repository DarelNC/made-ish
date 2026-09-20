// The outbound mark. Square-cut on purpose, to sit next to the slab corners.
export default function Arrow({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden="true" className={className}>
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  );
}
