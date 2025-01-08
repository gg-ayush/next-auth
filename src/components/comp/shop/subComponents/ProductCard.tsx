import React from "react";
import Image from "next/image";
import { Button } from "@/src/ui/button/button";
import { Badge } from "@/src/ui/badge";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
  isMobile: boolean;
  cartQuantity: number;
  onAddToCart: (productId: number, productType: string) => void;
  onSelectProduct?: (product: Product) => void;
  productType: "physical" | "virtual";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isMobile,
  cartQuantity,
  onAddToCart,
  onSelectProduct,
  productType,
}) => {
  return (
    <div
      className={`border border-gray-200/30 rounded-lg bg-white text-black shadow-sm cursor-pointer ${
        isMobile ? "h-[220px]" : "h-[300px]"
      } flex flex-col`}
      onClick={onSelectProduct ? () => onSelectProduct(product) : () => {}}
    >
      <div className="relative overflow-hidden h-[222px]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="hover:scale-110 transition-transform duration-300 object-contain"
          unoptimized
          loading="lazy"
        />
      </div>
      <div className="p-2 flex flex-col justify-between flex-grow">
        <h3 className="font-semibold text-xs sm:text-sm truncate">
          {product.name}
        </h3>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product.id, productType);
          }}
          className="w-full relative text-xs"
          size="sm"
          variant="black"
        >
          <span className="text-yellow-400 mr-1">$</span>
          {product.price.toFixed(2)}
          <span className="absolute right-2">
            {cartQuantity > 0 && (
              <Badge
                variant="cool"
                className="ml-1 text-xs rounded-md text-black"
              >
                {cartQuantity}
              </Badge>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
