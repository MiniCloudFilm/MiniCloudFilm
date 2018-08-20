const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
} 

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 2000
})
 
// 显示提示
var showToast = text => wx.showToast({
  title: text,
  icon: 'none',
  duration: 2000
})

// 显示成功提示
var showSuccess = (text,success) => wx.showToast({
  title: text,
  icon: 'success',
  duration: 2000,
  success:(res)=>{
    success()
  }
})

// 显示警告提示
var showWarning = text => wx.showToast({
  title: text,
  image: '/image/icon-warning.png',
  duration: 2000
})

// 显示失败提示1
var showFail = text => wx.showToast({
  title: text,
  image: '/image/icon-failed.png',
  duration: 2000
})

// 显示失败提示2
var showModel = (title, content) => {
  wx.hideLoading();
  wx.hideToast(); 
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
};


/**展示进度条的网络请求
 * url:网络请求的url
 * params:请求参数
 * message:进度条的提示信息
 * success:成功的回调函数
 * fail：失败的回调
 */
var request = (url, params, hideLoading,type,contentType, success)=>{
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': `application/${contentType}`
    },
    method: type,
    success:res=> {
      if (hideLoading) {
        wx.hideLoading()
      };
      if (res.data.code == 200) {
        success(res.data)
      } else{
        showFail("获取数据失败")
      };

    },
    fail: function (res) {
      if (hideLoading) {
        wx.hideLoading()
      };
      showFail("连接服务器失败")
    }
  })
}

module.exports = { formatTime, showBusy, showSuccess, showWarning, showFail,showModel, showToast,request} 
