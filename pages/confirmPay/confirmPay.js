// pages/confirmPay/confirmPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: 'true',
    allow: true
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  radioAllow: function (e) {
    this.data.allow = !this.data.allow;
  },
  //支付
  goPay: function (charge, body, payType, reportId, doctorId) {
    let user = wx.getStorageSync("userList")
    wx.request({
      url: 'http://192.168.131.63:8080/api/v1/pay/prePay', //仅为示例，并非真实的接口地址
      data: {
        "totalFee": charge,
        "body": body,
        "openId": user.userOpenId,
        "mobile": user.mobile,
        "payType": payType
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        let wxPay = res.data;
        if (wxPay.code == '200') {
          // wx.requestPayment({
          //   'timeStamp': wxPay.data.timeStamp,
          //   'nonceStr': wxPay.data.nonceStr,
          //   'package': wxPay.data.package,
          //   'signType': wxPay.data.signType,
          //   'paySign': wxPay.data.paySign,
          //   'success': resA => {
          //     console.log(resA);
          let data = {
            "totalFee": charge,
            "mobile": user.mobile,
            "orderType": payType, //1:咨询,2:视频
            "orderTime": wxPay.data.timeStamp,
            "userId": user.userId,
          }
          if(payType=="1"){
            data.payForDoctor=doctorId;
          }else if(payType=="2"){
            data.payForVideo = doctorId; 
          }
          console.log(data);
          wx.request({
            url: 'http://192.168.131.63:8080/api/v1/pay/saveOrder',
            data:data,
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: resB => {
              console.log(resB);
              if (resB.data.code == "200") { 
                if(payType=="1"){
                  wx.request({
                    url: 'http://192.168.131.63:8080/consult/api/v1/start',
                    data: {
                      "sponsor": user.userId,
                      "receiver": doctorId,
                      "reportId": reportId,
                      "isAssist": this.data.allow ? 'Y' : 'N'
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: resC => {
                      console.log(resC.data.data);
                      if (resC.data.code == "200") {
                        wx.redirectTo({
                          url: `../ConInterface/ConInterface?dialogId=${resC.data.data.dialogId}&reportId=${reportId}&dialoger=${body}&consultId=${resC.data.data.concultId}`
                        })
                      } 
                    }
                  })
                } 
                //   //         if (this.data.payType == "0") {
                //   //           wx.showModal({
                //   //             title: '支付完成',
                //   //             content: '是否马上观看视频？',
                //   //             confirmText: "看视频",
                //   //             confirmColor: "#1c7eff",
                //   //             cancelText: "返回列表",
                //   //             cancelColor: "##1c7eff",
                //   //             success: function (res) {
                //   //               if (res.confirm) {
                //   //                 wx.redirectTo({
                //   //                   url: '../video/video'
                //   //                 })
                //   //               } else {
                //   //                 wx.redirectTo({
                //   //                   url: '../film/film'
                //   //                 })
                //   //               }
                //   //             }
                //   //           });
                //   //         } else {
                //   //           wx.showModal({
                //   //             title: '支付完成',
                //   //             content: '解读咨询已发起,请等待医生接受。',
                //   //             confirmText: "回主页",
                //   //             confirmColor: "#1c7eff",
                //   //             cancelText: "咨询列表",
                //   //             cancelColor: "#616569",
                //   //             success: function (res) {
                //   //               if (res.confirm) {
                //   //                 wx.switchTab({
                //   //                   url: '../index/index'
                //   //                 })
                //   //               } else {
                //   //                 wx.switchTab({
                //   //                   url: '../counList/counList'
                //   //                 })
                //   //               }
                //   //             }
                //   // });
                //   // }
                // },
                //   'fail': resA => {
                //   }
                // }) 
              }
            }
          })
        }
      }
    })
  },
  openConfirm: function () {
    console.log(this.data.allow);
    let pay = this.data.payList;
    console.log(pay) 
    if(pay.type=="1"){
      console.log("1");
      this.goPay(pay.price, pay.doctorName, pay.type, pay.reportId, pay.doctorId)
    }
    else if (pay.type == "2"){ 
      console.log("2");
      this.goPay(pay.charge, pay.title, pay.type, "", pay.videoId);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let user = wx.getStorageSync("userList")
    console.log(user);
    this.setData({
      payList: options
    });
    console.log(this.data.payList)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})