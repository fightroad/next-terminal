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
