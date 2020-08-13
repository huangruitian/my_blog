## 栈
栈，我们可以理解成一个装羽毛球的桶；
先放进去的先放出来，也就是先进后出；
我们直接以leetcode真题来讲解：
```js
// leetcode20：有效的括号
// 给定一个只包括 '(' ，')' ，'{' ，'}' ，'[' ，']' 的字符串，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串。

var isValid = function(s) {
   // 直接用栈
   // 遇到开口直接入栈，
   // 遇到闭口，就拿闭口对应的开口和栈顶对比，不一致直接不合法
   // 最后如果真的是合法栈应该为空

   //存储闭口对应的开口   
   let map = new Map([[")", "("], ["]", "["], ["}", "{"]])
   let st = []
   for(let i = 0; i < s.length; i++){
      if(map.has(s[i])){
        // 闭口的对应开口和栈顶不一致。
        if(st.pop() != map.get(s[i])){
           return false
        } 
      }else{
        // 开口直接入栈
        st.push(s[i]) 
      } 
   }
   return st.length ? false : true
};
```

单调栈：
```js
// leetCode:496
var nextGreaterElement = function(nums1, nums2) {
 //忽略nums1, 先用单调栈对nums2求出
 //整体思路：
 //1.用一个单调递减的栈，如果遇到比栈顶大的元素就是第一个比自己大的了
 //2.那么用key表示当前的数，nums[i]表示比key大的第一个数
 //3.枚举nums1找存在的key里的value值即可

  // 把此类问题比作排队看后面第一个比自己高的
  // 从后面往前面看，就能很好的避免不知道后面什么情况  
  let stack = []
  let res = []
  let map = new Map()
  for(let i = nums2.length - 1; i >= 0; i--){
    // 矮个子起开，要你也没用，反正看不见你  
    while(stack.length && nums2[i] >= stack[stack.length - 1]){
      stack.pop() 
    }
    map.set(nums2[i], stack.length ? stack[stack.length - 1] : -1)  
    stack.push(nums2[i])
  }
  nums1.forEach(item => {
    res.push(map.get(item))
  })
  return res;
};
```

## 数组
leetCode：88 合并两个数组：
```js
// 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 num1 成为一个有序数组。

// 说明:

// 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
// 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n ）来保存 nums2 中的元素。

// 直接双指针；
var merge = function(nums1, m, nums2, n) {
    let len1 = m - 1,
        len2 = n - 1,
        len = m + n - 1
    while(len2 >= 0) {
        // 剩下的都是空的了；
        if(len1 < 0) {
            nums1[len--] = nums2[len2--]
            continue
        }
        nums1[len--] = nums1[len1] >= nums2[len2] ? nums1[len1--]: nums2[len2--]
    }
};
```

leetcode1：两数之和：
```js
// 给定一个整数数组 nums 和一个目标值 target ，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

// 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

var twoSum = function(nums, target) {
    let map = new Map()
    for(let i = 0; i < nums.length; i++) {
        let k = target - nums[i];
        if(map.has(k)) {
            return [map.get(k), i]
        }
        map.set(nums[i], i)
    }
    return [];
};
```

leetcode15：三数之和：
```js
//这道题经典的是细节，需要考虑蛮多细节的
//解法：
//1.暴力破解，三层枚举，O（n^3）效率太低不考虑
//2.a+b+c = 0，转换思路，a+b = -c，这不就是两数之和嘛？
//3.利用双指针夹逼，但是怎么避免重复呢？
//3.1 排序即可，利用排序好的数组，固定一个指针i，夹逼选举left和right
//3.2 这道题难度在于要考虑的细节太多，多想想即可。
//3.3 扩展一下，如果是4数之和，五数之和，N数之和呢？怎么解决？
const threeSum = (nums) => {
  const len = nums.length
  const result = []
  // 因为是三数之和，小于三个不用考虑了
  if(len < 3){
    return result
  }
  nums.sort((a, b) => a - b)
  // len - 2 同样道理，小于三个不用考虑
  for(let i = 0; i < len - 2; i++){
    // 如果第一个就大于0了，三个加起来肯定大于0
    if(nums[i] > 0){
      break
    }
    // 避免掉重复的情况
    if(i && nums[i] === nums[i - 1]){
       continue
    }
    let left = i + 1
    let right = len - 1
    // 双指针夹逼
    while(left < right){
      const sum = nums[i] + nums[left] + nums[right]
      if(sum === 0){
         result.push([nums[i], nums[left++], nums[right--]])
         // push 加了之后防止还存在重复
         while(nums[left] === nums[left - 1]){
           left++
         }
         while(nums[right] === nums[right + 1]){
           right--
         } 
      }else if(sum > 0){
          right--
      }else{
          left++
      }
    }
  }
  return result
}
```

数组去重，子集：
```js
let nums1 = [1, 2, 3, 3, 4]
let nums2 = [0, 1, 3, 3, 5]

// 去重太简单了
let result = [...new Set(nums1)]

// 交集
let result = nums1.filter((item) => nums2.includes(item))
```

计算多个数组的交集：
```js
var intersection = function(...args) {
  if (args.length === 0) {
    return []
  }
  if (args.length === 1) {
    return args[0]
  }
  return [...new Set(args.reduce((result, arg) => {
    return result.filter(item => arg.includes(item))
  }))]
};
```

## 链表
leetcode21：合并两个有序链表：
```js
// 递归非常的简洁，非递归就麻烦点了；
function mergeTwoLists(l1, l2) {
    if(l1 === null) {
        return l2
    }
    if(l2 === null) {
        return l1
    }
    if(l1.val <= l2.val) {
        l1.next = mergeTwoLists(l1.next, l2)
        return l1
    } else {
        l2.next = mergeTwoLists(l2.next, l1)
        return l2
    }
}
```

leetcode141：判断一个单链表是否有环：
```js
// 标记法
let hasCycle = function(head) {
    while(head) {
        if(head.flag) return true
        head.flag = true
        head = head.next
    }
    return false
};

// 利用 JSON.stringify() 不能序列化含有循环引用的结构
let hasCycle = function(head) {
    try{
        JSON.stringify(head);
        return false;
    }
    catch(err){
        return true;
    }
};

// 快慢指针（双指针法）
let hasCycle = function(head) {
    if(!head || !head.next) {
        return false
    }
    let fast = head.next.next, slow = head.next
    while(fast !== slow) {
        if(!fast || !fast.next) return false
        fast = fast.next.next
        slow = slow.next
    }
    return true
};
```

leetcode206：反转链表:
```js
var reverseList = function(head) {
   // 递归出口 
   if(!head || !head.next){
       return head
   }
   // process
   // 下一个同样是这样处理    
   let newHead = reverseList(head.next)
   let nextNode = head.next
   nextNode.next = head
   head.next = null
   return newHead
};

// 非递归实现；
var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while (curr != null) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
};
```
## 字符串
leetcode151：翻转字符串里的单词：
```js
// 输入: "the sky is blue"
// 输出: "blue is sky the"

// 正则：
var reverseWords = function(s) {
    // s.trim().replace(/\s+/g, ' ') 处理多个空格的；
    return s.trim().replace(/\s+/g, ' ').split(' ').reverse().join(' ')
};
```

leetcode14：最长公共前缀：
```js
// 直接先取最长的和最短的进行比较；
var longestCommonPrefix = function(strs) {
    if (strs === null || strs.length === 0) return "";
    if(strs.length === 1) return strs[0]
    let min = 0, max = 0
    for(let i = 1; i < strs.length; i++) {
        if(strs[min] > strs[i]) min = i
        if(strs[max] < strs[i]) max = i
    }
    for(let j = 0; j < strs[min].length; j++) {
        if(strs[min].charAt(j) !== strs[max].charAt(j)) {
            return strs[min].substring(0, j)
        }
    }
    return strs[min]
};
```

Leetcode3：无重复字符的最长子串：
```js
var lengthOfLongestSubstring = function(s) {
    let map = new Map(), max = 0
    // i 表示窗口的左边界，j是右边界；
    for(let i = 0, j = 0; j < s.length; j++) {
        if(map.has(s[j])) {
            i = Math.max(map.get(s[j]) + 1, i)
        }
        max = Math.max(max, j - i + 1)
        map.set(s[j], j)
    }
    return max
};
```

leetcode415：字符串相加
```js
// "111" + ”2222“ = ”2333“
var addStrings = function(num1, num2) {
    let a = num1.length, 
        b = num2.length, 
        result = '', 
        tmp = 0
    while(a || b) {
        a ? tmp += +num1[--a] : ''
        b ? tmp +=  +num2[--b] : ''

        // 先加个位数，tmp % 10排序掉进位；
        result = tmp % 10 + result
        // 有进位
        if(tmp > 9) tmp = 1
        else tmp = 0
    }
    // 如果进位还有；
    if (tmp) result = 1 + result
    // 没有直接返回结果；
    return result
};
```

## 队列
剑指offer09：用两个栈实现队列：

```js
var CQueue = function() {
    this.stack1 = []
    this.stack2 = []
};
CQueue.prototype.appendTail = function(value) {
    this.stack1.push(value)
};
CQueue.prototype.deleteHead = function() {
    if(this.stack2.length) {
        return this.stack2.pop()
    }
    if(!this.stack1.length) return -1
    while(this.stack1.length) {
        this.stack2.push(this.stack1.pop())
    }
    return this.stack2.pop()
};
```

## 哈希表
leetcode349：给定两个数组，编写一个函数来计算它们的交集
```js
// 输入: nums1 = [1,2,2,1], nums2 = [2,2]
// 输出: [2]

var intersection = function(nums1, nums2) {
    return [...new Set(nums1.filter((item)=>nums2.includes(item)))]
};
```

剑指Offer：第一个只出现一次的字符：
```js
// s = "abaccdeff"
// 返回 "b"

// 用map两次遍历就好
var firstUniqChar = function(s) {
    if(!s) return " "
    let map = new Map()
    for(let c of s) {
        if(map.has(c)) {
            map.set(c, map.get(c) + 1)
        } else {
            map.set(c, 1)
        }
    }
    for(let c of s) {
        if(map.get(c) === 1) {
            return c
        }
    }
    return  " "
};
```

## 二叉树

前中后遍历：
```js
// 前
var preorderTraversal = function(root) {
   let stack = [[0, root]]
   let res = []
   while(stack.length){
     const [color, node] = stack.pop()
     if(!node) continue;
     if(!color){
         //栈是先进后出的  
         stack.push([0, node.right])
         stack.push([0, node.left])
         stack.push([1, node])
     }else{
         res.push(node.val)
     }
   }
   return res
};
// 中
var inorderTraversal = function(root) {
   let stack = [[0, root]]
   let res = []
   while(stack.length){
     const [color, node] = stack.pop()
     if(!node) continue;
     if(!color){
         //栈是先进后出的  
         stack.push([0, node.right])
         stack.push([1, node])
         stack.push([0, node.left])
     }else{
         res.push(node.val)
     }
   }
   return res
};
// 后
var postorderTraversal = function(root) {
   let stack = [[0, root]]
   let res = []
   while(stack.length){
     const [color, node] = stack.pop()
     if(!node) continue;
     if(!color){
         //栈是先进后出的  
         stack.push([1, node])
         stack.push([0, node.right])
         stack.push([0, node.left])
     }else{
         res.push(node.val)
     }
   }
   return res
};
```
## 堆
堆，就是一个完全二叉树。可以用数组实现

**已知节点i, 左子节点 2*i+1，右2*i+2，父节点(i-1) / 2**

如何构建堆？其实就是一个heapify

```js
function heapify(array, index, length) {
  if (index >= length) {
    return
  }
  // 假设index默认最大的
  let max = index
  let l = 2 * index + 1
  let r = 2 * index + 2
  // 如果左孩子在有效的边界内，并且左孩子比最大值大
  if (l < length && array[l] > array[max]) {
    max = l //先交换索引
  }
  // 右边比最大值大交换
  if (r < length && array[r] > array[max]) {
    max = r //先交换索引
  }
  // 不是默认的最大值，交换
  if (max != index) {
    [array[max], array[index]] = [array[index], array[max]]
    // 交换之后，会破坏原来的子结构，递归
    // max节点继续heapify
    heapify(array, max, length) 
  }
}

// 接着我们只需要在最后一个父节点往上 heapify 就可以了
function createMaxHeap(nums){
  let n = nums.length
  // 数组乱序的，我们就以第一个父节点，从下往上，从右往左做 heapify 即可
  for(let i = (n - 1) >> 1; i >= 0; i--){
    heapify(nums, i, n)
  }
}
// 构建堆的过程是O（n），堆排序是n*log n

// 这里扩展一下堆排序
// 整体思路：
// 先构建一个大根堆，然后把堆顶和最后一个元素交换，交换了的节点继续 heapify 操作调整即可
const heapSort = (nums) => {
  let n = nums.length
  createMaxHeap(nums)
  for(let i = n - 1; i >= 0; i--){
    // 交换两个元素
    [array[0], array[i]] = [array[i], array[0]]
    // 继续以交换了的做 heapify 调整为大顶堆;
    heapify(n, 0, i)
  }
  return nums
}
```

## 图
leetcode997：找到小镇的法官

在一个小镇里，按从 1 到 N 标记了 N 个人。传言称，这些人中有一个是小镇上的秘密法官。

如果小镇的法官真的存在，那么：

小镇的法官不相信任何人。
每个人（除了小镇法官外）都信任小镇的法官。
只有一个人同时满足属性 1 和属性 2 。
给定数组 trust ，该数组由信任对 trust[i] = [a, b] 组成，表示标记为 a 的人信任标记为 b 的人。

如果小镇存在秘密法官并且可以确定他的身份，请返回该法官的标记。否则，返回 -1 。
```js
//很明显是图的问题，求出度为0，入度为N-1的那个节点，即法官
//构造0-N个节点的图
var findJudge = function(N, trust) {
  let graph = Array.from({length:N+1}, () => ({outDegree:0, inDegree:0}))
  trust.forEach(([a, b]) => {
    graph[a].outDegree++
    graph[b].inDegree++
  })
  return graph.findIndex(({outDegree, inDegree}, index) => {
    //避开第一个0;
    return index != 0 && outDegree == 0 && inDegree == N-1 
  })
};

// 其实我们不用计算出入度
var findJudge = function(N, trust) {
  //事实上我们真的有必要去算每个节点的出度入度嘛？
  //其实是不用的，我们只需要算出度和入度的差值是N-1即可
  //也就是说入度加1, 出度减1；
  let graph = Array(N+1).fill(0)
  trust.forEach(([a, b]) => {
    graph[a]--
    graph[b]++
  })
  return graph.findIndex((node, index) => {
    return index != 0 && node == N-1 
  })
};
```


