import { Button, ConfigProvider, Modal, Space } from "antd";
import type { ModalProps } from "antd/es/modal";


export function Model({ children, ...props }: { children: React.ReactNode } & ModalProps) {
  return (
    <ConfigProvider>
      <Modal {...props}>{children}</Modal>
    </ConfigProvider>
  );
}
