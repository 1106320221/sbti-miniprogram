# 低智商犯罪 SBTI 人格测试 - 微信小程序

## 项目结构
```
sbti-miniprogram/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序全局配置
├── app.wxss               # 全局样式
├── project.config.json    # 项目配置
├── sitemap.json           # 站点地图
├── pages/
│   ├── intro/             # 首页
│   │   ├── intro.js
│   │   ├── intro.json
│   │   ├── intro.wxml
│   │   └── intro.wxss
│   ├── test/              # 测试页
│   │   ├── test.js
│   │   ├── test.json
│   │   ├── test.wxml
│   │   └── test.wxss
│   └── result/            # 结果页
│       ├── result.js
│       ├── result.json
│       ├── result.wxml
│       └── result.wxss
└── utils/
    ├── data.js            # 数据层（题目、人格库、维度等）
    └── compute.js         # 计算逻辑（洗牌、评分、匹配等）
```

## 使用方法

### 1. 导入项目
1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具
3. 点击「导入项目」，选择 `sbti-miniprogram` 目录
4. 填写 AppID（可以先选择「测试号」）

### 2. 添加图片资源
将《低智商犯罪》主题的人格图片放入项目中，并更新 `utils/data.js` 中的 `TYPE_IMAGES` 对象。

### 3. 预览或上传
- 在微信开发者工具中点击「预览」生成二维码，在手机微信中扫码预览
- 或者点击「上传」按钮将代码上传到微信小程序后台

## 主要功能
- 首页介绍
- 30道测试题 + 补充题
- 15个维度评分
- 24种人格类型（包括特殊人格）
- 结果展示
- 重新测试

## 技术特点
- 模块化设计（数据层、计算逻辑与视图层分离）
- 刑侦风格 UI 设计
- 本地存储记录测试结果
- 支持分享
