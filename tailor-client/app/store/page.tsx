import WebpNextImage from "@/components/WebpNextImage";
import Link from "next/link";
import ComingSoonPageOverlay from "@/components/ComingSoonPageOverlay";
import {
  Bell,
  CalendarDays,
  Heart,
  Home,
  MapPin,
  Navigation,
  Package,
  Plus,
  Scissors,
  Search,
  Shirt,
  ShoppingBag,
  Star,
  Store,
  User,
} from "lucide-react";

const boutiques = [
  { name: "House of Myraa", place: "Indiranagar", image: "/fashion/saree-champagne.jpg", rating: "4.9" },
  { name: "Label Ananya", place: "Koramangala", image: "/fashion/saree-mauve.jpg", rating: "4.8" },
  { name: "The Silk Room", place: "Jayanagar", image: "/fashion/saree-pearl.jpg", rating: "4.7" },
  { name: "Stitch & Sage", place: "HSR Layout", image: "/fashion/bride-ivory.jpg", rating: "4.9" },
  { name: "Golden Atelier", place: "Indiranagar", image: "/fashion/gown-golden.jpg", rating: "4.9" },
  { name: "Emerald House", place: "Koramangala", image: "/fashion/gown-green.jpg", rating: "4.8" },
  { name: "Silver Studio", place: "Jayanagar", image: "/fashion/gown-silver.jpg", rating: "4.9" },
  { name: "Blush Couture", place: "Whitefield", image: "/fashion/gown-blush.jpg", rating: "4.7" },
  { name: "Ivory Bridal House", place: "Indiranagar", image: "/fashion/gown-white-tiara.jpg", rating: "4.9" },
  { name: "Navy Royale", place: "Koramangala", image: "/fashion/lehenga-navy-floral.jpg", rating: "4.8" },
  { name: "Rose Gold Studio", place: "Jayanagar", image: "/fashion/lehenga-rose-gold.jpg", rating: "4.9" },
  { name: "Saffron Ivory", place: "HSR Layout", image: "/fashion/gown-saffron-ivory.jpg", rating: "4.8" },
];

const collections = [
  { title: "Wedding Edit", count: "32 boutiques", image: "/fashion/saree-champagne.jpg" },
  { title: "Festive Favourites", count: "28 boutiques", image: "/fashion/saree-mauve.jpg" },
  { title: "Summer Styles", count: "18 boutiques", image: "/fashion/lehenga-blue.jpg" },
  { title: "Minimal Muse", count: "22 boutiques", image: "/fashion/saree-pearl.jpg" },
  { title: "Royal Gowns", count: "24 boutiques", image: "/fashion/gown-maroon-princess.jpg" },
  { title: "Walima Edit", count: "16 boutiques", image: "/fashion/gown-walima.jpg" },
  { title: "Bridal Reds", count: "20 boutiques", image: "/fashion/lehenga-royal-red.jpg" },
  { title: "Handwork Sarees", count: "18 boutiques", image: "/fashion/saree-handwork-model.jpg" },
  { title: "White Bridal", count: "26 boutiques", image: "/fashion/gown-white-bridal.jpg" },
  { title: "Midnight Lehengas", count: "19 boutiques", image: "/fashion/lehenga-black-blue.jpg" },
  { title: "Rose Gold Edit", count: "21 boutiques", image: "/fashion/lehenga-blush-heavy.jpg" },
  { title: "Princess Couture", count: "17 boutiques", image: "/fashion/lehenga-royal-princess.jpg" },
];

const categories = [
  { label: "Bridal", icon: Shirt },
  { label: "Kurthis", icon: ShoppingBag },
  { label: "Sarees", icon: Package },
  { label: "Lehengas", icon: SparkIcon },
  { label: "Blouses", icon: Scissors },
  { label: "Bookings", icon: CalendarDays },
];

function SparkIcon({ size = 22 }: { size?: number }) {
  return <Star size={size} />;
}

export default function StoreLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FCF4E1] text-[#101828]">
      <div className="pointer-events-none relative select-none opacity-70 blur-[1.2px]">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-emerald-100/80 bg-white/72 px-6 py-8 shadow-2xl shadow-emerald-950/5 backdrop-blur-xl lg:block">
          <Link href="/tailor" className="mb-11 block">
            <span className="font-PlayfairDisplay text-4xl text-slate-900">Stitchr</span>
            <p className="mt-1 text-sm text-slate-500">Your style. Our craft.</p>
          </Link>
          <nav className="space-y-2">
            {[
              { label: "Explore", icon: Home },
              { label: "Boutiques", icon: Store },
              { label: "Collections", icon: ShoppingBag },
              { label: "Nearby", icon: MapPin },
              { label: "Custom Stitching", icon: Scissors },
              { label: "Bookings", icon: CalendarDays },
              { label: "Profile", icon: User },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex h-12 w-full items-center gap-3 px-4 text-left text-sm font-semibold transition ${
                    index === 0 ? "bg-slate-950 text-white shadow-lg shadow-emerald-950/15" : "text-slate-700 hover:bg-emerald-50"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-10 border border-emerald-100 bg-white/80 p-5 shadow-xl shadow-emerald-950/5">
            <div className="relative mb-4 h-52 overflow-hidden bg-gradient-to-br from-white to-emerald-50">
              <WebpNextImage src="/fashion/gown-dusty-pink.jpg" alt="Custom stitched dusty pink gown" fill className="object-cover object-top" sizes="220px" />
            </div>
            <p className="text-xl font-bold">Custom stitching made for you</p>
            <Link href="/tailor" className="mt-5 inline-flex bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Management
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-10">
          <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="lg:hidden">
              <span className="font-PlayfairDisplay text-3xl">Stitchr</span>
            </div>
            <div className="flex min-h-14 flex-1 items-center gap-3 bg-white/90 px-5 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100 backdrop-blur md:max-w-xl">
              <Search size={21} className="text-slate-500" />
              <span className="truncate text-sm text-slate-500">Search outfits, boutiques, styles...</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 text-sm font-semibold md:flex"><MapPin size={20} /> Bangalore, India</span>
              <button className="bg-white/90 p-3 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100" aria-label="Saved"><Heart size={21} /></button>
              <button className="bg-white/90 p-3 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100" aria-label="Notifications"><Bell size={21} /></button>
            </div>
          </header>

          <section className="relative min-h-[390px] overflow-hidden border border-white/20 bg-slate-950 p-8 text-white shadow-2xl shadow-emerald-950/20 md:p-12">
            <WebpNextImage src="/fashion/saree-champagne.jpg" alt="" fill priority className="object-contain object-right opacity-78 drop-shadow-2xl" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/72 to-slate-950/12" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-emerald-500/18 to-transparent" />
            <div className="relative max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Wedding Season</p>
              <h1 className="mt-5 font-PlayfairDisplay text-4xl leading-tight md:text-6xl">Timeless Looks, Thoughtfully Stitched</h1>
              <p className="mt-5 max-w-md text-base leading-7 text-emerald-50">A simple preview for boutique collections, custom stitching, local discovery, and bookings.</p>
              <button className="mt-7 bg-white px-6 py-3 text-sm font-bold text-black shadow-xl shadow-black/20">Explore Collections</button>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                {["32 Collections", "4.8 Avg Rating", "Within 5 km"].map((item) => (
                  <div key={item} className="border border-white/15 bg-white/10 px-3 py-3 text-xs font-semibold text-emerald-50 backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className="flex min-h-24 flex-col items-center justify-center gap-2 bg-white/90 text-sm font-semibold text-slate-700 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100 backdrop-blur">
                  <Icon size={24} className="text-emerald-700" />
                  {item.label}
                </button>
              );
            })}
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Boutiques</h2>
              <button className="text-sm font-bold text-emerald-700">View all</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {boutiques.map((item) => (
                <article key={item.name} className="relative min-h-72 overflow-hidden bg-slate-100 shadow-2xl shadow-emerald-950/10 ring-1 ring-white/70">
                  <WebpNextImage src={item.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 22vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <Heart className="absolute right-4 top-4 text-white" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm">{item.place}, Bangalore</p>
                    <p className="mt-2 flex items-center gap-1 text-sm"><Star size={15} fill="currentColor" className="text-emerald-300" /> {item.rating}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Curated Collections</h2>
              <button className="text-sm font-bold text-emerald-700">View all</button>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {collections.map((item) => (
                <article key={item.title} className="relative min-h-40 overflow-hidden bg-white/92 p-5 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100 backdrop-blur">
                  <div className="relative z-10">
                    <h3 className="font-PlayfairDisplay text-xl">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.count}</p>
                  </div>
                  <WebpNextImage src={item.image} alt="" width={110} height={140} className="absolute bottom-0 right-1 h-32 w-24 object-contain" />
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Nearby Boutiques</h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {boutiques.slice(0, 3).map((item, index) => (
                  <article key={item.name} className="overflow-hidden bg-white/92 shadow-xl shadow-emerald-950/5 ring-1 ring-emerald-100 backdrop-blur">
                    <div className="relative h-56 bg-emerald-50">
                      <WebpNextImage src={item.image} alt="" fill className="object-cover object-top" sizes="(max-width: 1280px) 50vw, 260px" />
                      <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 text-xs font-bold text-white">{(index + 2.1).toFixed(1)} km</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold">{item.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Star size={14} fill="currentColor" className="text-emerald-500" /> {item.rating}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="relative min-h-72 overflow-hidden bg-emerald-100 p-5 shadow-xl shadow-emerald-950/10 ring-1 ring-white/80">
              <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:42px_42px]" />
              <MapPin className="absolute left-1/2 top-1/3 text-black" size={34} fill="currentColor" />
              <MapPin className="absolute right-16 top-24 text-black" size={28} fill="currentColor" />
              <MapPin className="absolute bottom-20 left-20 text-black" size={30} fill="currentColor" />
              <button className="absolute bottom-5 left-5 bg-white px-5 py-3 text-sm font-bold shadow">View all on map</button>
              <button className="absolute bottom-5 right-5 bg-emerald-700 p-4 text-white" aria-label="Locate"><Navigation size={20} /></button>
            </div>
          </section>
        </section>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-around bg-white px-5 py-3 shadow-2xl ring-1 ring-emerald-100 lg:hidden">
        {[Home, Search, Plus, CalendarDays, User].map((Icon, index) => (
          <button key={index} className={`${index === 2 ? "bg-emerald-600 text-white" : "text-slate-700"} p-3`} aria-label={`Store action ${index + 1}`}>
            <Icon size={22} />
          </button>
        ))}
      </nav>
      </div>
      <ComingSoonPageOverlay title="Store" kind="store" />
    </main>
  );
}
