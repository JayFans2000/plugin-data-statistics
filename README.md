# Halo 数据统计插件

## 📊 简介

为 Halo2 提供强大的数据可视化统计功能，支持：

- **Umami 流量统计**：实时访客、访问趋势、网站分析
- **网站内部数据图表**：标签分布、分类统计、文章发布趋势、评论排行、热门文章
- **服务状态监控**：集成 Uptime Kuma 状态页面监控
- **GitHub 统计展示**：访客可查看博主的 GitHub 活跃度
- **灵活插入**：可在编辑器中任意位置插入数据图表

## ✨ 特性

- 🚀 **高性能**：内置连接池优化，解决 WebClient 连接复用问题
- 🛡️ **高可用**：自动重试机制，提升服务稳定性
- ⚡ **响应式**：支持暗色/亮色主题自动切换
- 📱 **移动端适配**：完美适配手机和平板设备
- 🔧 **易配置**：简洁的后台配置界面
- 🎨 **美观设计**：现代化 UI 设计，视觉效果出色

## 🔧 技术栈

- **后端**：Spring Boot WebFlux、Reactor Netty、Hutool
- **前端**：Vue 3、TypeScript、Rsbuild
- **UI 组件**：Halo Components
- **数据可视化**：Chart.js
- **构建工具**：Gradle、pnpm

## 🙏 致谢

**文章热力图设计灵感来源于微浸主题**：[了解主题](https://www.webjing.cn/archives/roLydXtD)

## 🌐 演示与交流

- **演示站点1**：[https://www.xhhao.com/](https://www.xhhao.com/chart)
- **演示站点2**：[https://blog.timxs.com/](https://blog.timxs.com/)
- **文档中心**：[https://docs.lik.cc/](https://docs.lik.cc/)
- **QQ 交流群**：[![QQ群](https://www.xhhao.com/upload/iShot_2025-03-03_16.03.00.png)](https://www.xhhao.com/upload/iShot_2025-03-03_16.03.00.png)

## 📦 最近更新

### v1.0.5  (2026-02-15)

**🚀 性能优化**
- 优化 WebClient 连接池配置，解决 `PrematureCloseException` 连接复用问题
- 添加自动重试机制，提升服务调用稳定性
- 实现数据缓存机制，减少重复计算

**🔧 功能完善**
- 统一 API 响应格式，提升接口规范性
- 抽取通用常量类，提高代码可维护性
- 优化日志级别，减少生产环境日志噪音

**🎨 代码质量**
- 重构 Umami 服务实现，抽取公共方法
- 完善错误处理机制
- 添加详细的代码注释 
## ⚙️ 开发环境

- Java 21+
- Node.js 18+
- pnpm 9+
- Gradle 8+

## 🛠️ 开发指南

### 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd plugin-data-statistics

# 安装前端依赖
cd ui
pnpm install
cd ..
```

### 开发命令

```bash
# 后端开发（监听模式）
./gradlew build --continuous

# 前端开发（热重载）
cd ui
pnpm dev

# 构建插件
./gradlew build

# 只压缩 CSS
./gradlew minifyCss

# 清理构建
cd ..
./gradlew clean
```

## 📄 许可证

[GPL-3.0](./LICENSE) © Handsome

## 💖 支持作者

如果你觉得这个插件对你有帮助，欢迎：

- Star 本项目 ⭐
- 分享给更多人 📢
- 提交 Issue 或 PR 🤝
- 捐赠支持开发者 ☕