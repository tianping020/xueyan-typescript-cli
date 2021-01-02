# xueyan-typescript-cli

## Introduction

xueyan-typescript-cli is a react cli application.

The project created by xueyan <yang@xueyan.site>.

## Install

- NPM: `npm i -g xueyan-typescript-cli`  
- YARN: `yarn global add xueyan-typescript-cli`  

## xueyan-typescript create

`xueyan-typescript create [path]` create application or package

## xueyan-typescript start

`xueyan-typescript start [path]` start application (no package)

## xueyan-typescript build

`xueyan-typescript build [path] [-w, --watch]` build application or package

## xueyan-typescript serve

`xueyan-typescript serve [path]` run application by http server (no package)

## react-application config

```ts
interface ReactApplicationConfig {
  type: 'react-application'
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  startPort?: number
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  servePort?: number
  /** <https://webpack.docschina.org/configuration/dev-server/#devserverproxy> */
  startProxies?: ProxyConfigArrayItem[]
  /** <https://webpack.docschina.org/configuration/dev-server/#devserverproxy> */
  serveProxies?: ProxyConfigArrayItem[]
  /** <https://webpack.docschina.org/configuration/resolve/#resolvealias> */
  moduleAlias?: Resolve['alias']
  /** <https://webpack.docschina.org/configuration/externals/> */
  moduleExternals?: ExternalsElement[]
  /** <https://webpack.docschina.org/configuration/module/#condition> */
  babelParseIncludes?: RuleSetCondition[]
  /** <https://webpack.docschina.org/configuration/module/#condition> */
  babelParseExcludes?: RuleSetCondition[]
}
```

## react-package config

```ts
interface ReactPackageConfig {
  type: 'react-package'
}
```

## node-application config

```ts
interface NodeApplicationConfig {
  type: 'node-application'
}
```

## node-package config

```ts
export interface NodePackageConfig {
  type: 'node-package'
}
```
