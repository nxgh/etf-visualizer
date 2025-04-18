interface V5StockQuoteJson {
  /**
   * @description 包含市场信息的主要数据对象
   */
  data: {
    /**
     * @description 市场状态和地区信息
     */
    market: {
      /**
       * @description 市场状态ID
       */
      status_id: number;
      /**
       * @description 市场地区代码（例如："CN"表示中国）
       */
      region: string;
      /**
       * @description 当前市场状态（例如："已收盘"）
       */
      status: string;
      /**
       * @description 时区标识（例如："Asia/Shanghai"）
       */
      time_zone: string;
      /**
       * @description 时区描述（未提供时为null）
       */
      time_zone_desc: null | string;
      /**
       * @description 延迟标记（0表示无延迟）
       */
      delay_tag: number;
    };
    /**
     * @description 证券的行情信息
     */
    quote: {
      /**
       * @description 证券代码（例如："SH000001"）
       */
      symbol: string;
      /**
       * @description 平盘（无变化）股票数量
       */
      flat_count: number;
      /**
       * @description 证券代码（例如："000001"）
       */
      code: string;
      /**
       * @description 52周最高价
       */
      high52w: number;
      /**
       * @description 平均价格
       */
      avg_price: number;
      /**
       * @description 延迟数据标记（0表示实时）
       */
      delayed: number;
      /**
       * @description 类型标识
       */
      type: number;
      /**
       * @description 涨跌幅百分比
       */
      percent: number;
      /**
       * @description 最小价格变动单位
       */
      tick_size: number;
      /**
       * @description 流通股本数量
       */
      float_shares: number;
      /**
       * @description 振幅（百分比）
       */
      amplitude: number;
      /**
       * @description 当前价格
       */
      current: number;
      /**
       * @description 当日最高价
       */
      high: number;
      /**
       * @description 本年至今涨跌幅
       */
      current_year_percent: number;
      /**
       * @description 流通市值
       */
      float_market_capital: number;
      /**
       * @description 上市日期（时间戳）
       */
      issue_date: number;
      /**
       * @description 当日最低价
       */
      low: number;
      /**
       * @description 子类型（未提供时为null）
       */
      sub_type: null | string;
      /**
       * @description 总市值
       */
      market_capital: number;
      /**
       * @description 货币单位（例如："CNY"人民币）
       */
      currency: string;
      /**
       * @description 每手股数
       */
      lot_size: number;
      /**
       * @description 锁定集合标记
       */
      lock_set: number;
      /**
       * @description 时间戳
       */
      timestamp: number;
      /**
       * @description 下跌股票数量
       */
      fall_count: number;
      /**
       * @description 上涨股票数量
       */
      rise_count: number;
      /**
       * @description 成交金额
       */
      amount: number;
      /**
       * @description 涨跌额
       */
      chg: number;
      /**
       * @description 昨日收盘价
       */
      last_close: number;
      /**
       * @description 成交量
       */
      volume: number;
      /**
       * @description 量比
       */
      volume_ratio: number;
      /**
       * @description 换手率
       */
      turnover_rate: number;
      /**
       * @description 52周最低价
       */
      low52w: number;
      /**
       * @description 证券名称（例如："上证指数"）
       */
      name: string;
      /**
       * @description 交易所代码（例如："SH"表示上海）
       */
      exchange: string;
      /**
       * @description 时间戳
       */
      time: number;
      /**
       * @description 总股本
       */
      total_shares: number;
      /**
       * @description 开盘价
       */
      open: number;
      /**
       * @description 状态标识
       */
      status: number;
    };
    /**
     * @description 其他信息
     */
    others: {
      /**
       * @description 盘口比例（未提供时为null）
       */
      pankou_ratio: null | number;
      /**
       * @description 创业板开关标记
       */
      cyb_switch: boolean;
    };
    /**
     * @description 标签数组
     */
    tags: any[];
  };
  /**
   * @description 错误代码（0表示成功）
   */
  error_code: number;
  /**
   * @description 错误描述（成功时为空字符串）
   */
  error_description: string;
}

export type { V5StockQuoteJson };
