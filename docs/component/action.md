# Action表达式

程序在运行中会有很多交互的行为需要进行描述，如：跳转、接口请求、登录、分享...，若想在DSL中设置这些行为并生效，需要对相关行为进行抽象，并和系统产生关联

> 当前实现的引擎中，我将Action和事件通过Promise实现成了同样的行为，你可以简单理解为`Action`约等于`事件`

## Action的表达式

```
{
  "type":"Action",
  // 行为的名称
  "value":"Jump",
  // 辅助参数，可嵌套表达式
  // 行为的参数，可以是数组，也可以是字段，字段的值需要符合表达式规范
  "params":[
    {
      "type":"API",
      "value":"api.apiName.data.community.name"
    }
  ]
}
```

# 如何开发Action


> 简单来说行为就是在DSL中的一个语法糖

我们以Jump为例：

```
// 请将方法名和行为名称保持一致
export const Jump = (
  // action表达式
  actionItem, 
  // 配置字段，可能包含 state: 数据、loopCache: 循环缓存、context: 上下文
  options
) => {
  const { params } = actionItem;
  const urlList = execProp(params, options);

  if (urlList && urlList.length && urlList[0]) {
    window.open(urlList[0]);
  }

  // 如果行为没有需要传递的副作用可以返回null，或者不返回
  return null;
};
```
### 如何挂载


``` Typescript
import { registerActionModule } from 'whimsical-shared';
import Jump from '../actions/Jump';
registerActionModule({
  Jump
})
```
