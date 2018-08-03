// pages/chRepCon/chRepCon.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: { 
  },
  turn: function (e) {
    if (this.data.doctorMes.order == 'before') {
      console.log(e.currentTarget.dataset.doctoruserid)
      wx.navigateTo({
        url: `../expertList/expert?reportId=${e.currentTarget.dataset.reportid}&doctoruserid=${e.currentTarget.dataset.doctoruserid}`
      })
    } else {
      console.log(e.currentTarget.dataset.doctoruserid)
      console.log(this.data.doctorMes.doctorId)
      console.log(e.currentTarget.dataset.doctoruserid.indexOf(this.data.doctorMes.doctorId))
      if (e.currentTarget.dataset.doctoruserid.indexOf(this.data.doctorMes.doctorId)!=-1){
        wx.showModal({
          title: '温馨提示',
          content: '该检查报告正在和此医生咨询中，请勿重复选择',
          showCancel: false,
          success: function (res) {}
        });
        return false;
      }
      wx.navigateTo({
        url: `../confirmPay/confirmPay?price=${this.data.doctorMes.price}&doctorName=${this.data.doctorMes.doctorName}&belong=${this.data.doctorMes.belong}&doctorId=${this.data.doctorMes.doctorId}&reportId=${e.currentTarget.dataset.reportid }&type=1` 
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.showLoading({
      title: '报告加载中..',
    });
    this.setData({ 
      isHideLoadMore: true, 
      isEnd: true,
      page: 1
    })
    if (options.order == 'before') {
      this.setData({
        doctorMes: options
      })
    } else {
      this.setData({
        doctorMes: options
      })
      // console.log(this.data.doctorMes);
    }
    app.checkLoginInfo(app.getCurrentUrl());
  },

  //获取列表
  getReportList:function( ){
    wx.request({
      url: app.globalData.api.chRepCon.getReportList,
      data: {
        'token': app.globalData.token,
        'name': app.globalData.userList.name,
        'pageSize': 5,
        'page': this.data.page
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.code == "200") {
          this.setData({
            reportList: app.globalData.pageLoad.check(this.data.reportList, res.data.data.datas, 5,this)
          }) 
        }  
        // console.log(this.data.page);
        // console.log(this.data.reportList);
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常，请稍后再试！',
          icon: 'none',
          duration: 2000
        })
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
    this.getReportList()
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
  onPullDownRefresh: function () {
    app.globalData.pageLoad.pullDownRefresh(this,this.getReportList);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 显示加载图标   
    app.globalData.pageLoad.reachBottom(this, this.getReportList); 
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})