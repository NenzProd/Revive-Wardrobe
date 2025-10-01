import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import ImageModal from "../components/ImageModal";
import SizeGuide from "../components/SizeGuide";
import RelatedProducts from "../components/RelatedProducts";
import Newsletter from "../components/Newsletter";
import { Heart, Share2, Truck, Calendar, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { priceSymbol } from "../config/constants";
import ProductReviews from "../components/ProductReviews";

import { useCartStore } from "../stores/useCartStore";
import { useProductBySlug } from "../hooks/useProduct";
import logo from "/logo.png";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import StarRating from "@/components/StarRating";
import { useReviewSummary } from "../hooks/useReviewSummary";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, wishlist, addToWishlist } = useCartStore();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [maxStock, setMaxStock] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Fetch product data based on slug
  const { product, loading, error } = useProductBySlug(slug || "");
  
  // Fetch review summary for the product
  const { summary: reviewSummary } = useReviewSummary(product?._id || "");

  // Set default size and price when product loads
  React.useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedSize(product.variants[0].filter_value || null);
      setDisplayPrice(product.variants[0].retail_price);
      setMaxStock(product.variants[0].stock);
      setQuantity(1);
    }
  }, [product]);

  // Update price when selectedSize changes
  React.useEffect(() => {
    if (product && product.variants && selectedSize) {
      const variant = product.variants.find(
        (v) => v.filter_value === selectedSize
      );
      if (variant) {
        setDisplayPrice(variant.retail_price);
        setSelectedVariant(variant);
        setMaxStock(variant.stock);
        setQuantity(1);
      }
    }
  }, [selectedSize, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <img
          src={logo}
          alt="Loading..."
          className="w-32 h-32 animate-pulse opacity-80"
          style={{ filter: "drop-shadow(0 2px 8px rgba(220,38,38,0.15))" }}
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  const {
    _id,
    name,
    image,
    description,
    type,
    sizes,
    bestseller,
    category,
    variants,
  } = product;

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    if (!selectedVariant || selectedVariant.stock === 0) {
      toast({
        title: "Out of stock",
        description: "Selected size is out of stock",
        variant: "destructive",
      });
      return;
    }
    addToCart({ ...product }, quantity, selectedSize || undefined);
    navigate("/cart");
    toast({
      title: "Added to cart",
      description: `${name} (${quantity}) has been added to your cart`,
    });
  };

  const handleAddToWishlist = () => {
    if (!selectedVariant || selectedVariant.stock === 0) {
      toast({
        title: "Out of stock",
        description: "Selected size is out of stock",
        variant: "destructive",
      });
      return;
    }
    addToWishlist(product);
  };

  // Share button handler
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Product link copied to clipboard.",
    });
  };

  // Modal handlers
  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    
      <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm">
            <li className="mr-2">
              <a href="/" className="text-gray-500 hover:text-revive-red">
                Home
              </a>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li className="mr-2">
              <a href="/shop" className="text-gray-500 hover:text-revive-red">
                Shop
              </a>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li className="text-revive-red">{name}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <ProductImageGallery images={image} onImageClick={handleImageClick} />
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-serif mb-4">{name}</h1>
            <div className="mb-6">
              {/* Reviews rating and count */}
              <div className="flex items-center gap-2">
                {reviewSummary && reviewSummary.totalReviews > 0 ? (
                  <>
                    <StarRating 
                      rating={reviewSummary.averageRating} 
                      readonly 
                      size="md" 
                    />
                    <span className="text-sm text-gray-600">
                      ({reviewSummary.totalReviews} review{reviewSummary.totalReviews !== 1 ? 's' : ''})
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">No reviews yet</span>
                )}
              </div>
            </div>

            <div className="text-2xl font-bold text-revive-red mb-6">
              {priceSymbol}{" "}
              {displayPrice !== null ? displayPrice.toLocaleString() : ""}
            </div>

            

            {/* Size Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.filter_value}
                      className={`px-4 py-2 border ${
                        selectedSize === variant.filter_value
                          ? "border-revive-red bg-revive-red text-white"
                          : "border-gray-300 hover:border-revive-red"
                      } rounded-md transition-colors`}
                      onClick={() => setSelectedSize(variant.filter_value)}
                      disabled={variant.stock === 0}
                    >
                      {variant.filter_value}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    className="text-sm text-revive-gold hover:underline flex items-center"
                    onClick={() =>
                      document
                        .getElementById("sizeGuideModal")
                        ?.classList.remove("hidden")
                    }
                  >
                    <Calendar size={16} className="mr-1" />
                    Size Guide
                  </button>
                  <span className="text-xs font-medium">
                    {selectedVariant?.stock !== undefined ? (
                      selectedVariant.stock > 20 ? (
                        <span className="text-green-600">In stock</span>
                      ) : selectedVariant.stock > 10 ? (
                        <span className="text-yellow-600">
                          Only {selectedVariant.stock} left in stock
                        </span>
                      ) : selectedVariant.stock > 0 ? (
                        <span className="text-red-600 font-semibold">
                          🔥 Hurry! Only {selectedVariant.stock} left
                        </span>
                      ) : (
                        <span className="text-gray-500 line-through">
                          Out of stock
                        </span>
                      )
                    ) : (
                      <span className="text-gray-500">
                        Stock info unavailable
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex border border-gray-300 rounded-md w-32">
                <button
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={selectedVariant?.stock === 0 || quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-full text-center border-0 focus:ring-0 focus:outline-none"
                  value={quantity}
                  readOnly
                />
                <button
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    setQuantity((prev) => Math.min(maxStock, prev + 1))
                  }
                  disabled={
                    selectedVariant?.stock === 0 || quantity >= maxStock
                  }
                >
                  +
                </button>
              </div>
              {selectedVariant?.stock > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {selectedVariant.stock} in stock
                </div>
              )}
              {selectedVariant?.stock === 0 && (
                <div className="text-xs text-red-500 mt-1">Out of stock</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                className="bg-revive-red hover:bg-revive-red/90 flex-1"
                onClick={handleAddToCart}
                disabled={selectedVariant?.stock === 0}
              >
                {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
                onClick={handleAddToWishlist}
                disabled={
                  selectedVariant?.stock === 0 ||
                  wishlist.some((item) => item._id === product._id)
                }
              >
                <Heart size={18} className="mr-2" />
                Wishlist
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
                onClick={handleShare}
              >
                <Share2 size={18} />
              </Button>
            </div>

            {/* Product Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="py-4">
                <div className="text-gray-600 space-y-4">
                  <p>
                    {product.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="py-4">
                <div className="text-gray-600 space-y-4">
                  <p>
                    We ship to most countries worldwide. Delivery times may vary
                    depending on your location.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="py-4">
                <ProductReviews productId={product._id} productName={product.name} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif mb-8 text-center">
            You May Also Like
          </h2>
          <RelatedProducts
            currentProductId={product._id}
            category={product.category}
          />
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuide />

      {/* Image Modal */}
      <ImageModal
        images={image}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialIndex={modalImageIndex}
      />

      <Newsletter />
      <Footer />
    </div>
  );
};

export default ProductDetail;
