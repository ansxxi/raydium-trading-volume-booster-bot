import { Connection, Keypair, PublicKey, VersionedTransaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import "dotenv/config";
import bs58 from "bs58";
import fetch from "node-fetch";
import { Buffer } from "buffer";

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const PUBLIC_KEY = new PublicKey(process.env.PUBLIC_KEY!);
const TOKEN_MINT = new PublicKey(process.env.TOKEN_MINT!);
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

// ✅ Function to retry API calls on failure
async function fetchWithRetry(fn: Function, retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.error(`⚠️ RPC Fetch Failed. Retrying in ${delay}ms... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    throw new Error("❌ Fetching data failed after multiple retries.");
}

// ✅ Function to get SOL balance
async function getSolBalance(): Promise<number> {
    return fetchWithRetry(async () => {
        const balance = await connection.getBalance(PUBLIC_KEY);
        return balance / 1e9; 
    });
}

// ✅ Function to get FrogKing token balance (Correct Decimal Handling)
async function getTokenBalance(): Promise<number> {
    return fetchWithRetry(async () => {
        const tokenAccount = await connection.getParsedTokenAccountsByOwner(PUBLIC_KEY, { mint: TOKEN_MINT });
        if (tokenAccount.value.length === 0) return 0;
        return parseFloat(tokenAccount.value[0].account.data.parsed.info.tokenAmount.uiAmount);
    });
}

// ✅ Function to execute swaps (Buy or Sell)
async function executeSwap(inputMint: string, outputMint: string, amount: number) {
    try {
        const quoteResponse = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`);
        if (!quoteResponse.ok) {
            console.error(`❌ Swap API Error: ${quoteResponse.status} - ${quoteResponse.statusText}`);
            return;
        }

        const quoteData = await quoteResponse.json();
        console.log("✅ Swap quote received. Requesting transaction...");

        const transactionResponse = await fetch(`https://quote-api.jup.ag/v6/swap`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userPublicKey: PUBLIC_KEY.toBase58(),
                quoteResponse: quoteData,
                wrapAndUnwrapSol: true,
            }),
        });

        if (!transactionResponse.ok) {
            console.error(`❌ Swap API Error: ${transactionResponse.status} - ${transactionResponse.statusText}`);
            return;
        }

        const transactionData = await transactionResponse.json();
        console.log("✅ Swap transaction received. Executing...");

        const swapTransaction = VersionedTransaction.deserialize(Buffer.from(transactionData.swapTransaction, "base64"));
        swapTransaction.sign([keypair]);
        const serializedTx = Buffer.from(swapTransaction.serialize());
        const txId = await sendAndConfirmRawTransaction(connection, serializedTx);

        console.log(`✅ Swap successful! Transaction ID: ${txId}`);
    } catch (error) {
        console.error("❌ Error executing swap:", error);
    }
}

// ✅ Emergency Sell - Sell FrogKing if SOL is too low
async function emergencySell(): Promise<void> {
    try {
        const solBalance = await getSolBalance();
        const tokenBalance = await getTokenBalance();

        console.log(`🔹 Current SOL Balance: ${solBalance.toFixed(6)}`);
        console.log(`🔹 Current FrogKing Balance: ${tokenBalance.toFixed(2)}`);

        if (solBalance >= 0.005) {
            console.log("✅ SOL balance is fine, no emergency sell needed.");
            return;
        }

        if (tokenBalance > 2000) {
            let sellAmountTokens = Math.floor(tokenBalance * 0.9); // Sell 90% of FrogKing tokens

            // ✅ Fix: Convert tokens to base units (Multiply by 10^6)
            const sellAmountBase = Math.floor(sellAmountTokens * 10 ** 6);
            console.log(`⚠️ Selling ${sellAmountTokens.toFixed(6)} FrogKing tokens (Base: ${sellAmountBase}) for SOL...`);
            await executeSwap(TOKEN_MINT.toBase58(), "So11111111111111111111111111111111111111112", sellAmountBase);
        } else {
            console.log("⚠️ Not enough FrogKing tokens to sell.");
        }
    } catch (error) {
        console.error("❌ Error in emergency sell process:", error);
    }
}

// ✅ Function to buy FrogKing tokens (Correct Decimal Handling)
async function buyFrogKing(): Promise<void> {
    try {
        const solBalance = await getSolBalance();

        if (solBalance < 0.005) {
            console.log("⚠️ SOL too low for buying. Selling FrogKing instead...");
            await emergencySell();
            return;
        }

        // 🔹 Buy between 0.0011 and 0.0039 SOL worth of FrogKing
        const buyAmountSol = Math.random() * (0.0039 - 0.0011) + 0.0011;
        console.log(`💰 Buying ${buyAmountSol.toFixed(6)} SOL worth of FrogKing tokens...`);

        await executeSwap("So11111111111111111111111111111111111111112", TOKEN_MINT.toBase58(), Math.floor(buyAmountSol * 1e9));
    } catch (error) {
        console.error("❌ Error buying FrogKing tokens:", error);
    }
}

// ✅ Function to sell FrogKing for SOL (Regular Sale)
async function sellFrogKing(): Promise<void> {
    try {
        const solBalance = await getSolBalance();
        const tokenBalance = await getTokenBalance();

        console.log(`🔹 Current SOL Balance: ${solBalance.toFixed(6)}`);
        console.log(`🔹 Current FrogKing Balance: ${tokenBalance.toFixed(2)}`);

        if (solBalance < 0.005) {
            console.log("⚠️ SOL too low. Running emergency sell first...");
            await emergencySell();
            return;
        }

        if (tokenBalance <= 0) {
            console.log("❌ No FrogKing tokens available for sale.");
            return;
        }

        // 🔹 Sell at least 1,000 FrogKing in a regular sale
        let sellAmountTokens = Math.max(1000, Math.floor(tokenBalance * 0.1));

        // ✅ Convert to base units (Multiply by 10^6)
        const sellAmountBase = Math.floor(sellAmountTokens * 10 ** 6);
        console.log(`💰 Selling ${sellAmountTokens} FrogKing tokens (Base: ${sellAmountBase}) for SOL...`);

        await executeSwap(TOKEN_MINT.toBase58(), "So11111111111111111111111111111111111111112", sellAmountBase);
    } catch (error) {
        console.error("❌ Error selling FrogKing tokens:", error);
    }
}

// ✅ Start the bot
console.log("🚀 Trading bot is starting...");

// ✅ Run Buy & Sell at Different Intervals
setInterval(async () => {
    await buyFrogKing();
}, Math.floor(Math.random() * (30000 - 20000) + 20000)); // Buy every 20-30 sec

setInterval(async () => {
    await sellFrogKing();
}, Math.floor(Math.random() * (60000 - 40000) + 40000)); // Sell every 40-60 sec
