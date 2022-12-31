# 快速开始

项目尚处于开发阶段，DEMO网站正在建设中，如果您感兴趣可以通过github上的代码进行体验。

## 克隆项目仓库

``` bash
git clone https://github.com/gaofeiyu/whimsical.git
cd whimsical
pnpm i
```

> 项目要求pnpm版本 >= 7.12.2；Node版本大于16

## 启动组件库

因为编辑器的运作依赖一个组件库，因此需要先启动一个组件库。
项目中提供了一个react的组件库供尝试。

``` bash
pnpm run dev:react
```

> 组件库启动了一个端口为8070的本地服务，这个端口会被编辑器引用，如果变更，编辑器将会报找不到组件库。
> 相关配置在`packages/whimsical/src/mock/wNode.ts`文件中。

## 启动编辑器

``` bash
pnpm run dev
```

命令执行成功后，打开对应的地址即可开始体验。
