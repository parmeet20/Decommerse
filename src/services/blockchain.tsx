import { Decommerse } from "@/conf/decommerse";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import idl from "@/conf/decommerse.json";
import { IProduct, IUser, Transaction } from "@/utils/interface";

const idl_object = JSON.parse(JSON.stringify(idl));
const RPC_URL: string = "https://api.devnet.solana.com";

export const getProvider = (
  publicKey: PublicKey | null,
  signTransaction: unknown,
  sendTransaction: unknown
): Program<Decommerse> | null => {
  if (!publicKey || !signTransaction) {
    return null;
  }
  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new AnchorProvider(
    connection,
    { publicKey, signTransaction, sendTransaction } as unknown as Wallet,
    { commitment: "processed" }
  );

  return new Program<Decommerse>(idl_object, provider);
};

export const getProviderReadonly = (): Program<Decommerse> => {
  const connection = new Connection(RPC_URL, "confirmed");

  const walllet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
    signAllTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
  };

  const provider = new AnchorProvider(
    connection,
    walllet as unknown as Wallet,
    { commitment: "processed" }
  );

  return new Program<Decommerse>(idl_object, provider);
};

export const getUser = async (
  program: Program<Decommerse>,
  creator: PublicKey
): Promise<IUser | null> => {
  const [userProfileStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), creator.toBuffer()],
    program.programId
  );
  const usr = await program.account.userProfile.fetch(userProfileStatePda);
  if (usr.isInitialized) {
    return usr;
  }
  return null;
};

export const createUser = async (
  program: Program<Decommerse>,
  creator: PublicKey,
  username: string
): Promise<TransactionSignature> => {
  const [userProfileStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), creator.toBuffer()],
    program.programId
  );
  const tx = await program.methods
    .createUserProfile(username)
    .accountsPartial({
      userProfile: userProfileStatePda,
      user: creator,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  return tx;
};

export const createProduct = async (
  program: Program<Decommerse>,
  seller: PublicKey,
  name: string,
  description: string,
  metadata: string,
  price: number,
  stock: number
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  const state = await program.account.programState.fetch(programStatePda);
  const pid = state.productCount.add(new BN(1));
  const [productPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("product"),
      seller.toBuffer(),
      pid.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const PRODUCT_PRICE = new BN(price * 1_000_000_000);
  const PRODUCT_STOCK = new BN(stock);
  const tx = await program.methods
    .createProduct(name, description, metadata, PRODUCT_PRICE, PRODUCT_STOCK)
    .accountsPartial({
      product: productPda,
      seller: seller,
      programState: programStatePda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  return tx;
};

export const getAllProducts = async (
  program: Program<Decommerse>
): Promise<IProduct[]> => {
  // Fetch all products
  const products = await program.account.product.all();

  // Map over the products and return them as IProduct[] with 'publicKey' included
  return products.map((product) => ({
    productId: product.account.productId,
    name: product.account.name,
    description: product.account.description,
    metadata: product.account.metadata,
    price: product.account.price,
    stock: product.account.stock,
    timestamp: product.account.timestamp,
    seller: product.account.seller,
    publicKey: product.publicKey, // Add the publicKey to match the IProduct interface
  }));
};
export const fetchProduct = async (
  program: Program<Decommerse>,
  seller: PublicKey,
  pi: number
): Promise<IProduct> => {
  const pid = new BN(pi);
  const [productPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("product"),
      seller.toBuffer(),
      pid.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const product = await program.account.product.fetch(productPda);
  console.log(product);
  const prod: IProduct = {
    name: product.name,
    description: product.description,
    metadata: product.metadata,
    price: product.price,
    stock: product.stock,
    timestamp: product.timestamp,
    productId: product.productId,
    seller: product.seller,
    publicKey: productPda,
  };
  return prod;
};

export const buyProduct = async (
  program: Program<Decommerse>,
  pi: number,
  quantity: number,
  buyer: PublicKey,
  seller: PublicKey
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  const state = await program.account.programState.fetch(programStatePda);
  const tid = state.transactionCount.add(new BN(1));
  const pid = new BN(pi);
  const [productPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("product"),
      seller.toBuffer(),
      pid.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("transaction"),
      buyer.toBuffer(),
      seller.toBuffer(),
      tid.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const stock = new BN(quantity);
  const tx = await program.methods
    .purchaseProduct(pid, stock)
    .accountsPartial({
      buyer: buyer,
      seller: seller,
      product: productPda,
      programState: programStatePda,
      transaction: transactionPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  return tx;
};

export const getAllTransactions = async (
  program: Program<Decommerse>
): Promise<Transaction[]> => {
  const txs = await program.account.transaction.all();
  return txs.map((tx) => ({
    pid: tx.account.pid,
    buyer: tx.account.buyer,
    seller: tx.account.seller,
    timestamp: tx.account.timestamp,
    amount: tx.account.amount,
    quantity: tx.account.quantity,
  }));
};
export const getMyTransactions = async (
  program: Program<Decommerse>,
  publicKey: PublicKey
): Promise<Transaction[]> => {
  const txs = await program.account.transaction.all();
  return txs
    .filter((tx) => tx.account.buyer.toString() === publicKey.toString())
    .map((tx) => ({
      pid: tx.account.pid,
      buyer: tx.account.buyer,
      seller: tx.account.seller,
      timestamp: tx.account.timestamp,
      amount: tx.account.amount,
      quantity: tx.account.quantity,
    }));
};
export const getMyProductTransactions = async (
  program: Program<Decommerse>,
  publicKey: PublicKey
): Promise<Transaction[]> => {
  const txs = await program.account.transaction.all();
  return txs
    .filter((tx) => tx.account.seller.toString() === publicKey.toString())
    .map((tx) => ({
      pid: tx.account.pid,
      buyer: tx.account.buyer,
      seller: tx.account.seller,
      timestamp: tx.account.timestamp,
      amount: tx.account.amount,
      quantity: tx.account.quantity,
    }));
};

export const updateStock = async (
  program: Program<Decommerse>,
  pi: number,
  stock: number,
  seller: PublicKey
): Promise<TransactionSignature> => {
  const pid = new BN(pi);
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  const [productPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("product"),
      seller.toBuffer(),
      pid.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const tx = await program.methods
    .updateProductStock(new BN(stock))
    .accountsPartial({
      product: productPda,
      programState: programStatePda,
      seller: seller,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  return tx;
};
