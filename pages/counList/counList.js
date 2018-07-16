// pages/counList/counList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoctor: true,
    tabs: ["患者咨询", "医生协助","待处理"],
    activeIndex: 0,
    token:''
  },
  tabClick: function (e) {
    let index = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: index
    });
    // if (index==0){
    //   this.getCounList();
    //   return false;
    // }else if(index==1){
    //   this.receiveAssist();
    //   return false;
    // }else if(index==2){
    //   this.pendingAction();
    // }
  },
  //退款
  refund: function (orderId){
    wx.request({
      url: app.globalData.api.counList.refund, 
      data: {
        'orderId': orderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.code == '200') {
          this.pendingAction();
        }
      }
    })
  },
  //接受
  accept:function(e){
    console.log(e.currentTarget.dataset.consult);
    wx.request({
      url: app.globalData.api.counList.accept,
      data: {
        'consultId': e.currentTarget.dataset.consult, 
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res=> {
        console.log(res);
        if (res.data.code == '200') { 
          this.pendingAction();
        }
      }
    })
  },
  //拒绝
  refuse:function(e){
    wx.request({
      url: app.globalData.api.counList.refuse,
      data: {
        'consultId': e.currentTarget.dataset.consult,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res=> {
        console.log(res);
        if (res.data.code == '200') { 
          this.refund(e.currentTarget.dataset.orderId);
        }
      }
    })
  },
  //获取咨询列表---患者端
  getCounListOfPatient: function () {
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
        console.log(res.data);
        if (res.data.code == '200') {
          this.setData({
            counList: res.data.data
          })
        }
      }
    })
  },
  //获取咨询列表---医生端
  getCounList:function(){
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
        console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            counList: res.data.data
          })
        }
      }
    })
  },
  receiveAssist:function(){//我接收的协助
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
        console.log(res.data)
        if (res.data.code == "200") {
          this.setData({
            receiveAssistList: res.data.data
          })
        }
      }
    })
  },
  pendingAction:function(){//待处理
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
        console.log(res.data)
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
    if (e.currentTarget.dataset.status == "0") { 
      wx.showToast({
        title: '请等待专家确认！',
        icon: 'none',
        duration: 2000
      })   
    } else if(e.currentTarget.dataset.status == "1"){
      wx.navigateTo({
        url: `../ConInterface/ConInterface?dialogId=${e.currentTarget.dataset.dialogid}&reportId=${e.currentTarget.dataset.reportid}&dialoger=${e.currentTarget.dataset.aponsorname}&ifAssist=${e.currentTarget.dataset.assisterid}&consultId=${e.currentTarget.dataset.consultid}&fromWhere=noRecord`,
      })
    } else if (e.currentTarget.dataset.status == "2"){
      wx.showToast({
        title: '咨询结束！',
        icon: 'none',
        duration: 2000
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
    let user = wx.getStorageSync("userList");
    this.setData({
      userType: user.userType
    });
    if(this.data.userType==1){
      this.getCounListOfPatient();
      return false;
    } else if (this.data.userType == 2){
      this.getCounList();
      this.pendingAction();
      this.receiveAssist();
    }
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