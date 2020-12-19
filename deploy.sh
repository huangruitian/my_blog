#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://huangruitian.github.io
# git push -f git@github.com:huangruitian/huangruitian.github.io.git master
# http://huangruitian.gitee.io/my_blog
git push -f https://gitee.com/huangruitian/my_blog.git master:gh-pages
cd -

