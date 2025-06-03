import { cn } from "@shadcn/lib/utils";
import { InputNumber as AntdInputNumber, type InputNumberProps } from "antd";
import { ConfigProvider } from "antd";

export function InputNumber<T extends string | number>(props: InputNumberProps<T>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          InputNumber: {
            activeBorderColor: "rgb(0,11,131)",
            handleHoverColor: "rgb(0,41,99)",
            hoverBorderColor: "rgb(0,49,110)",
          },
        },
      }}
    >
      <AntdInputNumber<T>
        {...props}
        className={cn(props.className, "w-full")}
        style={{
          ...(props.style || {}),
          "--ant-input-number-control-width": "100%",
        } as React.CSSProperties}
      />
    </ConfigProvider>
  );
}
