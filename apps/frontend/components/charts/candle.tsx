interface CandleStickParams {
  open: number;
  close: number;
  high: number;
  low: number;
  maxHeight?: number; // 可选的绘图区域高度
  candleWidth?: number; // 可选的蜡烛宽度
}

interface CandleStickResult {
  // 价格空间数据
  priceMetrics: {
    bodyHeight: number; // 蜡烛实体高度
    upperShadow: number; // 上影线长度
    lowerShadow: number; // 下影线长度
  };
  // 可选的视觉空间数据
  visualMetrics?: {
    bodyHeight: number; // 实体像素高度
    upperShadow: number; // 上影线像素高度
    lowerShadow: number; // 下影线像素高度
    candleWidth: number; // 蜡烛固定宽度
  };
}

/**
 * 计算K线图的价格和视觉指标
 * @param params K线图计算所需的参数
 * @returns 包含价格空间和可选视觉空间的计算结果
 *
 * @example
 * const result = calculateCandleMetrics({
 *   open: 0.532,
 *   close: 0.545,
 *   high: 0.55,
 *   low: 0.531,
 *   maxHeight: 200,  // 可选
 *   candleWidth: 20  // 可选
 * });
 */
export const calculateCandleMetrics = (params: CandleStickParams): CandleStickResult => {
  const { open, close, high, low, maxHeight, candleWidth } = params;

  // 计算价格空间指标
  const bodyHeight = Number(Math.abs(close - open).toFixed(3));
  const upperShadow = Number((high - (close > open ? close : open)).toFixed(3));
  const lowerShadow = Number(((close > open ? open : close) - low).toFixed(3));

  const priceMetrics = {
    bodyHeight,
    upperShadow,
    lowerShadow,
  };

  // 如果没有提供视觉参数，只返回价格空间数据
  if (!maxHeight || !candleWidth) {
    return { priceMetrics };
  }

  // 计算视觉空间指标
  const totalShadowHeight = upperShadow + lowerShadow;
  const priceToPixelRatio = (maxHeight * 0.9) / (bodyHeight + totalShadowHeight);
  const scale = (val: number) => Math.round(val * priceToPixelRatio);

  const visualMetrics = {
    bodyHeight: scale(bodyHeight),
    upperShadow: scale(upperShadow),
    lowerShadow: scale(lowerShadow),
    candleWidth,
  };

  return {
    priceMetrics,
    visualMetrics,
  };
};

// 使用示例
// const result = calculateCandleMetrics({
//   open: 0.532,
//   close: 0.545,
//   high: 0.55,
//   low: 0.531,
//   maxHeight: 200,
//   candleWidth: 20
// });

export const genCandleHtml = (
  visualMetrics: {
    bodyHeight: number;
    upperShadow: number;
    lowerShadow: number;
    candleWidth: number;
  },
  isUp: boolean = true,
  data: {
    date: string;
    open: string | number;
    close: string | number;
    high: string | number;
    low: string | number;
    volume: string | number;
    ma5?: string | number;
    ma10?: string | number;
    ma20?: string | number;
    ma30?: string | number;
  }
) => {
  const totalHeight = visualMetrics.bodyHeight + visualMetrics.upperShadow + visualMetrics.lowerShadow;

  // 计算各个价格标注的垂直位置
  const textHeight = 14; // 文字高度
  const textMargin = 28; // 增加文字间距，避免太近
  const minTextGap = textHeight + textMargin; // 最小文字间隔

  // 最高价位置（顶部）
  const highPosition = 0;

  // 开盘价基础位置
  let openPosition = isUp ? visualMetrics.upperShadow : visualMetrics.upperShadow + visualMetrics.bodyHeight - textHeight;

  // 收盘价基础位置
  let closePosition = isUp ? visualMetrics.upperShadow + visualMetrics.bodyHeight - textHeight : visualMetrics.upperShadow;

  // 最低价位置（底部）
  const lowPosition = totalHeight - textHeight;

  // 防止最高价和开盘价重叠
  if (Math.abs(highPosition - openPosition) <= minTextGap) {
    openPosition = highPosition + minTextGap;
  }

  // 防止最低价和收盘价重叠
  console.log("lowPosition", {
    lowPosition,
    closePosition,
    minTextGap,
    a: Math.abs(lowPosition - closePosition),
    r: Math.abs(lowPosition - closePosition) < minTextGap,
    data,
  });
  if (Math.abs(lowPosition - closePosition) < minTextGap) {
    closePosition = lowPosition - minTextGap;
  }

  return `
      <div class="candle-container" style="
        position: relative;
        height: ${totalHeight}px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-family: monospace;
      ">
        <div style="display: flex; align-items: flex-start; width: 100%;">
          <!-- 价格标注区域 -->
          <div style="
            position: relative;
            width: 60px;
            height: ${totalHeight}px;
            margin-right: 5px;
            font-size: 12px;
          ">
            <!-- 最高价 -->
            <div style="
              position: absolute;
              top: ${highPosition}px;
              color: ${isUp ? "#00da3c" : "#ec0000"};
            ">${data.high}</div>
            
            <!-- 开盘价 -->
            <div style="
              position: absolute;
              top: ${openPosition}px;
              left: 80%;
              
            ">${data.open}</div>
            
            <!-- 收盘价 -->
            <div style="
              position: absolute;
              top: ${closePosition}px;
              left: 80%;
            
            ">${data.close}</div>
            
            <!-- 最低价 -->
            <div style="
              position: absolute;
              top: ${lowPosition}px;
              color: ${isUp ? "#00da3c" : "#ec0000"};
            ">${data.low}</div>
          </div>

          <!-- 蜡烛图区域 -->
          <div style="display: flex; flex-direction: column; align-items: center;">
            <!-- 上影线 -->
            <div class="upper-shadow" style="
              width: 2px;
              height: ${visualMetrics.upperShadow}px;
              background-color: ${isUp ? "#00da3c3d" : "#ec00003d"};
            "></div>
            
            <!-- 实体 -->
            <div class="body" style="
              width: ${visualMetrics.candleWidth}px;
              height: ${visualMetrics.bodyHeight}px;
              background-color: ${isUp ? "#00da3c3d" : "#ec00003d"};
            "></div>
            
            <!-- 下影线 -->
            <div class="lower-shadow" style="
              width: 2px;
              height: ${visualMetrics.lowerShadow}px;
              background-color: ${isUp ? "#00da3c3d" : "#ec00003d"};
            "></div>
          </div>

          <!-- 均线标注区域 -->
          <div style="
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            font-size: 12px;
            color: #666;
          ">
            ${data.ma5 ? `<div>MA5: ${data.ma5}</div>` : ""}
            ${data.ma10 ? `<div>MA10: ${data.ma10}</div>` : ""}
            ${data.ma20 ? `<div>MA20: ${data.ma20}</div>` : ""}
            ${data.ma30 ? `<div>MA30: ${data.ma30}</div>` : ""}
          </div>
        </div>
      </div>
    `.trim();
};
