module.exports = {
    title: '懵新加加首页', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
    description: '懵新加加的前端记录', // meta 中的描述文字，用于SEO
    base: '/my_blog/', //设置站点根路径
    // 注入到当前页面的 HTML <head> 中的标签
    // head: [
    //     ['link', {
    //         rel: 'icon',
    //         href: '/egg.png'
    //     }], //浏览器的标签栏的网页图标
    // ],
    markdown: {
        lineNumbers: true
    },
    serviceWorker: true,
    themeConfig: {
        // logo: '/egg.png',
        displayAllHeaders: true,   // 默认值：false
        lastUpdated: 'lastUpdate', // string | boolean
        nav: [
            //格式一：直接跳转，'/'为不添加路由，跳转至首页
            {
                text: '首页',
                link: '/'
            },
            //格式二：添加下拉菜单，link指向的文件路径
            // {
            //     text: '计算机基础',
            //     ariaLabel: '计算机基础',
            //     items: [
            //         //点击标签会跳转至link的markdown文件生成的页面
            //         {
            //             text: '网络',
            //             link: '/pages/pcBase/network.md'
            //         },
            //         {
            //             text: '数据结构',
            //             link: '/pages/pcBase/dataStructure.md'
            //         },
            //         {
            //             text: '算法',
            //             link: '/pages/pcBase/algorithm.md'
            //         },
            //         {
            //             text: '操作系统',
            //             link: '/pages/pcBase/system.md'
            //         },
            //     ]
            // },
            // {
            //     text: '前端',
            //     ariaLabel: '前端',
            //     items: [
            //         //点击标签会跳转至link的markdown文件生成的页面
            //         {
            //             text: 'html',
            //             link: '/pages/frontEnd/html.md'
            //         },
            //         {
            //             text: 'css',
            //             link: '/pages/frontEnd/css.md'
            //         },
            //         {
            //             text: 'js',
            //             link: '/pages/frontEnd/js.md'
            //         },
            //         {
            //             text: 'es6',
            //             link: '/pages/frontEnd/es6.md'
            //         },
            //         {
            //             text: 'react',
            //             link: '/pages/frontEnd/react.md'
            //         },
            //         {
            //             text: 'redux',
            //             link: '/pages/frontEnd/redux.md'
            //         },
            //         {
            //             text: 'typescript',
            //             link: '/pages/frontEnd/typescript.md'
            //         },
            //         {
            //             text: 'webpack',
            //             link: '/pages/frontEnd/webpack.md'
            //         },
            //         {
            //             text: '前端工程化',
            //             link: '/pages/frontEnd/engineering.md'
            //         },
            //         {
            //             text: '浏览器',
            //             link: '/pages/frontEnd/browser.md'
            //         },
            //         {                
            //             text: 'node',
            //             link: '/pages/frontEnd/node.md'
            //         },
            //     ]
            // },
            // { text: '功能演示', link: '/pages/folder1/test3.md' },
            //格式三：跳转至外部网页，需http/https前缀
            {
                text: 'Github',
                link: 'https://github.com/huangruitian'
            },
        ],
        //侧边导航栏：会根据当前的文件路径是否匹配侧边栏数据，自动显示/隐藏
        sidebar: {
            '/pages/frontEnd/': [{
                    title: 'html', // 必要的，一级菜单
                    // collapsable: false,      // 可选的, 默认值true是折叠,
                    // sidebarDepth: 1, // 可选的, 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
                    children: [
                      'html.md', //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
                    ]
                },
                {
                    title: 'css', // 必要的，一级菜单
                    // collapsable: false,      // 可选的, 默认值true是折叠,
                    sidebarDepth: 1, // 可选的, 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
                    children: [
                      'css.md', //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
                    ]
                },
                {
                    title: 'js',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                      'js.md',
                    ]
                },
                {
                    title: 'es6',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                      'es6.md',
                    ]
                },
                {
                    title: 'react',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                      'react.md',
                    ]
                },
                {
                    title: 'redux',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                      'redux.md',
                    ]
                },
                {
                    title: '浏览器',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'browser.md',
                    ]
                },
                {
                    title: 'http',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'http.md',
                    ]
                },
                {
                    title: 'https',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'https.md',
                    ]
                },
                {
                    title: 'websocket',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'websocket.md',
                    ]
                },
                {
                    title: 'TypeScript',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'typescript.md',
                    ]
                },
                {
                    title: 'webpack',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'webpack.md',
                    ]
                },
                {
                    title: 'node',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'node.md',
                    ]
                },
                {
                    title: '数据结构',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'dataStructure.md',
                    ]
                },
                {
                    title: '算法',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'algorithm.md',
                    ]
                },
                {
                    title: '操作系统',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'system.md',
                    ]
                },
                {
                    title: '网络',
                    // collapsable: false, // 可选的, 默认值是 true,
                    children: [
                       'network.md',
                    ]
                },
            ],
        }
    }
}