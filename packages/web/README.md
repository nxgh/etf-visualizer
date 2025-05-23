```sql
CREATE TABLE index_info (
    code VARCHAR(10) PRIMARY KEY,
    market INT,
    name VARCHAR(50),
    decimal INT,
    dktotal INT
);
```

| 字段名      | 数据类型      | 说明                                            |
| ----------- | ------------- | ----------------------------------------------- |
| id          | BIGINT        | 主键，自增                                      |
| code        | VARCHAR(10)   | 指数代码                                        |
| type        | VARCHAR(10)   | 指数类型 (0: 指数, 1: 基金， 2： 股票,3： 债券) |
| date        | DATETIME      | 时间                                            |
| open_price  | DECIMAL(18,2) | 开盘价                                          |
| high_price  | DECIMAL(18,2) | 最高价                                          |
| low_price   | DECIMAL(18,2) | 最低价                                          |
| close_price | DECIMAL(18,2) | 股票指数收盘价/基金净值                         |
| volume      | BIGINT        | 成交量                                          |
| amount      | DECIMAL(18,2) | 成交额                                          |

```sql
CREATE TABLE index_kline (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10),
    date DATETIME,
    open_price DECIMAL(18,2) ,
    high_price DECIMAL(18,2),
    low_price DECIMAL(18,2),
    close_price DECIMAL(18,2),
    volume BIGINT,
    amount DECIMAL(18,2),
    FOREIGN KEY (code) REFERENCES index_info(code)
);
```

1. 根据 code/name 查询基金/指数/股票/债券

   - 添加到自选
   - 删除自选

2. 点击条目
   - 显示历史净值
   - 历史操作记录
     - 添加/批量添加
     - 删除/批量删除

vscode/chrome 插件
mobile / pc / web

对于以下数据，使用关系型数据库应该如何设计？
基金/股票/指数/债券

- 历史净值/k 线数据
- 历史操作记录 (买入/卖出/分红/拆分/转换)

1. 个人操作数据可选则是否存储在云端

存在本地时

- web 端使用 IndexedDB
- mobile 端使用 SQLite
- pc 端使用 SQLite

存在云端时

- 使用关系型数据库

2. 是否缓存接口数据？缓存多久？ 缓存更新频率？ 缓存更新策略？
   - 先不缓存

```ts
interface;
```

- 模糊查询 Fund/Stock/Index...

  - 返回结果以列表形式展现，点击列表项，显示详情

- 点击列表项
  - 查询
    - api request
    - `/search?keyword=${keyword}`
    - `/fund/search?keyword=${keyword}`
    - `/fund/${symbol}/detail`
    - `/fund/${symbol}/nat`
    - `/stock/search?keyword=${keyword}`
    - `/stock/${symbol}/kline`
    - `/stock/${symbol}/detail`
    - `/operation/${symbol}/list`

## GetStock

    // 通过  stock_quote 获取 issue_date
    // 查询数据库，获取最新一条K线数据
    // 1. 如果数据的更新时间为当天，则直接返回
    // 2. 否则，获取最新的K线数据，并更新数据库
    // 2.1 数据每日更新，如果首次获取的数据与数据库中的数据相同，则不更新数据库
    // 2.2. 如果首次获取的数据与数据库中的数据不同，则更新数据库
    // 2.3 更新数据时，根据 issue_date 判断是否需要递归获取数据， 如果获取到的 timestamp 等于 issue_date 判断时需要格式化为 YYYY-MM-DD，则停止获取，否则递归获取
    //      如果 issue_date 为 Null 则递归获取数据，获取的数量是否小于 260 条
    // 3. 如果数据库中没有数据，则直接获取

    // 为什么搞这么复杂？
    // 两个条件： 1. 只有递归查询，当查询的第一页数据绝大部分都在库中时，退出递归

code + timestamp 作为主键

`SZ159938-1462204800000`

网格预设

- 买入价格、卖出价格、网格数量、网格间隔
- 压力测试
- 每格金额，阶梯
- 每格比例（大网 30%、中网 15%、小网 5%）

网格收益回测

- 每格数量、阶梯、

网格交易记录

- 统计收益

TODO:

[ ] dayjs 更换 date-fns
https://klinecharts.com/guide/styles

```ts
export interface Root {
  state: State;
  version: number;
}

export interface State {
  presetList: PresetList[];
  transaction: Transaction[];
  watchList: WatchList[];
  presetListTemplate: any[];
}

export interface PresetList {
  id: string;
  strategyName: string;
  code: string;
  basePrice: number;
  buyVolume: number;
  priceIncrease: number;
  priceDecline: number;
  stressTest: number;
  gridStepIncrement: number;
  profitRetention: number;
}

export interface Transaction {
  id: string;
  code: string;
  positionIndex: number;
  level: number;
  buyPrice: number;
  buyQuantity: number;
  buyAmount: number;
  sellPrice: number;
  sellQuantity: number;
  sellAmount: number;
  remainingQuantity: number;
  retainedProfit: number;
  profit: number;
  yieldRate: number;
}

export interface WatchList {
  code: string;
  name: string;
  type: string;
}

/**
 * @description 网格策略配置 (Grid strategy configuration)
 */
export interface IGridTradeStrategyConfig {
  /** @description 网格策略ID */
  id: string | number;

  /** @description 网格名称 (Grid strategy identifier/name) */
  strategyName: string;

  /** @description 证券代码 */
  code: string;

  /** @description 基准价格 (Reference price for grid calculations) */
  basePrice: number;

  /** @description 买入数量 (Buy quantity) */
  buyVolume: number;

  /** @description 涨幅 (Price increase percentage threshold) */
  priceIncrease: number;

  /** @description 跌幅 (Price decline percentage threshold) */
  priceDecline: number;

  /** @description 压力测试 (Stress testing mode flag) */
  stressTest: number;

  /** @description 逐格加码 (Progressive position scaling) */
  gridStepIncrement: number;

  /** @description 利润留存 (Profit retention percentage) */
  profitRetention: number;
}

/**
 *  @description 网格交易档位详细信息/Grid trading level detailed information
 */
export interface IGridLevelRecord {
  /** @description 交易ID/Transaction ID */
  id: string | number;

  /** @description 交易策略ID/Transaction strategy ID */
  strategyId?: string | number;

  /** @description 证券代码 */
  code: string;

  /** @description 交易顺序编号/Transaction sequence number */
  positionIndex: number;

  /** @description 价格区间层级/Price interval level */
  level: number;

  /** @description 买入价格/Triggered purchase price */
  buyPrice: number;

  /** @description 买入时间/Purchase time */
  buyDate?: string;

  /** @description 买入数量/Purchased quantity */
  buyQuantity: number;

  /** @description 买入总金额/Total purchase amount */
  buyAmount: number;

  /** @description 卖出价格/Triggered sell price */
  sellPrice?: number;

  /** @description 卖出时间/Sell time */
  sellDate?: string;

  /** @description 卖出数量/Sold quantity */
  sellQuantity?: number;

  /** @description 卖出总金额/Total sell amount */
  sellAmount?: number;

  /** @description 未卖出持仓数量/Unsold position quantity */
  remainingQuantity?: number;

  /** @description 本档保留利润/Profit retained in this level */
  retainedProfit?: number;

  /** @description 已实现收益/Realized profit */
  profit: number;

  /** @description 收益率/Return rate percentage */
  yieldRate?: number;
}

// 定义 WatchList 项的接口，确保包含一个唯一标识符
export interface IWatchListItem {
  code: string; // 使用 code 作为唯一标识符
  name: string;
  type: string;
}
```
