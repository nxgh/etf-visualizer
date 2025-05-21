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
      <AntdInputNumber<T> {...props} />
    </ConfigProvider>
  );
}
