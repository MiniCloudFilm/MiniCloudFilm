// pages/transactionList/transaction.js 
let app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transactionList:[],
    page:1,
    load:true
  }, 
  getData: function (pg) {
    wx.showNavigationBarLoading();
    let token=wx.getStorageSync('token'); 
    // console.log(token) 
    pg = pg ? pg : 0;   
    wx.request({
      url: app.globalData.api.transactionList.myPayList,
      data:{
        'userId':this.data.myId,
        'page':pg ,
        'token':token 
      }, 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res=>{
        // console.log(res.data)
        var tmpArr = this.data.transactionList;
        // 这一步实现了上拉加载更多
        if (res.data.data.datas.length<15){
          this.data.load=false;
        }
        tmpArr.push.apply(tmpArr, res.data.data.datas);
        this.setData({
          transactionList: this.data.transactionList
        })
        this.data.page++;
        wx.hideNavigationBarLoading();
      }
    })
  },
  openDetail:function(e){
    let orderId = e.currentTarget.dataset.orderId;
    let orderFee = e.currentTarget.dataset.orderFee;
    let orderMobile = e.currentTarget.dataset.orderMobile;
    let orderTime = e.currentTarget.dataset.orderTime;
    let orderType = e.currentTarget.dataset.orderType;
    wx.navigateTo({
      url: `../payDetail/payDetail?orderId=${orderId}&orderFee=${orderFee}&orderMobile=${orderMobile}&orderTime=${orderTime}&orderType=${orderType}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.setData({
      myId: wx.getStorageSync('userList').userId
    });
    this.getData(0);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    // 显示加载图标  
    if (this.data.load){
      wx.showLoading({
        title: '玩命加载中',
      })
      this.getData(this.data.page);
      // 隐藏加载框  
      wx.hideLoading(); 
    } 

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})