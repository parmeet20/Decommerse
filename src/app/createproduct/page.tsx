"use client";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, getProvider } from "@/services/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer"),
  image: z.any().refine((file) => file?.size > 0, "Image is required"),
});

const CreateProductPage = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { publicKey, sendTransaction, signTransaction } = useWallet();

  const program = useMemo(() => {
    if (!publicKey) return null;
    return getProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, sendTransaction, signTransaction]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        form.setValue("image", file);
      }
    },
  });

  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
          },
        }
      );
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error("IPFS Upload Error:", error);
      throw new Error("Failed to upload image to IPFS");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setIsUploading(true);
      const ipfsUrl = await uploadToIPFS(values.image);

      const productData = {
        ...values,
        image: ipfsUrl,
        price: Number(values.price),
        stock: Number(values.stock),
      };
      const tx = await createProduct(
        program!,
        publicKey!,
        productData.title,
        productData.description,
        productData.image!,
        productData.price,
        productData.stock
      );
      console.log("Product Created:", tx);
      toast({
        title: "Product created",
        description: "Product created successfully!",
        action: (
          <a
            target="_blank"
            href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}
          >
            Signature
          </a>
        ),
      });
      form.reset();
      setPreview(null);
    } catch (error) {
      console.error("Form Submission Error:", error);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 shadow-xl m-24 mx-5 border rounded-3xl max-w-2xl sm:mx-auto min-h-[600px]">
      <h1 className="text-3xl font-bold mb-8">Create New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload */}

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <input {...getInputProps()} />
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 mx-auto mb-4 rounded-lg"
                      />
                    ) : (
                      <p>Drag & drop an image here, or click to select</p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full flex items-center"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin mr-2" />}
            {isUploading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProductPage;
