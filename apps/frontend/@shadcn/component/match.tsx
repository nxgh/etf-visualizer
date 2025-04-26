import { Children, ReactNode, isValidElement, useMemo } from "react";

type MatchProps<T> = {
  when: T;
  children: ReactNode | ((item: NonNullable<T>) => ReactNode);
};

/**
 * Only renders when it is the first `<Match>` in a `<Switch>`
 * whose `when` prop is truthy.
 *
 * Borrowed from Solid: https://www.solidjs.com/docs/latest/api#switchmatch
 */
export function Match<T>({ when, children }: MatchProps<T>) {
  if (!when) {
    // This block should never execute based on the implementation of <Switch>
    return null;
  }

  if (typeof children === "function" && children.length > 0) {
    return <>{children(when)}</>;
  }

  return <>{children}</>;
}

type SwitchProps = {
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * Renders the first `<Match>` whose `when` prop is truthy.
 *
 * Borrowed from Solid: https://www.solidjs.com/docs/latest/api#switchmatch
 *
 * @example
 * ```tsx
 * <Switch fallback={<p>A fallback</p>}>
 *    <Match when={false}>
 *     <p>First match</p>
 *   </Match>
 *   <Match when={true}>
 *    <p>Second match</p>
 *   </Match>
 *   <Match when={data}>
 *    {({ foo }) => <p>{foo.bar}</p>}
 *   </Match>
 * </Switch>
 * ```
 */
export function Switch({ fallback, children }: SwitchProps) {
  const match = useMemo(
    () =>
      Children.toArray(children).find(
        (child) =>
          isValidElement<MatchProps<boolean>>(child) && // First React Element
          child.type === Match && // That is a <Match>
          child.props.when // Whose `when` prop is truthy
      ),
    [children]
  );

  if (match) {
    return <>{match}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
