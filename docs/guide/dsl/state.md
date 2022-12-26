# 数据描述

## 类型声明

```
type BodyStateType = {
  store?: Record<string, unknown>;
  api?: Record<string, unknown>;
};
```

## 示例

```
{
  store: {},
  api: {
    // key是相关接口的别名
    getInfo: {
      // 请求方式
      method: 'GET',
      // 请求地址
      url: 'https://example.com/mobile/getInfo',
      // 默认请求传参 object | string
      params: {}
      // mock数据 | 预加载数据 | 请求后存放数据的地方
      body: {
        name
      }
    }
  }
}
```
