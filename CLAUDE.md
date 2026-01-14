# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

梯航智能车创新工作室裁判系统 - 基于 Tauri 2.x + Vue 3 + TypeScript 的跨平台桌面应用程序。

硬件部分采用 STM32G431 + RT-Thread，客户端部分为本项目。

## 开发命令

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 启动开发模式（前端 + Tauri 后端）
pnpm run tauri dev
# 或
pnpm start

# 仅启动前端开发服务器（Vite）
pnpm dev

# 构建生产版本
pnpm run tauri build

# 仅构建前端
pnpm build
```

## 架构说明

### 前端架构 (Vue 3)

- **入口**: `index.html` → `src/main.ts` → `src/App.vue`
- **技术栈**: Vue 3.5 + TypeScript 5.6 + Ant Design Vue 4.x + Vue Router 4.x + Pinia 2.x
- **构建工具**: Vite 6.0（开发服务器端口 1420）
- **路径别名**: `@` 指向 `src` 目录

**路由结构** (`src/router/index.ts`):
- `/` → 重定向到 `/login`
- `/login` → 登录页
- `/home` → 首页
- `/about` → 关于页

**状态管理**: Pinia（`src/store/index.ts`，当前仅基础配置）

### 后端架构 (Rust + Tauri)

- **入口**: `src-tauri/src/main.rs` → `src-tauri/src/lib.rs`
- **技术栈**: Rust 2021 edition + Tauri 2.x
- **序列化**: serde + serde_json
- **插件**: tauri-plugin-opener（打开链接）

**Tauri 命令定义**:
- 在 `src-tauri/src/lib.rs` 中使用 `#[tauri::command]` 宏定义
- 使用 `invoke_handler` 注册命令（目前仅有示例 `greet` 命令）
- 前端通过 `@tauri-apps/api` 的 `invoke` 函数调用

**权限配置**: `src-tauri/capabilities/default.json`

### 项目配置

- **Tauri 配置**: `src-tauri/tauri.conf.json`
  - 应用标识: `com.tihangstudio.app`
  - 窗口大小: 800x600
  - 前端开发地址: `http://localhost:1420`

- **Vite 配置** (`vite.config.ts`):
  - 开发服务器端口: 1420
  - HMR 端口: 1421
  - 忽略 `src-tauri` 目录监听

- **TypeScript 配置**:
  - 主配置: `tsconfig.json`（严格模式、ES2020 目标）
  - Node 配置: `tsconfig.node.json`

## 推荐扩展

根据 `.vscode/extensions.json`:
- Vue.volar（Vue 语言支持）
- tauri-apps.tauri-vscode（Tauri 支持）
- rust-lang.rust-analyzer（Rust 语言支持）

## 重要说明

- 使用 **pnpm** 作为包管理器，而非 npm 或 yarn
- 前端路由使用 HTML5 History 模式
- Tauri 命令需要在 Rust 后端定义并注册，前端通过 `invoke()` 调用
- 修改 Rust 代码后会自动重新编译，无需手动重启
