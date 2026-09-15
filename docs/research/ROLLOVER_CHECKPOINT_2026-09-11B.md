# Catalyst rollover checkpoint — 2026-09-11B

This is the handoff from the second long-running Catalyst conversation of 2026-09-11 into a fresh chat. Continue from this state rather than restarting.

## Product / research state

The immediate product problem remains the cognitive architecture of the Working Picture, not Portrayal Lab polish. Preserve the principle that analytical structure must be legible before it is readable; analytical material dominates; application chrome retreats; document and source placement remain part of the thinking surface.

Do not code the next Working Picture yet. Continue the backward-and-forward research pass until the cognitive architecture is defensible. Prefer free/libre/open-source software as current comparators and implementation references. Proprietary or metered products may be mentioned only when historically useful; do not make Catalyst depend on inaccessible proprietary behavior.

The current architecture hypothesis remains anchored material + focus-in-context + bounded subpictures: placed source/document objects stay spatial landmarks, provisional spatial structure may precede explicit semantic relations, and deep reading should feel like entering the same placed object rather than switching to a separate app mode.

Useful FOSS comparators identified for deeper hands-on study include TriliumNext, Zotero, AFFiNE, Logseq, Freeplane/FreeIBIS, Excalidraw, and Zettlr. A hands-on Freeplane pass was planned but has not yet been completed.

## Agent Workbench state

A browser-visible isolated Linux GUI workbench has been validated in WSL2 using Xvfb + Openbox + x11vnc + websockify/noVNC + xdotool. Its keyboard and mouse are independent of the user's Windows keyboard/mouse because input is injected directly into the private virtual X display.

Two profiles now exist and may run concurrently. **Catalyst chats must use only the Catalyst profile; non-Catalyst chats must use only the General profile. Never choose a profile merely because a noVNC tab is already open.**

Catalyst profile: display `:99` / `127.0.0.1:99.0`, VNC `5902`, noVNC `6080`, metadata `C:\Users\iris\AgentWorkbench\catalyst\profile.json`, state `C:\Users\iris\AgentWorkbench\catalyst\state\current.json`.

General profile: display `:98` / `127.0.0.1:98.0`, VNC `5912`, noVNC `6081`, metadata `C:\Users\iris\AgentWorkbench\general\profile.json`, state `C:\Users\iris\AgentWorkbench\general\state\current.json`.

The general profile was validated while Catalyst remained running: private keyboard text and a private mouse right-click were visibly confirmed through Opera. Catalyst's own keyboard/mouse path had already been validated earlier. The profile boundary is also documented in `docs/development-tooling.md` and `docs/conversation-continuity.md`.

## Browser / OpenAI session state

Mozilla Firefox `155.0.1` was installed from Mozilla's Linux tarball at `/home/iris/.agent-workbench-tools/firefox/firefox`. The binary is shared, but the browser data is not.

General Firefox uses `/home/iris/.agent-workbench-general-browser/firefox-profile` on display `:98`. Catalyst Firefox uses `/home/iris/.agent-workbench-catalyst-browser/firefox-profile` on display `:99`. Both profiles are currently running and were visibly verified as authenticated to OpenAI/ChatGPT. Keep these browser profiles separate.

The earlier Falkon and Epiphany experiments are not the supported browser path: Falkon did not render current ChatGPT correctly, and Epiphany/WebKit crashed on the Xvfb graphics path. Use Firefox unless there is a specific reason to revisit them.

The chat `Revise Resume Signal Clarity` received `GENERAL_WORKBENCH_HANDOFF_2026_09_11`; Opera inspection confirmed that message exists in the target conversation. That chat must use the General profile only and must not operate Catalyst display `:99`, VNC `5902`, or web port `6080`.

## Execution-window continuity

The workbench can outlive a ChatGPT execution window: detached processes and GUI state continue on the PC after tool execution stops. A more formal persistent-job supervisor was designed so jobs, logs, checkpoints, and next actions survive between turns/chats.

That supervisor is **not yet operational**. `C:\Users\iris\AgentWorkbench\shared\supervisor` exists, but do not assume detached-job queueing/checkpoint automation has been implemented or validated. Finish and validate it before relying on it for unattended multi-step work.

Until then, use the profile `state\current.json` files plus Catalyst documentation as the durable handoff, and verify live process state after any rollover.

## Validated Portrayal boundary

Do not regress this state: catalog `0.1.0-lab.3`, protocol `blind-v1`, result schema 3. P7 single-scale blind measurement was implemented and validated; `npm test` and `npm run build` passed; blind P7 showed one assigned scale; review P7 retained the four-scale matrix with measurements disabled. A `blind-v2` patch helper existed but was never executed/applied.

## Immediate continuation

First recover this checkpoint and the two workbench profile/state files. Then finish the execution-window supervisor and reproducible Firefox launch helpers without mixing profiles. After that, return to hands-on FOSS UI/cognitive-architecture research (Freeplane is a reasonable first target) before any new Catalyst Working Picture implementation.

## Environment supersession notice

The Agent Workbench environment advanced after this checkpoint was written. For current workbench/runtime state, **do not rely on the environment section of this checkpoint alone**. Read `C:\Users\iris\AgentWorkbench\ENVIRONMENT_ROLLOVER_2026-09-11.md` and the relevant profile/state files, then verify live status. That environment rollover records active General v2 `:97/5922/6082`, the implemented/validated detached-job supervisor, and the live Freeplane/Zotero Catalyst research jobs.