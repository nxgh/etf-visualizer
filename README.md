

依赖管理

- 安装公共依赖 `pnpm i <package_name> -w` 
- 安装子项目依赖 `pnpm add <package_name> --filter <sub_project_name>` 
- 子项目引入 ` pnpm add '@etf-visualizer/shared@workspace:*' --filter @etf-visualizer/server` 



```
apps/
 - frontend
 - server 
packages/
 - spider       
 - database 
 - shared
   - types
   - logger
   - utils
```