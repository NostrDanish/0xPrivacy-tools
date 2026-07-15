# 0xPrivacy Tools

Privacy-first, client-side tools. No backend, no accounts, no tracking.
The privacy equivalent of a Swiss Army knife.

## Philosophy
- **Zero backend.** Every tool runs entirely in your browser.
- **No network calls** in crypto/utility tools. Vendored libs, no CDN.
- **Offline-first PWA.** Install once; works offline after first visit.
- **Open source** under MIT. Self-hostable on any static host.

## MVP tools (shipped)
| Tool | Path | Notes |
|------|------|-------|
| Password & Passphrase | `tools/password/` | Diceware (EFF short 1296) + random; `crypto.getRandomValues` |
| Hash Calculator | `tools/hash/` | SHA-256 + BLAKE3 via `@noble/hashes`; MD5 vendored for verification only |
| Converters | `tools/converters/` | Base64, URL, bech32, npub↔hex |
| Dev Utils | `tools/devutils/` | JSON format, Unix time, UUID v4 |
| Offline QR | `tools/qrcode/` | BTC / XMR / Nostr / Wi-Fi / text; vendored qrcode.js |
| Metadata Cleaner | `tools/metadata/` | Canvas re-encode strips EXIF from images |

## Roadmap (client-side)
Network tools (DNS/WebRTC leak, Tor/I2P checks), Nostr tools (NIP lookup,
relay health, event decoder), and the `0x*` originals (0xSearch, 0xPaste,
0xDrop, 0xScan, 0xLeaks, 0xRelay, 0xVerify, 0xVault, 0xMirror, 0xShare,
0xDev, 0xIdentity).

## Hosting
Static only. Deploy to Cloudflare Pages / any static host. Optional IPFS
mirror for resilience.

## Repo
https://github.com/NostrDanish/0xPrivacy-tools
