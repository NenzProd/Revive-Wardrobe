import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Hand } from "lucide-react";
import { CashbackImage, SilkSleepwear } from "../assets/assets";

const CashbackBanner = () => {
  return (
    <section className="bg-white overflow-hidden">
      <div className="w-full">
        <div className="container mx-auto px-4 py-2 md:py-4">
          <div className="flex flex-row h-[30vh] md:h-[60vh] gap-3 md:gap-8 items-center">
            <div
              className="w-[60%] md:w-[70%] h-full relative perspective-[10 100px] animate-slide-in-left opacity-0 fill-mode-forwards"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative w-full h-full transform-style-3d animate-flip-vertical rounded-xl">
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-gray-200">
                  <img
                    src={CashbackImage}
                    alt="Model styling abaya"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 md:p-6 text-white backface-hidden">
                    <h3 className="text-xs md:text-xl font-serif">
                      Signature Collection
                    </h3>
                  </div>
                </div>

                <div className="absolute inset-0 w-full h-full backface-hidden rotate-x-180 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={SilkSleepwear}
                    alt="Dress detail view"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 md:p-6 text-white backface-hidden">
                    <h3 className="text-xs md:text-xl font-serif">
                      Exquisite Detail
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[40%] md:w-[30%] flex flex-col justify-center items-start text-left space-y-2 md:space-y-6">
              <div className="relative flex flex-col gap-1">
                <span className="text-gray-500 text-[10px] md:text-sm uppercase tracking-[0.3em] font-sans ml-1">
                  Exclusive
                </span>
                <h2 className="text-4xl md:text-8xl font-serif text-revive-red leading-[0.8] tracking-tight">
                  2026
                </h2>
                <span className="text-gray-900 text-xs md:text-2xl font-light font-sans uppercase tracking-widest ml-0.5 md:ml-2">
                  New Year Offer
                </span>

                <div className="flex items-center gap-2 justify-start mt-2 md:mt-4">
                  <div className="bg-revive-red/10 border border-revive-red/20 px-3 py-1 md:px-6 md:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-sm md:text-3xl font-bold text-revive-red whitespace-nowrap">
                      20% Cashback
                    </span>
                  </div>
                  <Heart className="w-4 h-4 md:w-8 md:h-8 text-revive-red fill-current animate-zoom-pulse" />
                </div>
              </div>

              <p className="hidden md:block text-gray-600 text-sm md:text-lg font-serif italic leading-relaxed max-w-sm border-l-2 border-revive-red/30 pl-4">
                "Experience the luxury of modest fashion with exclusive
                rewards."
              </p>

              <div className="relative group self-start">
                <Link to="/contact">
                  <Button className="w-full md:w-auto relative px-4 py-2 md:px-6 md:py-3 h-auto rounded bg-revive-red text-white font-medium text-sm hover:bg-opacity-90 transition-all overflow-visible">
                    <span className="relative z-10 flex items-center gap-2 md:gap-3 whitespace-nowrap">
                      Claim
                      <span className="hidden md:inline">Reward</span>
                      <Hand className="w-4 h-4 md:w-5 md:h-5 text-revive-gold animate-pulse" />
                    </span>
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
