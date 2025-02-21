"use client";
import { getAllProducts, getProvider } from "@/services/blockchain";
import { IProduct } from "@/utils/interface";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [products, setProducts] = useState<IProduct[]>([]);
  const program = useMemo(() => {
    if (!publicKey) return null;
    return getProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, sendTransaction, signTransaction]);
  const fet = async () => {
    setProducts(await getAllProducts(program!));
  };
  useEffect(()=>{
    fet()
  },[])

  return (
    <div>
      {publicKey && <Button onClick={() => fet()}>Products</Button>}
      {!publicKey && (
        <p className="text-slate-600 font-mono font-extrabold">
          Login to view products
        </p>
      )}
      <div className="flex p-10 flex-wrap gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.publicKey.toBase58()}
            timestamp={p.timestamp}
            name={p.name}
            description={p.description}
            metadata={p.metadata}
            price={p.price}
            stock={p.stock}
            productId={p.productId}
            seller={p.seller}
            publicKey={p.publicKey}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
