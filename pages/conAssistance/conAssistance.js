// pages/counList/counList.js
var sliderWidth = 96; 
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoctor: true,
    tabs: ["我的会诊", "发起协助","接收协助"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    isAccept:false,
    token:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.checkLoginInfo(app.getCurrentUrl()); 
    console.log(that.data.activeIndex)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: 0,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.setData({
      token:wx.getStorageSync("token")
    });
    this.myALLConsult();
    this.sendAssist();
    this.receiveAssist();
  },
  tabClick: function (e) {
    console.log(e.currentTarget.offsetLeft);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  myALLConsult:function(){//所有患者的咨询---医生端
    wx.request({
      url: app.globalData.api.conAssistance.myALLConsult,
      data: {
        'token': this.data.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.code == '200') {
          this.setData({
            myALLConsultList:res.data.data
          })
        }
      }
    })
  },
  sendAssist:function(){//我向别人发起协助的会诊
    wx.request({
      url: app.globalData.api.conAssistance.sendAssist, //仅为示例，并非真实的接口地址
      data: {
        'token': this.data.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.code == '200') {
          this.setData({
            sendAssistList: res.data.data
          })
        }
      }
    })
  },
  receiveAssist:function(){//别人向我发起的协助会诊
    wx.request({
      url: app.globalData.api.conAssistance.receiveAssist,
      data: {
        'token': this.data.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.code == '200') {
          this.setData({
            receiveAssistList: res.data.data
          })
        }
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

})