// pages/transactionList/transaction.js 
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
  },
  getData: function() { 
    wx.showNavigationBarLoading();
    let token = app.globalData.token;
    var doctorUrl = app.globalData.api.transactionList.myPayList;
    var patientUrl = app.globalData.api.transactionList.myPayListOfPatient;
    var url = this.data.userType == 2 ? doctorUrl : patientUrl;
    // console.log(token)  
    wx.request({
      url: url,
      data: {
        'page': this.data.page,
        'token': token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.code == "200") {
          this.setData({
            transactionList: app.globalData.pageLoad.check(this.data.transactionList, res.data.data.datas, 15, this)
          })
        }
        wx.hideNavigationBarLoading();
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        util.showToast('服务器连接失败！')
      }  
    })
  },
  openDetail: function(e) {
    let orderId = e.currentTarget.dataset.orderId;
    let orderFee = e.currentTarget.dataset.orderFee;
    let orderMobile = e.currentTarget.dataset.orderMobile;
    let orderTime = e.currentTarget.dataset.orderTime;
    let orderType = e.currentTarget.dataset.orderType;
    let userName = e.currentTarget.dataset.userName;
    let orderPayType = e.currentTarget.dataset.orderpaytype;
    let videoTitle = e.currentTarget.dataset.videotitle;
    let doctorName = e.currentTarget.dataset.doctorName;
    wx.navigateTo({
      url: `../payDetail/payDetail?orderId=${orderId}&orderFee=${orderFee}&orderMobile=${orderMobile}&orderTime=${orderTime}&orderType=${orderType}&userName=${userName}&orderPayType=${orderPayType}&videoTitle=${videoTitle}&doctorName=${doctorName}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isHideLoadMore: true,
      page:1, 
      isEnd:true,
      myId: app.globalData.userList.userId,
      userType: app.globalData.userList.userType
    });
    this.getData(this.data.page);
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
  onPullDownRefresh: function () {
    app.globalData.pageLoad.pullDownRefresh(this, this.getData); 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 显示加载图标 
    app.globalData.pageLoad.reachBottom(this, this.getData); 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})