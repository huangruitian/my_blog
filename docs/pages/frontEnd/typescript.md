## 为什么要使用TS？
- 获得更好的开发体验，解决JS中一些难以解决的问题
```js
  const findUserName = (arr, name) => {
     let result = arr.filters(item => {
        return name === item.name
     })
  }
  findUserNmae(arr, 'hrt') 
```

## JS存在的问题：
1. 使用了不存在的变量函数或者成员（函数名字写错等等）
2. 函数返回类型不准确，无法预知的类型。（把不确定的类型，当成确定的类型）
3. 在使用null或者undefined成员
4. 代码的 可阅读性 和 可维护性很差；

## js的原罪
1. js语言本身的特性，决定了该语言无法适应大型复杂项目
2. 弱类型，某个变量随时更换类型
3. 解释性语言，解释一行，运行一行。错误发生的时间点是运行时。
4. 前端开发中，大部分时间都在排错。（很多时候，都在花费时间排错！！！）

## TypeScript (简称TS)
1. TS是JS的超集，是一个可选的，静态的类型系统。
2. 类型系统，对所有的标识符（变量、参数、函数、返回值）进行类型检查
3. 类型检查是在编译时候，运行之前（运行的是JS代码）
4. 需要tsc index.ts 转换才能执行，TS不参与任何运行时候的检查。

## TypeScript 的常识
1. 2012年微软发布
2. anders负责开发TS项目，后来开源了
3. 定位类型检查系统，缩短项目排错时间
4. 有了类型检查之后，无形中增强了面向对象的开发
5. JS可以面向对象开发，但是会遇到很多问题的。（暂不举具例）
6. 使用TS后，可以编写出完善的面向对象代码

## TypeScript 的环境搭建
- 在node中搭建TS开发环境，因为要关注语法本身

## 默认情况下，TS会做出下面几种假设：
1. 假设当前的执行环境是浏览器的环境
2. 如果代码中没有使用模块化语句（import、export）, 便认为该代码是全局执行。
  一个文件中 let n:number = 1 ，tsc 编译之后形成的js文件中的变量是全局的，所有TS文件的全局变量报错。全局冲突嘛。 
3. 编译的目标代码，是ES3，可配置。

## 有两种方式更改以上假设：
1. 使用tsc命令行编译的时候，加上选项参数
2. 使用TS配置文件，来更改编译选项（重点学, tsc --init命令会直接生成tsconfig.json文件）
3. 使用了配置文件之后，tsc编译不能再跟上文件名了，如果跟上会忽略配置文件
4. @types/node, @types是官方的第三方库，其中包含了很多对js代码类型的描述。（比如JQ，可以安装@types/jquery, 为jquery库添加类型描述）

## 使用第三方库简化操作流程，编译执行。
- ts-node: 将ts代码在内存中完成编译，同时完成运行。
- 使用的时候要指定一个入口，命令 ts-node src/index.ts, 开发阶段很好用。
- 但是不能监控代码变化，要使用nodemon:用于检测文件的变化。
- nodemon --exec ts-node src/index.ts  //检测文件变化，变化时候执行ts-node命令
- nodemon --exec ts-node src/index.ts 把这个命令写成一个脚本，方便执行。
- 把命令写到package.json，中。"scripts":{ "dev" : "nodemon --exec ts-node src/index.ts" }
- 启动的时候直接npm run dev就可以了
- nodemon 监控的文件太多了，所以要配置一下它：
- nodemon -e ts --exec ts-node src/index.ts  // -e ts 文件扩展名ts
- 进一步配置，监控的文件夹：nodemon --watch src -e ts --exec ts-node src/index.ts
- 开发完成直接tsc ，打包输出dist  

## 基本的类型约束（可选的）
- 如何进行类型约束？
- 变量，函数的参数、函数的返回值
- f2或者重命名符号，可以全局改一个索引。f12或者转到定义。就可以快速跳到定义。
- 很多场景下ts可以类型推导；没有一定说用了ts就啥都要写类型；

## 源代码和编译结果的差异
- 运行过程中就是JS代码，切记，TS类型是静态类型，暂时做不到运行时的类型检查

## 基本类型
1. number
2. string
3. boolean
4. 数组：
```js
let numArr:number[] = [1, 2]; 或者let numArr:Array<number> = [1, 2]，这种也叫泛型
```
5. object:  let u:Object; 约束力很弱，赋值函数也不会报错，用得不多。
6. null/undefined
- null 和 undefined 是所有其它类型的子类型，它们可以赋值给其它类型
- "strictNullChecks": true, 可以更加严格的空类型检查，不让null 和 undefined 随便赋值，只能赋值给自身
- 随着版本更新，2020-2-20发布的3.8版本有更多新特性

## 其它常用类型
- 联合类型（多种类型，任选其一），比如字面量联合类型，类型联合类型，后面还会学到 & 与操作 
- let name:string | undefined = undefined, 如果没有具体赋值，还是可以类型推导。
- 类型保护，如果某个变量进行判断之后，就可以确定是什么类型了。（后面讲怎么触发类型保护，只能触发原始类型）

- void类型: 通常用于约束函数的返回值

- never类型：通常用于约束函数的返回值，表示该函数永远不可能结束，不会返回值
- 举例：或者函数内死循环。
```javascript
  function throwError(msg :string):never{
    throw new Error(msg); //到这里就停了
    console.log('aaaa');  //这里以至于下面都不可能执行了
  }
```

- 字面量类型：
```javascript
   let gender:'男' | '女';       //从此只能赋值男女
   let arr:[]                    //永远只能取值为一个空数组
   let user: {
     name:string
     age:number
   }
   user = { name:'hrt', age:33 } //强力约束了
```

- 元祖类型(Tuple)：一个固定长度的数组，并且数组中每一项的类型确定
- ```let tu:[string, number]```; 之后赋值必须赋值两项，类型确定

- any类型：any类型，可以绕过类型检查，因此，any类型的数据，可以赋值给任意类型
- 举例：
```js
let data:any; 
let num:number = data
```
- 会有隐患，不要随意用，我们可以使用unknown保持有类型检查；

- 基本类型和其它常用类型统称为TS类型

## 类型别名：对已知的类型定义别名
- 这个react会经常用到
```js
type User = {
   name:string
   age:number
}
```
- let user: User, 不仅变量可以这样方便的使用，函数返回值也可以方便点，简洁代码
- 后面还可以通过一些操作符，像&之类的，高级联合类型

## 甚至还可以类型组合
```javascript
type Gender = '男' | '女'
type User = user: {
  name:string
  age:number
  gender:Gender //这样可以很方便的维护代码，代码重用
}
```

## 函数的相关约束
- 函数重载：在函数实现之前，对调用的多种情况进行声明
- 举例：
```javascript
   function combine(a:number, b:number):number;
   function combine(a:string, b:string):string;
   function combine(a:number | string, b:number | string):number | string{
      if(typeof a === 'number' && typeof b === 'number'){
          return a * b
      }else if(typeof a === 'string' && typeof b === 'string'){
          return a + b
      }
      throw new Error('a和b 类型必须相同')
   }
   const result = combine("2", '2') //使用的时候，就可以具体的推导出类型
```
- 可选参数：在某些参数后面加上问号，代表可选参数，不仅在函数（要放末尾）中可以使用，其它地方也可以
- 函数默认值：像ES6 一样可以直接在参数上面写默认参数
```js
  function combine(a:number = 1, b?:number):number {
       return a + 0
  }
```

## 扩展类型-枚举
- 枚举类型可以很好的避免硬编码
1. 类型别名：type 另取名字
2. 枚举：
-   枚举通常用于约束某个变量的取值范围，用字面量和联合类型配合使用，也可以达到同样的目标
-   字面量类型的问题：会出现重复的代码，比如 let gender: '男' | '女'；
-   在某个函数中要使用通过性别查找，函数的形参，就要写字面量；这样就不够灵活，出现硬编码
-   解决：使用type类型别名，就可以解决了，但是，如果一旦别名类型一改，全部的代码都要改
-   举例：
```javascript
type Gender = '男' | '女'
let gender:Gender;
    gender = '男' //这里只能选字面量的值
//我们假设后面还有 N 多个变量使用类型别名Gender
//......如果Gender改了，gender后面甚至更多的都要改
//根源是真实的值和逻辑含义产生了混淆，没有分开。真实值一改，全要改了。
//字面量类型不会进入到编译结果
```
## 枚举：自定义类型，扩展类型
- 枚举类型可以很好的解决上面硬编码的问题
- 定义：enum 枚举名｛ 枚举字段 ｝
- 举例使用：
```javascript
-  enum Gender {
     male = '男',
     female = '女'
   }
   let gender:Gender;
   gender = Gender.male
   gender = Gender.female
```
- 因此，使用的时候是使用逻辑名称，赋值的时候还是字面量
- 如果逻辑名称改了，f2重构就可以了，一改全改，编码硬编码
- 枚举参与编译，会出现在编译结果中，编译成一个对象。以前的类型别名，不会参数到编译中的

## 枚举细节规则
1. 枚举的字段值，只能使用字符串或者数字
2. 数字枚举的时候，值会自动自增，比如第一个写了1，后面不写，后面就自增1，
-   如果全都不写，第一个就是0，后面自增
    enum Level {
      level1 = 1,
      level2,
      level3,
    }
- 被数字枚举约束的变量，可以直接赋值为数子，如：let lev:Level = 1；原因是因为位枚举。
- 数据枚举的编译结果，和字符串编译结果有差异，将来枚举数字的时候千万要注意
- 最佳实践
1. 尽量不要在一个枚举中，即出现字符串字段，又出现了数字字段
2. 使用枚举时，尽量使用枚举的名字字段，不要使用真实值，避免硬编码
3. 能使用枚举，就不要使用类型别名，因为会出现上面我们分析的一改全改的情况

## 扩展：位枚举（枚举的位运算符）
- 针对数字枚举
- 位运算：两个数字换成二进制进行位运算
- 举例：向下面这个实例，利用位运算来控制权限，是非常优雅的，可扩展性也很强。
```javascript
    enum Permission {
        Read = 1,  //0001
        Write = 2, //0010
        Create = 4,//0100
        Delete = 8 //1000
    }
    // 1.组合权限，使用或运算
    // 0001 0010 -> 0011
    let p:Permission = Permission.Read | Permission.Write

    // 2.如何判断是否拥有某个权限, 用与运算
    function hasPermission(target:Permission, per:Permission):boolean{
      return (target & per) === Permission.Read
    }
    // 判断是不是有读权限
    hasPermission(p, Permission.Read);

    // 3.如何删除某个权限
    // 亦或，相同取0，不同1
    // 0011 0010 -> 0001 这样就可以删除写权限了；
    p = p ^ Permission.Write
```
## 接口和类型兼容性：
1. interface，接口。TS中的接口，用于约束类，对象，函数的契约（标准）。
- 举例，电源接口，如果两个充电器的电源接口满足相同的标准，就可以互相拿来充电。
- 只不过，我们以前前端开发的契约标准就是文档形式的。API文档，就是一个契约文档。
- 但是文档作为契约，作为标准的话，是一个弱标准。写代码的时候调用接口时候会写错，没有提示。

## 在代码层次的接口约束，就是强约束（java, C#）。
2. 接口约束对象
```javascript
    interface IUser {
      name:string,
      age:number,
      sayHello?:() => void, //千万不要在这里写实现，这里是定义。
    }
    let u:IUser = { //强力约束u这个字面量对象必须按照接口标准实现
      name:'hrt',
      age:18,
    }
    //那和type User 有什么区别呢？目前区别不大，在约束类中区别就大了。
    //在绝大部分场景下，约束对象尽量用接口约束，而尽量不要使用type。
    //接口和类型别名一样，不出现在编译结果中。
```
3. 接口约束函数
```javascript
    interface ICallBack {                  //接口约束
         (n:number): boolean
     }

    type ICallBack = (n:number) => boolean //类型别名

    type ICallBack = {                     //定界符号，具体的约束内容
        (n:number): boolean
    }
    function sum(numbers:number[], callBack:ICallBack):number{
        let s:number = 0
        numbers.forEach((d) => {
            if(callBack(d)){
              s += d
            }
        })
        return s
    }
    let addSum:number = sum([1,2,3,4,5,6], (n) => n % 2 !== 0)
    console.log(addSum)
```
## 接口是可以继承的, 可以通过继承接口来组合约束。类型别名不行了。
```javascript
    interface A {
      T1:string,
    }
    interface B {
      T2:string,
    }
    interface C extends A, B { 
      T3:boolean
    }
    // 类型别名实现同样的效果：需要通过 & 符号实现，是交叉类型。
    type A {
      T1:string,
    }
    type B {
      T2:string,
    }
    type C { 
      T3:boolean
    } & A & B //C是交叉类型，本身交叉A, B
```
## 接口和类型别名的差异：
1. 在接口中，子接口不能覆盖父接口的约束成员。
2. 类型别名交叉的时候，相同的成员会交叉约束类型。两个成员的约束类型都会有，不覆盖。 

## readonly修饰符，修饰的目标是只读的
1. 只读修饰符不参与编译，要注意修饰的目标。
```js
    type A {
      readonly T1:string, //第一次赋值之后，不能再修改，只读
    }
```
2. 比如修饰数组
```javascript
    let arr: readonly number[] = [1,2,3]
    // 注意上面的修饰符号只是修饰类型。
    arr = [4,5,6] 
    // 凡是涉及改变数组的相关函数/成员的提示就没了，arr[0] = 3; 这样都不行了。只读
    arr.push()   
    // 如果 const arr: readonly number[] = [1,2,3]
    // 相当于：cosnt arr: ReadonlyAarray<number> = [1,2,3]
    // 注意，如果是修饰成员，写在成员的前面，相当于const。
```
## 类型兼容性
- 两个类型，如果能完成赋值，A = B，则 B和A兼容
- 用得是鸭子辨型法（子结构辩型法）：
- 目标类型（A）约束有某些特征，赋值的类型（B）只要满足该特征即可，可以有多于的属于自己的。

## 对类型的判断
- 基本类型：完全匹配
- 对象类型：鸭子辨型法
- 举例：
```javascript
      interface Duck {
          sound:"嘎嘎嘎"
          swin:() => void
      }
      let person = {
          name:'伪装成鸭子的人',
          age:11,
          // 类型断言，sound:"嘎嘎嘎" 这样的写的话TS会自动推断出sound的类型为string。
          // 用了类型断言就是"嘎嘎嘎"类型的"嘎嘎嘎"值了；其实就是更换类型。
          // 类型断言也可以在前面加<Type>来使用, <"嘎嘎嘎">"嘎嘎嘎"
          sound:"嘎嘎嘎" as "嘎嘎嘎",
          swin:() => {
              console.log(this.name)
          }
      }
      // 这就是鸭子辨型法，可以完成赋值
      // 但是，不能直接把person的字面量对象直接写过来。
      // 如果直接写过来，就更加严格了，只能是个鸭子
      let duck:Duck = person  
``` 

## 函数类型：一切无比的自然，但是返回值如果在约束的时候就要求返回就一定要返回
- 函数的参数，也是鸭子辩型法
- 实例：
```javascript
    //函数参数的鸭子辨型法
    interface ICallBack { 
        (n:number, i:number): boolean
    }
    function sum(numbers:number[], callBack:ICallBack):number{
        let s:number = 0
        numbers.forEach((d, i) => {
            // 注意这里接口约束要传两个
            if(callBack(d, i)){
              s += d
            }
        })
        return s
    }
                          //注意这里实际调用的时候根本没传完喔！ 
    let addSum:number = sum([1,2,3,4,5,6], (n) => n % 2 !== 0)
    // js的高阶函数forEach, map, filter都是这样的自然
```

## 类（面向对象思想、是一种思维模式）
- 基础部分，仅考虑新增的语法部分，后面再讨论面向对象的思想
- 使用属性列表来描述，不能像以前JS一样动态的赋值增加
1. 属性的初始化检查，"strictPropertyInitialization": true  //更加严格的属性检查，检查初始化
2. 构造函数中检查有没有赋值，或者属性列表有没有初始化默认值
3. 属性可以修饰为可选的，用问号?
4. 有些属性初始化之后就不能改变了, 用 readonly 修饰
5. 有些属性是不希望外部能读取的，使用访问修饰符。可以控制类中的某个成员的访问权限
- public 默认是这个访问权限，公开的，所有都可以访问
- private 私有的，只有在类中使用
- protected 受保护的，暂时不考虑
- 可以在构造函数的形参增加一个访问修饰符，可以这样简写。达到传参赋初值效果（不做任何操作的初始化赋值才可以）

## 感受一下下面的实例：
 ```javascript
    // "strictPropertyInitialization": true  更加严格的属性检查，检查属性初始化
    class name {
        //属性列表
        readonly id:number;              //只读, 相当于const
        gender:'男' | '女' = '男'
        public pid?: string
        private publishNumber:number = 3 //每天一共可以发多少篇文章
        private curNumber:number = 0     //当前可以发布的文章数量
        // 可以在形参中加修饰符达到初始化的效果。简化繁琐代码
        constructor(public name:string, public age:number) {
            this.id = Math.random()
        }
        public publish(title:string){
          if(this.publishNumber > this.curNumber){
            console.log('发布了一篇文章', title)
            this.curNumber++
          }else{
            console.log('不能发布文章了')
          }
        }
    }
    const user = new name('hrt', 18)
    user.publish('文章1')
    user.publish('文章2')
    user.publish('文章3')
```
## 访问器，用于控制属性的读取和赋值
- 某些类的属性，要受一定的限制控制，如年龄不能是小数，负数
```javascript
    class name {
        // 可以在形参中加修饰符达到初始化的效果。简化繁琐代码
        constructor(public name:string, private _age:number) {
            this.id = Math.random()
        }
        // 利用private控制，getAge() 是java的做法
        // C# 是这样做的 get age，用的时候就像普通对象的获取
        // ES6 的时候，也是这样玩的，其实这样也相当于是readonly
        // C# 规范，写私有属性的时候尽量前面加下划线
        get age(){
            return this._age
        }
        set age(age: number){
            // 类的属性，要受一定的限制控制
            if(age >= 18 ){
              return
            }
            this._age = age
        }
    }
    const user = new name('hrt', 18)
    user.publish('文章1')
    user.publish('文章2')
    user.publish('文章3')
    user.age = 10
```
## 泛型，重点类型后面会频繁使用
- 有时候，书写某个函数时候，会丢失一些信息。（多个位置类型应该保持一致或者有关联的信息）
- 泛型：是指附属于函数、类、接口、类型别名之上的类型
- 如果，需要丢失的这些信息，就需要泛型了。

## 在函数中使用泛型：
-  注意先看举例
1. 在函数名之后写上两个尖括号加泛型名称
2. 泛型就相当于类型变量，一般用T表示，定义的时候不知道什么类型，运行的时候才能确定是什么类型
3. 执行语句如果不使用指定泛型的类型，take([1, '2', 3], 2)，就不会报错了。
4. 因为TS可以类型推导，很多时候，TS可以智能的推导出类型，前提是使用了泛型。
5. 如果无法完成推导，并且有没有传递具体的类型，默认为空对象（相当于any）
6. 定义时候泛型可以使用默认值，不指定就是默认值。如：take<T = number>
7. 泛型是一个地方确定类型了，就可以推导确定出具体的类型了。
- 举例：
```javascript
  // T表示泛型，依附于这个函数，泛型就相当于类型变量
  function take<T>(arr:T[], n:number): T[]{
      if(n >= arr.length){
          return arr
      }
      const res: T[] = []
      for (let i = 0; i < n; i++) {
          const element = arr[i];
          res.push(element)
      }
      return res
  }
  // 调用函数的时候才知道什么类型
  // 这样就能把丢失的信息（类型）找回来了
  take<number>([1, '2', 3], 2) //指定类型的话，里面有字符串类型，就会报错；
```
## 泛型在类、接口、类型别名上的应用
```js
 type callback = (n:number, i:number) => boolean
 type callback<T> = (n:<T>, i:number) => boolean
```
- 类：通过约束类的泛型，类下面的函数成员等，就直接是根据类实例化的时候的泛型
- 接口和函数也差不多
- 泛型，其实就是泛指的类型，也就是不能暂时确定的类型。
- 泛型约束：函数使用泛型，参数是泛型，返回值也是泛型```<T>```, 对T进行一些约束。```<T extends XXX>```, 这样子一约束之后，到时候传过来的类型，必须满足XXX，鸭子辨型法。

## 多泛型
- 在ts+react中的类型声明文件有很多用例，注意实践多练多查

## 模块化
- 前端领域的模块化标准：ES6，commonjs/amd/cmd/umd/system/esnext
- 前两个是讨论的重点
1. TS中如何书写模块化语句
- TS中，导入和导出，统一使用es6的模块化标准
- 尽量不要使用默认导出，因为没有智能提示 export default。应该用export
- 导入的时候不要添加后缀名
2. 编译结果中的模块化
- 如果编译标准是ES6，没有区别
- 如果编译结果的模块化标准是commonJS，导出的声明，会变成exports的属性

## 小总结：
1. 基本类型：boolean number string object Array void never null undefined
2. 字面量类型：具体的对象，或者元组
3. 扩展类型：类型别名，枚举，接口，类。（实际上还有很多高级的联合类型）
4. 类型别名和接口不产生编译结果，枚举和类产生编译结果。（枚举产生的就是类，类没啥区别）
5. TS类：访问修饰符，readonly, 一些访问修饰符（public等）
6. 泛型：解决某个功能和类型的耦合。（其实就是抽出一个通用的方法，方便代码重用）
7. 类型兼容性：鸭子辨型法，子结构辨型法。（A如果想赋值给B，A必须满足B的结构，A的属性可以多不可以少）
8. 类型兼容性，在函数类型兼容的时候，参数是可以少的，但是不可以多。要求返回必须返回，不要求你随缘
9. 类型断言：开发者非常清楚某个类型，但是TS分辨不出来，可以用类型断言 as
10. TS有很多的内置关键类型，像```ReturnType<T>```之类的，用到时候可以查文档
11. TS 还有 keyof、is 之类的关键字，用到时候也可以多查阅文档 

## 深入理解类和接口
- 面向对象：以类为切入点进行编程。(可以产生对象的模版)
- 人：
- 特征（属性）：眼睛，鼻子，嘴巴四肢，性别
- 动作（方法）：说话，运动，制造工具
- react：类组件，可以产生对象的模版
- 如何学习？
- TS的OOP（Oriented Object Programing）
- 开发小游戏很锻炼思维，多实践

## 里氏替换原则
- 类型匹配：
- TS 用的是鸭子辨型法。子类的对象，始终可以赋值给父类；在面向对象中，这种现象叫做里氏替换原则。
- 如果要判断具体的子类型，用 instanceof 即可

## 继承的作用
1. 继承可以描述类与类之间的关系，如A和B
- B是父类，A是子类
- B派生A，A继承自B
- B是A的基类，A是B的派生类
- A继承自B，会拥有B的所有方法和属性
- 子类的对象，始终可以赋值给父类。（鸭子辨型法）
- 实例：
- let a:B = new A()
- a变量中的this指向还是正常的，还是执行A的实例
- 此时a只能使用子类和父类共有的方法，因为你声明的是B父类。就是A子类有多余的都不能使用，一般不会这么奇葩写
- instanceof 判断具体是哪个子类型。

## 成员的重写（override）
- 子类中覆盖父类的成员,这就叫重写
- 重写不能改变父类成员的类型（属性）
- 重写方法的时候，子类参数要和父类一样，返回值可以不一样，但差别太大就没必要使用同一个方法
- 重写方法的时候，要注意this指向
- super：在子类的方法中，可以使用super读取父类的成员。super和this是有区别的。

## protected private public
- 编译结果没有访问修饰符
- readonly：只读修饰符
- protected：受保护成员，只能在自身或者子类使用
- private：私有的，只能自己使用
- public：公共的，默认的

## 继承的单根性和传递性
- 单根性：每个类最多只能拥有一个父类。
- 传递性：如果A是B的父类，并且B也是C的父类，则A也是C的父类

## 抽象类
- 为什么需要抽象类？
- 中国象棋为例子，游戏里面存在各种棋子，棋子对象是抽象的，兵、马、炮这样的才是具体的实例
- js 无法描述抽象类，TS可以
- abstract class Chess { }
- 有时某个类只是表示抽象的概念，用于提取子类的公有成员，而不能直接创建它的实例对象。
- 该类可以作为抽象类，主要是为了解决代码重复的问题。
- 抽象类只能用于继承，不能创建实例。抽象类是一个强约束，用于对类的强约束。
- 如果抽象类中某个成员必须要子类实现，也可以使用abstract来进行强约束，要求子类一定要实现。
- 抽象成员必须出现在抽象类中。
- 抽象类可以再次继承抽象类，抽象类中可以先实现抽象成员，也可以到具体的子类再实现。
- 这样的强约束，对于维护和团队合作是非常好的。 

## 静态成员 static
- 属于某个构造函数的成员, 不附属在实例上，就要加上static关键字
- 静态方法中的this, 执向的是当前类

## 再谈接口
- 接口用于约束类，对象、函数，是一个类型契约。
- 在类的实例中，方法没有强约束力。容易将类型和方法耦合在一起。
- 例如：A, B 继承自C。A，B有各自的方法，在某处要一起调用，就需要instance判断类型了。 
- 系统缺失对能力（方法）的定义 - 解决办法（接口）
- 面向对象领域中的接口的语义：表达了某个类是否拥有某种能力（方法）
- 某个类具有某种能力，其实，就是实现了某种接口。implements interface（可以实现多个接口）
- 如果implements实现了某种能力，必须要实现，不实现会报错。
- 例子：
```javascript
    interface IDown{
      down():void
    }

    class Children extends Parent implements IDown{
        down(): void {
            throw new Error("Method not implemented.");
        }
    }
```
## 类型保护函数：相当于 a instanceof IDown, java中可以这么用TS不行。
```javascript
function isHasIDown(chi: object): chi is IDown {
  if((chi as unknown as IDown).方法){
    return true
  }else{
    return false
  }
}
```
- 接口和类型别名的最大区别：接口可以被类实现，类型别名不行
- 接口可以继承类，表示该类的所有成员都在接口中
- 实例：
```javascript
    class A {
        name: string = 'A';
    }
    class B {
        age: number = 1;
    }

    interface C extends A, B{}

    let c:C = {
        name:'C',
        age: 10
    }
```
## 索引器
```对象[值]```
```javascript
  class A {
      [prop:string]:string
      name:string = 'hrt'
  }
```
- 索引器要写在最前面
- 在严格的检查下，可以动态的增加成员
```javascript
  class A {
      [prop:string]:string
      name:string = '1'
  }

  let c:A = new A()
  c.name = "ss"
  c.x = '2222'
```
## 类this指向问题
- TS类中其实是使用了严格模式的，下面这样用会导致this为undefined
```javascript
  class A {
    name:string = 'hrt'
    say(){
        console.log(this.name)
    }
  }
  let c:A = new A()
  let s = c.say
  s()
```
- 而如果使用字面量的形式，this是any类型的
```javascript
  let c = {
      name: 'hrt',
      say(){
          console.log(this.name) //this是any类型的
      }
  }
  let s = c.say
  s()
```
- TS允许在书写函数的时候，手动声明该函数的this指向，
- 将this作为第一个参数，只用于约束this，不是真正的参数，也不会出现在编译结果中。
- 接口强约束了this指向，防止this乱指向，压根就犯不了错误。
```javascript
  interface IUser {
    name:string,
    age:number,
    sayHello(this:IUser):void //强行约束this
  }
  let c:IUser = {
      name: 'hrt',
      age:18,
      sayHello(){
          console.log(this.name)
      }
  }
  let s = c.sayHello
  s() //报错
```

## 类型演算
- 根据已知的信息，来计算出新的类型
- 类型演算和计算出新的类型在一些大型的UI库上特别有用。像antd/antd pro
- 把一个变量约束为构造函数可以 new () => C 或者 typeof
## 三个关键字
1. typeof
- js得到一个数据的类型, ts中的typeof书写在类型约束的位置上
```js
  // js中的 typeof
  const a = '111'
  typeof a // string
  // ts 中的typeof，表示获取到的数据类型
  // b 的类型和 a 的类型保持一致，就用typeof
  let b:typeof a = "aaa" 
``` 
- 注意，当typeof作用于类的时候，得到的是该类的构造函数
```js
   class User {}
   //  
   function careteUser(cls:User): User { //1. 返回值要求的是 new User()，不是User
     return new cls()                    //2. 如果传new User()，这里必须是一个构造函数
   } 
   //传类，参数不匹配
   const u = careteUser(User)

   //那怎么办才能满足这奇葩需求呢？ 
   //1. 构造函数约束
   function careteUser(cls:new() => User)
   //2. 或者这么干, typeof typeof作用于类的时候，得到的是该类的构造函数（是个类型）
   function careteUser(cls:typeof User)  
``` 
2. keyof
- 作用于类、接口、类型别名，用于获取其它类型中的所有成员名，组成的联合类型
- 很有用的一个关键字
```js
  interface IUser { 
    pw:string,
    age:number,
    id:string   
  }
  // 怎么约束prop呢？ 它应该是某个具体类型的一个属性
  // keyof User 相当于 type prop = pw | age | id
  function printUserProperty(obj:User, prop:keyof User){
    //obj[prop]
  }
  printUserProperty(user, "age")
```
3. in
- 该关键字往往和keyof 一起用，该关键字往往和keyof联用，限制某个索引类型的取值范围
```js
  type Obj = {
     //属性和值是字符串是string就满足条件
     //怎么进一步约束取值范围呢？太广阔了  
     [p:string]: string,
     // in 操作符，in 一个联合类型就行了
     [p in "pw" | "age" | "id"]: string,  

  }
  const u:Obj = {}
  u.abc = "sss"
  // ========> 分割线
  // 最佳写法 in keyof xxx
  // 得到一个新类型Obj，将IUser所有属性值类型变成了字符串
  type Obj = { 
     [p in keyof IUser]: string,  
  }
  // ========> 分割线
  // 还可以这么玩
  type newObj = { 
     [p in keyof IUser]: IUser[p],  
  }
  // ========> 分割线
  // 还可以这么玩，全设成只读的
  type newObj = { 
     readonly [p in keyof IUser]: IUser[p],  
  }
  // ========> 分割线
  // 还可以这么玩，全设成可选的
  type newObj = { 
    [p in keyof IUser]?: IUser[p],  
  }
  // 这样不够通用，可以利用泛型
  type Partial<T> = { 
    [p in keyof T]?: T[p],  
  }
  type ReadyOnly<T> = { 
    readonly [p in keyof T]: T[p],  
  }
  type String<T> = { 
    [p in keyof T]: string,  
  }
  type Required<T> = {
    // -? 就是把问号去掉
    [p in keyof T]-?: string, 
  }
  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  }
  // 选择某些类型	
  type Person = {
      name: string;
      age: number;
      location: string;
  };
  type RemainingKeys = Exclude<keyof Person, "location">;
  type QuantumPerson = Pick<Person, RemainingKeys>;
  // equivalent to
  type QuantumPerson = {
      name: string;
      age: number;
  };
  // QuantumPerson or equivalent to
  type QuantumPerson = Omit<QuantumPerson, "location">
  // equivalent to
  type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```
## 类型演算其实就是根据已知类型可关键字演算出新的类型，很实用
- ts中的预设类型演算
1. ```Partial<T>```，将类型变成可选
2. ```Required<T>```，将类型变成必选
3. ```ReadyOnly<T>```, 只读
4. ```Exclude<T, U>``，从T中剔除可以赋值给U的类型
- ```type Exclude<T, U> = T extends U ? never : T``
- 这里的 extends 表示匹配不是继承，鸭子辩型法，never表示不存在
5. ```Extract<T, U>```，提取T中可以赋值给U的类型，和Exclude相反
- ```type Extract<T, U> = T extends U ? T : never```
6. ```NonNullable<T>```，从T中剔除null和undefined
7. ```ReturnType<T>```，获取函数返回类型
- infer 表示推断类型关键字，了解一下
- 如果是一个普通函数，要这么用 ```let a:ReturnType<typeof func>;```
- 因为func是一个函数，不是类型，typeof就可以得到构造函数
8. ```InstanceType<T>```，获取构造函数类型的实例类型
- 和 ReturnType 差不多，获取的是构造函数类型的实例类型
```js
  class User {}
  type towParamsConstructor = new (arg1:any, arg2:any) => User
  const A:towParamsConstructor = class Test {
    // 鸭子辩型法，不报错，但是constructor参数不能多
    // 但是我想要得到构造函数返回的类型是啥？
    constructor(a:any, a:any){}
  }
  // =========> 这样就可以得到 towParamsConstructor 返回的类型了
  type towParamsConstructor = new (arg1:any, arg2:any) => User
  type Inst = InstanceType<towParamsConstructor>
```
9.  Pick
- 选择，在T中选择K，K是T的子集 ```Pick<T, K extends keyof T>```
```js
    interface Person {
        name: string;
        age?: number;
    }
    type person5 = Pick<Person, "name">;
//  person5 === {name: string}
```
10. Omit 忽略对象某些属性功能
```type Omit<T, K> = Pick<T, Exclude<keyof T, K>>```
- ```Omit<T, K extends keyof any>```，在T中选择除了K的类型，keyof any 表示任何类型
- 在泛型里面 ```extends``` 关键字是约束的意思，不是继承

11. Record 将 K 中所有的属性的值转化为 T 类型
```type Record<K extends keyof any, T> = { [P in K]: T };```
- keyof any表示可以用作对象索引的任何值的类型。
- 在Record类型中，这 K extends keyof any 用于约束K某些对象，该对象是对象的有效键。所以，K目前为 number string symbol 三种

12. AxiosReturnType (未包含)
开发经常使用 axios 进行封装 API层 请求, 通常是一个函数返回一个``` AxiosPromise<Resp>```, 现在我想取到它的 Resp 类型, 根据上一个工具泛型的知识我们可以这样写.
```js
  import { AxiosPromise } from 'axios' // 导入接口
  type AxiosReturnType<T> = T extends (...args: any[]) => AxiosPromise<infer R> ? R : any
  // 使用
  type Resp = AxiosReturnType<Api> // 泛型参数中传入你的 Api 请求函数
```

13. Exclude 
- T extends U ? X : Y
- 以上语句的意思就是 如果 T 是 U 的子类型的话，那么就会返回 X，否则返回 Y
- 甚至可以组合多个
```js
  type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";
```
14. 去掉可能为空的属性键名
- https://mariusschulz.com/blog/conditional-types-in-typescript 强推好文
- never 为TS内置的不可达类型，就是没有意义，不可达
```js
    type NonNullablePropertyKeys<T> = {
      //[P in keyof T]，p是T的所有属性，null extends T[P] ? never : P，约束属性值必须不为null
      [P in keyof T]: null extends T[P] ? never : P
      // 得到结果：
      // name: "name";
      // email: never;
      // [keyof T]，A[B]的意思，由于never没有意义，所以只会拿出 "name"
    }[keyof T]; 

    type User = {
      name: string;
      email: string | null;
    };
    // "name"
    type NonNullableUserPropertyKeys = NonNullablePropertyKeys<User>;
    // 配合Pick<T, U>, 就可以选择属性不为空的类型别名
    type NonNullableProperties<T> = Pick<T, NonNullablePropertyKeys<T>>;
    // { name: string }
    type NonNullableUserProperties = NonNullableProperties<User>;
```

15. 得到一个元组类型，元组类型是函数所有形参的类型
```js
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any
    ? P
    : never;
```

## 声明文件
1. 什么是声明文件？
- 在ts中以```.d.ts```结尾的就是声明文件
2. 声明文件有什么用？
- 以前的代码都是js写的，ts使用js的代码时候，得不到类型声明，不知道js里面有什么类型
- 那怎么告诉ts，js里面的代码类型呢？无需修改原来的js代码
- 简而言之，就是为js提供类型声明，这就是声明文件的作用
3. 声明文件的位置放在哪里会生效？
- 放置到 tsconfig.json 配置中包含的目录中，就是配置文件的include:["./src"]配置
- 可以放在node_modules/@types文件夹中，安装的js代码的库的声明文件都在这
- 手动配置，tsconfig.json 中的 "typeRoots:[]", 启用这个配置，前面两条就失效
- 还有一种比较好的方式，与js代码所在的文件目录相同，文件名字相同。

# react + ts 结合会有很多的坑！！！
1. 某个组件有哪些属性需要传递？（antd 官方文档）
2. 某个组件有某个属性，需要传具体的属性类型
3. 传递事件的时候，具体需要传的参数
4. 错误发生在运行时
- 可以通过propsTypes约束属性的类型，但是错误发生在运行时。
- ts都可以解决这些问题（F12看定义的声明文件，需要有一定的TS基础）

- external 打包文件太大可以配置外部依赖

## 2020-04-06 二次学习TS的一些坑
1. 如果TS配置了可以识别JSX语法的话，类型断言只能使用as 语法，不能使用尖括号
```ts
function extend<T extends object, U extends object>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    // 如果TS配置了可以识别JSX语法，这里是会报错的
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }
  return result;
}
const x = extend({ a: 'hello' }, { b: 42 });
```

## 允许使用额外的属性
- 在React antd 中会经常使用到；
```ts
let x: { foo: number, [x: string]: any };

x = { foo: 1, baz: 2 }; // ok, 'baz' 属性匹配于索引签名
```

## 自定义类型保护函数
```ts
// 仅仅是一个 interface
interface Foo {
  foo: number;
  common: string;
}

interface Bar {
  bar: number;
  common: string;
}

// 用户自己定义的类型保护！
// 使用的时候就知道具体是什么类型了
function isFoo(arg: Foo | Bar): arg is Foo {
  return (arg as Foo).foo !== undefined;
}
```

## 枚举类型
- 自定义枚举类型 ```{ [K in T]: K }``` 返回类型，索引签名
```ts
function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
// 创建 K: V
const Direction = strEnum(['North', 'South', 'East', 'West']);
// 创建一个类型，这里的 typeof 是得到一个类型
type Direction = keyof typeof Direction;
// 简单的使用
let sample: Direction;
sample = Direction.North; // Okay
sample = 'North'; // Okay
sample = 'AnythingElse'; // ERROR!
```

## readonly 只能保证“我”不能改变属性，其它没有保证的可以改
```ts
  const foo: {
    readonly bar: number;
  } = {
    bar: 123
  };
  // 这里改了
  function iMutateFoo(foo: { bar: number }) {
    foo.bar = 456;
  }
  iMutateFoo(foo);
  console.log(foo.bar);
```
## TS 类型兼容，重要；
- B 赋值给 A，如果能完成赋值，则B和A类型兼容
- TS 总的类型兼容使用的是鸭子辩型法（子结构辩型法）
- 什么是鸭子辩型法？
- 目标类型需要某一些特征，赋值类型只有满足该特征即可
1. 基本类型：完全匹配
2. 对象类型：鸭子辩型法；因为js经常使用字面量对象，经常把一个对象当成多个类型；
```ts
    interface Duck {
      sound:'gagaga'
    }
    const b = {
      name:'haha',
      sound:'gagaga' as 'gagaga'
    }
    // 如果直接使用字面量对象，会出现更严格的类型检查
    // 这样的好处是，防止你直接打错属性名称了；
    let a: Duck = {
      name:'haha',  // 报错，更严格的类型检查
      sound:'gagaga'// 直接字面量不用 as
    }
    // 鸭子辩型法，子结构辩型法，变得宽松一点了
    let a: Duck = b
```
3. 函数类型：基本和js无缝衔接，很自然；主要是参数 和 返回值
- 参数，js的数组方法都是这样的，如map, forEach；传递给目标的参数可以少，但是不可以多
```ts
    interface ICallBack {                  //接口约束
         (n:number, i:number): boolean
    }
    function sum(numbers:number[], callBack:ICallBack){
        let s:number = 0
        numbers.forEach((d, i) => {
            if(callBack(d, i)){
              s += d
            }
        })
        return s
    }
    // 如果TS是严格的类型检查，必须要填两个参数；
    let addSum:number = sum([1,2,3,4,5,6], (n) => n % 2 !== 0)
    console.log(addSum)
```
- 返回值，要求返回，必须返回，类型要匹配；没有要求返回你随意；
- 理解合理性，不要死记硬背；

## TS 索引签名，加强
- js时候```对象[值]```，其实这个就是索引器，以前也叫成员表达式；TS同样支持
- 在TS中，默认不对成员表达式做严格的类型检测；为什么呢？因为成员表达式的成员是动态的，TS不能够算出来，所有比较放松，不做严格的类型检查；如果要检查，开启 "noImplicitAny": true, 不仅仅是限制了索引器；这是一个更严格的类型检查；
- tip：索引器的范围很广，如果是类使用的，是一个通用的选项；
- 如果某个类中使用了两种类型的索引器，两种类型的索引器类型必须匹配
```ts
  class A {
    [p: number]: string //报错
    [p: string]: number
  }
  // 正确的使用姿势，两个索引器的使用类型必须匹配
  class B { }
  class A {
    [p: string]: object
    [p: number]: B
  }
```
- TypeScript 的索引签名必须是 string 或者 number。
- symbols 也是有效的，TypeScript 支持它。

## typeof TS中，作用于类型的时候，得到的是类型，作用于类的时候，得到的时候构造函数
- const a:any = 'aaa'
- const b: typeof a = 'aadadsdasdasdasd1'

## infer
- 待推断类型，这个歌语句的意思是
- T 限制为函数类型，返回类型如果是P，就返回P，否则返回 any
- https://jkchao.github.io/typescript-book-chinese/tips/infer.html
```ts
  type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```
> 现在在有条件类型的 extends 子语句中，允许出现 infer 声明，它会引入一个待推断的类型变量。 这个推断的类型变量可以在有条件类型的 true 分支中被引用。 允许出现多个同类型变量的 infer。

使用过程中需要注意以下几个关键点：
- 只能出现在有条件类型的 extends 子语句中；
- 出现 infer 声明，会引入一个待推断的类型变量；
- 推断的类型变量可以在有条件类型的 true 分支中被引用；
- 允许出现多个同类型变量的 infer

```js
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```
我们仔细研读一下以上源码，发现遵循我们上面所说的 infer 满足的四个特点：
- 只能出现在有条件类型的 extends 子语句中；
- 出现 infer 声明，会引入一个**待推断的类型变量**；
- 推断的类型变量可以在有条件类型的 true 分支中被引用；
- 允许出现多个同类型变量的 infer

因为我们要获取函数参数，所以传递的参数必须是个函数，所以有 T extends (...args: any) => any，由于我们要获取的是函数参数的类型，所以 infer 出现在了函数参数位置。也就是说：
- ```...args: infer P``` 参数是一个待推断的类型变量
- ```any ? P : never``` 如果返回值是这个待推断的P，也就是说待推断的P是函数的参数，就返回这个参数；

同理获取函数返回值的方法就呼之欲出了：
```js
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

获取构造函数类型 ConstructorParameters：
```js
type ConstructorParameters<
  T extends new (...args: any) => any
> = T extends new (...args: infer P) => any ? P : never;
```

一道经典的TS题目：
```js
// 假设有一个这样的类型：
interface initInterface {
  count: number;
  message: string;
  asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;
  syncMethod<T, U>(action: Action<T>): Action<U>;
}
// 在经过 Connect 函数之后，返回值类型为

type Result {
  asyncMethod<T, U>(input: T): Action<U>;
  syncMethod<T, U>(action: T): Action<U>;
}
// 其中 Action<T> 的定义为：
interface Action<T> {
  payload?: T
  type: string
}
// 现在要求写出Connect的函数类型定义。
```
详解：
```js
type RemoveNonFunctionProps<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// 先移除非函数的属性
type PickFunction<T> = Pick<T, RemoveNonFunctionProps<T>>;

// 妙用 infer 脱衣服；
type TransformMethod<T> = T extends (
  input: Promise<infer U>
) => Promise<Action<infer S>>  // 限制为一个函数
  // 满足 Promise<Action<infer S>> 形式吗？
  ? (input: U) => Action<S>    // 满足
  // 不满足 Promise<Action<infer S>>，咱接着判断；
  : T extends (action: Action<infer U>) => Action<infer S>
  // 满足 Action<infer S> 形式吗？  
  ? (action: U) => Action<S>   // 满足
  : never;                     // 不满足
type ConnectAll<T> = {
  [K in keyof T]: TransformMethod<T[K]>;
};

type Connect<T> = ConnectAll<PickFunction<T>>;
```






















