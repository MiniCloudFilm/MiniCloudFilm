// pages/counList/counList.js
var sliderWidth = 96; 
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
    token:"",
    myALLConsultList:[],
    sendAssistList:[],
    receiveAssistList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
      url: 'http://192.168.131.63:8080/consult/api/v1/myConsultRecord', //仅为示例，并非真实的接口地址
      data: {
        'token': this.data.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data);
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
      url: 'http://192.168.131.63:8080/consult/api/v1/sponsorAssistRecord', //仅为示例，并非真实的接口地址
      data: {
        'token': this.data.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data);
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
      url: 'http://192.168.131.63:8080/consult/api/v1/myAssistConsultRecord', //仅为示例，并非真实的接口地址
      data: {
        'token': this.data.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data);
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