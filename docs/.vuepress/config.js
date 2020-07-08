module.exports = {
    title: '懵新加加首页', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
    description: '懵新加加的前端记录', // meta 中的描述文字，用于SEO
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', {
            rel: 'icon',
            href: '/egg.png'
        }], //浏览器的标签栏的网页图标
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
            {
                text: '首页',
                link: '/'
            },
            //格式二：添加下拉菜单，link指向的文件路径
            {
                text: '计算机基础',
                ariaLabel: '计算机基础',
                items: [
                    //点击标签会跳转至link的markdown文件生成的页面
                    {
                        text: '网络',
                        link: '/pages/pcBase/network.md'
                    },
                    {
                        text: '数据结构',
                        link: '/pages/pcBase/dataStructure.md'
                    },
                    {
                        text: '算法',
                        link: '/pages/pcBase/algorithm.md'
                    },
                    {
                        text: '操作系统',
                        link: '/pages/pcBase/system.md'
                    },
                ]
            },
            {
                text: '前端',
                ariaLabel: '前端',
                items: [
                    //点击标签会跳转至link的markdown文件生成的页面
                    {
                        text: 'html',
                        link: '/pages/frontEnd/html.md'
                    },
                    {
                        text: 'css',
                        link: '/pages/frontEnd/css.md'
                    },
                    {
                        text: 'js',
                        link: '/pages/frontEnd/js.md'
                    },
                    {
                        text: 'es6',
                        link: '/pages/frontEnd/es6.md'
                    },
                    {
                        text: 'react',
                        link: '/pages/frontEnd/react.md'
                    },
                    {
                        text: 'redux',
                        link: '/pages/frontEnd/redux.md'
                    },
                    {
                        text: 'typescript',
                        link: '/pages/frontEnd/typescript.md'
                    },
                    {
                        text: 'webpack',
                        link: '/pages/frontEnd/webpack.md'
                    },
                    {
                        text: '前端工程化',
                        link: '/pages/frontEnd/engineering.md'
                    },
                    {
                        text: 'node',
                        link: '/pages/frontEnd/node.md'
                    },
                ]
            },
            // { text: '功能演示', link: '/pages/folder1/test3.md' },
            //格式三：跳转至外部网页，需http/https前缀
            {
                text: 'Github',
                link: 'https://github.com/huangruitian'
            },
        ],
        //侧边导航栏：会根据当前的文件路径是否匹配侧边栏数据，自动显示/隐藏
        sidebar: {
            '/pages/pcBase/': [{
                    title: '数据结构', // 必要的，一级菜单
                    // collapsable: false,      // 可选的, 默认值true是折叠,
                    sidebarDepth: 1, // 可选的, 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
                    children: [
                        ['dataStructure.md', '数据结构']
                    ]
                },
                {
                    title: '算法', // 必要的，一级菜单
                    // collapsable: false,      // 可选的, 默认值true是折叠,
                    sidebarDepth: 1, // 可选的, 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
                    children: [
                        ['algorithm.md', '算法'], //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
                    ]
                },
                {
                    title: '网络',
                    // collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 1, // 可选的, 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
                    children: [
                        ['network.md', '网络分层'],
                        ['http.md', 'http'],
                        ['https.md', 'https'],
                        ['websocket.md', 'websocket'],
                        ['tcp.md', 'tcp'],
                    ]
                }
            ],
            '/pages/frontEnd/': [{
                    title: 'html/css', // 必要的，一级菜单
                    // collapsable: false,      // 可选的, 默认值true是折叠,
                    sidebarDepth: 1, // 可选的, 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
                    children: [
                        ['html.md', 'html'], //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
                        ['css.md', '层叠样式表']
                    ]
                },
                {
                    title: 'js',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                        ['js.md', 'ECMAScript']
                    ]
                },
                {
                    title: '浏览器',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                        ['browser.md', '浏览器']
                    ]
                }
            ],
        }
    }
}