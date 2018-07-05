// pages/counList/counList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoctor:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let user=wx.getStorageSync("userList")
    // let token = wx.getStorageSync("token")
    // console.log(user.userId);
    // console.log(token);
    // wx.request({
    //   url: 'http://192.168.131.63:8080/dialog/api/v1/dialogList',
    //   data: { 
    //     'userId': user.userId,
    //     'userType': user.userType
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: res => {
    //     console.log(res.data.data)
    //     if (res.data.code == "200") {
    //       this.setData({
    //         expertList: res.data.data
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  trunConInterface:function(e){
    console.log(e);
    console.log(e.currentTarget.dataset.dialogid);
    console.log(e.currentTarget.dataset.reportid);
    wx.navigateTo({
      url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}`,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user = wx.getStorageSync("userList")
    let token = wx.getStorageSync("token")
    this.setData({
      userType:user.userType
    })
    console.log(user.userId);
    console.log(token);
    wx.request({
      url: 'http://192.168.131.63:8080/dialog/api/v1/dialogList',
      data: {
        'userId': user.userId,
        'userType': user.userType
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            counList: res.data.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})