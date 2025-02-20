import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ArrowUpRight, Wallet } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface ProductProps {
  name: string;
  description: string;
  metadata: string;
  price: BN;
  stock: BN;
  timestamp: BN;
  productId: BN;
  seller: PublicKey;
  publicKey: PublicKey;
}

const ProductCard = (product: ProductProps) => {
  const formattedPrice = (Number(product.price) / LAMPORTS_PER_SOL).toFixed(2);
  const stockCount = Number(product.stock);
  const sellerAddress = product.seller.toString();

  return (
    <Card className="w-[350px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
      <TooltipProvider>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={product.metadata}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 backdrop-blur-sm"
          >
            {stockCount} in stock
          </Badge>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger className="text-left">
                <h3 className="text-xl font-bold line-clamp-1">
                  {product.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent>{product.name}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="text-left">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                {product.description}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-md font-bold text-primary">
                  {formattedPrice} <span className="text-base">SOL</span>
                </p>
              </div>
              <Badge variant="outline" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <Tooltip>
                  <TooltipTrigger>
                    {`${sellerAddress.slice(0, 4)}...${sellerAddress.slice(
                      -4
                    )}`}
                  </TooltipTrigger>
                  <TooltipContent>Seller: {sellerAddress}</TooltipContent>
                </Tooltip>
              </Badge>
            </div>

            <Link
              href={`/products/${product.productId}?seller=${product.seller.toBase58()}`}
              passHref
              legacyBehavior
            >
              <Button className="w-full gap-2" variant="secondary">
                View Details
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </TooltipProvider>
    </Card>
  );
};

export default ProductCard;
