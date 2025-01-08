import { useRef, useEffect, MutableRefObject, ForwardedRef } from "react";

export function useForwardedRef<T>(
  ref: ForwardedRef<T>
): MutableRefObject<T | null> {
  const innerRef = useRef<T | null>(null);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  }, [ref]);

  return innerRef;
}
