import { message, Upload } from "antd";
import { Button } from "@shadcn/ui/button";

export function UploadTransaction() {
  return (
    <Upload
      beforeUpload={(file, fileList) => {
        console.log(file, fileList);
        return false;
      }}
    >
      <Button>Upload</Button>
    </Upload>
  );
}
