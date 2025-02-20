"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  createUser,
  getMyProductTransactions,
  getMyTransactions,
  getProvider,
  getUser,
} from "@/services/blockchain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo, useState } from "react";
import { IUser, Transaction } from "@/utils/interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [userState, setUserState] = useState<IUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myProdutTransactions, setMyProdutTransactions] = useState<
    Transaction[]
  >([]); // Store transactions here

  // Memoize the program object to avoid unnecessary recalculations
  const program = useMemo(() => {
    if (!publicKey) return null;
    return getProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, sendTransaction, signTransaction]);

  // Fetch user state from the blockchain
  const getUserState = async () => {
    if (program && publicKey) {
      try {
        const user = await getUser(program, publicKey);
        setUserState(user);
      } catch (error) {
        console.log("Error fetching user state:", error);
      }
    }
  };

  // Handle username submission and user creation
  const handleUsernameSubmit = async () => {
    if (!username) return;
    try {
      setLoading(true);
      const tx = await createUser(program!, publicKey!, username);
      toast({
        title: "User initialized",
        description: "User initialized successfully",
        // action: (<a href={``}>signature</a>),
      });
      console.log(tx);
    } catch (error) {
      console.log("Error during user creation:", error);
      toast({
        title: "Error",
        description: "There was an error while initializing the user.",
      });
    } finally {
      setLoading(false);
      setIsDialogOpen(!isDialogOpen);
    }
  };

  // Fetch transactions and set them in state
  const fetMyTxs = async () => {
    try {
      const txs = await getMyTransactions(program!, publicKey!);
      setTransactions(txs); // Set transactions to state
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }
  };
  const fetMyProTxs = async () => {
    try {
      const txs = await getMyProductTransactions(program!, publicKey!);
      setMyProdutTransactions(txs); // Set transactions to state
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }
  };

  // Effect to fetch user state after the program is set
  useEffect(() => {
    if (program && publicKey) {
      getUserState();
      fetMyTxs();
      fetMyProTxs();
    }
  }, [program, publicKey]);

  if (userState) {
    return (
      <div className="max-w-6xl mx-auto mt-24 px-4 py-8">
        <div className="flex flex-col md:flex-col gap-6">
          {/* Profile Card */}
          <Card className="w-full md:max-w-xs">
            <CardHeader>
              <CardTitle className="text-xl">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-white">
                    {userState.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {userState.username}
                  </h2>
                  <p className="text-muted-foreground">
                    {publicKey?.toString().slice(0, 6)}...
                    {publicKey?.toString().slice(-4)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    {" "}
                    <span className="text-muted-foreground">
                      Products Purchased
                    </span>
                    <span className="font-medium">{transactions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Products Sold</span>
                    <span className="font-medium">
                      {myProdutTransactions.length}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={fetMyTxs}>
                Refresh Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Transactions Table */}

          {transactions.length === 0 ? (
            <div className="text-2xl font-semibold">No purchase trancactions found</div>
          ) : (
            <div className="border rounded-2xl overflow-hidden">
              <ScrollArea className="h-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          #{Number(tx.pid)}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px]">
                          {tx.buyer.toString()}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px]">
                          {tx.seller.toString()}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            Number(tx.timestamp) * 1000
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {(Number(tx.amount) / LAMPORTS_PER_SOL).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(tx.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
                <Separator className="my-4" />

          {myProdutTransactions.length === 0 ? (
            <div className="text-2xl font-semibold">No products sold transactions found</div>
          ) : (
            <div className="border rounded-2xl overflow-hidden">
              <ScrollArea className="h-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myProdutTransactions.map((tx, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          #{Number(tx.pid)}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px]">
                          {tx.buyer.toString()}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px]">
                          {tx.seller.toString()}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            Number(tx.timestamp) * 1000
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {(Number(tx.amount) / LAMPORTS_PER_SOL).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(tx.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Initialize Your Profile</h1>
        <Button size="lg" onClick={() => setIsDialogOpen(true)}>
          Get Started
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-lg"
              />
              <Button
                size="lg"
                onClick={handleUsernameSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
