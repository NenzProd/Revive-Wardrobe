import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MoonStar, Sparkles, Timer } from "lucide-react";
import { CashbackImage, GracefulAbayas } from "../assets/assets";
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "@/lib/buttonStyles";

const CashbackBanner = () => {
  return (
    <section className="bg-[#f8f3ea] overflow-hidden py-6 md:py-10">
      <div className="container mx-auto px-3 md:px-4">
        <div className="relative rounded-3xl border border-[#7b4d2e]/15 bg-gradient-to-r from-[#2a1a14] via-[#3a2319] to-[#2a1a14] p-4 md:p-8 text-white shadow-[0_25px_55px_rgba(0,0,0,0.25)]">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-red-400/10 blur-3xl" />

          <div className="relative grid md:grid-cols-[1.1fr_1fr] gap-5 md:gap-8 items-center">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="rounded-2xl overflow-hidden border border-white/20">
                <img src={CashbackImage} alt="Ramzan luxury collection" className="w-full h-48 md:h-64 object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/20">
                <img src={GracefulAbayas} alt="Graceful abayas" className="w-full h-48 md:h-64 object-cover object-top" />
              </div>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                <MoonStar size={14} /> Ramzan Special
              </p>
              <h2 className="mt-4 text-3xl md:text-6xl font-serif leading-[0.92]">Ramzan Offer 2026</h2>
              <p className="mt-4 text-white/85 leading-relaxed md:text-lg">
                Celebrate the season with premium modest wear and exclusive rewards curated for festive nights and family gatherings.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-amber-300/50 bg-amber-300/15 px-4 py-2 text-sm md:text-xl font-semibold text-amber-100 inline-flex items-center gap-2">
                  <Sparkles size={16} /> Up to 20% Cashback
                </div>
                <div className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs md:text-sm inline-flex items-center gap-2">
                  <Timer size={14} /> Limited festive window
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop/category/graceful-abayas">
                  <Button className={`${PRIMARY_BUTTON_CLASS} px-6 py-5 rounded-md`}>Shop Abayas</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className={`${SECONDARY_BUTTON_CLASS} px-6 py-5 rounded-md`}>
                    Claim Ramzan Reward
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CashbackBanner;
