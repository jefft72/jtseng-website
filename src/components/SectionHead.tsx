import ScrambleText from './ScrambleText';

type SectionHeadProps = {
  num: string;
  title: string;
};

function SectionHead({ num, title }: SectionHeadProps) {
  return (
    <div className="section-head">
      <span className="section-num">{num}</span>
      <h2>
        <ScrambleText text={title} />
      </h2>
    </div>
  );
}

export default SectionHead;
