"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { buyProduct, fetchProduct, getProvider } from "@/services/blockchain";
import { SiSolana } from "react-icons/si";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/utils/interface";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import UpdateStock from "@/components/shared/drawer/UpdateStock";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState<PublicKey | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const program = useMemo(() => {
    if (!publicKey) return null;
    return getProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, sendTransaction, signTransaction]);

  const fetchProductDetails = async () => {
    try {
      if (program && seller) {
        const productData = await fetchProduct(program, seller, Number(id));
        setProduct(productData);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerParam = urlParams.get("seller");
    if (sellerParam) setSeller(new PublicKey(sellerParam));
  }, []);

  useEffect(() => {
    if (seller && program) fetchProductDetails();
  }, [seller, program]);

  const truncateAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
      setTotalPrice((value * Number(product?.price)) / LAMPORTS_PER_SOL);
    }
  };

  const handlePurchase = async () => {
    try {
      if (program && publicKey) {
        if (product && product.seller) {
          const tx = await buyProduct(
            program,
            Number(product.productId),
            Number(quantity),
            publicKey,
            product.seller
          );
          toast({
            title: "Purchase successful",
            description: "Product purchased successfully",
            action: (
              <a
                target="_blank"
                href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}
              >
                Signature
              </a>
            ),
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleDialogClose();
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (!publicKey || !program) {
    return (
      <div className="mt-24 max-w-4xl mx-auto p-4 text-center text-muted-foreground">
        <span className="text-lg font-medium">
          Connect your wallet to view this product
        </span>
      </div>
    );
  }

  if (!product) {
    return <>Product not found</>;
  }

  if (loading) {
    return (
      <div className="mt-24 max-w-4xl mx-auto p-4">
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <Skeleton className="h-9 w-[320px] rounded-lg" />
          </CardHeader>
          <CardContent className="space-y-6">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="h-full w-full rounded-xl" />
            </AspectRatio>
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[120px] rounded-md" />
                  <Skeleton className="h-6 w-[160px] rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-24 max-w-4xl mx-auto p-4">
      <Card className="rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/5 p-8">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {product.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {product.description}
              </CardDescription>
            </div>
            <Badge
              variant={Number(product.stock) > 0 ? "default" : "destructive"}
              className="h-8 px-4 text-sm rounded-lg"
            >
              {Number(product.stock) > 0
                ? `In Stock • ${product.stock} units`
                : "Out of Stock"}
            </Badge>
          </div>
        </CardHeader>

        <Separator className="bg-border/50" />

        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Price
                </Label>
                <div className="text-xl flex items-center font-bold text-primary">
                  <SiSolana className="mr-2" />
                  {(Number(product.price) / LAMPORTS_PER_SOL).toLocaleString()}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Product Details
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Product ID</div>
                      <div className="font-mono text-sm">
                        {Number(product.productId)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Listed Date</div>
                      <div className="text-sm">
                        {new Date(
                          Number(product.timestamp) * 1000
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Addresses
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Seller</div>
                      <div className="font-mono text-sm">
                        {truncateAddress(product.seller.toString())}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Product</div>
                      <div className="font-mono text-sm">
                        {truncateAddress(product.publicKey.toString())}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Product Image
                </Label>
                {product.metadata && product.metadata.includes("http") ? (
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-muted rounded-xl overflow-hidden"
                  >
                    <img
                      src={product.metadata}
                      alt={product.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </AspectRatio>
                ) : (
                  <div className="bg-muted p-6 rounded-xl">
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                      {product.metadata}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
          {publicKey.toBase58() === product.seller.toBase58() && (
            <UpdateStock seller={publicKey} pid={Number(product.productId)} st={Number(product.stock)} />
          )}
        </CardContent>

        <CardFooter className="p-8 bg-muted/5">
          <div className="flex w-full justify-end gap-4">
            <Button variant="outline" onClick={fetchProductDetails}>
              Refresh Details
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={Number(product.stock) === 0}
                  onClick={handleDialogOpen}
                >
                  {Number(product.stock) > 0 ? (
                    <span>Buy Now</span>
                  ) : (
                    "Sold Out"
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Quantity</DialogTitle>
                </DialogHeader>
                <div>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min={1}
                    max={product.stock}
                  />
                  <div className="mt-4">
                    Total Price:{" "}
                    <span className="font-bold flex items-center space-x-2 text-primary">
                      <SiSolana className="mr-2" />
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      handlePurchase();
                    }}
                  >
                    Confirm Purchase
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
