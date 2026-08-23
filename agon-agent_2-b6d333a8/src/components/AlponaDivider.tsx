interface AlponaDividerProps {
  /** CSS color of the section above, used to blend the top edge */
  from?: string;
  /** CSS color of the section below, used to blend the bottom edge */
  to?: string;
}

/**
 * The white Bengali alpona artwork (uploaded brand asset) used strictly as a
 * standalone decorative band between sections — it never overlaps any text.
 */
export default function AlponaDivider({ from = 'rgba(246,238,218,0)', to = 'rgba(246,238,218,1)' }: AlponaDividerProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none relative h-24 select-none overflow-hidden sm:h-32 md:h-44">
      <img
        src="/assets/asset4.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-x-0 top-0 h-12" style={{ background: `linear-gradient(to bottom, ${from}, rgba(0,0,0,0))` }} />
      <div className="absolute inset-x-0 bottom-0 h-3/4" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0), ${to})` }} />
    </div>
  );
}
