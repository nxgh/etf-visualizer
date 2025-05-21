import { DatePicker as AntdDatePicker, type DatePickerProps } from "antd";
import { ConfigProvider } from "antd";

export function DatePicker(props: DatePickerProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            activeBorderColor: "rgb(0,0,0)",
            hoverBorderColor: "rgb(0,0,0)",
          },
        },
      }}
    >
      <AntdDatePicker {...props} />
    </ConfigProvider>
  );
}
