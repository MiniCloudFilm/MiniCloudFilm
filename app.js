//app.js
let code = '';
let openid = ""
let APPID = 'wxa4cd3f1e2af9b0dd'
let sessionKey=''
App({
  onLaunch: function () {
    // 展示本地存储能力
    let that=this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs) 
    this.globalData.userList = wx.getStorageSync('userList');
    this.globalData.token = wx.getStorageSync('token');
    console.log(this.globalData);
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
    //       success: function (resO) {
    //         openid = resO.data.openid //返回openid  
    //         that.globalData.openid = resO.data.openid ; 
    //         console.log(openid);
    //       }
    //     })
    //   }
    // })  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res);
        if (res.authSetting['scope.userInfo']) {
          console.log('进入');
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('进入1');
              // 可以将 res 发送给后台解码出 unionId
              
              this.globalData.userInfo = res.userInfo 
              console.log(this.globalData.userInfo)
              console.log(this.globalData.openid)

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
    userInfo: null
  }
})