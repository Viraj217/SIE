const steps = [
  {
    number: '01',
    title: 'Source with intent',
    description: 'Reliable stock in the grades, diameters, and lengths your production line actually calls for.',
  },
  {
    number: '02',
    title: 'Cut to your drawing',
    description: 'Custom hacksaw cutting takes the rough work off your floor and gives your team a clean starting point.',
  },
  {
    number: '03',
    title: 'Dispatch ready',
    description: 'Measured, packed, and sent from Darukhana with the details your workshop needs to keep moving.',
  },
];

export default function OperatingPromise() {
  return (
    <section id="process" className="relative overflow-hidden border-y border-steel/10 bg-paper-warm py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:gap-14 sm:px-8 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div>
          <span className="section-tag">THE SHAH METHOD</span>
          <h2 className="section-title max-w-[460px]">Less setup time. More work getting done.</h2>
          <p className="section-desc max-w-[470px]">
            A good steel supplier removes friction before the material reaches your machine. That is the promise behind every Shah Industrial dispatch.
          </p>
        </div>

        <div className="grid divide-y divide-steel/10 border-y border-steel/10">
          {steps.map((step) => (
            <div key={step.number} className="group grid gap-4 py-7 sm:grid-cols-[70px_1fr] sm:gap-7">
              <span className="font-mono text-[0.7rem] tracking-[0.2em] text-dawn-coral">{step.number}</span>
              <div>
                <h3 className="mb-2 font-display text-2xl text-slate transition-colors duration-300 group-hover:text-steel">{step.title}</h3>
                <p className="max-w-[480px] text-[0.92rem] leading-relaxed text-slate/70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
