// pages/pickupCachRecord/pickupCachRecord.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // ifHasData: true, //是否可以下拉刷新
    // page: 1,
    // nodataIsHidden: true,
    // loadingIsHidden: true,
    pageSize:10//每页信息条数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isHideLoadMore: true,
      isEnd: true,
      page: 1,
    })
    this.getCashRecord();
  },
  getCashRecord: function (){
    wx.request({
      url: app.globalData.api.pickupCachRecord.getCashRecord,
      data: {
        'token': app.globalData.token,
        'page': this.data.page,
        'pageSize': this.data.pageSize
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res)
        if (res.data.code == "200") {
          this.setData({
            pickupCashRecord: app.globalData.pageLoad.check(this.data.pickupCashRecord, res.data.data.datas, this.data.pageSize, this)
          }) 
          // let mesArr;
          // if (page > 1) {
          //   mesArr = this.data.pickupCashRecord;
          // } else {
          //   mesArr = [];
          // };
          // mesArr.push.apply(mesArr, res.data.data.datas); //合并数组
          // this.setData({
          //   pickupCashRecord: mesArr
          // });
          // // 判断是否换页
          // if (res.data.data.datas.length == 0) {
          //   this.setData({
          //     ifHasData: false
          //   })
          //   if (page > 1) {
          //     this.setData({
          //       nodataIsHidden: false,
          //       loadingIsHidden: true
          //     })
          //   }
          // } else {
          //   if (res.data.data.datas.length < this.data.pageSize) {
          //     this.setData({
          //       ifHasData: false
          //     })
          //     if (page > 1) {
          //       this.setData({
          //         nodataIsHidden: false,
          //         loadingIsHidden: true
          //       })
          //     }
          //   } else {
          //     this.setData({
          //       loadingIsHidden: true,
          //       page: ++page
          //     })
          //   }
          // };
        };
      }
    })
    
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
    app.globalData.pageLoad.pullDownRefresh(this, this.getCashRecord);
    // wx.showNavigationBarLoading() //在标题栏中显示加载  
    // setTimeout(() => {
    //   this.getCashRecord(1);
    //   this.setData({
    //     page: 1,
    //     loadingIsHidden: true,
    //     nodataIsHidden: true,
    //     ifHasData: true
    //   })
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新 
    // }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    app.globalData.pageLoad.reachBottom(this, this.getCashRecord);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})