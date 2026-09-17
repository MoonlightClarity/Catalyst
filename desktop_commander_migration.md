# Desktop Commander migration to LocalMCPCommander + Tailscale

**Status:** Current local-agent infrastructure
**Introduced:** 2026-09-16
**Scope:** External LLM access to the Windows workstation; not a Catalyst runtime dependency
**Recommended replacement:** LocalMCPCommander + Tailscale Funnel

Catalyst development previously relied on Remote Desktop Commander / browser-control infrastructure for model access to the local machine. That path has been replaced by **LocalMCPCommander + Tailscale Funnel**, connected to ChatGPT through MCP.

This migration changes how an LLM reaches the workstation. It does **not** change Catalyst's application architecture, persistence model, release format, or local-first behavior. Catalyst remains usable without LocalMCPCommander, Tailscale, ChatGPT, or any MCP server.

## Final architecture

The active path is:

```text
ChatGPT MCP connection
        |
        | HTTPS + OAuth
        v
Tailscale Funnel
https://<your-funnel-hostname>/mcp
        |
        v
LocalMCPCommander
127.0.0.1:8787
        |
        v
Windows / PowerShell / filesystem
        |
        v
Catalyst
%USERPROFILE%\Downloads\Catalyst
```

The MCP runtime itself is isolated under:

```text
%USERPROFILE%\Documents\LocalMCPCommander
```

That folder is the canonical runtime home for the MCP server, launcher, OAuth state, logs, dependencies, and local passphrase material.

## Why the migration was made

Remote Desktop Commander and the earlier browser-connector path added unnecessary moving parts and had inconsistent session behavior. The replacement has a simpler contract:

- ChatGPT connects through one MCP endpoint.
- The MCP server performs local filesystem and PowerShell operations directly.
- Tailscale Funnel provides a stable public HTTPS endpoint without requiring a paid tunnel service or a separately managed domain.
- The server starts automatically at Windows logon.
- OAuth registration survives server and system restarts.
- The model can interact with Catalyst files and the local workstation without requiring UI automation for ordinary filesystem or shell work.

UI automation can still be used when interaction with a graphical application is genuinely required, but it is no longer the default transport for local machine access.

## Canonical MCP folder

The live installation is:

```text
%USERPROFILE%\Documents\LocalMCPCommander
```

Important files include:

```text
.env                 persistent MCP passphrase/token source
passphrase.txt       human-readable local copy of the passphrase
oauth.js             OAuth authorization server implementation
oauth-state.json     persisted OAuth client and refresh-token state
server.js            MCP server
start_mcp.ps1        canonical Windows startup supervisor
logs\                 startup/server/funnel logs
```

Generated/private runtime state is excluded from Git. At minimum, the following remain local:

```text
.env
passphrase.txt
oauth-state.json
logs/
```

The former working copy under `Downloads\localmcpcoder-main` is obsolete once the dedicated-folder configuration has passed reboot validation. It should not be treated as the canonical runtime location.

## Windows startup

Windows Task Scheduler owns automatic startup.

Task name:

```text
LocalMCPCommander
```

The task launches:

```text
%USERPROFILE%\Documents\LocalMCPCommander\start_mcp.ps1
```

with working directory:

```text
%USERPROFILE%\Documents\LocalMCPCommander
```

The logon trigger delay was reduced from **45 seconds to 5 seconds**. The short Task Scheduler delay is intentional because the launcher itself waits for Tailscale readiness.

The startup supervisor:

1. loads or creates the persistent MCP token;
2. synchronizes it to `passphrase.txt`;
3. waits until Tailscale reports the machine online;
4. confirms or configures Tailscale Funnel;
5. checks that port `8787` is not occupied by an unhealthy process;
6. starts `server.js` on `127.0.0.1:8787`;
7. waits for the local `/health` endpoint;
8. remains running as the supervisor so Task Scheduler can restart it after failure.

The observed reboot sequence on 2026-09-16 was approximately:

```text
15:58:58  scheduled task starts
15:59:15  Tailscale reports online
15:59:17  MCP server begins startup
15:59:27  MCP server reports healthy
```

The practical post-login warm-up is therefore roughly **30 seconds** on the current machine. A temporary connection failure immediately after login does not necessarily indicate a broken configuration.

## Tailscale Funnel

The MCP endpoint is provided through Tailscale Funnel. The live hostname is intentionally omitted from public documentation:

```text
https://<your-funnel-hostname>/mcp
```

The local server remains bound to:

```text
http://127.0.0.1:8787
```

Tailscale Funnel exposes the local service publicly over HTTPS. Funnel configuration persists independently of the MCP process, but the public endpoint is only useful once both Tailscale and the local MCP server are ready.

Useful health checks are:

```text
http://127.0.0.1:8787/health
https://<your-funnel-hostname>/health
```

A healthy public endpoint returns HTTP `200` with:

```json
{"status":"ok"}
```

## OAuth persistence

The original MCP implementation stored registered OAuth clients only in memory:

```js
const clients = new Map();
```

That meant every server restart forgot ChatGPT's `client_id`. After a reboot, ChatGPT would attempt to authorize with its previous client ID and receive:

```text
Authorization error: unknown client_id — register first
```

The OAuth implementation was modified so registered clients and refresh-token grants are persisted in:

```text
%USERPROFILE%\Documents\LocalMCPCommander\oauth-state.json
```

Authorization codes and short-lived access tokens remain memory-only. This preserves restart continuity without unnecessarily writing every bearer access token to disk.

The current ChatGPT MCP redirect URI is:

```text
https://chatgpt.com/connector_platform_oauth_redirect
```

The redirect URI must exactly match the value stored for the registered client. A mismatch produces:

```text
Authorization error: redirect_uri does not match the one registered
```

The current ChatGPT MCP client registration is expected to survive both MCP process restarts and full Windows reboots.

## ChatGPT MCP connection

The active ChatGPT integration is a custom MCP connection pointed at the stable LocalMCPCommander endpoint.

This MCP connection is the replacement access path for local machine operations in current development sessions. Its LocalMCPCommander tool surface includes:

- PowerShell command execution;
- text file reads and writes;
- exact file edits;
- directory listing;
- glob and regex search;
- basic machine information;
- task-list persistence for long operations.

The MCP allowed root remains the current Windows user's profile directory:

```text
%USERPROFILE%
```

Access outside that root is blocked.

## Passphrase handling

The MCP passphrase is persistent and stored locally under the dedicated MCP folder. The launcher synchronizes the token from `.env` into:

```text
%USERPROFILE%\Documents\LocalMCPCommander\passphrase.txt
```

The passphrase is required when ChatGPT performs a fresh OAuth authorization. It should not be committed to source control or copied into Catalyst documentation.

`desktop_commander_migration.md` intentionally documents where the passphrase lives, but not its value.

## Expected behavior after reboot

A normal reboot should require no MCP reinstallation, no new OAuth client registration, and no new Tailscale configuration.

Expected sequence:

```text
Windows login
  -> scheduled task begins after ~5 seconds
  -> launcher waits for Tailscale
  -> Funnel becomes available
  -> LocalMCPCommander starts
  -> OAuth state is loaded from oauth-state.json
  -> ChatGPT MCP connection becomes reachable
```

During the first tens of seconds after login, ChatGPT may temporarily report a connection failure or `502`. Before changing configuration, allow the normal Tailscale/MCP startup sequence to complete and retry the connection.

A post-reboot `unknown client_id` error is **not** expected anymore. If it returns, verify that the running server is loading the dedicated `Documents\LocalMCPCommander` copy and that `oauth-state.json` exists and contains the ChatGPT MCP client registration.

## Troubleshooting

### ChatGPT MCP connection cannot connect immediately after login

First suspect startup warm-up. The current observed sequence can take about 30 seconds from Task Scheduler launch to a healthy MCP endpoint.

Check the local health endpoint first. If local health succeeds but the public endpoint fails, investigate Tailscale/Funnel rather than OAuth.

### `unknown client_id — register first`

The running server did not load the expected persisted OAuth registration. Check:

- `oauth-state.json` exists;
- the ChatGPT MCP client entry is present;
- the server process is running from `Documents\LocalMCPCommander` rather than the obsolete Downloads copy.

### `redirect_uri does not match the one registered`

For the current ChatGPT connector, the registered URI should be:

```text
https://chatgpt.com/connector_platform_oauth_redirect
```

After changing `oauth-state.json`, restart the MCP server so the in-memory client map reloads from disk.

### HTTP 502 or connection failure

This occurs before OAuth and usually means the public Funnel has no healthy upstream yet. Check:

1. Tailscale is online;
2. the scheduled task is running;
3. `127.0.0.1:8787/health` returns `ok`;
4. Funnel status points to the expected port;
5. the public `/health` endpoint returns HTTP 200.

### Task Scheduler status `0x41301`

`0x41301` means the scheduled task is currently running. For this supervisor-style task, that is expected and healthy.

## Relationship to Catalyst

LocalMCPCommander + Tailscale is development and agent infrastructure, not part of Catalyst itself.

Catalyst must not acquire a runtime dependency on:

- ChatGPT;
- LocalMCPCommander;
- Tailscale;
- any remote-control or browser-control bridge.

The value of LocalMCPCommander + Tailscale is that an LLM can operate Catalyst and its surrounding development environment more directly and reliably. Catalyst remains a standalone local application with its own persistence, navigation, and LLM-facing documentation.

The relevant Catalyst agent documentation remains:

```text
catalyst.md
llms-navigation.md
```

Those files describe how an LLM uses Catalyst. This document describes how an LLM reaches the workstation that hosts Catalyst.

## Migration outcome

The migration is considered successful when all of the following are true:

- the MCP runtime is isolated under `Documents\LocalMCPCommander`;
- Task Scheduler launches that copy automatically;
- the passphrase persists locally;
- OAuth client registration persists across reboot;
- Tailscale Funnel retains the stable public MCP URL;
- the ChatGPT MCP connection reconnects after normal startup without recreating the connection;
- Catalyst remains independent of the entire access stack.

As of 2026-09-16, those conditions have been demonstrated, with the remaining operational characteristic being a normal post-login warm-up period while Tailscale and the local MCP server initialize.
