//app.js
let code = '';
let APPID = 'wxa4cd3f1e2af9b0dd'
const api = require('utils/apiConfig.js')
const util = require('utils/util')
App({
  onLaunch: function() {
    // 展示本地存储能力 
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.api = api;
    this.globalData.util = util;
    this.globalData.userList = wx.getStorageSync('userList');
    this.globalData.token = wx.getStorageSync('token');
    // console.log(this.globalData.api);
    // 登录
    // wx.login({
    //   success: res => {
    //     code = res.code
    //     console.log(code);
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId  
    //     wx.request({
    //       url: `https://api.weixin.qq.com/sns/jscode2session`,
    //       data: {
    //         appid: 'wxa4cd3f1e2af9b0dd',
    //         //小程序的 app secret
    //         secret: '258161f4a510c793ebd0356962bb177b',
    //         grant_type: 'authorization_code',
    //         js_code: res.code
    //       },
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       success: function resO=>{
    //         resO.data.openid //返回openid  
    //         this.globalData.openid = resO.data.openid ; 
    //         console.log(resO.data.openid);
    //       }
    //     })
    //   }
    // })  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId 
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo)
              // console.log(this.globalData.openid) 
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userList: null,
    loginUrl: '../login/login'
  },
  checkLoginInfo: function(url) { //验证登录状态
    console.log(this.globalData.userList);
    if (!this.globalData.userList) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请先登录账号！',
        success: res => {
          if (res.confirm) {
            wx.redirectTo({
              url: `${this.globalData.loginUrl}?backUrl=${url}`,
            })
          } else if (res.cancel) {
            wx.reLaunch({
              url: '../index/index',
            })
          }
        }
      })
    } else {
      return "";
    }
  },
  getCurrentUrl: function() { //获取当前页面全路径
    var url = getCurrentPages()[getCurrentPages().length - 1].__route__;
    url = url.replace("pages", ".."); //替换路径全路径。修改该路径为相对路径
    return url;
  }
})