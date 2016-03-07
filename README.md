TSPM- Static Package Manager
=================================================

TSPM是前端打包工具。

## 安装

```
npm install tspm -g
```

## 使用方法

```bash
tspm [COMMAND]
```

### 目录结构

```
src/		# 源代码=
build/		# 打包后代码，未压缩=
dist/		# 压缩后代码=

### 构建JS

```bash
tspm demo/js/main.js
tspm demo/js
```

### 构建LESS

```bash
tspm demo/css/main.less
tspm demo/css
```

### 构建图片

```bash
tspm demo/img/demo.png
tspm demo/img
```

### 压缩打包后的代码

```bash
tspm min g/js/g.js
```

### 指定配置
用config参数指定配置，默认用当前目录下的`tpm-config.js`。

```bash
tspm demo/js/main.js --config=my-config.js
```

### 整理build、dist目录

删除build、dist里的多余的目录和文件。

### 配置说明

* main：JS和CSS入口文件。
* libjs：全局非AMD文件。
* global：全局入口文件。
