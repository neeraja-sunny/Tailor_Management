import { ArrowLeft, Store, UsersRound } from "lucide-react";
import Link from "next/link";

type ComingSoonPageOverlayProps = {
  title: "Store" | "Social";
  kind: "store" | "social";
};

export default function ComingSoonPageOverlay({
  title,
  kind,
}: ComingSoonPageOverlayProps) {
  const Icon = kind === "store" ? Store : UsersRound;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label={`${title} is coming soon. Currently in development.`}
    >
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2.5px]" />

      <div className="relative w-[min(92vw,28rem)] overflow-hidden rounded-xl border border-emerald-200/25 bg-emerald-950/82 p-[1px] opacity-100 shadow-2xl shadow-emerald-950/45 backdrop-blur-xl transition duration-500 ease-out hover:scale-[1.02] hover:shadow-emerald-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.28),transparent_34%),linear-gradient(135deg,rgba(4,108,78,0.92),rgba(11,28,45,0.82))]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-[#FCF4E1] to-emerald-500" />
        <div className="relative rounded-xl bg-emerald-950/34 px-6 py-8 text-center text-white backdrop-blur-xl sm:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-emerald-200/30 bg-white/10 text-emerald-100 shadow-lg shadow-black/20">
            <Icon size={28} aria-hidden="true" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/85">
            {title}
          </p>

          <div className="mx-auto inline-flex rounded-md border border-emerald-200/55 bg-emerald-300/18 px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-emerald-950/30">
            Coming Soon
          </div>

          <p className="mt-4 text-sm font-medium text-white/82">
            Currently in development
          </p>

          <Link
            href="/"
            className="group pointer-events-auto relative mt-6 inline-flex items-center justify-center gap-2 overflow-hidden rounded-md border border-emerald-200/55 bg-emerald-300/18 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-emerald-950/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-white hover:bg-white hover:text-emerald-950 hover:shadow-xl hover:shadow-emerald-950/40 active:translate-y-0 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <ArrowLeft
              size={18}
              className="relative transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span className="relative">Back to Home</span>
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#FCF4E1]/75">
            Stay Tuned
          </p>
        </div>
      </div>
    </div>
  );
}
