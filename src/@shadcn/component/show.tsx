import { ReactNode } from "react";

type ShowProps<T> = {
  when: T;
  fallback?: ReactNode;
  children: ReactNode | ((item: NonNullable<T>) => ReactNode);
};

/**
 * Concept borrowed from Solid: https://www.solidjs.com/docs/latest/api#show
 *
 * Using <Show> can be an improvement over ternary or boolean expressions in some cases.
 *
 * @example
 * ```tsx
 * <Show when={!loading} fallback={<Spinner />}>
 *    <div>All done</div>
 * </Show>
 * ```
 *
 * @example
 * ```tsx
 * <Show when={data}>
 *   {({ foo }) => <div>{foo.bar}</div>}
 * </Show>
 * ```
 */
export function Show<T>({ when, fallback, children }: ShowProps<T>) {
  if (when) {
    if (typeof children === "function" && children.length > 0) {
      return <>{children(when)}</>;
    }

    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}

export default Show;
