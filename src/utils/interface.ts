import { PublicKey } from "@solana/web3.js";
import { BN } from '@coral-xyz/anchor';
export interface IUser {
    username: string;
    user: PublicKey;
    isInitialized: boolean;
    productsCount: number;
}
export interface IProduct {
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
export interface Transaction {
    pid: BN;
    buyer: PublicKey;
    seller: PublicKey;
    timestamp: BN;
    amount: BN;
    quantity: BN;
}
export interface ProgramState {
    owner: PublicKey;
    transactionCount: BN;
    productCount: BN;
    initialized: boolean;
}
export interface GlobalState {
    product: IProduct | null;
    programState: ProgramState | null;
}