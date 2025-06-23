import bs58 from 'bs58';
import { writeFileSync } from 'fs';

const base58Key = 'NK81G6NHvhnCWSFUwcnY71VSjD6U3WPkaAT3rNpBB9AkwNyJvAQz3H73rNn6SdWBaTxG7ciJDV1BDVaLpwZBqJy'; // 🔑 Paste your private key here

const decoded = bs58.decode(base58Key);

writeFileSync('wallet.json', JSON.stringify(Array.from(decoded)));

console.log('✅ wallet.json saved successfully.');
