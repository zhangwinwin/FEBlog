---
title: 梳理git的常用指令
---

## 前言
git是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理。  

git是一名程序员必须掌握技能。所以很有必要来学习一些常用git的指令。下面结合《pro git》来梳理常用的git指令。

## 文件状态
在git仓库下，每一个文件只有两种状态：已跟踪、未跟踪。  
1、已跟踪文件是指已经被纳入版本控制的文件。  
在上一次快照中有它们的记录，在工作一段时间后，它们的状态可能是未修改、已修改或已放入暂存区。  

2、未跟踪文件是指除了已跟踪文件之外的其他文件。  
它们既不存在与上次快照的记录中，也没有被放入暂存取。  

### 状态转换
初次clone某个仓库时，目录下的所有文件都是已跟踪文件，并处于未修改状态。  

编辑某些文件后，由于自上次提交后对它们做了修改，git将它们标记为已修改文件。将这些修改过的文件放入暂存区，然后提交所有暂存了的修改，如此反复。  
**文件的状态变化周期** -> 如图所示。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708ab2e5d40793a~tplv-t2oaga2asx-image.image' title='文件的状态变化周期' width='600'>  

### 检查当前文件状态--git status
运用git status命令查看哪些文件处于什么状态。  
* 情景一： 在clone仓库后立即使用该命令  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708ac1c3344e30d~tplv-t2oaga2asx-image.image' width='600'>  
说明所有已跟踪文件在上次提交后都未被更改过。此外还表明，当前目录下没有出现任何未跟踪状态的新文件。  

* 情景二： 创建一个新文件--a.md  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708ac734525a223~tplv-t2oaga2asx-image.image' width='600'>  
新建的a.md文件出现在Untracked files下面。未跟踪文件是git在之前的快照中没有的文件。git不会自动将其纳入跟踪范围，需要手动增加。  


### 跟踪新文件--git add
运用git add跟踪一个文件。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708acb7b08d5b37~tplv-t2oaga2asx-image.image' width='600'>  
只要在Changes to be committed下，就说明是已暂存状态。如果此时commit，那么该文件就会被存在历史快照中。  

### 查看已暂存和未暂存的修改--git diff
git status的输出过于模糊，不清楚具体的修改。这时，可以运用git diff命令。  

* 情景一：编辑a.md文件后先不暂存。然后运用git diff
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708ad45d18941fa~tplv-t2oaga2asx-image.image' width='600'>  
可以清楚的看到当前文件和暂存区域快照之间的差异。也就是修改之后还没有暂存起来的变化内容。  

* 情景二：创建b.md文件后暂存。然后运用git diff --staged
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708add473ae3e61~tplv-t2oaga2asx-image.image' width='600'>  
git diff --staged命令将比对已暂存文件与最后一次提交的文件差异  

* 注意：git diff本身只显示尚未暂存的改动，而不是自上次提交以来所做的所有改动。所以有时候你一下子暂存了所有更新过的文件后，运行git diff后却什么也没有，就是这个原因。  

### 提交更新 git commit
运用git commit将会启动文本编辑器以便输入本次提交的说明
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708ae1681aec112~tplv-t2oaga2asx-image.image' width='600'>  

也可以在 commit 命令后添加 -m 选项，将提交信息与命令放在同一行。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708ae311d82c3fb~tplv-t2oaga2asx-image.image' width ='600'>  

给git commit加上-a选项，git就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 git add步骤。


## 查看提交历史
在开发中，想查看commit历史。最简单的就是用git log。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708ae65fbbdbcb6~tplv-t2oaga2asx-image.image' width='600'>  
不传入任何参数的默认情况下，git log会按时间先后顺序列出所有的提交，最近的更新排在最上面。 如图所示，这个命令会列出每个提交的SHA-1校验和、作者的名字和电子邮件地址、提交时间以及提交说明。  

git log有许多选项可以帮助搜寻所要找的提交，下面介绍几个最常用的选项。  

* 其中一个比较有用的选项是-p，它会显示每次提交所引入的差异。与此同时，你也可以使用-1选项来仅显示最近的一次提交  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708aec0f66f9640~tplv-t2oaga2asx-image.image' width='600'>  

* 另一个非常有用的选项是--pretty(详细参数，请查阅文档)。这个选项可以使用不同于默认格式的方式展示提交历史。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708aed72e834c75~tplv-t2oaga2asx-image.image' width='600'>  

## 撤消操作
在任何一个阶段，都有可能想要撤消某些操作。学习几个撤消修改的基本命令将对你大有裨益。但是有些撤消操作是不可逆的。这是在使用git的过程中，会因为操作失误而导致之前的工作丢失的少有的几个地方之一。  

* 情景一：有时候提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。 此时，可以运行带有--amend选项的提交命令尝试重新提交  
```
$ git commit --amend
```
这个命令会将暂存区中的文件提交。如果自上次提交以来还未做任何修改，那么快照会保持不变，而所修改的只是提交信息。  

* 情景二：有时候已经修改了a.md和b.md两个文件并且想要将它们作为两次独立的修改提交，但是却意外地输入了git add *全部暂存了。如何只取消暂存a.md呢？  
```
git reset HEAD a.md
```

* 情景三：对a.md做了修改，但不想保留修改，想撤销这个修改。将它还原成上次提交时的样子。
```
git checkout -- a.md
```

## 远程仓库的使用
为了能在任意git项目上协作，需要知道如何管理自己的远程仓库。  

### 查看远程仓库--git remote
* 已经克隆了自己的仓库，那么至少应该能看到origin，这是git克隆的仓库服务器的默认名字。  
* 也可以指定选项 -v，会显示需要读写远程仓库使用的git保存的简写与其对应的URL
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708b0bff050c336~tplv-t2oaga2asx-image.image' width='600'>  

### 添加远程仓库--git remote add shortname url
```
git remote add origin https://github.com/../../..
```
之后就可以在命令行中使用字符串origin来代替整个url  

### 从远程仓库中抓取与拉取
1、git fetch [remote-name]
* 这个命令会访问远程仓库，从中拉取所有目前本地仓库还没有的数据。执行完成后，将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看。  
* 这命令并不会自动合并或修改当前本地的工作。当准备好时必须手动将其合并入本地的工作。  

2、git pull [remote-name]  
* 与git fetch类似也会拉取远程仓库的数据。  
* 区别在于git pull抓取数据后，会自动尝试合并到当前所在的分支。

### 推送到远程仓库--git push
当想要将master分支推送到origin服务器时，那么运行这个命令就可以将你所做的备份到服务器
```
git push origin master
```

## 打标签
可以给历史中的某一个提交打上标签，以示重要。比较有代表性的是人们会使用这个功能来标记发布功能版本（v1.0 等等）。

### 列出标签--git tag
这个命令以字母顺序列出标签  

如果只对v2.0标签系列感兴趣的，可以输入
```
git tag -l 'v2.0*'
```

### 创建标签
git使用两种主要类型的标签:  
1、轻量标签  
* 一个轻量标签很像一个不会改变的分支——它只是一个特定提交的引用  

2、附注标签  
* 附注标签是存储在git数据库中的一个完整对象。它们是可以被校验的；  
* 其中包含打标签者的名字、电子邮件地址、日期时间；  
* 通常建议创建附注标签，这样你可以拥有以上所有信息；  

创建附注标签：  
运行tag命令时指定-a选项来创建**附注标签**，-m选项指定了一条将会存储在标签中的信息
```
git tag -a v1.0 -m "first version 1.0"
```

运行git show命令可以看到标签信息与对应的提交信息
```
git show v1.0
```

创建轻量标签：  
轻量标签本质上是将提交校验和存储到一个文件中——没有保存任何其他信息。创建轻量标签，不需要使用-a、-s或-m选项，只需要提供标签名字。
```
git tag v1.0
```
如果在标签上运行git show，不会有额外的标签信息

### 后期打标签
情景一：现在开发v1.3版本，经过几轮commit之后才发现没有打v1.2标签。  
想要在增加ignore那次commit中打上v1.2标签
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708b339846cc66a~tplv-t2oaga2asx-image.image' width='600'>  

只需要在命令的末尾指定提交的校验和（或部分校验和）  
```
git tag -a v1.2 0bec1b1d2 '标签信息'
```
再次查看  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/28/1708b3805b3935e4~tplv-t2oaga2asx-image.image' width='600'>

### 共享标签
默认情况下，git push命令并不会传送标签到远程仓库服务器上。在创建完标签后必须手动地推送标签到共享服务器上。
* 可以运行 git push origin [tagname]。
```
git push origin v1.2
```
* 可以使用带有--tags选项的git push命令。这将会把所有不在远程仓库服务器上的标签全部传送到那里。
```
git push origin --tags
```

### 删除标签
* 删除本地标签可以使用命令 git tag -d [tagname]
```
git tag -d v1.2
```

## 分支管理
### 分支列表--git branch
运行git branch如果不加任何参数，会得到当前所有分支的一个列表
```
$ git branch
  iss53
* master
  testing
```
* master分支前的*字符代表当前HEAD指针所指向的分支。  

如果需要查看每一个分支的最后一次提交，可以运行git branch -v命令
```
$ git branch -v
  iss53   93b412c fix javascript issue
* master  7a98805 Merge branch 'iss53'
  testing 782fd34 add scott to the author list in the readmes
```

### 分支的新建与合并
* 分支新建--git branch [branchName]  
运行git branch 'dev'，创建dev分支  
* 分支切换--git checkout [branchName]  
运行git checkout dev，切换到dev分支  
* 分支合并--git merge [branchName]  
在master中运行git merge dev，将dev分支与master进行合并。

### 储藏与清理
有时，在项目的一个分支上已经工作一段时间，所有东西都进入了混乱的状态，而这时想要切换到另一个分支做一点别的事情。问题是，不想仅仅因为过会儿回到这一点而为做了一半的工作创建一次提交。这时可以运用git stash命令。  

* 改动a.md，然后运行git status看当前状态
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/17090266e352b78f~tplv-t2oaga2asx-image.image' width='600'>  
* 现在想要切换分支，但是还不想要提交之前的工作；所以储藏修改。运行git stash或 git stash save：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/170902cfc1b91db3~tplv-t2oaga2asx-image.image' width='600'>  

* 要查看储藏的东西，可以使用git stash list：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/17090dccecfd22c3~tplv-t2oaga2asx-image.image' width='600'>  

* 要恢复储藏的工作，可以使用git stash apply  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/17090dfc765d5903~tplv-t2oaga2asx-image.image' width='600'>  
* 文件的改动被重新应用了，但是之前暂存的文件却没有重新暂存。必须使用 --index 选项来运行git stash apply命令，来尝试重新应用暂存的修改
```
git stash apply --index
```

* 删除存储的工作，可以运用git stash drop加上将要移除的储藏的名字来移除它。也可以通过git stash pop移除栈顶元素


## 综合
下面通过一个综合的例子，可以说是大多数程序员都会遇到的案例来说明运用git的工作流程。  

1、进行某个项目的开发。  
2、为实现v1.2版本的新需求开发而创建一个新的分支。  
3、在这个新分支上开展工作。  

正在此时，突然接到一个电话说已发行的版本上有个很严重的问题需要紧急修补。 按照下面方法进行操作：  
1、切换到线上分支（production branch）。  
2、为这个紧急任务新建一个分支，并在其中修复它。  
3、在测试通过之后，切换回线上分支，然后合并这个修补分支，最后将改动推送到线上分支。  
4、切换回v1.2版本的分支上，继续工作。  

### 1、新建issue1.2分支
```
git checkout -b issue1.2
// 等同于下面两条指令
git branch issue1.2
git checkout issue1.2
```
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/1709100ceee42e52~tplv-t2oaga2asx-image.image' width='600'>

### 2、在issue1.2上有一些提交
```
vim footer.js
git commit -a -m 'added a footer.js in issue1.2'
```
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/170910603710a35a~tplv-t2oaga2asx-image.image' width='600'>

### 3、接到紧急任务
接到那个紧急任务电话。有了git的帮助，所要做的仅仅是切换回 master 分支。  

但是，在checkout之前，要存储当前分支上工作目录和暂存区里那些还没有被提交的修改。
```
git stash
```
然后切换到master
```
git checkout master
```
这个时候，工作目录和issue1.2开发之前一模一样，可以专心修复紧急问题了。  
建立一个针对该紧急问题的分支（hotfix branch），在该分支上工作直到问题解决
```
git checkout -b hotfix
vim index.html
git commit -a -m 'fixed some broken'
```

### 4、将hotfix合并到master上
确保修改是正确的，然后将其合并回master分支来部署到线上
```
git checkout master
git merge hotfix
```
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/1709116d4e149129~tplv-t2oaga2asx-image.image' width='600'>  

最新的修改已经在 master 分支所指向的提交快照中，你可以着手发布该修复了。
然后删除hotfix分支
```
git branch -d hotfix
```

### 5、切换到issue1.2分支继续工作
```
git checkout issue1.2
```
取出存储的文件改动
```
git stash apply --index
```
现在已经实现了1.2版本的功能，打算更新到master上
```
git checkout master
git merge issue1.2
```
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/29/170911f1fe8de825~tplv-t2oaga2asx-image.image' width='600'>  

然后删除issue1.2分支
```
git branch -d 'issue1.2'
```

## 总结
掌握上面的常用git指令，应该能满足日常的开发。在此基础上再去学习一些高级指令或一些骚操作，能让你的开发更加流畅。
