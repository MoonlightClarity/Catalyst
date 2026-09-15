# Optional development tooling

Status: optional developer convenience. None of the tools on this page are required to build, run, or use Catalyst.

Catalyst remains local-first and non-proprietary. Assistant integrations are development aids, not product dependencies, persistence backends, or runtime services.

## Opera Browser Connector

Purpose: inspect the locally rendered Catalyst web UI, read the accessibility tree, capture screenshots, and navigate browser tabs during development.

Current Windows setup:

1. Install Opera One or Opera GX and sign in to an Opera account.
2. Enable **Early Bird** in Opera settings.
3. Enable **Browser Connector in toolbar** and **Browser Connector** under Early Bird.
4. Search Opera settings for **AI Services** and install/enable Browser Connector if prompted.
5. Open the Browser Connector toolbar panel and enable **Allow AI connection**.
6. Connect the Opera Browser Connector plugin in ChatGPT.
7. Run Catalyst locally, normally at `http://127.0.0.1:5173/`.

Early Bird is currently required for the connector controls to appear and is easy to miss during setup.
## Remote Desktop Commander

Purpose: allow an explicitly authorized development session to inspect/edit Catalyst files, run PowerShell/npm commands, manage development processes, and execute the local validation loop without manual command relay.

Start the device agent from a terminal:

```powershell
npx @wonderwhy-er/desktop-commander@latest remote
```

Operational rules:

- the agent runs in the foreground; keep that terminal open for the session;
- stopping the process or closing the terminal ends machine access;
- do not configure automatic startup for Catalyst development;
- prefer session-scoped use and stop the agent when work is complete;
- the agent operates with the permissions of the logged-in Windows user;
- restrict allowed directories to the Catalyst workspace when practical;
- do not treat Desktop Commander restrictions as a security sandbox.

The ChatGPT integration uses Desktop Commander's remote MCP service/relay. Do not use this optional integration with sensitive operational datasets merely because Catalyst itself supports local/private work.
## Catalyst Chat Bridge and conversation recovery

Purpose: allow a fresh development conversation to query an older ChatGPT thread when a long conversation becomes unstable or crashes. Opera Browser Connector supplies read/navigation access; the local unpacked bridge supplies the missing draft/send action.

The extension lives under 	ools/chatgpt-bridge-extension/ for local development. Its command key is local secret material and must not be published or included in a shared source/archive package. Reload the unpacked extension from `opera://extensions/` after changing its source.

Use direct read-only retrieval first. Send a targeted question into an old thread only when inspection is insufficient. The complete recovery procedure, source-of-truth order, limitations, and proactive rollover procedure are in `conversation-continuity.md`.

## Recommended assistant development sequence

1. Start Catalyst dependencies once with `install.ps1` when needed.
2. Start the Remote Desktop Commander device agent only for sessions that need local command/file access.
3. Start Catalyst with `run.ps1 -Web`.
4. Connect Opera Browser Connector for rendered UI inspection.
5. Use `npm test` and `npm run build` as the code gate before browser QA.
6. Stop the Remote Desktop Commander agent when the session ends.

`run.ps1` checks for both `node_modules` and the local Vite executable before assuming dependencies are usable. With `-SkipInstall`, an incomplete dependency tree is reported explicitly instead of failing later with a misleading `vite is not recognized` error.

## Trust boundary

These tools may increase developer convenience, but they must not redefine Catalyst's product architecture. Catalyst must continue to run without ChatGPT, Opera Browser Connector, Remote Desktop Commander, hosted AI services, or any account-based development integration.

## Agent Workbench profile boundary

A browser-visible Linux GUI workbench is available as optional development infrastructure. It is external to Catalyst runtime and lives at `C:\Users\iris\AgentWorkbench`.

**Catalyst work must use the Catalyst profile.** Before using the workbench, read:

- `C:\Users\iris\AgentWorkbench\catalyst\profile.json`
- `C:\Users\iris\AgentWorkbench\catalyst\state\current.json`
- `C:\Users\iris\AgentWorkbench\README.md`

The validated Catalyst profile currently uses X display `:99`, VNC `127.0.0.1:5902`, and noVNC `127.0.0.1:6080`. Its canonical start/stop/control scripts remain at the root of `C:\Users\iris\AgentWorkbench`.

A separate **general-purpose** profile exists under `C:\Users\iris\AgentWorkbench\general` and uses X display `:98`, VNC port `5912`, and noVNC port `6081`. That profile is for non-Catalyst chats and must not be substituted for the Catalyst profile merely because it is available.

Operational rule: a Catalyst chat must not start, stop, reconfigure, or reuse the general profile unless the user explicitly asks it to. Likewise, non-Catalyst work should use the general profile rather than the Catalyst `:99 / 5902 / 6080` instance. The profiles are deliberately separate so they can coexist without one chat disturbing another.

## Workbench Linux v2 experiment — 2026-09-11

The current Xvfb workbench should not assume Firefox itself is the primary cause of modern-browser instability. A stronger hypothesis is that the validated v1 desktop is intentionally minimal: its X server is TCP-addressed and started without the normal local Unix X socket/session environment modern Linux GUI applications usually expect.

Before doing more browser-specific debugging, test a **General v2** workbench without changing either validated v1 profile. The experiment must use new display/VNC/web ports and a separate browser profile. Its intended session model is:

- private mount namespace for the experimental desktop;
- a private writable directory mounted at the namespace's `/tmp/.X11-unix` so Xvfb exposes a normal local Unix X socket without colliding with WSLg or the v1 workbenches;
- private `XDG_RUNTIME_DIR` with correct ownership/mode;
- `dbus-run-session` around the GUI session;
- `DISPLAY=:<experimental-display>` using the local Unix socket rather than `127.0.0.1:<display>.0` TCP transport;
- GUI applications explicitly forced to X11 where relevant (`MOZ_ENABLE_WAYLAND=0`, `GDK_BACKEND=x11`, and equivalent toolkit settings);
- a distinct Firefox profile and distinctly labeled noVNC surface.

Test Firefox/ChatGPT on General v2 first. Only if that environment behaves materially better should the same architecture be proposed as a later Catalyst migration. **Do not alter Catalyst `:99 / 5902 / 6080` to perform this experiment.** If the private-session model remains fragile, escalate to a properly isolated Linux desktop/container or a separate lightweight WSL distro rather than continuing browser-specific patching.
## General v2 isolation experiment — 2026-09-11 current state

General v2 already exists and is active on experimental boundary `:97 / 5922 / 6082` with a private mount namespace, private writable `/tmp/.X11-unix`, local Unix-only X socket, separate `XDG_RUNTIME_DIR`, `dbus-run-session`, and X11-forced Firefox. `general-v2/validate-root.sh` passes its namespace/socket/environment/port checks, and Catalyst/General v1 remain unchanged.

Browser/UI validation is still **in progress**. An early automated send test was confounded by noVNC viewport-coordinate/focus ambiguity and ChatGPT Work-mode controls, so it must not be treated as proof that General v2 failed. The required acceptance test remains end-to-end normal ChatGPT composer → send → rendered reply behavior through the existing General-v2 viewer.

Do not migrate/restart Catalyst `:99 / 5902 / 6080` while this validation is unfinished. If General v2 passes, decide whether to promote it to canonical General before planning any later Catalyst migration; only escalate to a fuller isolated desktop/WSL distro if reliable end-to-end UI validation actually fails.
