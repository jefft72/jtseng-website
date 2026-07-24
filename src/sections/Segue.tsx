type SegueProps = {
  to: 'work' | 'play';
  title: string;
  cmd: string;
};

// Full-bleed band that hands off between the two surfaces.
function Segue({ to, title, cmd }: SegueProps) {
  return (
    <section className="segue" aria-label={title}>
      <button
        type="button"
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent('jt:nav', { detail: { surface: to } }),
          )
        }
      >
        <span className="segue-cmd">{cmd}</span>
        <strong>{title} →</strong>
      </button>
    </section>
  );
}

export default Segue;
