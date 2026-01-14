import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import images
import img1 from "@/assets/img/carasoul images/ethinci elegance (1).jpeg";
import img2 from "@/assets/img/carasoul images/ethinci elegance (2).jpeg";
import img3 from "@/assets/img/carasoul images/ethinci elegance (3).jpeg";
import img4 from "@/assets/img/carasoul images/ethinci elegance (4).jpeg";

const EthnicElegance = () => {
  const images = [img1, img2, img3, img4];

  return (
    <section className="py-8 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header - Minimalist */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 border-b border-gray-100 pb-2 md:pb-4 text-center md:text-left">
          <div>
            <h2 className="text-xl md:text-4xl font-serif text-gray-900 mb-1 md:mb-2 tracking-tight">
              Ethnic Elegance
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              Discover tradition tailored for you.
            </p>
          </div>
          <Link to="/shop/category/ethnic-elegance" className="hidden md:block">
            <Button
              variant="link"
              className="text-revive-red font-normal hover:text-revive-red hover:underline underline-offset-4 px-0"
            >
              View All Collection &rarr;
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <div className="w-full px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link
                    to="/shop/category/ethnic-elegance"
                    className="block group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50">
                      <img
                        src={image}
                        alt={`Ethnic Elegance ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-12" />
          </Carousel>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/shop/category/ethnic-elegance">
            <Button
              variant="outline"
              className="w-full border-revive-red text-revive-red hover:bg-revive-red hover:text-white"
            >
              View All Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EthnicElegance;
