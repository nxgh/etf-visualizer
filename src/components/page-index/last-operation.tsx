import { Store } from "#store";
import type { TransactionRecord } from "#stores/types/type";
import { useObserverWidthResize } from "#utils/use-observer-width-resize";
import { Table } from "@shadcn/antd/table";
import { cn } from "@shadcn/lib/utils";
import { ScrollArea } from "@shadcn/ui/scroll-area";
import { Col, Row } from "antd";

function RenderItem({ item }: { item: TransactionRecord }) {
  const data = [
    {
      label: "",
      value: (
        <span>
          <span className={cn("mr-2", item.quantity < 0 ? "text-blue-500" : "text-red-500")}>{item.quantity > 0 ? "买入" : "卖出"}</span>
          {item.name}[{item.code ?? ""}]
        </span>
      ),
    },
    {
      label: "",
      value: <span className="text-gray-500">{item.date}</span>,
    },
    {
      label: "价格",
      value: item.price,
    },
    {
      label: "数量",
      value: Math.abs(item.quantity),
    },
    {
      label: "金额",
      value: Math.abs(item.quantity * item.price),
    },
    {
      label: "费用",
      value: item.fee,
    },
    // {
    //   label: "利润",
    //   value: item.profit,
    // },
    // {
    //   label: "利润率",
    //   value: item.profitRate,
    // },
  ];

  return (
    <Row className="w-full border-b py-2">
      {data.map((data, index) => (
        <Col
          key={`${index}-${data.label}`}
          span={12}
          className={cn("flex items-center justify-between pb-1", index % 2 !== 0 ? "text-right" : "")}
        >
          <span className="text-gray-400">{data.label}</span> {data.value ?? "--"}
        </Col>
      ))}
    </Row>
  );
}

const columns = [
  {
    title: "日期",
    dataIndex: "date",
    width: 120,
    ellipsis: true,
  },
  {
    title: "代码",
    dataIndex: "code",
    width: 100,
    ellipsis: true,
  },
  {
    title: "名称",
    dataIndex: "name",
    width: 100,
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 100,
    render: (_: unknown, item: TransactionRecord) => {
      return (
        <div className={cn("flex items-center gap-2", item.quantity > 0 ? "text-blue-500" : "text-red-500")}>
          {item.quantity > 0 ? "买入" : "卖出"}
        </div>
      );
    },
  },
  {
    title: "价格",
    dataIndex: "price",
    width: 100,
  },
  {
    title: "数量",
    dataIndex: "quantity",
    width: 100,
  },
  {
    title: "金额",
    dataIndex: "amount",
    width: 100,
  },
  {
    title: "费用",
    dataIndex: "fee",
    width: 100,
  },
  {
    title: "利润",
    dataIndex: "profit",
  },
  {
    title: "利润率",
    dataIndex: "profitRate",
  },
  // {
  //   title: "操作",
  //   dataIndex: "action",
  //   render: (_, item: TransactionRecord) => {
  //     return <div className="flex items-center gap-2">删除</div>;
  //   },
  // },
];
export function LastOperation() {
  const transaction = Store.transactionStoreAction.use.transaction();

  const { width, ref } = useObserverWidthResize();

  const data = transaction
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
    .map((item) => ({
      ...item,
      profit: item.quantity * item.price,
      profitRate: (item.quantity * item.price) / item.quantity,
    }));

  return (
    <div className="flex flex-col gap-2 h-full px-2" ref={ref}>
      {width < 600 ? (
        <ScrollArea className="h-full rounded-md w-full pr-4">
          {data.map((item) => (
            <RenderItem key={item.id} item={item} />
          ))}
        </ScrollArea>
      ) : (
        <Table scroll={{ y: 200, x: "max-content" }} size="small" rowKey="id" dataSource={data} columns={columns} pagination={false} />
      )}
    </div>
  );
}
