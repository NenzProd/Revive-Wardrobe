import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "@/lib/buttonStyles";

const StorytellingSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f5efe6] py-20 md:py-28">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#d9c6a6]/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#c79b7a]/30 blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#7b4d2e] font-semibold">
              The Revive Wardrobe Story
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-serif text-[#2b1b13] leading-tight">
              Crafted for Women Who Lead With Grace, Presence, and Purpose
            </h2>
            <p className="mt-5 text-[#4b3529] leading-relaxed md:text-lg max-w-2xl">
              Every drop is curated around mood, movement, and occasion. From Dubai luxury evenings
              to family celebrations, our abayas and Pakistani wear are designed to feel effortless,
              regal, and deeply personal.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop/category/graceful-abayas">
                <Button className={`${PRIMARY_BUTTON_CLASS} px-6 py-6 rounded-md tracking-wide`}>
                  Shop Graceful Abayas
                </Button>
              </Link>
              <Link to="/shop/category/ethnic-elegance">
                <Button variant="outline" className={`${SECONDARY_BUTTON_CLASS} px-6 py-6 rounded-md tracking-wide`}>
                  Explore Ethnic Elegance
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Express Delivery",
                desc: "UAE priority processing with real-time support for urgent occasion orders.",
              },
              {
                title: "Limited Batch Drops",
                desc: "Popular sizes move fast. New arrivals are released in small, premium capsules.",
              },
              {
                title: "Luxury Fabric Selection",
                desc: "Carefully selected drape and finish for comfort in warm climates and formal settings.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#7b4d2e]/15 bg-white/90 p-5 shadow-[0_10px_30px_rgba(90,55,34,0.08)] animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <h3 className="font-semibold text-[#2b1b13] text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-[#5f4639]">{item.desc}</p>
              </div>
            ))}

            <div className="rounded-xl border border-[#a51c30]/25 bg-[#a51c30]/8 px-5 py-4 text-[#7f1424] text-sm font-medium animate-pulse">
              Scarcity alert: Signature designs can sell out before weekend. Secure your size today.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;
