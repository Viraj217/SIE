interface StatItemProps {
  value: string | number;
  unit?: string;
  label: string;
}

function StatItem({ value, unit, label }: StatItemProps) {
  return (
    <div className="relative flex flex-col items-center py-6 text-center group sm:py-8">
      {/* Decorative top line */}
      <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-dawn-coral to-transparent mb-6 opacity-40 group-hover:opacity-100 group-hover:w-12 transition-all duration-500" />
      
      {/* Metric and label — pure static text for SSR & CSR, never resets */}
      <div className="flex items-baseline font-mono font-semibold leading-none mb-4">
        <span className="text-[clamp(2.5rem,4vw,3.8rem)] text-slate">
          {value}
        </span>
        {unit && <span className="text-[clamp(1.2rem,2vw,1.6rem)] text-dawn-coral ml-1.5">{unit}</span>}
        {" "}
      </div>
      {" "}
      <span className="text-[0.7rem] text-steel uppercase tracking-[0.25em] font-mono block">
        {label}
      </span>
    </div>
  );
}

export default function ProofStrip() {
  return (
    <section id="proof" className="relative z-30 bg-paper">
      {/* Top glow line */}
      <div className="glow-line" />
      
      <div className="mx-auto max-w-[1100px] px-5 py-4 sm:px-8 sm:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-steel/10">
          <StatItem value="65" unit="+" label="Years of Presence" />{" "}
          <StatItem value="500" unit="T/yr" label="Steel Handled" />{" "}
          <StatItem value="18" unit="" label="States Supplied" />{" "}
          <StatItem value="10" unit="+" label="Sectors Supplied" />
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="glow-line" />
    </section>
  );
}
