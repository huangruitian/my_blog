## 排序算法
1. 冒泡排序
```js
const bubbleSort = (nums) => {
   let n = nums.length;
   let complete;
   for(let i = 0; i < n; i++){
     complete = true
     for(let j = 0; j < n - i - 1; j++){
        if(nums[j] > nums[j + 1]){
            [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]]
            complete = false
        }
     }
     if(complete){
        break; 
     }  
   }
   return nums   
}
```

2. 选择排序
```js
const selectSort = (nums) => {
   let n = nums.length;
   let min = 0;
   for(let i = 0; i < n - 1; i++){
     min = i;
     for(let j = i + 1; j < n; j++){
       if(nums[min] > nums[j]){
          min = j;
       }
     }
     if(min !== i){
       [nums[i], nums[min]] = [nums[min], nums[i]]
     }
   }
   return nums   
}
```

3. 快排
```js
const quickSort = (nums) => {
    let n = nums.length;
    if(n < 2){
       return nums; 
    }
    let point = n >> 1;
    let left = []
    let right = []
    for(let i = 0; i < n; i++){
      if(i === point){
         continue;
      } 
      if(nums[i] > nums[point]){
          right.push(nums[i])
      }else{
          left.push(nums[i])
      }
    }
    return quickSort(left).concat(nums[point], quickSort(right))
}

// 省内存的写法
const quickSort = (nums) => {
  console.time('test:');
  let n = nums.length;
  if(n < 2){
     return nums; 
  }

  const findCenter = (nums, l, r) => {
    // 比较对象
    let t = nums[l];
    // 整理的目标
    let idx = l+1;
    for(let i = idx; i <= r; i++){
       if(nums[i] < t){
          //比t大的都放后面去；    
          [nums[i], nums[idx]] = [nums[idx], nums[i]]
          idx++;
       } 
    }
    // 比我大的都给挪到后面去了；但是别忘了自己也要挪；
    [nums[l], nums[idx - 1]] = [nums[idx - 1], nums[l]]
    return idx - 1;
  }

  const sort = (nums, l, r) => {
    if(r > l){
      let mid = findCenter(nums, l, r);
      // 注意不能从0开始！！！；   
      sort(nums, l, mid);
      sort(nums, mid + 1, r);
    }
  }
  sort(nums, 0, n - 1);
  console.timeEnd('test:')
  return nums
}
```
4. 归并排序
```js
// 关键点，先分再合
const mergeSort = (nums) => {
   let n = nums.length
   if(n < 2){
      return nums; 
   }
   n = n >> 1;
   return merge(mergeSort(nums.slice(0, n)), mergeSort(nums.slice(n)))
   
}

// 合并需要借助一个外部变量；
const merge = (left, right) => {
  let result = [];
  let i = 0,
      j = 0;
  // 这里有个坑，不能length --;
  let leftLen = left.length, 
      rightLen = right.length; 
  while (leftLen > i && rightLen > j) {
    result.push(left[i] > right[j] ? right[j++] : left[i++]);
  }
  while (leftLen > i) {
    result.push(left[i++]);
  }
  while (rightLen > j) {
    result.push(right[j++]);
  }
  return result;
};
```
5. 堆排序
- 首先要知道堆是完全二叉树；
- 对于节点i，左子树是2*i+1，右子树是2*i+2，父节点是 (i-1) / 2;
```js
// 堆排序的思路其实就是，构建一个堆
// 然后把堆顶和最后一个元素交换，然后再缩小堆的范围，继续heapify；

// 先来完成 heapify 操作，构造一个大顶堆
const heapify = (i, n, nums) => {
  if(i >= n){
     return 
  }
  let max = i
  let left = i * 2 + 1
  let right = i * 2 + 2
  if(left < n && nums[left] > nums[max]){
      max = left;
  }
  if(right < n && nums[right] > nums[max]){
      max = right;
  }
  if(max !== i){
      [nums[i], nums[max]] = [nums[max], nums[i]]
      heapify(max, n, nums)
  }
}

const createMaxHeap = (nums) => {
   let n = nums.length;
   for(let i = (n - 1) >> 1; i >= 0; i--){
     heapify(i, n, nums)
   }
}

const heapSort = (nums) => {
   let n = nums.length;
   createMaxHeap(nums);
   for(let i = n - 1; i >= 0; i--){
      [nums[i], nums[0]] = [nums[0], nums[i]]
      heapify(0, i, nums) 
   }
   return nums
}
```
## 二分查找
- 口诀：找左缩右，找右缩左, 边界左加右不加
- 解释：找左边界，遇到相等先收缩右边界(因为我们要左边界嘛), 右边界同理; 
- 缩左边界时候加一，右边界不加
```js
// 找左边界
const findLeft = (nums, target) => {
  let left = 0;
  let right = nums.length
  let mid = 0
  while(left < right){
     mid = (right + left) >> 1
     //收缩右边界  
     if(nums[mid] >= target){
       right = mid
     }else{
       left = mid + 1
     }
  }
  // 终止的条件是 left == right，此时搜索区间 [left, left)
  return nums[left] == target ? left : -1
}

// 找右边界
const findRight = (nums, target) => {
  let left = 0;
  let right = nums.length
  let mid = 0
  while(left < right){
     mid = (right + left) >> 1
     //收缩左边界  
     if(nums[mid] <= target){
       left = mid + 1
     }else{
       right = mid
     }
  }
  // 到底没有?
  return nums[left - 1] == target ? left - 1 : -1
}
```

## 动态规划
1. 0-1背包问题

现在有这么一个场景， “你”是一名“小偷”，你带了个包去“偷东西”。

- 条件1：每个商品只有一个，要么拿，要么不拿。（0-1背包问题） 
- 条件2：你最多拿得动4kg的东西。（固定大小，可不装满）

商品|价格|重量
--|:--:|--:
A|3000|4kg
B|3000|3kg
C|3000|1kg
D|3000|1kg

**在有限的重量条件下，如何“偷”，赚的钱最多？**

暴力枚举出所有商品的排列组合， 舍去所有超出重量要求的组合， 从中挑一个最大的。

但是暴力求解的时间复杂度是O(2^n)，指数复杂度，太慢了；

贪心行不行呢？

通过某个贪心策略（拿最贵的、拿性价比最高的商品）来得出近似解。

这种方案接近最优解，是近似解，但不一定是最优解，故不可行。

因为是要求最大价值，那么，只要你稍微有点经验就知道是DP问题；

**设：dp[i][j] = x 代表，i件物品，容量为j的背包能装最大价值是x;**

对于每个物品，其实我们有两种可能：
- 装，背包当前容量可以装下；
- 不装，背包当前容量装不下；

那么状态转移方程其实就可以得到了：
```js
// p[i] 为物品价值，w[i]为物品重量；j为背包容量
  能装：dp[i][j] = max(p[i] + dp[i-1][j-w[i]], dp[i-1][j])，j >= w[i]
不能装：dp[i][j] = dp[i-1][j]                                     j < w[i]
```

那么答案就是求dp[i-1][j]了，也就是背包容量为j，物品数量为i-1（因为数组下标从0开始）的最大价值；
```js
//m, w 物品的数量和背包的容量，prices, weights 为每个物品的价值和重量
var package = function (prices, weights, m, w) { 
  var dp = []
  // m个物品
  for (let i = 0; i < m; i++) { 
    dp[i] = Array(w + 1).fill(0)
    // w背包容量
    for (let j = 1; j <= w; j++) { 
      if (i == 0) {
        // 只有一个物品的情况
        dp[i][j] = j < weights[i] ? 0 : prices[i]
      } else if (weights[i] > j) {
        // 当前的背包不能装下此物品 
        dp[i][j] = dp[i - 1][j]
      } else {
        // 可以取当前物品；注意和不取的时候对比最大价值；
        dp[i][j] = Math.max(dp[i - 1][j], prices[i] + dp[i - 1][j - weights[i]])
      }
    }
  }
  return dp[m - 1][w]
}
```
2. 完全背包

那如果是物品数量不限呢？我们改如何改动？
```js
//m, w 物品的数量和背包的容量
function package(prices, weights, m, w) { 
  var dp = []
  //m个物品
  for (let i = 0; i < m; i++) { 
    dp[i] = Array(w + 1).fill(0)
    //w背包容量
    for (let j = 1; j <= w; j++) { 
      if (i == 0) { 
        //第一行也计算出来，只有一个物品；
        dp[i][j] = j < weights[i] ? 0 : prices[i]
      } else if (weights[i] > j) { 
        //当前的背包不能装下此物品
        dp[i][j] = dp[i - 1][j]
      } else { 
        //当前的背包能装下此物品
        //不取当前物品
        let p1 = dp[i - 1][j] 
        //取当前物品
        let p2 = prices[i] + dp[i][j - weights[i]] 
        dp[i][j] = Math.max(p1, p2)
        // 注意，0-1背包物品数量只有1。所有是 prices[i] + dp[i - 1][j - weights[i]]
        // 意思是说，拿了当前物品，其最大价值是当前物品价值 + 前面的物品最大价值；
        // dp[i][j] = Math.max(dp[i - 1][j], prices[i] + dp[i - 1][j - weights[i]])
      }
    }
  }
  return dp[m - 1][w]
}
```

### 来对DP做一个总结
1. 确定状态
- 研究最优策略的最后一步（最后一步是什么，就是最后一个解；）
- 化为子问题去想；
- 确定状态是dp的定海神针
- 简单来说就是动态规划需要开辟一个cache缓存数组，数组中的每个元素dp[i]或者dp[i][j]代表什么；类似于解数学题中的，X，Y，Z代表什么；一定要很准确；说白了也就是数学归纳法；

2. 转移方程
- 根据子问题的定义直接得到，上N部的结果组成，主要是观察规律；
- 当问题的规模逐渐变大的时候，由逐渐变大的子问题（明确定义好的状态）得到一个数学的关系式。

3. 初始条件和边界
- 计算顺序，有的时候是从小到大，有的是从大到小，怎么确定呢？记住一个原则，要用到的状态已经计算出来了，就可以了；
- 数组开多大？如果要用到0-n，就开n + 1，如果要用到0 -（n-1），就开n

### 买卖股票系列

我们再来看一个股票系列的dp；dp是比较难的算法了；想要掌握，必须多练。

既然是买卖股票系列问题，那我们先想清买卖股票的状态

1. buy：在 k 次以内，未持有股票，就可以买入; 也可以rest。
2. sell: 持有股票，才能卖出0; 当然也可以rest
3. rest: 不买也不卖。

所以我们的状态可以这样定义dp[i][k][0 or 1]

在K次的交易内，第i天持有或者未持有股票的最大利润；

很显然要求的结果就是 dp[i][k][0]

状态转移方程：
```js
// 1. dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][1] + prices[i])
//                  max(   选择 rest  ,           选择 sell      )
// 解释：今天我没有持有股票，有两种可能：
// 要么是我昨天就没有持有，然后今天选择 rest，所以我今天还是没有持有；
// 要么是我昨天持有股票，但是今天我 sell 了，所以我今天没有持有股票了。

// 2. dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i])
//                  max(   选择 rest  ,           选择 buy         )
// 解释：今天我持有着股票，有两种可能：
// 要么我昨天就持有着股票，然后今天选择 rest，所以我今天还持有着股票；
// 要么我昨天本没有持有，但今天我选择 buy，所以今天我就持有股票了。
```

初始条件和边界：
```js
// dp[-1][k][0] = 0
// 解释：因为 i 是从 0 开始的，所以 i = -1 意味着还没有开始，这时候的利润当然是 0 。
// dp[-1][k][1] = -infinity
// 解释：还没开始的时候，是不可能持有股票的，用负无穷表示这种不可能。
// dp[i][0][0] = 0
// 解释：因为 k 是从 1 开始的，所以 k = 0 意味着根本不允许交易，这时候利润当然是 0 。
// dp[i][0][1] = -infinity
// 解释：不允许交易的情况下，是不可能持有股票的，用负无穷表示这种不可能。
```

总结状态转移方程 和 base case：
```js
// base case：
dp[-1][k][0] = dp[i][0][0] = 0         //还未开始，利润肯定是零
dp[-1][k][1] = dp[i][0][1] = -infinity //还未开始，不可能持有股票

// 状态转移方程：
dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][1] + prices[i])
dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i])
// 接下来根据这个状态转移方程枚举 DP table 即可。
```

## 回溯法
回溯算法框架：
- 回溯算法框架
```js
// result = []
// def backtrack(路径, 选择列表):
//     if 满足结束条件:
//         result.add(路径)
//         return

//     for 选择 in 选择列表:
//         做选择
//         backtrack(路径, 选择列表)
//         撤销选择
```

其核心就是 for 循环里面的递归，**在递归调用之前「做选择」，在递归调用之后「撤销选择」**，特别简单
```js
// for 选择 in 选择列表:
//     # 做选择
//     将该选择从选择列表移除
//     路径.add(选择)
//     backtrack(路径, 选择列表)
//     # 撤销选择
//     路径.remove(选择)
//     将该选择再加入选择列表
```

我们直接来一道经典的回溯算法题目，N皇后；
```js
// leetCode：51
var solveNQueens = function(n) {
    function backtrack(res, n, board = [], r = 0) {
        if (r === n) {
            res.push(board.map(c => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
            return;
        }
        for (let c = 0; c < n; c++) {
            // 列：bc === c, 撇：r + c  衲：r - c
            if (cols.has(c) || pie.has(r+c) || na.has(r-c)) {
                continue;
            }
            board.push(c);
            cols.add(c)
            pie.add(r + c) //row + col
            na.add(r - c)
            backtrack(res, n, board, r + 1);
            board.pop();
            cols.delete(c)
            pie.delete(r + c) //row + col
            na.delete(r - c)
        }
    }
    const res = [];
    const cols = new Set()
    const pie = new Set()
    const na = new Set()
    backtrack(res, n);
    return res;
};
```

## 贪心算法
- leetCode:455 分发饼干
```js
// g, s 代表孩子和饼干；
var findContentChildren = function(g, s) {
  // 贪心法
  g.sort((a, b) => a - b)
  s.sort((a, b) => a - b)
  let count = 0
  let gi = 0, si = 0;
  let gLen = g.length, sLen = s.length;
  // 尽量用小饼干满足小朋友的需求；   
  while(gi < gLen && si < sLen){
    if(s[si] >= g[gi]){
      gi++
    }
    si++
  }
  return gi
};
```

## 滑动窗口（双指针的一类）
- 滑动窗口特别适合解决一些“最长无重复子串”的问题；
- 这个算法技巧的时间复杂度是 O(N)，比字符串暴力算法要高效得多。
- 算法框架
```js
int left = 0, right = 0;

while (right < s.size()) {
    // 增大窗口
    window.add(s[right]);
    right++;
    // 需要缩小窗口
    while (window needs shrink) {
        // 缩小窗口
        window.remove(s[left]);
        left++;
    }
}
```

最长无重复子串：
```js
var lengthOfLongestSubstring = function(s) {
    //1.滑动窗口
    let map = new Map();
    let i = -1
    let res = 0
    let n = s.length
    for(let j = 0; j < n; j++){
       // 存在重复 
       if(map.has(s[j])){
           // 收缩左边界，用max就是说要后面那个s[j]   
           i = Math.max(i, map.get(s[j]))
       }
       // 每次比较结果；  
       res = Math.max(res, j - i) 
       // 设置索引；    
       map.set(s[j], j)
    }
    return res
};
```

## 前缀和
- 前缀和适合做sumRange(i, j)范围取值类型题目；
- 过于简单就不展开了；
- 这个算法的好处是提前计算 0-i 的和，让频繁求和可以利用缓存好的数组直接得到；
```js
int n = nums.length;
// 前缀和数组
int[] preSum = new int[n + 1];
preSum[0] = 0;
for (int i = 0; i < n; i++)
    preSum[i + 1] = preSum[i] + nums[i];
```


