// pages/counList/counList.js
var app = getApp();
let filter = require('../../utils/filter.js')
// filter.identityFilter(
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoctor: true,
    tabs: ["患者咨询", "医生协助", "待处理"],
    activeIndex: 0,
    token: ''
  },
  tabClick: function(e) {
    let index = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: index
    });
  },
  //退款
  refund: function(e) {
    wx.request({
      url: app.globalData.api.counList.refund,
      data: {
        'orderId': e.currentTarget.dataset.orderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.data == 'SUCCESS') {
          this.refuse(e.currentTarget.dataset.consult);
        }else{
          wx.showToast({
            title: '拒绝失败，请稍后再试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //接受
  accept: function(e) {
    // console.log(e.currentTarget.dataset.consult);
    wx.request({
      url: app.globalData.api.counList.accept,
      data: {
        'consultId': e.currentTarget.dataset.consult,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res);
        if (res.data.code == '200') {
          let dialoger = e.currentTarget.dataset.dialoger;
          let dialogId = e.currentTarget.dataset.dialogId;
          let reportId = e.currentTarget.dataset.reportId;
          let consultId = e.currentTarget.dataset.consult;
          wx.navigateTo({
            url: `../ConInterface/ConInterface?dialogId=${dialogId}&reportId=${reportId}&dialoger=${dialoger}&ifNeedAssist=true&consultId=${consultId}&fromWhere=noRecord&endbutton=true`
          })
        }
      }
    })
  },
  //拒绝
  refuse: function (consult) {
    wx.request({
      url: app.globalData.api.counList.refuse,
      data: {
        'consultId':consult,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res);
        if (res.data.code=="200") {
          this.pendingAction(); 
        } 
      }
    })
  },
  //获取咨询列表---患者端
  getCounListOfPatient: function() {
    wx.request({
      url: app.globalData.api.counList.getCounListOfPatient,
      data: {
        "token": app.globalData.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data);
        if (res.data.code == '200') {
          this.setData({
            counList: res.data.data
          })
          wx.hideLoading()
        }
      }
    })
  },
  //获取咨询列表---医生端
  getCounList: function() {
    wx.request({
      url: app.globalData.api.counList.getCounList,
      data: {
        "token": app.globalData.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            counList: res.data.data
          })
          wx.hideLoading()
        }
      }
    })
  },
  receiveAssist: function() { //我接收的协助
    wx.request({
      url: app.globalData.api.counList.receiveAssist,
      data: {
        "token": app.globalData.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            receiveAssistList: res.data.data
          })
        }
      }
    })
  },
  pendingAction: function() { //待处理
    wx.request({
      url: app.globalData.api.counList.pendingAction,
      data: {
        "token": app.globalData.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            pendingActionList: res.data.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log((this.data.counList && this.data.counList.length == 0));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  trunConInterface: function(e) {
    if (e.currentTarget.dataset.status == "0") {
      wx.showToast({
        title: '请等待专家确认！',
        icon: 'none',
        duration: 2000
      })
    } else if (e.currentTarget.dataset.status == "1") {
      var limitsOfEnd = e.currentTarget.dataset.endbutton ? 'false' : 'true'
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifNeedAssist=${e.currentTarget.dataset.assisterid ? false : true}&consultId=${e.currentTarget.dataset.consultid}&fromWhere=noRecord&endbutton=${limitsOfEnd}`,
      })
    } else if (e.currentTarget.dataset.status == "2") {
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifNeedAssist=false&consultId=&fromWhere=record&endbutton=false`,
      })
    } else if (e.currentTarget.dataset.status == "3") {
      wx.showToast({
        title: '咨询已被拒绝！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中..', 
    })
    //登录校验
    app.checkLoginInfo(app.getCurrentUrl()); 
    let user = app.globalData.userList;
    console.log(user); 
    if (user) {
      this.setData({
        userType: user.userType
      }); 
    }else{ 
      this.setData({
        userType: null
      }); 
    }
    if (this.data.userType == 1) {
      this.getCounListOfPatient();
      return false;
    } else if (this.data.userType == 2) {
      this.getCounList();
      this.pendingAction();
      this.receiveAssist();
    }
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