# Catalyst Chat Bridge

Development-only Opera/Chromium extension for conversation continuity testing.

It fills the narrow capability gap between Opera Browser Connector (read/navigate) and ChatGPT's message composer (write/send). It is **not** a Catalyst runtime dependency.

## Install / reload

1. Open `opera://extensions/`.
2. Enable Developer mode.
3. Choose **Load unpacked** and select this directory.
4. After editing `content.js`, click **Reload** on the extension card before testing again.

The extension is scoped to `https://chatgpt.com/*`.

## Commands

`make-command.ps1` creates a local command URL for a known ChatGPT conversation URL.

- `draft` fills the composer but does not submit.
- `send` fills the composer and activates Send.

Always validate with `draft` after extension/browser changes before using `send`.

The bridge uses a local secret token embedded in the extension and command generator. Do not publish that token or copy generated command URLs into documentation, issues, or public repositories.

## Validated recovery pattern

1. Navigate Opera to the older `https://chatgpt.com/c/...` conversation.
2. Read it directly with Opera Browser Connector first.
3. If a targeted handoff is needed, generate a bridge command and send the question into the old thread.
4. Read the reply through Opera and continue work in the fresh conversation.

If a full navigation consumes the command but reports `composer not found`, let the page finish loading and resend the command against the already-loaded chat. The hash-only retry path has been validated.

See `../../docs/conversation-continuity.md` for the full crash-recovery runbook.

## Access escalation

During continuity/recovery work, the assistant may ask for additional access whenever it would materially improve retrieval, browser control, validation, or recovery. This is permission to ask, not permission to grant itself broader privileges. New connectors, permissions, account access, filesystem scope, or browser capabilities still require explicit user approval when requested.

## 0.2.0 stability behavior

Full ChatGPT navigations may take a long time to create the message composer. The bridge now waits up to 45 seconds for the visible composer and does **not** remove the command from the URL until draft insertion or submission succeeds.

If ChatGPT still fails to expose the composer or Send control within that window, the command remains in the URL so it can be retried rather than silently lost. Duplicate handling of the same in-flight command is suppressed while a retry window is active.

This makes full-navigation commands suitable for proactive conversation rollover, not only already-loaded chat tabs.

## 0.7.0 send-commit behavior

A visible composer is not enough to prove that a brand-new ChatGPT conversation exists. After activating Send, the bridge now waits for an observable commit before clearing the command or reporting success.

For a new chat, success requires ChatGPT to transition to a real `/c/<conversation-id>` route. For an existing conversation, success requires the composer to clear or be replaced after submission.

This prevents the bridge from declaring a new chat finished while ChatGPT is still asynchronously creating the conversation. Operationally: open ChatGPT, allow the app to load, send the short seed-file pointer, then record the conversation URL only after the `/c/` route exists.
