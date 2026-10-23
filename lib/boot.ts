/** One-shot signals that coordinate the boot screen with what plays behind it. */
const signal = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return [promise, resolve] as const;
};

/** Resolves when the boot screen starts leaving, or right away when it's skipped. Intros wait on it. */
export const [booted, finishBoot] = signal();

/** Resolves once the 3D backdrop has rendered, or has failed and been given up on. */
export const [sceneReady, markSceneReady] = signal();
