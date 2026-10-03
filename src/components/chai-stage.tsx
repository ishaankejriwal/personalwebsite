const figures = [
  { n: "60+", label: "studies read and turned into metrics" },
  { n: "2", label: "public evaluation tools I wrote" },
  { n: "8", label: "working groups, from ambient scribes to cybersecurity" },
  { n: "1", label: "cold email that started it" },
];

export function ChaiStage() {
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2">
      {figures.map((f, i) => (
        <div
          key={f.label}
          className={`flex flex-col justify-between p-4 sm:p-6 ${
            i % 2 === 0 ? "border-r-[3px] border-ink" : ""
          } ${i < 2 ? "border-b-[3px] border-ink" : ""} ${i === 3 ? "bg-accent text-bg" : ""}`}
        >
          <span className="display num text-5xl sm:text-7xl lg:text-8xl">{f.n}</span>
          <span className="max-w-[16ch] text-sm leading-tight sm:text-base">{f.label}</span>
        </div>
      ))}
    </div>
  );
}
