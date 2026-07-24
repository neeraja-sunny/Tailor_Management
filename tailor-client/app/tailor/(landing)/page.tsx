"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WebpImage from "@/components/WebpImage";
import { ArrowRight, CalendarDays, FileText, Sparkles, Users } from "lucide-react";

const logos = [
  "/logos/burberry.png",
  "/logos/chanel.png",
  "/logos/dior.png",
  "/logos/fendi.png",
  "/logos/louis.png",
  "/logos/polo.png",
  "/logos/prada.webp",
  "/logos/versace.webp",
];

const features = [
  {
    icon: Users,
    eyebrow: "Customers",
    title: "Every detail, remembered.",
    copy: "Measurements, preferences and order history stay organised in one secure place.",
  },
  {
    icon: CalendarDays,
    eyebrow: "Schedule",
    title: "Deadlines feel effortless.",
    copy: "Plan trials and deliveries with a clear calendar built for a working boutique.",
  },
  {
    icon: FileText,
    eyebrow: "Orders",
    title: "From request to invoice.",
    copy: "Create orders, track progress and prepare professional invoices without extra tools.",
  },
];

const galleryStories = [
  { src: "/landing/pop-1.png", eyebrow: "Materials", title: "Every fabric, remembered.", copy: "Keep preferences and details close to every customer order.", tone: "text-white", shade: "from-black/75 via-black/10 to-transparent" },
  { src: "/landing/pop-2.png", eyebrow: "Craft", title: "Detail deserves clarity.", copy: "Assign specialised work and keep every hand-finished step visible.", tone: "text-white", shade: "from-black/75 via-black/10 to-transparent" },
  { src: "/landing/pop-3.png", eyebrow: "Workshop", title: "One calm place to work.", copy: "Orders, schedules and responsibilities stay organised together.", tone: "text-white", shade: "from-black/80 via-black/15 to-transparent" },
  { src: "/landing/pop-4.png", eyebrow: "Workflow", title: "Know what happens next.", copy: "Track measurements, progress and delivery without the paper chase.", tone: "text-[#1d1d1f]", shade: "from-white/95 via-white/35 to-transparent" },
  { src: "/landing/pop-5.png", eyebrow: "Customers", title: "A personal fit, every time.", copy: "Measurements and preferences return whenever your customer does.", tone: "text-[#1d1d1f]", shade: "from-white/95 via-white/40 to-transparent" },
];

const editorialHeroSlides = [
  { src: "/images/landing/hero-1.jpg", alt: "Bridal couture photographed in the rain" },
  { src: "/images/landing/hero-2.png", alt: "A bridal party in designer lehengas" },
  { src: "/images/landing/hero-3.png", alt: "An ivory bridal look in a quiet interior" },
  { src: "/images/landing/hero-4.png", alt: "A flowing bridal gown in a forest" },
  { src: "/images/landing/hero-5.png", alt: "A red bridal veil in warm evening light" },
    { src: "/images/landing/hero-6.jpg", alt: "A red bridal veil in warm evening light" },

];

export default function TailorLandingPage() {
  const movingLogos = [...logos, ...logos];
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const heroTouchStartX = useRef<number | null>(null);
  const heroDidSwipe = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % editorialHeroSlides.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="font-Poppins overflow-hidden bg-white  text-[#1d1d1f]">
      <section
        className="relative flex h-screen touch-pan-y items-center justify-center overflow-hidden px-5 py-16 md:px-10"
        onClick={(event) => {
          if (heroDidSwipe.current) {
            heroDidSwipe.current = false;
            return;
          }
          if ((event.target as HTMLElement).closest("a, button")) return;
          setActiveHeroSlide((current) => (current + 1) % editorialHeroSlides.length);
        }}
        onTouchStart={(event) => {
          heroDidSwipe.current = false;
          heroTouchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (heroTouchStartX.current === null) return;
          const distance = event.changedTouches[0].clientX - heroTouchStartX.current;
          heroTouchStartX.current = null;
          if (Math.abs(distance) < 45) return;
          heroDidSwipe.current = true;
          setActiveHeroSlide((current) =>
            distance < 0
              ? (current + 1) % editorialHeroSlides.length
              : (current - 1 + editorialHeroSlides.length) % editorialHeroSlides.length,
          );
        }}
      >
        <div className="absolute inset-0 bg-[#171512]" aria-hidden="true">
          {editorialHeroSlides.map((slide, index) => (
            <WebpImage
              key={slide.src}
              src={slide.src}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-[opacity,transform] duration-1000 ease-out ${activeHeroSlide === index ? "scale-100 opacity-100" : "scale-[1.015] opacity-0"}`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" aria-hidden="true" />
        <div className="reveal-on-scroll relative flex-col items-start justify-start z-10 w-full max-w-[1500px] px-3 py-12 text-white sm:px-12 md:py-16">
          {/* <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75 md:text-sm">Boutique management, refined</p> */}
          <h1 className="  mt-4 max-w-[900px] text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[0.95] tracking-[-0.035em]">Your craft. Beautifully organised.</h1>
          <p className=" mt-7 max-w-2xl text-start flex justifty-start leading-7 text-white md:text-xl md:leading-8"   style={{fontWeight:200}}>Bring customers, measurements, orders and payments into one thoughtful workspace made for modern boutiques.</p>
          <div className="mt-9 flex flex-col items-start justify-start gap-3 sm:flex-row">
            <Link href="/auth" className="inline-flex items-center gap-2 border border-white/80 bg-white/5 px-8 py-4 text-sm font-light text-white backdrop-blur-sm transition duration-300 hover:bg-white hover:text-[#151515] md:text-base">Start with TailorPro <ArrowRight size={18} /></Link>
            <a href="#features" className="inline-flex items-center gap-2 px-7 py-4 text-sm font-light text-white transition hover:text-white/65 md:text-base">Explore the workspace <ArrowRight size={17} /></a>
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" aria-label={`Hero image ${activeHeroSlide + 1} of ${editorialHeroSlides.length}`}>
          {editorialHeroSlides.map((slide, index) => (
            <button key={`${slide.src}-control`} type="button" onClick={() => setActiveHeroSlide(index)} aria-label={`Show hero image ${index + 1}`} className={`h-1.5 rounded-full transition-all duration-300 ${activeHeroSlide === index ? "w-8 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"}`} />
          ))}
        </div>
      </section>

      <section aria-label="Fashion brands" className="py-9 md:py-11">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="tailor-logo-marquee flex w-max items-center gap-16">
            {movingLogos.map((src, index) => (
              <WebpImage
                key={`${src}-${index}`}
                src={src}
                alt=""
                className="h-8 w-24 shrink-0 object-contain brightness-0"
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Trusted by boutiques" className="bg-[#f7f6f2] px-6 py-20 md:py-28">
        <div className="reveal-on-scroll mx-auto max-w-[1180px]">
          {/* <div className="mx-auto h-px w-12 bg-emerald-700" aria-hidden="true" /> */}
          <p className="mt-7 text-center text-xl font-light uppercase tracking-[0.24em] text-[#555557] md:text-2xl">Trusted by boutiques</p>
          <div className="mt-12 grid divide-y divide-black/10 text-center md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="px-5 py-9 md:py-5"><AnimatedCount value={360} suffix="+" /><span className="mt-4 block text-sm font-light tracking-[0.08em] text-[#6e6e73] md:text-base">Boutiques</span></div>
            <div className="px-5 py-9 md:py-5"><AnimatedCount value={1200} suffix="+" /><span className="mt-4 block text-sm font-light tracking-[0.08em] text-[#6e6e73] md:text-base">Orders organised</span></div>
            <div className="px-5 py-9 md:py-5"><AnimatedCount value={98} suffix="%" /><span className="mt-4 block text-sm font-light tracking-[0.08em] text-[#6e6e73] md:text-base">Customer satisfaction</span></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1180px] text-center">
         {/* <p className="text-sm font-semibold text-emerald-700">One calm workspace</p> */}
          <h2 className="mx-auto mt-2 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-7xl">
            More time for the work only you can do.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73] md:text-xl">
            TailorPro brings the day-to-day work of your studio together, without making the experience feel complicated.
          </p>
          <div className="mt-16 overflow-hidden bg-[#e8e8ed] shadow-[0_25px_80px_rgba(0,0,0,0.08)] md:mt-20">
            <video
              className="h-[360px] w-full object-cover object-center md:h-[680px]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Tailoring craft in motion"
            >
              <source src="/videos/tailor-craft.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 md:px-8 md:py-36">
        <div className="mx-auto max-w-[1180px] text-center">
          {/* <p className="text-sm font-semibold text-emerald-700">Everything in view</p> */}
          <h2 className="mx-auto  max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-7xl">
            Your boutique, beautifully under control.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73] md:text-xl">
            Orders, measurements, appointments and payments come together in one clear dashboard.
          </p>

        </div>

        <div className="reveal-on-scroll mx-auto mt-16 w-full max-w-[1180px] md:mt-20">
          <WebpImage
            src="/landing/image3.png"
            alt="TailorPro dashboard in a tailoring workshop"
            className="block h-auto w-full"
          />
        </div>
      </section>

      <StoryGallery />

      {/* <section id="features" className="bg-white px-6 py-24 md:py-36">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 border-b border-black/10 pb-12 md:grid-cols-[1fr_2fr] md:items-end md:gap-16 md:pb-16">
            <div>
              <div className="h-px w-12 bg-emerald-700" aria-hidden="true" />
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.26em] text-emerald-700 md:text-sm">
                Built for boutique work
              </p>
              <p className="mt-4 max-w-sm text-base font-light leading-7 text-[#6e6e73]">
                Everything your team needs, without the unnecessary complexity.
              </p>
            </div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#1d1d1f] md:text-6xl">
              Powerful where it matters. Simple everywhere else.
            </h2>
          </div>

          <div className="mt-10 grid border-l border-t border-black/10 md:mt-14 md:grid-cols-3">
            {features.map(({ icon: Icon, eyebrow, title, copy }, index) => (
              <article
                key={title}
                className="group relative flex min-h-[410px] flex-col border-b border-r border-black/10 bg-[#f5f5f7] p-8 transition duration-500 hover:bg-white hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)] md:p-10"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-emerald-700 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
                <div className="flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center border border-emerald-700/30 text-emerald-700 transition duration-500 group-hover:bg-emerald-700 group-hover:text-white">
                    <Icon size={29} strokeWidth={1.4} />
                  </span>
                  <span className="text-sm font-light tracking-[0.18em] text-[#9a9a9f]">0{index + 1}</span>
                </div>
                <div className="mt-auto pt-14">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
                  <h3 className="mt-5 max-w-xs text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#1d1d1f] md:text-4xl">
                    {title}
                  </h3>
                  <div className="mt-6 h-px w-10 bg-emerald-700/50 transition-all duration-500 group-hover:w-20" aria-hidden="true" />
                  <p className="mt-6 max-w-sm text-base font-light leading-7 text-[#6e6e73]">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section> */}

      <section className="bg-[#f5f5f7] px-6 py-24 md:py-36">
        <div className="mx-auto max-w-[1180px]">
          <div className=" max-w-3xl">
            {/* <p className="text-sm font-semibold text-emerald-700">The craft behind every order</p> */}
            <h2 className=" text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Made by hand. Managed with clarity.</h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              { src: "/landing/fabric-texture.jpg", label: "Fabric texture", position: "object-center" },
              { src: "/landing/hand-embroidery.jpg", label: "Hand embroidery", position: "object-center" },
              { src: "/landing/tailoring-tools.jpg", label: "Tailoring tools", position: "object-center" },
            ].map(({ src, label, position }) => (
              <figure key={label} className=" group">
                <div className="overflow-hidden bg-[#e8e8ed]">
                  <WebpImage src={src} alt={label} className={`slow-zoom-image h-[420px] w-full object-cover md:h-[520px] ${position}`} />
                </div>
                <figcaption className="mt-4 text-lg font-semibold text-[#3a3a3c] md:text-xl">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="bg-[#f5f5f7] px-6 py-24 md:py-36">
        <div className=" mx-auto grid max-w-[1180px] gap-10  py-10 md:grid-cols-[320px_1fr] md:items-stretch md:gap-16 md:py-16">
          <div className="relative min-h-[360px] overflow-hidden  md:min-h-[430px]">
            <WebpImage src="/landing/boutique-owner.jpg" alt="Portrait of TailorPro boutique owner Neeraja Sunny" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-700" aria-hidden="true" />
          </div>
          <div className="flex flex-col justify-between py-1 md:py-5">
            <div>
             
              <span className="mt-8 block text-6xl font-light leading-none text-emerald-700/25 md:text-8xl" aria-hidden="true">“</span>
            <blockquote className="-mt-5 max-w-3xl text-3xl font-medium leading-[1.12] tracking-[-0.04em] text-[#000] md:-mt-8 md:text-5xl">
              “TailorPro gives our team more time for fittings, details and the people we design for.”
            </blockquote>
            </div>
            <div className="mt-10 border-t border-black/10 pt-6 [&>p]:!mt-0 [&>p]:!text-[#1d1d1f] [&_span]:!font-light [&_span]:!text-[#6e6e73]">
            <p className="mt-7 text-sm font-semibold text-white/80">Neeraja Sunny <span className="font-normal text-white/45">— Boutique owner, Bengaluru</span></p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="relative min-h-[720px] overflow-hidden text-white md:min-h-[840px]">
        <div className="absolute inset-0 ">
          <WebpImage src="/landing/last-1.png" alt="A red bridal couture look" className="h-full min-h-[360px] w-full object-cover object-center" />
           {/* <WebpImage src="/landing/closing-ivory-bride.jpg" alt="An ivory bridal couture look" className="hidden h-full w-full object-cover object-center md:block" />  */}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[720px] items-end justify-center px-6 pb-16 text-center md:min-h-[840px] md:pb-24">
          <div className="reveal-on-scroll max-w-4xl">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75 md:text-sm">Made for the way boutiques work</p> */}
            <h2 className="font-PlayfairDisplay mt-4 text-5xl font-medium leading-[0.98] tracking-[-0.035em] md:text-7xl">Made with care. Managed with clarity.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-xl md:leading-8">Give every order, fitting and hand-finished detail the attention it deserves.</p>
            <Link href="/auth" className="mt-9 inline-flex items-center gap-2 border border-white/80 bg-white/5 px-9 py-4 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white hover:text-[#151515] md:text-base">Begin with TailorPro <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes tailorLogoMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 2rem)); }
        }
        .tailor-logo-marquee { animation: tailorLogoMarquee 34s linear infinite; }
        @keyframes gentleReveal {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gentleZoom {
          from { transform: scale(1.06); }
          to { transform: scale(1); }
        }
        .reveal-on-scroll {
          animation: gentleReveal both ease-out;
          animation-timeline: view();
          animation-range: entry 10% cover 34%;
        }
        .slow-zoom-image {
          animation: gentleZoom both linear;
          animation-timeline: view();
          animation-range: entry 5% cover 70%;
        }
        .tailor-story-scroller { scrollbar-width: none; }
        .tailor-story-scroller::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) {
          .tailor-logo-marquee { animation-duration: 40s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tailor-logo-marquee { animation: none; }
          .reveal-on-scroll, .slow-zoom-image { animation: none; }
          .tailor-story-scroller { scroll-behavior: auto; }
        }
      `}</style>
    </div>
  );
}

function AnimatedCount({ value, suffix }: { value: number; suffix: string }) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCount(value);
        return;
      }

      const duration = 1600;
      const startedAt = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(value * eased));
        if (progress < 1) window.requestAnimationFrame(animate);
      };
      window.requestAnimationFrame(animate);
    }, { threshold: 0.45 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={counterRef} className="block text-5xl font-extralight leading-none tracking-[-0.045em] text-[#19191a] tabular-nums md:text-7xl">
      {count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

function StoryGallery() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const moveGallery = (direction: 1 | -1) => {
    setActive((current) => (current + direction + galleryStories.length) % galleryStories.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % galleryStories.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section aria-label="TailorPro stories" className="bg-[#f5f5f7] py-24 md:py-32">
      <div className="px-5 text-center md:px-8">
        <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.045em] md:text-7xl">
          Your whole boutique. In motion.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6e6e73]">
          Move from first measurements to final delivery with every detail in view.
        </p>
      </div>

      <div
        className="relative mt-14 h-[470px] pb-20 w-full touch-pan-y overflow-hidden md:mt-18 md:h-[650px]"
        onClick={(event) => {
          if (didSwipe.current) {
            didSwipe.current = false;
            return;
          }
          if ((event.target as HTMLElement).closest("button")) return;
          moveGallery(1);
        }}
        onTouchStart={(event) => {
          didSwipe.current = false;
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(distance) < 45) return;
          didSwipe.current = true;
          moveGallery(distance < 0 ? 1 : -1);
        }}
      >
        {galleryStories.map((story, index) => {
          const rawDistance = index - active;
          const distance =
            rawDistance > galleryStories.length / 2
              ? rawDistance - galleryStories.length
              : rawDistance < -galleryStories.length / 2
                ? rawDistance + galleryStories.length
                : rawDistance;
          const isActive = distance === 0;
          const isNeighbour = Math.abs(distance) === 1;

          return (
            <article
              key={story.title}
              aria-hidden={!isActive}
              className={`absolute left-1/2  top-1/2 h-[80%] w-[78%] max-w-[1180px] overflow-hidden bg-[#ddd] transition-[transform,opacity,filter,box-shadow] duration-1000 ease-in-out ${
                isActive
                  ? "z-20 opacity-100 shadow-[0_20px_55px_rgba(0,0,0,0.28)] blur-0"
                  : isNeighbour
                    ? "z-10 opacity-45 blur-[3px]"
                    : "pointer-events-none z-0 opacity-0 blur-md"
              }`}
              style={{
                transform: `translate(-50%, -50%) translateX(${distance * 82}%) scale(${isActive ? 1 : isNeighbour ? 0.86 : 0.72})`,
              }}
            >
              <WebpImage
                src={story.src}
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${story.shade}`} />
              <div className={`absolute inset-x-0 bottom-0 p-6 sm:p-9 md:p-12 ${story.tone}`}>
                {/* <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-75">{story.eyebrow}</p> */}
                <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">{story.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 opacity-80 md:text-lg md:leading-7">{story.copy}</p>
              </div>
            </article>
          );
        })}

        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" aria-label={`Story ${active + 1} of ${galleryStories.length}`}>
          {galleryStories.map((story, index) => (
            <button
              key={`${story.title}-control`}
              type="button"
              onClick={() => {
                setActive(index);
              }}
              aria-label={`Show ${story.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active === index ? "w-8 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
