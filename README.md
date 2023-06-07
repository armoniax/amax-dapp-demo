# dapp demo

#### 支持 `scatter`与`anchor`钱包连接
#### 演示链接钱包，转帐，合约操作与查询等。




## 安装
----

```
yarn 

yarn start
```

## 测试帐号
----

```
testuser1111
mammal venue industry until village tortoise pattern smart menu margin rib matrix
5Jv1RGHLVt4CRvGWQnZ6Ckhjir29buv2oH4tGGdVyU4xNKysdWQ
AM5CvhFPqeiyAzn6e6wJu2yzqANDsdz7KnyVKgLTWgtXb85EKfp7

testuser2222
tray amateur blade enter moment jacket flat pupil melody woman exist advice
5KUa7AEPT2YFQHc8WeaG8u117q97YGiu8krLGJrVRTMuGMpwrZj
AM5ywN4f2by3BY3kGbZbsuLH7kTLMm5kPb4CGfbE7zzdxvD2yXem

```



## 问题
----
webpack5+

```
{
   resolve: {
      fallback: {
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
      },
  },
  plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
  ]
}
```