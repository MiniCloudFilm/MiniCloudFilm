// pages/user/user.js   
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  outLogin: function() {
    wx.removeStorageSync('userList');
    app.globalData.userList = null;
    wx.navigateTo({
      url: '../login/login?backUrl=../user/user'
    })
  },
  //获取头像
  getUserInfo: function(e) { 
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl
    }) 
  },
  login: function(e) {
    wx.navigateTo({
      url: '../login/login?backUrl=../user/user'
    })
  },
  onLoad: function(options) { 
    app.checkLoginInfo(app.getCurrentUrl()); 
    if (app.globalData.userInfo){ 
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
    // console.log(wx.getStorageSync('userList')); 
    if (app.globalData.userList) { 
      this.setData({
        userName: app.globalData.userList.name,
        userType: app.globalData.userList.userType
      })
    } else {
      this.setData({
        userName: '',
        userType: ''
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})