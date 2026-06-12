# 云书城管理与销售系统

基于 `Next.js 14 + React 18 + Redux Toolkit + Prisma + MySQL` 的全栈在线购书项目，覆盖用户端购书流程和管理员后台管理流程。

## 功能范围

### 用户端

- 用户注册、登录与 JWT 认证
- 图书分类展示、关键词搜索、分页浏览
- 图书详情与相关推荐
- 购物车增删改与数量调整
- 在线下单与模拟支付
- 订单状态查询与历史订单查看
- 个人资料维护与收货地址管理

### 管理员端

- 管理员后台登录
- 图书新增、编辑、删除、上架下架
- 库存与价格调整
- 订单状态更新
- 用户列表查看
- 销售额与订单统计展示

### 技术特性

- Redux Toolkit 管理全局用户态与购物车状态
- Prisma + MySQL 管理核心业务数据
- Next.js App Router + Route Handlers 实现前后端一体化
- 中间件补充 CORS、安全头
- 文件上传接口支持头像与图书封面
- 响应式布局，兼容 PC 与移动端

## 快速启动

1. 安装依赖

```bash
pnpm install
```

2. 配置环境变量

```bash
cp .env.example .env
```

3. 初始化数据库

```bash
pnpm db:push
pnpm db:seed
```

4. 启动开发环境

```bash
pnpm dev
```

## 默认测试账号

- 管理员：`admin@bookstore.com` / `Admin@123`
- 用户：`user@bookstore.com` / `User@123`
s
## 主要目录

- `app/`：页面与 API Routes
- `components/`：用户端与后台组件
- `lib/`：认证、数据库、安全与工具函数
- `store/`：Redux Toolkit 状态管理
- `prisma/`：数据库模型与种子数据

## 说明

- 当前支付流程为模拟支付，可替换成支付宝、微信支付或其他第三方支付 SDK。
- 上传文件默认保存在 `public/uploads/`，生产环境建议切换到对象存储。
- React 默认会转义渲染内容，配合输入清洗与 CSP 头一起降低 XSS 风险。
