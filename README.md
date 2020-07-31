# 360mp store

## 文档

- [jsDoc 类型声明](https://www.tslang.cn/docs/handbook/type-checking-javascript-files.html)

## 开发指南

> 开发项目前请仔细阅读此规范,也请谨慎遵守此开发规范

开发项目前请安装 `eslint` VSCode 插件

```shell
# 通过快捷键 Ctrl + P 调出快速面板，然后粘贴下面命令
ext install esbenp.eslint-vscode
```

### 启动

如果习惯使用 `npm`, 请替换成 `npm run *`。

#### Dependencies

```shell
# install dependencies
yarn install
```

#### Serve

```shell
# Compile project and watch file
yarn serve
```

#### Build

```shell
# build for production
yarn build
```

#### test unit

```shell
# 查看测试用例通过情况
yarn run test
# 查看测试覆盖率
yarn run test --covarage
```

#### git commit

```shell
# submit git log with conventional style
yarn commit
```

## 工作流程指南

### Code Review

为了确保本项目的代码健康程度不会随着时间的推移慢慢下降，请严格遵循 Google 工程指南实施代码评审制度（Code Review），在为本项目贡献代码前，请花一部分时间阅读 Google 工程实践文档。
文档地址：https://github.com/google/eng-practices  
中文参考资料：https://github.com/berwin/Blog/issues/44

### Git 流程

Git 流程遵从广为流传的 GitFlow 流程，两个长期分支： master 和 develop、以及若干个短期分支： feature、hotfix。

###### 长期分支

- master
  线上代码分支，与线上代码保持一致。(此分支只能通过 Merge_Request 的方式向前增长)
- develop
  充当功能集成分支，开发完成并经过测试的 feature 分支合并到 develop 分支，严禁将未开发完成的 feature 分支合并到 develop

###### 短期分支

- feature/\*  
  feature 分支从 develop 分支生成，用于开发新功能。开发完成后并且测试通过，通过提 pr 合并到 develop 分支。开发者严禁直接合并到长期分支。
- hotfix/\*
  hotfix 分支主要用于解决线上 bug ，从 master 分支生成，修改完成后通过 pr 审核后合并到长期分支。

### Commit 提交规范

commit 提交规范遵循 [Angular 规范](https://github.com/angular/angular.js/blob/f3377da6a748007c11fde090890ee58fae4cefa5/CONTRIBUTING.md#-git-commit-guidelines)，大致规范如下：

```
<type>(<scope>): <subject>
// 空一行
<body>
//type（必需）、scope（可选）和subject（必需）
//<body>(可选)
```

- type 用于说明 commit 的类别，只允许使用下面 8 个标识。
- feat：新功能（feature）
- fix：修补 bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- perf: 性能提升
- test：增加测试
- chore：构建过程或辅助工具的变动

## 入口汇总

###### 1、zhanshicube（商业化的 cube）

- 打开探索 tab 的链接：http://so.mp.360.cn/mp.html?appid=qhe9q84tw21mn6mwkv&path=pages%2fhome%2findex%3ftab%3ddiscover
- 打开小程序 tab 的链接：http://so.mp.360.cn/mp.html?appid=qhe9q84tw21mn6mwkv&path=pages%2fhome%2findex%3ftab%3dminiprogram
- 打开小游戏 tab 的链接：http://so.mp.360.cn/mp.html?appid=qhe9q84tw21mn6mwkv&path=pages%2fhome%2findex%3ftab%3dminigame
- 打开网页游戏 tab 的链接：http://so.mp.360.cn/mp.html?appid=qhe9q84tw21mn6mwkv&path=pages%2fhome%2findex%3ftab%3dwebgame
- 打开云游戏 tab 的链接：http://so.mp.360.cn/mp.html?appid=qhe9q84tw21mn6mwkv&path=pages%2fhome%2findex%3ftab%3dcloudgame
- 打开我的 tab 的链接：http://so.mp.360.cn/mp.html?appid=qhe9q84tw21mn6mwkv&path=pages%2fhome%2findex%3ftab%3dmy
- 打开排行榜的链接：http://so.mp.360.cn/mp.html?appid=qhe9q84tw21mn6mwkv&path=%23/pages/cloudRanking/index&channel=ecommand&from=share&k=

## 发布测试版本

###### 1、绑 host: 10.216.0.188 mp.360.cn 上传代码

###### 2、审核后台点击通过按钮

- host: 10.132.65.214 dev.rms.mp.360.cn
- host: 10.216.0.188 test.api.wallet.qihoo.net
- 访问地址：http://dev.rms.mp.360.cn/audit/pcminiplatformapp
