# Next Terminal

## 快速了解

Next Terminal是一个简单好用安全的开源交互审计系统，支持RDP、SSH、VNC、Telnet、Kubernetes协议。

## 主要功能

- 授权凭证管理
- 资产管理（支持RDP、SSH、VNC、TELNET协议）
- 指令管理
- 批量执行命令
- 在线会话管理（监控、强制断开）
- 离线会话管理（查看录屏）
- 双因素认证
- 资产标签与授权
- 多用户&用户分组
- 计划任务
- SSH Server
- 登录策略
- 系统监控

## 快速安装

- [安装文档](https://next-terminal.typesafe.cn)

默认账号密码为 `admin/admin`。

## Docker Compose 部署

使用项目根目录的 `docker-compose.yml` 文件快速部署：

```bash
docker-compose up -d
```

### 配置说明

- **guacd 服务**：Guacamole 代理服务，用于处理远程连接
- **next-terminal 服务**：主服务，Web 界面和 API
  - 端口映射：`8088:8088`（可根据需要修改）
  - 数据目录：`/opt/docker/next-terminal/data`（可根据需要修改）
  - 使用 SQLite 数据库（默认）
- **网络**：自动创建 `next-terminal` 网络，两个服务在同一网络中

### 环境变量

可通过环境变量覆盖配置：

- `DB`: 数据库类型，`sqlite` 或 `mysql`
- `GUACD_HOSTNAME`: guacd 服务地址（默认：`guacd`）
- `GUACD_PORT`: guacd 服务端口（默认：`4822`）

使用 MySQL 数据库示例：

```yaml
environment:
  DB: mysql
  MYSQL_HOSTNAME: mysql
  MYSQL_PORT: 3306
  MYSQL_USERNAME: next-terminal
  MYSQL_PASSWORD: your_password
  MYSQL_DATABASE: next-terminal
```

## 配置文件说明

项目根目录的 `config.yml` 为配置文件示例，主要配置项：

### 数据库配置

- `db`: 数据库类型，`sqlite` 或 `mysql`
- `sqlite.file`: SQLite 数据库文件路径
- `mysql.*`: MySQL 数据库连接信息

### 服务器配置

- `server.addr`: 服务器监听地址，格式：`IP:端口`

### Guacd 配置

- `guacd.hostname`: guacd 服务地址
- `guacd.port`: guacd 服务端口（默认：`4822`）
- `guacd.recording`: 录屏文件存储路径（需绝对路径）
- `guacd.drive`: 文件传输存储路径（需绝对路径）

### SSH Server 配置

- `sshd.enable`: 是否启用 SSH Server
- `sshd.addr`: SSH Server 监听地址
- `sshd.key`: SSH 私钥文件路径

### 注意事项

1. `guacd.recording` 和 `guacd.drive` 必须是绝对路径
2. 这两个路径需要 next-terminal 和 guacd 都能访问到（Docker 部署时需挂载相同卷）
3. 配置文件路径优先级：
   - `/etc/next-terminal/config.yml`
   - `$HOME/.next-terminal/config.yml`
   - `./config.yml`（当前目录）

## 手动编译

1. 准备 Linux 或 Mac 环境
2. 安装 Go 1.20 或以上版本
3. 安装 Node.js 18 或以上版本，以及 npm 或 yarn
4. 进入 `web` 目录执行 `yarn` 或 `npm install`
5. 返回项目根目录，执行 `sh build.sh`

## 协议与条款

如您需要在企业网络中使用 next-terminal，建议先征求 IT 管理员的同意。下载、使用或分发 next-terminal 前，您必须同意 [协议](./LICENSE) 条款与限制。本项目不提供任何担保，亦不承担任何责任。

## License

Next Terminal 使用 [AGPL-3.0](./LICENSE) 开源协议，请自觉遵守。
