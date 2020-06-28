module.exports = {
    title: '懵新加加首页',             // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
    description: '懵新加加的前端记录', // meta 中的描述文字，用于SEO
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', { rel: 'icon', href: '/egg.png' }],  //浏览器的标签栏的网页图标
    ],
    markdown: {
        lineNumbers: true
    },
    serviceWorker: true,
    themeConfig: {    
        logo: '/egg.png',
        lastUpdated: 'lastUpdate', // string | boolean
        nav: [
            //格式一：直接跳转，'/'为不添加路由，跳转至首页
            { text: '首页', link: '/' },
             //格式二：添加下拉菜单，link指向的文件路径
            {
                text: '分类',
                ariaLabel: '分类',
                items: [
                    //点击标签会跳转至link的markdown文件生成的页面
                    { text: 'html', link: '/pages/folder1/test1.md' },
                    { text: 'css', link: '/pages/folder2/test4.md' },
                    { text: 'js', link: '/pages/folder2/test4.md' },
                    { text: 'react', link: '/pages/folder2/test4.md' },
                    { text: 'webpack', link: '/pages/folder2/test4.md' },
                    { text: '网络', link: '/pages/folder2/test4.md' },
                    { text: '数据结构', link: '/pages/folder2/test4.md' },
                    { text: '算法', link: '/pages/folder2/test4.md' },
                    { text: '设计模式', link: '/pages/folder2/test4.md' },
                    { text: '前端工程化', link: '/pages/folder2/test4.md' },
                ]
            },
            {
                text: '分类',
                ariaLabel: '分类',
                items: [
                    //点击标签会跳转至link的markdown文件生成的页面
                    { text: 'html', link: '/pages/folder1/test1.md' },
                    { text: 'css', link: '/pages/folder2/test4.md' },
                    { text: 'js', link: '/pages/folder2/test4.md' },
                    { text: 'react', link: '/pages/folder2/test4.md' },
                    { text: 'webpack', link: '/pages/folder2/test4.md' },
                    { text: '网络', link: '/pages/folder2/test4.md' },
                    { text: '数据结构', link: '/pages/folder2/test4.md' },
                    { text: '算法', link: '/pages/folder2/test4.md' },
                    { text: '设计模式', link: '/pages/folder2/test4.md' },
                    { text: '前端工程化', link: '/pages/folder2/test4.md' },
                ]
            },
            // { text: '功能演示', link: '/pages/folder1/test3.md' },
            //格式三：跳转至外部网页，需http/https前缀
            { text: 'Github', link: 'https://github.com/huangruitian' },
        ],
        //侧边导航栏：会根据当前的文件路径是否匹配侧边栏数据，自动显示/隐藏
        sidebar: {
            '/pages/folder1/':[
                {
                    title: '测试菜单1',   // 必要的，一级菜单
                    collapsable: false,  // 可选的, 默认值true是折叠,
                    sidebarDepth: 1,     // 可选的, 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
                    children: [
                        ['test1.md', '子菜单1'], //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
                        ['test3.md', '子菜单2']
                    ]
                },
                {
                    title: '测试菜单2',
                    collapsable: false, // 可选的, 默认值是 true,
                    children: [
                        ['test2.md', '子菜单1']
                    ]
                }
            ],
        }
    }
}