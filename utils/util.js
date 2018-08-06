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
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success',
  duration: 2000
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
}

module.exports = { formatTime, showBusy, showSuccess, showWarning, showFail,showModel, showToast } 
