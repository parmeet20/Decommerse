"use client";
import React, { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getProvider, updateStock } from "@/services/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { toast } from "@/hooks/use-toast";

interface UpdateStockProps {
  pid: number;
  seller: PublicKey;
  st:number;
}

const UpdateStock: React.FC<UpdateStockProps> = ({ pid, seller, st }) => {
  const [stock, setStock] = useState(st);
  const [customValue, setCustomValue] = useState("");
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const program = useMemo(() => {
    if (!publicKey) return null;
    return getProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, sendTransaction, signTransaction]);

  const updateStockHandler = async () => {
    const tx = await updateStock(program!, pid, stock, seller!);
    toast({
      title: "Success",
      description: "Stocks updated succssfully.",
      action: (
        <a
          target="_blank"
          href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}
        >
          Signature
        </a>
      ),
    });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(customValue);
    if (!isNaN(value) && value >= 0) {
      setStock(value);
    }
    setCustomValue("");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Manage Inventory</Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-2xl">Inventory Control</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 space-y-6">
          {/* Stock Controls */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 shadow-sm"
                onClick={() => setStock(Math.max(0, stock - 1))}
                disabled={stock <= 0}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease stock</span>
              </Button>

              <div className="text-center space-y-1">
                <div className="text-5xl font-bold">
                  {stock}
                </div>
                <Label className="text-sm font-medium text-muted-foreground">
                  CURRENT STOCK
                </Label>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 shadow-sm"
                onClick={() => setStock(stock + 1)}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase stock</span>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Custom Stock Input */}
            <form onSubmit={handleCustomSubmit} className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customStock" className="text-sm font-medium">
                  Custom Quantity
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="customStock"
                    type="number"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="Enter custom quantity"
                    className="h-10"
                    min={0}
                  />
                  <Button type="submit" className="h-10">
                    Apply
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <DrawerFooter className="pt-6">
          <Button
            size="lg"
            onClick={() => updateStockHandler()}
            className="h-12 text-base"
          >
            Confirm Stock Update
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="h-12 text-base">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UpdateStock;
