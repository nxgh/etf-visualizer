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

interface CandleTransaction {
  type: string;
  value: number;
  quantity: number;
}

interface CandleData {
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

export const genCandleHtml = (
  visualMetrics: {
    bodyHeight: number;
    upperShadow: number;
    lowerShadow: number;
    candleWidth: number;
  },
  isUp: boolean = true,
  data:CandleData,
  transactions: CandleTransaction[]
) => {
  const totalHeight = 200; // visualMetrics.bodyHeight + visualMetrics.upperShadow + visualMetrics.lowerShadow;

  // 计算各个价格标注的垂直位置
  const textHeight = 14; // 文字高度
  const textMargin = 4; // 文本之间的最小垂直间距
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
  if (Math.abs(highPosition - openPosition) < minTextGap && openPosition < lowPosition - minTextGap) {
    openPosition = highPosition + minTextGap;
  }

  // 防止最低价和收盘价重叠
  if (Math.abs(lowPosition - closePosition) < minTextGap && closePosition > highPosition + minTextGap) {
    closePosition = lowPosition - minTextGap;
  }

  // 如果开盘价和收盘价重叠或非常接近
  if (Math.abs(openPosition - closePosition) < minTextGap) {
    if (isUp) {
      // 上涨行情，开盘价在下，收盘价在上
      // 如果开盘价接近最高价，则将开盘价向下移动
      if (Math.abs(openPosition - highPosition) < minTextGap) {
        openPosition = highPosition + minTextGap;
        closePosition = openPosition + minTextGap;
      } else {
        // 否则，将收盘价向上移动，开盘价向下移动
        closePosition = openPosition - minTextGap / 2;
        openPosition = openPosition + minTextGap / 2;
      }
      // 确保收盘价不会太靠近最高价
      if (closePosition < highPosition + textHeight) {
        closePosition = highPosition + textHeight;
      }
      // 确保开盘价不会太靠近最低价
      if (openPosition > lowPosition - textHeight) {
        openPosition = lowPosition - textHeight;
      }
    } else {
      // 下跌行情，开盘价在上，收盘价在下
      // 如果收盘价接近最低价，则将收盘价向上移动
      if (Math.abs(closePosition - lowPosition) < minTextGap) {
        closePosition = lowPosition - minTextGap;
        openPosition = closePosition - minTextGap;
      } else {
        // 否则，将开盘价向上移动，收盘价向下移动
        openPosition = closePosition - minTextGap / 2;
        closePosition = closePosition + minTextGap / 2;
      }
      // 确保开盘价不会太靠近最高价
      if (openPosition < highPosition + textHeight) {
        openPosition = highPosition + textHeight;
      }
      // 确保收盘价不会太靠近最低价
      if (closePosition > lowPosition - textHeight) {
        closePosition = lowPosition - textHeight;
      }
    }
  }

  // 再次检查并防止开盘价与最高价重叠
  if (openPosition <= highPosition + textHeight && data.open !== data.high) {
    openPosition = highPosition + textHeight + textMargin;
  }

  // 再次检查并防止收盘价与最低价重叠
  if (closePosition >= lowPosition - textHeight && data.close !== data.low) {
    closePosition = lowPosition - textHeight - textMargin;
  }

  // 最后检查开盘价和收盘价，确保它们之间有足够的间隙
  if (Math.abs(openPosition - closePosition) < textHeight) {
    if (isUp) {
      // 开盘价在下，收盘价在上
      if (openPosition > closePosition) {
        // 如果调整后开盘价反而高于收盘价了
        let mid = (openPosition + closePosition) / 2;
        openPosition = mid - textHeight / 2 - textMargin / 2;
        closePosition = mid + textHeight / 2 + textMargin / 2;
      } else {
        closePosition = openPosition + textHeight + textMargin;
      }
    } else {
      // 开盘价在上，收盘价在下
      if (closePosition > openPosition) {
        // 如果调整后收盘价反而高于开盘价了
        let mid = (openPosition + closePosition) / 2;
        openPosition = mid - textHeight / 2 - textMargin / 2;
        closePosition = mid + textHeight / 2 + textMargin / 2;
      } else {
        openPosition = closePosition + textHeight + textMargin;
      }
    }
  }

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
              color: ${isUp ? "#00da3c" : "#ec0000"};
            ">${data.open}</div>
            
            <!-- 收盘价 -->
            <div style="
              position: absolute;
              top: ${closePosition}px;
              left: 80%;
              color: ${isUp ? "#00da3c" : "#ec0000"};
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
          
          <ul>
            <li>日期: ${data.date}</li>
            <li>开盘: ${data.open}</li>
            <li>收盘: ${data.close}</li>
            <li>最高: ${data.high}</li>
            <li>最低: ${data.low}</li>  
            <li>成交量: ${data.volume}</li>
            <li>MA5: ${data.ma5}</li>
            <li>MA10: ${data.ma10}</li>
            <li>MA20: ${data.ma20}</li>
            <li>MA30: ${data.ma30}</li>
            <li>交易: ${transactions.map((t) => `${t.type}: ${t.quantity}`).join(", ")}</li>
          </ul>
          </div>
        </div>
      </div>
    `.trim();
};
