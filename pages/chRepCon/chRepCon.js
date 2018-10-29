// pages/chRepCon/chRepCon.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  turn: function(e) {
    if (this.data.doctorMes.order == 'before') {
      console.log(e.currentTarget.dataset.doctoruserid)
      wx.navigateTo({
        url: `../expertList/expert?reportId=${e.currentTarget.dataset.reportid}&doctoruserid=${e.currentTarget.dataset.doctoruserid}`
      })
    } else {
      // console.log(e.currentTarget.dataset.doctoruserid)
      // console.log(this.data.doctorMes.doctorId)
      // console.log(e.currentTarget.dataset.doctoruserid.indexOf(this.data.doctorMes.doctorId))
      if (e.currentTarget.dataset.doctoruserid.indexOf(this.data.doctorMes.doctorId) != -1) {
        wx.showModal({
          title: '温馨提示',
          content: '该检查报告正在和此医生咨询中，请勿重复选择',
          showCancel: false,
          success: function(res) {}
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

  onLoad: function(options) {
    wx.showLoading({
      title: '报告加载中..',
    });
    this.setData({
      isHideLoadMore: true,
      isEnd: true,
      page: 1,
      doctorMes: options
    })
    if (this.data.doctorMes.order=='case'){
      this.setData({
        url: app.globalData.api.chRepCon.getExample,
        params:{
          'pageSize': 5,
          'page': this.data.page
        }
      });
      wx.setNavigationBarTitle({ title: '演示案例' })  
    }else{
      //验证登录状态
      app.checkLoginInfo(app.getCurrentUrl());
      this.setData({
        url: app.globalData.api.chRepCon.getReportList,
        params: {
          'token': app.globalData.token,
          'name': app.globalData.userList.name,
          'pageSize': 5,
          'page': this.data.page
        }
      })
    }
   
  },

  //获取列表
  getReportList: function () {
    wx.request({
      url: this.data.url,
      data: this.data.params,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.code == "200") {
          this.setData({
            reportList: app.globalData.pageLoad.check(this.data.reportList, res.data.data.datas, 5, this)
          })
        };
        if (res.data.code == "400" && this.data.doctorMes.order != 'case') {
          app.globalData.pageLoad.outTime(res);
        }
        // console.log(this.data.page);
        // console.log(this.data.reportList);
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        app.globalData.util.showFail("服务连接失败");
      }
    })
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
    this.getReportList()
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
  onPullDownRefresh: function() {
    app.globalData.pageLoad.pullDownRefresh(this, this.getReportList, [this.data.url]);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 显示加载图标   
    app.globalData.pageLoad.reachBottom(this, this.getReportList,[ this.data.url]);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})