YSPM- Static Package Manager
=================================================

YSPM是前端打包工具。

## 安装

```
tnpm install yspm
npm install yspm -g
npm install yspm -g --registry http://10.5.111.205:4873
```

## 使用方法

```bash
yspm [COMMAND]
```

### 目录结构

```bash
src/		# 源代码=
build/		# 打包后代码，未压缩=
dist/		# 压缩后代码=
```

### 构建JS

```bash
yspm demo/js/main.js
yspm demo/js
```

### 构建LESS

```bash
yspm demo/css/main.less
yspm demo/css
```

### 构建图片

```bash
yspm demo/img/demo.png
yspm demo/img
```

### 压缩打包后的代码

```bash
yspm min g/js/g.js
```

### 监听JS修改实时构建

```bash
yspm watch
yspm watch demo/js/
```

### 配置说明

* js/css：JS和CSS入口文件。
* concatJs：全局非AMD文件。
* globalJs：全局入口文件。
