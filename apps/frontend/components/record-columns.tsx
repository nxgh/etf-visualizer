import createEnums, { type GetCreateEnumsKeyType } from "#utils/createEnums";
import { cn } from "@shadcn/lib/utils";
import { Input } from "@shadcn/ui/input";
import dayjs from "dayjs";
import { Decimal } from "decimal.js";

import { DatePicker, InputNumber } from "antd";

const transactionColumnMap = {
  level: "档位",
  date: "日期",
  price: "价格",
  quantity: "数量",
  amount: "金额",
  source: "来源",
} as const;
export const TransactionColumnEnums = createEnums(transactionColumnMap);

export const transactionColumns = (onChange: (item: ITransactionRecord, param: { key: string; value: string }) => void) => [
  {
    label: TransactionColumnEnums.level.value,
    headerClassName: "w-[100px]",
    key: TransactionColumnEnums.level.key,
    render: (item: ITransactionRecord) => item.level,
  },
  {
    label: TransactionColumnEnums.date.value,
    key: TransactionColumnEnums.date.key,
    headerClassName: "w-[200px]",
    render: (item: ITransactionRecord) => (
      <DatePicker
        value={dayjs(item.date)}
        onChange={(day) =>
          onChange(item, {
            key: TransactionColumnEnums.date.key,
            value: dayjs(day).format("YYYY-MM-DD"),
          })
        }
      />
    ),
  },
  {
    label: TransactionColumnEnums.price.value,
    key: TransactionColumnEnums.price.key,
    headerClassName: "w-[150px]",
    render: (item: ITransactionRecord) => (
      <InputNumber<number>
        style={{ width: 200 }}
        defaultValue={1}
        min={0.001}
        step={0.001}
        onChange={(value) =>
          onChange(item, {
            key: TransactionColumnEnums.price.key,
            value: value?.toString() ?? "",
          })
        }
        stringMode
      />
    ),
  },
  {
    label: TransactionColumnEnums.quantity.value,
    key: TransactionColumnEnums.quantity.key,
    headerClassName: "w-[150px]",
    render: (item: ITransactionRecord) => (
      <InputNumber<number>
        style={{ width: 200 }}
        step={1}
        value={item.quantity}
        onChange={(value) =>
          onChange(item, {
            key: TransactionColumnEnums.quantity.key,
            value: value?.toString() ?? "",
          })
        }
        stringMode
      />
    ),
  },
  {
    label: TransactionColumnEnums.amount.value,
    key: TransactionColumnEnums.amount.key,
    headerClassName: "w-[150px]",
    render: (item: ITransactionRecord) => (
      <div
        className={cn(
          "p-1 flex justify-center items-center rounded-md",
          item.price && item.quantity ? "bg-gray-100" : "",
          item.quantity > 0 ? "text-green-400" : "text-red-400"
        )}
      >
        {item.price && item.quantity ? new Decimal(item.price).mul(Math.abs(item.quantity)).toFixed(2) : ""}
      </div>
    ),
  },
  {
    label: TransactionColumnEnums.source.value,
    headerClassName: "w-[100px]",
    key: TransactionColumnEnums.source.key,
    render: (item: ITransactionRecord) => item.source,
  },
];

// export const columnEnums = createEnums({
// export const columnEnums = createEnums({
//   positionIndex: "序号",
//   level: "档位",
//   buyDate: "买入时间",
//   buyPrice: "买入价格",
//   buyQuantity: "买入数量",
//   buyAmount: "买入金额",
//   sellDate: "卖出时间",
//   sellPrice: "卖出价格",
//   sellQuantity: "卖出数量",
//   sellAmount: "卖出金额",
//   remainingQuantity: "留存数量",
//   retainedProfit: "留存利润",
//   profit: "收益",
//   yieldRate: "收益率",
// } as const);

// interface IColumns {
//   label: string;
//   key: GetCreateEnumsKeyType<typeof columnEnums>;
//   headerClassName?: string;
//   render?: (item: ITradRecord, index?: number) => React.ReactNode;
// }

// type onChangeType = (item: ITradRecord, key: keyof ITradRecord, value: string) => void;

// const getSellAmount = (item: ITradRecord) => {
//   if (item.sellPrice) {
//     return 0;
//   }
//   try {
//     return new Decimal(item.sellPrice ?? 0).mul(item.sellQuantity ?? 0).toFixed(2);
//   } catch (error) {
//     console.error(error);
//     return 0;
//   }
// };

// export const getColumns = (onChange: onChangeType) => {
//   const columns: IColumns[] = [
//     {
//       label: columnEnums.positionIndex.value,
//       key: columnEnums.positionIndex.key,
//       headerClassName: "w-[50px]",
//       render: (item: ITradRecord, index) => <div>{index! + 1}</div>,
//     },
//     { label: columnEnums.level.value, key: columnEnums.level.key },
//     {
//       label: columnEnums.buyDate.value,
//       key: columnEnums.buyDate.key,
//       render: (item: ITradRecord) => {
//         return (
//           <SimpleDataPicker
//             date={dayjs(item[columnEnums.buyDate.key]).toDate()}
//             onSelect={(day) => onChange(item, columnEnums.buyDate.key, dayjs(day).format("YYYY-MM-DD"))}
//           />
//         );
//       },
//     },
//     { label: columnEnums.buyPrice.value, key: columnEnums.buyPrice.key },
//     { label: columnEnums.buyQuantity.value, key: columnEnums.buyQuantity.key },
//     {
//       label: columnEnums.buyAmount.value,
//       key: columnEnums.buyAmount.key,
//       headerClassName: "w-[100px]",
//       render: (item: ITradRecord) => (
//         <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-green-300">
//           {new Decimal(item.buyPrice).mul(item.buyQuantity).toFixed(2) ?? ""}
//         </div>
//       ),
//     },
//     {
//       label: columnEnums.sellDate.value,
//       key: columnEnums.sellDate.key,
//       render: (item: ITradRecord) => {
//         return (
//           <SimpleDataPicker
//             date={dayjs(item[columnEnums.sellDate.key]).toDate()}
//             onSelect={(day) => onChange(item, columnEnums.sellDate.key, dayjs(day).format("YYYY-MM-DD"))}
//           />
//         );
//       },
//     },
//     { label: columnEnums.sellPrice.value, key: columnEnums.sellPrice.key },
//     { label: columnEnums.sellQuantity.value, key: columnEnums.sellQuantity.key },
//     {
//       label: columnEnums.sellAmount.value,
//       key: columnEnums.sellAmount.key,
//       headerClassName: "w-[100px]",
//       render: (item: ITradRecord) => (
//         <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-red-300">{getSellAmount(item)}</div>
//       ),
//     },
//   ];

//   const result = columns.map((column) => ({
//     ...column,
//     render: (item: ITradRecord, index?: number) =>
//       column?.render && typeof column.render === "function" ? (
//         column?.render(item, index)
//       ) : (
//         <Input
//           type="number"
//           className="border-none shadow-none ring-0 focus-visible:ring-1"
//           value={item[column.key as keyof ITradRecord] || ""}
//           onChange={(e) => {
//             onChange(item, column.key as keyof ITradRecord, e.target.value);
//           }}
//         />
//       ),
//   }));

//   return result;
// };

// const columns2 = [
//   {
//     label: columnEnums.remainingQuantity.value,
//     key: columnEnums.remainingQuantity.key,
//     headerClassName: "w-[100px]",
//     render: (item: ITradRecord) => (
//       <div>
//         {(() => {
//           try {
//             if (item.sellPrice) {
//               return 0;
//             }
//             console.log(item.buyQuantity, item.sellQuantity);
//             return new Decimal(item.buyQuantity ?? 0).sub(item.sellQuantity ?? 0).toFixed(2);
//           } catch (error) {
//             console.error(error);
//             return 0;
//           }
//         })()}
//       </div>
//     ),
//   },
//   {
//     label: columnEnums.retainedProfit.value,
//     key: columnEnums.retainedProfit.key,
//     headerClassName: "w-[100px]",
//     render: (item: ITradRecord) => (
//       <div>
//         {(() => {
//           try {
//             if (item.sellPrice) {
//               return 0;
//             }
//             return new Decimal(item.buyQuantity ?? 0)
//               .sub(item.sellQuantity ?? 0)
//               .mul(item.sellPrice ?? 0)
//               .toFixed(2);
//           } catch (error) {
//             console.error(error);
//             return 0;
//           }
//         })()}
//       </div>
//     ),
//   },
//   { label: columnEnums.profit.value, key: columnEnums.profit.key },
//   { label: columnEnums.yieldRate.value, key: columnEnums.yieldRate.key },
// ];

// transactionColumnEnums;

// export const RecordColumns = (onChange: onChangeType) => [
//   { label: columnEnums.level.value, key: columnEnums.level.key },
//   {
//     label: columnEnums.buyDate.value,
//     key: columnEnums.buyDate.key,
//     render: (item: ITradRecord) => {
//       return (
//         <SimpleDataPicker
//           date={dayjs(item[columnEnums.buyDate.key]).toDate()}
//           onSelect={(day) => onChange(item, columnEnums.buyDate.key, dayjs(day).format("YYYY-MM-DD"))}
//         />
//       );
//     },
//   },
//   { label: columnEnums.buyPrice.value, key: columnEnums.buyPrice.key },
//   { label: columnEnums.buyQuantity.value, key: columnEnums.buyQuantity.key },
//   {
//     label: columnEnums.buyAmount.value,
//     key: columnEnums.buyAmount.key,
//     headerClassName: "w-[100px]",
//     render: (item: ITradRecord) => (
//       <div className="bg-gray-100 p-1 flex justify-center items-center rounded-md text-green-300">
//         {new Decimal(item.buyPrice).mul(item.buyQuantity).toFixed(2) ?? ""}
//       </div>
//     ),
//   },
// ];
