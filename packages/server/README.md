# 微博用户历史博文数据采集

api /

- sync 同步客户端发来的 JSON 数据，直接存为 JSON， 最近保留 10 条

```
interface SyncRequest {
    userId: string;
    clientId: string;
    data: string;
}
```
