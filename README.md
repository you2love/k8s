# Kubernetes 学习教程

一个现代化的 Kubernetes 学习教程网站，采用模块化设计，易于维护和扩展。

## 项目结构

```
k8s-tutorial/
├── index.html                 # 主页面文件
├── assets/                    # 静态资源目录
│   ├── css/
│   │   └── styles.css        # 样式文件
│   └── js/
│       └── script.js         # JavaScript 逻辑
└── data/                      # 数据目录
    └── concepts/              # 概念内容
        ├── pod.html          # Pod 卡片 HTML
        ├── pod.js            # Pod 详细内容
        ├── deployment.html   # Deployment 卡片 HTML
        ├── deployment.js     # Deployment 详细内容
        ├── service.html      # Service 卡片 HTML
        ├── service.js        # Service 详细内容
        ├── node.html         # Node 卡片 HTML
        ├── node.js           # Node 详细内容
        ├── configmap.html    # ConfigMap 卡片 HTML
        ├── configmap.js      # ConfigMap 详细内容
        ├── secret.html       # Secret 卡片 HTML
        └── secret.js         # Secret 详细内容
```

## 功能特性

- 📚 **核心概念**：详细介绍 Kubernetes 核心概念
- 📥 **安装指南**：支持多平台安装（macOS、Linux、Windows、云服务商）
- 🛠️ **实践指南**：手把手教程
- ❓ **常见问题**：问题排查和解决方案
- ⭐ **最佳实践**：安全、资源管理、监控等最佳实践

## 技术栈

- **HTML5** - 语义化结构
- **CSS3** - Bootstrap 5 + 自定义样式
- **JavaScript** - 原生 JS，无框架依赖
- **Material Icons** - 图标库

## 如何使用

### 本地运行

1. 克隆项目
2. 直接在浏览器中打开 `index.html`
3. 或使用本地服务器（推荐）：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 使用 PHP
php -S localhost:8000
```

### 添加新概念

1. 在 `data/concepts/` 目录下创建新的 HTML 和 JS 文件
2. 在 `assets/js/script.js` 的 `concepts` 数组中添加新概念名称
3. 刷新页面即可看到新概念

## 浏览器兼容性

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移动端浏览器

## 许可证

MIT License