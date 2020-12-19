## 异步并发

需求描述，根据 Excel 表格自动化导出批量图片，并且打包成 zip 压缩包

1. 直接利用 antd 的上传组件拿到表格数据

```js
// 拿到Excel表格数据
const handleChange = async ({ fileList }: any) => {
  setFileList(fileList)
  if (fileList.length && fileList[0].status === "done") {
    onImportExcel(fileList[0].originFileObj)
  }
}
```

2. 利用 xlsx 插件读取表格数据

```js
//
import * as XLSX from "xlsx"
// 获取上传的文件对象
const onImportExcel = (file: File) => {
  // 通过FileReader对象读取文件
  const fileReader = new FileReader()
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(file)
  // 加载完成
  fileReader.onload = (event: any) => {
    try {
      const { result } = event.target
      // 以二进制流方式读取得到整份excel表格对象
      const workbook = XLSX.read(result, { type: "binary" })
      let data: ITableItem[] = [] // 存储获取到的数据

      // console.log('workbook.Sheets', workbook);
      // 遍历每张工作表进行读取（这里默认只读取第一张表）
      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 利用 sheet_to_json 方法将 excel 转成 json 数据
          data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          break // 只取第一张表
        }
      }
      setDataList(data)
      // console.log('excel data', [...data]);
      // console.log('excel data.length', data.length);
    } catch (e) {
      // 这里可以抛出文件类型错误不正确的相关提示
      console.log("文件类型不正确")
      return
    }
  }
}
```

3. 制作好一张图片我们使用的是 fabric.js，模版图片好了之后。我们先批量导出图片

```js
  // 批量生成图片
  const handleCreateImages = async () => {
    try {
      if (!checkDataList()) {
        return
      }

      const jobList: any[] = []
      const keysMap = getFabricCanvaskeys()
      const list = dataList
      list.forEach((item, i) => {
        const idx = i
        // 存一个个promise job
        jobList.push(() => expertImgData(item, keysMap, idx))
      })

      setLoading(true)
      multiRequestJobs(jobList).then(urls => {
        // 是否点了取消，没点，正常流程
        if (!hasCancel) {
          // 进行压缩
          setStepsTitle('正在压缩')
          handleZip(cloneDeep(dataList))
        } else {
          hasCancel = false
        }
      })
    } catch (error) {
      console.log('handleCreateImages', error)
    }
  }

  // 导出一张图片
  const expertImgData = (item: any, keysMap: any, idx: number) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        const keys = Object.keys(item)
        for (const key of keys) {
          if (keysMap.has(key)) {
            // 换值
            const canvasObj: any = keysMap.get(key)
            const text = (item as any)[key] + ''
            canvasObj.set({ text })
            fabricCanvas.renderAll()
          }
        }
        const dataUrl = fabricCanvas.toDataURL()
        // const filename = `${imgName}_${i}.png`
        const blobData = dataUrl.replace('data:image/png;base64,', '')
        const blob = b64toBlob(blobData)
        // handleUploadPoster()
        // // 变成url
        const url = URL.createObjectURL(blob)
        item.url = url
        setDataList(preData => [...preData])
        clearTimeout(timer)
        setCurrentFinishCount(idx)
        resolve(url)
      }, delayTime)
    })
  }
```

- 其中，最为关键的是并发执行任务的函数

```js
/**
 *
 * @param jobs   并发任务完成之后，按照 jobs 顺序依次打印结果
 * @param maxNum 最大并发数
 * 每当有一个请求返回，就留下一个空位，可以增加新的请求
 * 所有请求完成之后，按照 jobs 顺序依次打印结果
 * 如果 maxNum 为无限大，其实就是在让你实现 Promise.all
 * 如果是有一个失败就返回 就是Promise.race
 */

export type IJobs<T = any> = () => Promise<T>
export const multiRequestJobs = (
  jobs: IJobs[], // 返回promise的函数
  maxNum: number = 1
) => {
  const result = new Array(jobs.length).fill(false)
  const sum = jobs.length // 任务总数
  let count = 0 // 已完成任务数
  return new Promise((resolve) => {
    // 先请求maxNum个呗
    while (count < maxNum) {
      next()
    }
    // 递归next函数
    function next() {
      const current = count++
      // 边界
      if (current >= sum) {
        // 全部任务做完了？
        if (!result.includes(false)) {
          resolve(result)
        }
        return
      }
      try {
        // 必须是一个promise
        const job = jobs[current]
        job()
          .then((res: any) => {
            result[current] = res
            // 还有未完成，递归；
            if (current < sum) {
              next()
            }
          })
          .catch((err: any) => {
            result[current] = err
            if (current < sum) {
              next()
            }
          })
      } catch (error) {
        console.error("jobs must be a IJobs", error)
        resolve(result)
      }
    }
  })
}
```

4. 压缩亦是如此

```js
import JSZip from "jszip"
import FileSaver from "file-saver"
// 压缩打包
const handleZip = (data: ITableItem[]) => {
  handleBatchDownload(data)
}
// 批量下载
const handleBatchDownload = async (selectImgList: ITableItem[]) => {
  const zip = new JSZip()
  const jobsList: any[] = []
  selectImgList.forEach((item, i) => {
    if (item.url) {
      jobsList.push(() => handleZipImg(item, zip, i))
    }
  })

  setLoading(true)
  multiRequestJobs(jobsList).then((res) => {
    // 全部完成了
    zip
      .generateAsync({
        type: "blob",
      })
      .then((content) => {
        // 生成二进制流
        // 是否点了取消，没点，正常流程
        if (!hasCancel) {
          FileSaver.saveAs(content, `${folderName}.zip`) // 利用file-saver保存文件
          handleInitValue()
        } else {
          hasCancel = false
        }
      })
  })
}
```

5. 关键的流程取消

- 我们都知道 promise 是无法取消的，我们只能使用一个全局变量加锁思想，hasCancel 来记录是否取消了操作
- 导出图片中，如果不用延时器，由于 js 单线程肯定会卡死，而恰巧浏览器的定时器线程和 js 线程不是同一个线程，就可以巧妙的利用它模拟多线程，为了保证任务顺序执行完，promise 和递归完美配合。
