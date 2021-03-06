// pages/confirmPay/confirmPay.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: 'true',
    allow: true
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  radioAllow: function(e) {
    this.data.allow = !this.data.allow;
  },
  //支付 
  goPay: function (payList) { 
    let user = wx.getStorageSync("userList")
    wx.request({
      url: app.globalData.api.confirmPay.prepay, 
      data: {
        "totalFee": payList.charge ? payList.charge : payList.price,
        "body": payList.doctorName ? payList.doctorName : payList.title,
        "openId": user.userOpenId,
        "mobile": user.mobile,
        "payType": payList.type
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        let wxPay = res.data;
        if (wxPay.code == '200') {
          wx.requestPayment({
            'timeStamp': wxPay.data.timeStamp,
            'nonceStr': wxPay.data.nonceStr,
            'package': wxPay.data.package,
            'signType': wxPay.data.signType,
            'paySign': wxPay.data.paySign,
            'success': res => {
              console.log(res);
              //确认订单
              this.saveOrder(user, payList, wxPay);
            }, 
            'fail': res => {
              console.log(res); 
            }
          })
        }
      }
    })
  },
  //确认订单
  saveOrder: function(user, payList, wxPay) {
    let data = {
      "totalFee": payList.charge ? payList.charge:payList.price,
      "mobile": user.mobile,
      "orderType": payList.type, //1:咨询,2:视频
      "orderTime": wxPay.data.timeStamp,
      "userId": user.userId,
      "outTradeNo": wxPay.data.outTradeNo
    }
    console.log(payList);
    if (payList.type == "1") {
      data.payForDoctor = payList.doctorId;
    } else if (payList.type == "2") {
      data.payForVideo = payList.videoId;
    }
    // console.log(data);
    //确认订单
    wx.request({
      url: app.globalData.api.confirmPay.saveOrder,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.code == "200") {
          if (payList.type == "1") {
            //发起会诊
            this.start(user, payList,res.data.data)
          }
          if (payList.type == "2") {
            wx.showToast({
              title: '视频购买成功！',
              icon: 'none',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }
      }
    })
  },
  //发起会诊
  start: function(user, payList,orderId) {
    // console.log(app.globalData.api.consult.start);
    wx.request({
      url: app.globalData.api.confirmPay.start,
      data: {
        "sponsor": user.userId,
        "receiver": payList.doctorId,
        "reportId": payList.reportId,
        "isAssist": this.data.allow ? 'Y' : 'N',
        'orderId': orderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.code == "200") {
          //向医生推送消息
          this.sendMsg(user, res.data.data, payList);
        }
      }
    })
  },
  //推送消息给医生
  sendMsg: function(user, data, payList) { 
    wx.request({
      url: app.globalData.api.confirmPay.sendmsg,
      data: {
        "userId": payList.doctorId,
        "name": user.name
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.statusCode == "200") {
          wx.redirectTo({
            url: `../ConInterface/ConInterface?dialogId=${data.dialogId}&reportId=${payList.reportId}&dialoger=${payList.doctorName}&consultId=${data.concultId}&fromWhere=noRecord&endbutton=true`
          })
        }
      }
    })
  },
  openConfirm: function() {
    // console.log(this.data.allow);
    let payList = this.data.payList;
    console.log(payList)
    if (payList.type == "1") {
      this.goPay(payList)
    } else if (payList.type == "2") {
      this.goPay(payList);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);  
    let user = wx.getStorageSync("userList")
    // console.log(user);
    this.setData({
      payList: options
    });
    console.log(this.data.payList)
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