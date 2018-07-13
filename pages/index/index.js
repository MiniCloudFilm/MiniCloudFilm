//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),  
    bannerList:[
      "../../image/timg.jpg",
      "../../image/timg1.jpg",
      "../../image/timg2.jpg",
      "../../image/timg3.jpg",
    ] 
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(app.globalData.userList);
    let user = app.globalData.userList;
    if (user){
      this.setData({
        userType:user.userType
      })
    }else{ 
      this.setData({
        userType: ''
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){ 
    let user = app.globalData.userList;
    if (user) {
      this.setData({
        userType: user.userType
      })
    } else {
      this.setData({
        userType: ''
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 专家咨询
  turnToExpert:function(e){
    console.log(app.globalData.userList)
    let formId = e.detail.formId;
    wx.navigateTo({
      url: '../expertList/expert?order=before'
    });
    wx.request({//通过网络请求发送openId和formIds到服务器
      url: 'http://192.168.131.212:8080/wxapi/wechatForm',
      method: 'post',
      data: {
        "userId": app.globalData.userList.userId,
        "openId": app.globalData.userList.userOpenId,
        "formId": formId
      },
      success: function (res) {
        console.log(res)
      }
    });
  }
})
