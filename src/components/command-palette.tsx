"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type PaletteTarget = {
  label: string;
  href: string;
  group: "section" | "project";
  meta: string;
};

const targets: PaletteTarget[] = [
  { label: "Projects", href: "#projects", group: "section", meta: "running systems" },
  { label: "Research", href: "#research", group: "section", meta: "field log" },
  { label: "Writing", href: "#writing", group: "section", meta: "notes" },
  { label: "Contact", href: "#contact", group: "section", meta: "send note" },
  { label: "NeuroCore", href: "#neuro", group: "project", meta: "motion signal" },
  { label: "BioDock AI", href: "#bio", group: "project", meta: "binding fit" },
  { label: "CHAI", href: "#chai", group: "project", meta: "eval matrix" },
  { label: "NASA SEES", href: "#nasa", group: "project", meta: "water anomaly" },
  { label: "Skillify", href: "#skillify", group: "project", meta: "conversion path" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const listId = useId();

  const closePalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const filteredTargets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return targets;
    }

    return targets.filter((target) => {
      const haystack = `${target.label} ${target.meta} ${target.group}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCommandKey = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

      if (isCommandKey) {
        event.preventDefault();
        if (open) {
          closePalette();
        } else {
          setOpen(true);
        }
        return;
      }

      if (event.key === "Escape") {
        closePalette();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePalette, open]);

  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }
  }, [open]);

  function jumpToTarget(target: PaletteTarget) {
    const element = document.querySelector(target.href);

    if (element) {
      element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", target.href);
    }

    closePalette();
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % Math.max(filteredTargets.length, 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current === 0 ? Math.max(filteredTargets.length - 1, 0) : current - 1,
      );
    }

    if (event.key === "Enter" && filteredTargets[activeIndex]) {
      event.preventDefault();
      jumpToTarget(filteredTargets[activeIndex]);
    }
  }

  function onDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusable?.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-[4px] border border-white/[0.12] bg-[#0b1017]/82 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-300 shadow-2xl shadow-black/30 backdrop-blur transition-colors hover:border-[color:var(--accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
        Cmd/Ctrl K
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-[#05070a]/78 px-4 pt-20 backdrop-blur-md sm:pt-28"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closePalette();
              }
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="instrument-panel w-full max-w-2xl overflow-hidden rounded-[6px]"
              initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onKeyDown={onDialogKeyDown}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="border-b border-white/[0.08] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-[color:var(--accent)]">
                      Field notes
                    </p>
                    <h2
                      id={titleId}
                      className="mt-2 text-xl font-semibold tracking-[-0.035em] text-white"
                    >
                      Route to an active module
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closePalette}
                    className="rounded-[4px] border border-white/[0.12] px-2.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                  >
                    Esc
                  </button>
                </div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onInputKeyDown}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={
                    filteredTargets[activeIndex] ? `${listId}-${activeIndex}` : undefined
                  }
                  aria-label="Search page destinations"
                  className="mt-5 w-full rounded-[4px] border border-white/[0.1] bg-black/24 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                  placeholder="Search projects, research, writing, contact..."
                />
              </div>

              <div
                id={listId}
                role="listbox"
                aria-label="Page destinations"
                className="max-h-[60vh] overflow-y-auto p-2"
              >
                {filteredTargets.length ? (
                  filteredTargets.map((target, index) => {
                    const selected = index === activeIndex;

                    return (
                      <button
                        id={`${listId}-${index}`}
                        key={target.href}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => jumpToTarget(target)}
                        className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[4px] px-3 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] ${
                          selected
                            ? "bg-[color:var(--accent-soft)] text-white"
                            : "text-slate-300 hover:bg-white/[0.045] hover:text-white"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            target.group === "project"
                              ? "bg-[color:var(--accent)]"
                              : "border border-[color:var(--accent)]"
                          }`}
                        />
                        <span>
                          <span className="block text-sm font-medium">{target.label}</span>
                          <span className="mt-1 block font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                            {target.meta}
                          </span>
                        </span>
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                          {target.group}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="px-4 py-8 text-sm leading-6 text-[color:var(--muted)]">
                    No module matches that query.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
