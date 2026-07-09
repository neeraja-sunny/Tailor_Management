import Image from "next/image";
import Link from "next/link";
import ComingSoonPageOverlay from "@/components/ComingSoonPageOverlay";
import {
  Bell,
  Bookmark,
  Compass,
  Flame,
  Grid2X2,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Play,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  User,
} from "lucide-react";

const trendCards = [
  { title: "Minimal Elegance", saves: "12.4k saves", image: "/outfits/churidharimage.png" },
  { title: "Bridal Inspo", saves: "18.7k saves", image: "/outfits/blouseimage.jpg" },
  { title: "Pastel Perfect", saves: "7.8k saves", image: "/outfits/kurthaimage.jpg" },
  { title: "Detail Work", saves: "6.1k saves", image: "/outfits/coatimage.jpg" },
];

const feedItems = [
  { shop: "Label Ananya", place: "Koramangala", image: "/outfits/churidharimage.png", tag: "Wedding" },
  { shop: "The Silk Room", place: "Jayanagar", image: "/outfits/kurthaimage.jpg", tag: "Reels" },
  { shop: "Stitch & Sage", place: "Whitefield", image: "/outfits/blouseimage.jpg", tag: "Saved" },
  { shop: "Thread & Tales", place: "Indiranagar", image: "/outfits/pantimage.jpg", tag: "New" },
  { shop: "Raaga Bridal Studio", place: "Bangalore", image: "/outfits/shirtimage.jpg", tag: "Style" },
  { shop: "Ethnic Studio", place: "HSR Layout", image: "/outfits/coatimage.jpg", tag: "Bridal" },
];

const navItems = [
  { label: "Discover", icon: Home },
  { label: "Trending", icon: Flame },
  { label: "Following", icon: User },
  { label: "Saved", icon: Bookmark },
  { label: "Boards", icon: Grid2X2 },
  { label: "Messages", icon: MessageCircle },
];

export default function SocialLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FCF4E1] text-[#101828]">
      <div className="pointer-events-none relative select-none opacity-70 blur-[1.2px]">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-emerald-100/80 bg-white/72 px-6 py-8 shadow-2xl shadow-emerald-950/5 backdrop-blur-xl lg:block">
          <Link href="/tailor" className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
              <Sparkles size={23} />
            </div>
            <span className="text-3xl font-bold tracking-tight">Loomiz</span>
          </Link>
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex h-12 w-full items-center gap-3 rounded-md px-4 text-left text-sm font-semibold transition ${
                    index === 0 ? "bg-slate-950 text-white shadow-lg shadow-emerald-950/15" : "text-slate-700 hover:bg-emerald-50"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-10 rounded-lg border border-emerald-100 bg-white/80 p-5 shadow-xl shadow-emerald-950/5">
            <p className="text-lg font-bold">Get Inspired. Get Noticed.</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">A simple preview for fashion posts, reels, saves, and boutique discovery.</p>
            <Link href="/tailor" className="mt-5 inline-flex items-center rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Management
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8">
          <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <Sparkles className="text-emerald-600" />
              <span className="text-2xl font-bold">Loomiz</span>
            </div>
            <div className="flex min-h-14 flex-1 items-center gap-3 rounded-md bg-white/90 px-5 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100 backdrop-blur md:max-w-2xl">
              <Search size={21} className="text-slate-500" />
              <span className="truncate text-sm text-slate-500">Search styles, boutiques, inspirations...</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 text-sm font-semibold md:flex"><MapPin size={20} /> Bangalore, India</span>
              <button className="rounded-md bg-white/90 p-3 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100" aria-label="Saved"><Heart size={21} /></button>
              <button className="rounded-md bg-white/90 p-3 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100" aria-label="Notifications"><Bell size={21} /></button>
            </div>
          </header>

          <section className="rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-2xl shadow-emerald-950/8 backdrop-blur">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold"><Flame className="text-emerald-600" /> Trending Now</h1>
                <p className="mt-1 text-sm text-slate-500">What customers can discover later.</p>
              </div>
              <button className="text-sm font-bold text-emerald-600">See all</button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {trendCards.map((item) => (
                <article key={item.title} className="relative min-h-72 overflow-hidden rounded-lg bg-slate-100 shadow-xl shadow-emerald-950/10 ring-1 ring-white/70">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
                  <button className="absolute left-4 top-4 rounded-md bg-white/95 p-2 text-emerald-600 shadow-lg shadow-black/15" aria-label="Play"><Play size={17} fill="currentColor" /></button>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-lg font-bold leading-tight">{item.title}</h2>
                    <p className="mt-1 text-sm">{item.saves}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-2xl shadow-emerald-950/8 backdrop-blur">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {["For You", "Popular Near You", "Following", "New Arrivals"].map((tab, index) => (
                  <button key={tab} className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${index === 0 ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600 ring-1 ring-slate-100"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <button className="rounded-md border border-emerald-200 p-3 text-slate-700" aria-label="Filters"><SlidersHorizontal size={20} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {feedItems.map((item) => (
                <article key={item.shop} className="relative min-h-[23rem] overflow-hidden rounded-lg bg-slate-100 shadow-2xl shadow-emerald-950/10 ring-1 ring-white/70">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 30vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/15 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700">{item.tag}</div>
                  <Bookmark className="absolute right-4 top-4 text-white" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-lg font-bold">{item.shop}</h2>
                    <p className="text-sm">{item.place}, Bangalore</p>
                    <button className="mt-3 rounded-md border border-white/70 px-4 py-2 text-sm font-bold">Get This Stitched</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-around rounded-lg bg-white/92 px-5 py-3 shadow-2xl ring-1 ring-emerald-100 backdrop-blur lg:hidden">
        {[Home, Search, Plus, Compass, User].map((Icon, index) => (
          <button key={index} className={`${index === 2 ? "bg-emerald-600 text-white" : "text-slate-700"} rounded-md p-3`} aria-label={`Social action ${index + 1}`}>
            <Icon size={22} />
          </button>
        ))}
      </nav>
      </div>
      <ComingSoonPageOverlay title="Social" kind="social" />
    </main>
  );
}


