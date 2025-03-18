# raydium-trading-volume-buster-bot
increase trading volume on radium Dex easy to install and maintain. no scam like otters bots. one file to run everything is clear and easy

Here is your **complete `README.md`** file in one document:  

---

### **📜 README.md - Solana Trading Bot (FrogKing Bot)**  

```md
# 🐸 Solana Trading Bot - FrogKing Bot

This is an **automated trading bot** for Solana that swaps **FrogKing tokens** (`$FROGK`) with SOL based on balance conditions.

## ⚡ Features
✅ **Automated Swaps**: Buys and sells `$FROGK` tokens on Solana  
✅ **Balance Management**: Maintains SOL balance to ensure trades continue  
✅ **Emergency Sell**: Automatically sells `$FROGK` if SOL balance drops too low  
✅ **Customizable Settings**: Swap amounts, delays, and thresholds adjustable  
✅ **Auto-Restart**: Runs **24/7** with **PM2** to restart after failures  

---

## 🛠️ **Installation Instructions**
Follow these steps to install and run `frogking_bot` on your **Ubuntu Server**.

### **1️⃣ Connect to Your Ubuntu Server**
If using a **remote server**, connect via SSH:
```sh
ssh username@your-server-ip
```
For a local Ubuntu server, open a terminal.

---

### **2️⃣ Update System and Install Required Packages**
Ensure your system is updated:
```sh
sudo apt update && sudo apt upgrade -y
```
Install essential dependencies:
```sh
sudo apt install -y curl git build-essential
```

---

### **3️⃣ Install Node.js and npm**
Remove old versions:
```sh
sudo apt remove --purge nodejs npm -y
sudo apt autoremove -y
```
Install **Node.js 18**:
```sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```
Check installation:
```sh
node -v  # Should return v18.x.x
npm -v   # Should return a valid npm version
```

---

### **4️⃣ Clone the Bot Repository**
Navigate to a suitable directory:
```sh
cd ~
mkdir bot_server && cd bot_server
```
Clone the bot:
```sh
git clone your-repo-url .
```
Or manually upload your `bot.ts` and `.env` files via SCP:
```sh
scp -i your-key.pem bot.ts .env ubuntu@your-server-ip:~/bot_server/
```

---

### **5️⃣ Install Dependencies**
Ensure `package.json` exists:
```sh
ls -l package.json
```
If missing, create it:
```sh
nano package.json
```
Paste the following:
```json
{
  "name": "solana-trading-bot",
  "version": "1.0.0",
  "dependencies": {
    "@project-serum/anchor": "^0.24.2",
    "@solana/spl-token": "^0.3.8",
    "@solana/web3.js": "^1.98.0",
    "@types/node-fetch": "^2.6.12",
    "bs58": "^5.0.0",
    "dotenv": "^16.4.7",
    "node-fetch": "^2.7.0",
    "superstruct": "^1.0.3"
  },
  "devDependencies": {
    "@types/node": "^22.13.10",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.2"
  }
}
```
Save and install:
```sh
npm install
```

---

### **6️⃣ Configure `.env` File**
Edit your `.env` file to include:
```sh
nano .env
```
Paste your **real values**:
```
PRIVATE_KEY=your-private-key
PUBLIC_KEY=your-public-key
TOKEN_MINT=your-token-mint-address
```
Save and exit.

---

### **7️⃣ Test the Bot**
Run manually first:
```sh
npx ts-node bot.ts
```
If it **executes swaps correctly**, continue to the next step.

---

## **🚀 Running the Bot Permanently with PM2**
To keep the bot **running 24/7**, use **PM2**.

### **1️⃣ Install PM2**
```sh
npm install -g pm2
```

### **2️⃣ Start the Bot with PM2**
```sh
pm2 start "npx ts-node /home/bot_server/bot.ts" --name frogking_bot
```
Verify it’s running:
```sh
pm2 list
pm2 logs frogking_bot
```

### **3️⃣ Enable Auto-Restart After Reboots**
```sh
pm2 save
pm2 startup
```
PM2 will generate a **startup command**—copy and execute it.

---

## **🎮 Managing the Bot**
✅ **Check Running Bots**
```sh
pm2 list
```
✅ **Restart the Bot**
```sh
pm2 restart frogking_bot
```
✅ **Stop the Bot**
```sh
pm2 stop frogking_bot
```
✅ **Delete the Bot from PM2**
```sh
pm2 delete frogking_bot
```
✅ **View Bot Logs (Real-Time)**
```sh
pm2 logs frogking_bot
```

---

## **⚠️ Troubleshooting**
### ❌ **Bot doesn’t start with PM2**
Try using this command instead:
```sh
pm2 start "npx ts-node /home/bot_server/bot.ts" --name frogking_bot
```
If that doesn’t work, **reinstall PM2**:
```sh
npm install -g pm2
pm2 update
```

### ❌ **Permission Denied Error**
```sh
chmod +x /home/bot_server/bot.ts
sudo chown -R $USER:$USER /home/bot_server
```

### ❌ **Bot Crashes or Fails on Reboot**
Restart manually:
```sh
pm2 resurrect
```
Or restart the bot:
```sh
pm2 start frogking_bot
```

---

## **🎯 Conclusion**
✅ **Your bot is now running on Ubuntu 24/7**  
✅ **Auto-restarts on failures & reboots**  
✅ **Manages SOL & FrogKing balance dynamically**  

🐸 **Enjoy automated trading with FrogKing Bot!** 🚀  
For issues, check logs:  
```sh
pm2 logs frogking_bot
```
or manually restart:
```sh
pm2 restart frogking_bot
```
```

---

### **✅ Your `README.md` is Complete in One File!**
This **single file** contains:
- ✅ **Installation**
- ✅ **Bot Execution**
- ✅ **PM2 Setup**
- ✅ **Troubleshooting**
- ✅ **Complete Command List**

🚀 **Now, save this file as `README.md` in your bot folder (`/home/bot_server`) and you're set!** 🚀  

Let me know if you need **any modifications!** 🎯
