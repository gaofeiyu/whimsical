# 说明
文档都以yarn为例，如果使用的事npm请自行切换命令


## 安装依赖
文档都以yarn为例，如果使用的事npm请自行切换命令

- 安装本地环境

``` bash
yarn
```
## 本地构建

``` bash
yarn build
```

## 发布

- [whimsical-shared package](https://ee.58corp.com/irepo/file/tools?groupId=coralsea&format=npm&activeTab=TabList)

# 工具内容
## 遍历节点

`./src/ergodicNode.ts`

- 根据DSL树遍历节点，并根据回调返回节点信息
- 也可以遍历TreeNode，但是需要传递`getNodeInfo`初始化遍历需要的节点信息

## 表达式操作

`./src/propsGenerator.ts`

- `isLoopData(data: DSLNodeDataType): boolean` 判断当前节点的data（节点下的data属性）是否是循环
- `transformStateData(state: any, path: string): any` 根据数据源和路径返回数据
- `getLoopData(data: DSLNodeDataType, state): any[]` 根据数据源返回当前节点data（节点下的data属性）属性下的循环数据
- `getLoopStateData(props: DSLExpressionType, loopCache: LoopCacheType[] = []): any` 根据loopCache返回当前`LoopState`表达式的值
- `getNormalData(prop: DSLExpressionType, state): any` 根据数据源和表达式返回数据
- `getFunctionArguments(prop: DSLExpressionType, args: any[]): any` 返回上层方法的实参
- `getJSONData(prop: DSLExpressionType, options?: any): any` 解析JSON表达式
- `execLogic(logicExpression: DSLExpressionType, options?: any): any` 解析logic表达式
- `execProps(props: DSLExpressionType[], options?: any): any` 解析一个表达式数组
- `execProp` 通用表达式解析工具方法，详情见源文件

## 事件管理

`./src/eventManager.ts`
- `execEvent(eventExpression: EventExpressionType, options?: ActionModuleOptionsType)` 根据行为表达式和上下文，执行行为
- `generatorEvents(eventOptions: EventExpressionType[], options?: ActionModuleOptionsType)` 执行节点中的event属性
- `registerActionModule(actions: { [key: string]: IActionModule })` 注册事件到上下文

## 组件管理

`./src/componentManager.ts`
- `registerComponents = (newComponents: { [key: string]: any })` 注册组件到上下文
- `getComponents()` 获取已注册的组件

## 数据操作

`./src/updateStore.ts`
- `updatePageDSLStateStore(originPageDSL: PageDSLType, storeValue: JSONType): PageDSLType` 根据当前的pageDSL，更新store数据，并返回新的pageDSL

## 生成编辑器使用配置的工具方法

`./src/libConfigAPI.ts`，该工具方法的值暴露在`libConfigAPI`对象下面
- `formatDesignLocalesByComponentDSL` 根据组件DSL描述格式化出编辑器使用的国际化配置
- `formatSeedListByComponentDSL` 根据组件DSL描述格式化出编辑器使用的组件列表
- `formatFormItemConfigByComponentDSL` 根据组件DSL描述格式化出编辑器属性控制的配置信息


## 其他工具方法

- `getTypeof(target: any)`
- `isObject(target: any)`
- `isArray(target: any)`
- `isNumber(target: any)`
- `getQueryPrams(search: string)`
- `setValue(path: string, val: any, obj?: any)`
