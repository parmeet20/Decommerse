# 🚀 Decommerse

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Next.js](https://img.shields.io/badge/Framework-Next.js-black.svg)](https://nextjs.org/) [![Solana](https://img.shields.io/badge/Blockchain-Solana-blue.svg)](https://solana.com/)  

<p align="center">
  <img src="https://github.com/user-attachments/assets/acc938c7-c36b-4d88-9cc7-8f46cc7e49f1" alt="Decommerse Demo" width="800" />
</p>

An interactive decentralized marketplace on Solana, powered by Next.js and Solana Wallet Adapter.

---

## ✨ Features

- 🔐 **Digital Identity**: Mint an on-chain profile to manage your presence.
- 📦 **Product Management**: Create, list, and update stock in real time.
- 💸 **Seamless Purchases**: Buy products with SOL; stock auto-decrements.
- 📊 **Transaction History**: Track all incoming & outgoing SOL transfers.
- 🦸 **Wallet Integration**: Connect via Phantom or any Solana-compatible wallet.

---

## 🛠️ Frontend Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/parmeet20/Decommerse.git
   cd Decommerse/frontend
   npm install
   ```

2. **Configure Environment**
   Create a `.env.local` file in the `frontend/` folder with the following variables:
   ```ini
   NEXT_PUBLIC_PINATA_API_KEY=<YOUR_PINATA_API_KEY>
   NEXT_PUBLIC_PINATA_SECRET_API_KEY=<YOUR_PINATA_SECRET_API_KEY>
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Explore**
   Open your browser at [http://localhost:3000](http://localhost:3000) and connect your wallet to get started!

---

> **Tip:** Use `solana airdrop 2` to fund your devnet wallet if you’re low on SOL.

---

<details>
<summary>💡 Why Decommerse?</summary>

- Leverages Solana’s low fees and high throughput.
- Built with modern tools for a smooth developer experience.
- Modular architecture: swap smart contracts or UI components easily.

</details>

