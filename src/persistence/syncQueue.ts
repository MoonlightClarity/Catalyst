import type { WorkspaceState } from "../domain/types";
import type { WorkspaceRepository } from "./repository";

export class WorkspaceSyncQueue {
  private persisted: WorkspaceState;
  private latest: WorkspaceState;
  private timer: number | null = null;
  private running: Promise<void> | null = null;
  private failed = false;

  constructor(
    private readonly repository: WorkspaceRepository,
    baseline: WorkspaceState,
    private readonly onError: (error: unknown) => void,
    private readonly onSuccess: (persisted: WorkspaceState) => void = () => {},
  ) {
    this.persisted = baseline;
    this.latest = baseline;
  }

  schedule(state: WorkspaceState): void {
    this.latest = state;

    // Any new user change is a deliberate retry boundary after a failure.
    this.failed = false;

    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.timer = null;
      void this.flushNow();
    }, 180);
  }

  async flushNow(): Promise<void> {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.failed) return;

    if (this.running) {
      await this.running;
      if (!this.failed && this.latest !== this.persisted) await this.flushNow();
      return;
    }

    const target = this.latest;
    if (target === this.persisted) return;

    this.running = this.repository
      .sync(this.persisted, target)
      .then(() => {
        this.persisted = target;
        this.onSuccess(target);
      })
      .catch((error) => {
        this.failed = true;
        this.onError(error);
      })
      .finally(() => {
        this.running = null;
      });

    await this.running;

    if (!this.failed && this.latest !== this.persisted) await this.flushNow();
  }
}
