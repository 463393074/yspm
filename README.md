YSPM- Static Package Manager
=================================================

YSPM是前端打包工具。

## 安装

```
npm install yspm -g
```

## 使用方法

```bash
yspm [COMMAND]
```

### 目录结构

```
src/		# 源代码=
build/		# 打包后代码，未压缩=
dist/		# 压缩后代码=

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

### 指定配置
用config参数指定配置，默认用当前目录下的`tpm-config.js`。

```bash
yspm demo/js/main.js --config=my-config.js
```

### 整理build、dist目录

删除build、dist里的多余的目录和文件。

### 配置说明

* js/css：JS和CSS入口文件。
* concatJs：全局非AMD文件。
* globalJs：全局入口文件。
