"use client";

import { useEffect, useRef, useState } from "react";
import { throttle } from "lodash-es";

export function useObserverWidthResize() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      // 创建节流的 setWidth 函数，每 200ms 最多执行一次
      const throttledSetWidth = throttle((width: number) => {
        setWidth(width);
        console.log(width);
      }, 200);

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          throttledSetWidth(entry.contentRect.width);
        }
      });

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
        throttledSetWidth.cancel();
      };
    }
  }, []);

  return { width, ref };
}
