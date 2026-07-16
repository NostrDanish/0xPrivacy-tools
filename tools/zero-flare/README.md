# Zero Flare — Self‑hosted Nostr Relayer Stack

Zero Flare gives you a **private, censor‑resistant bridge** for Nostr and Tor services:

- **Tor hidden service** (`onion`) for true anonymous publishing  
- **Snowflake fallback** – when you can’t reach Tor, anonymity still works  
- **Nginx front‑end** – forwards traffic from HTTP/WebSocket port `:8080`

All components run in separate Docker containers, isolated from your host.

## Quick‑start

1. Clone/copy the `zero-flare/` folder onto any Docker-ready machine.

2. (Optional) Copy `config.env.template` to `.env` and set your relay list.

3. Build & run:

```bash
docker compose up -d
```

   Services:
   ```
   tor   → SOCKS5 port 9150
   nginx → HTTP/WebSocket proxy (port 8080) → tor
   snowflake → WebRTC bridge fallback (port 8081)
   ```

4. Point your Nostr client to `ws://localhost:8080` (or `socks5://localhost:9150`).

## How It Works

- **Tor** handles onion routing and SOCKS5 tunneling.  
- **Snowflake** (via separate client) provides a WebRTC bridge for blocked networks.  
- **Nginx** terminates HTTP/WebSocket from your browser and forwards to Tor’s SOCKS5.

## Security

- Containers use read‑only images except for `tor-data` volume.  
- No root privileges required on host (except for NET_ADMIN capability in tor).  
- Update weekly: `docker compose pull && docker compose up -d --force-recreate`

## FAQ

| Q | A |
|---|---|
| Public IP needed? | No. Run on any Docker host. |
| Multiple relays? | Yes – set `RELAYS` in `.env`. |
| Legal? | Tor is legal; Snowflake is protocol-level. |

---
© 2026 0xPrivacy. MIT License. Use responsibly.
