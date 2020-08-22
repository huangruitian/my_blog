const myNew = (fn, ...args) => {
    let obj = Object.create(fn.prototype);
    let res = fn.apply(obj, args)
    return res instanceof Object ? res : obj;
  }
  
  const call = (context) => {
    var context = context || window
    context.fn = this;
  
    var args = []
    for(var i = 1, len = arguments.length; i < len; i++){
        args.push('arguments['+ i +']');
    }
  
    var res = eval('context.fn('+ args + ')');
    delete context.fn;
    return res;
  }
  
  let url2 = `https://api.github.com/search/users?q=d`;
  let arr = new Array(100).fill(url2)
  multiRequest(arr, 10).then((res) => {
      console.log(res)
  })
  
  function multiRequest(urls = [], maxRequest){
     let sum = urls.length;
     let result = new Array(sum).fill(false)
     let count = 0;
  
     return new Promise((resolve, reject) => {
        while(count < maxRequest){
          next()
        }
        function next(){
            let current = count++;
            if(current >= sum){
              !result.includes(false) && resolve(result)
              return;
            }
            let url = urls[current]
            fetch(url).then((res) => {
              result[current] = res;
              next()
            }).catch(rej => {
              result[current] = rej;
              next()
            })
        }
     })
  }
  
  var arr = [{a:1, a1:2, a3:3}, {a:4, a1:5, a3:6}, {a:7, a1:8, a3:9}]
  itemKey = Object.keys(arr[0] || {})
  let keyIndex = 0
  let res = []
  arr.forEach((item) => {
     let keys = Object.keys(item)
     //1-3 -> a
     for (let i = 0, len = keys.length; i < len; i++) {
       res[i] = {...res[i], [itemKey[keyIndex]]: item[keys[i]]}  
     }
     keyIndex++;
  })

  