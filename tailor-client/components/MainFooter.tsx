'use client'

import Link from 'next/link'

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Trigger a small scroll event after scrolling
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'))
      }, 100)

      // Update URL hash
      history.replaceState(null, '', id === 'hero' ? '/' : `#${id}`)
    }
  }

  

export default function MainFooter() {
  return (
    <footer className="bg-white/35 border-tcd  px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          {/* <div className="flex items-center gap-2" onClick={() => scrollToSection('hero')} draggable='true'> <img src="/dressmaker.png" className="h-10 w-10" /> <span className="text-xl font-bold"> Tailor<span className="text-emerald-600">Pro</span> </span> </div> */}


          <div
  className="flex items-center cursor-pointer"
  onClick={() => scrollToSection('hero')}
>
  <img
    src="images/Loomiz.png"
    className="h-auto w-[10rem] md:w-[11rem] lg:w-[12rem]"
    alt="TailorPro Logo"
  />
</div>


          <p className="text-gray-600 font-Poppins text-sm">
            Tailoring, ecommerce & social — unified into one modern platform.
          </p>
        </div>

        {/* Products */}
        <div>
            <h4 className="text-xl font-medium text-gray-900 mb-4 font-Poppins">
              Products
            </h4>
            <ul className="space-y-3 text-gray-600 font-medium font-Poppins">
              <li><Link href="/tailor" className="hover:text-[#046C4E] transition">Tailor Pro</Link></li>
              <li><Link href="/store" className="hover:text-[#046C4E] transition">Store</Link></li>
              <li><Link href="/social" className="hover:text-[#046C4E] transition">Social</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-xl font-medium text-gray-900 mb-4 font-Poppins">
              Company
            </h4>
            <ul className="space-y-3 text-gray-600 font-medium font-Poppins">
              <li><Link href="/about" className="hover:text-[#046C4E] transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#046C4E] transition">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#046C4E] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#046C4E] transition">Terms & Conditions</Link></li>
            </ul>
          </div>
        {/* CTA */}
        <div className="flex flex-col justify-between">
          <p className="font-medium text-lg font-Poppins">
            Build. Sell. Connect.
          </p>
          <Link
            href="#products"
            className="mt-4 inline-flex justify-center rounded-xl border-2 border-[#046C4E] text-[#046C4E] px-5 py-2 hover:bg-[#046C4E] hover:text-[#FCF4E1] transition font-Poppins"
          >
            Join Now
          </Link>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-12 font-Poppins">
        © {new Date().getFullYear()} TailorPro. All rights reserved.
      </p>
    </footer>
  )
}
