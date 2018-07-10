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
  openConfirm: function () {
    let pay = this.data.payList;
    console.log(pay)
    let user = wx.getStorageSync("userList")
    console.log(user);
    wx.request({
      url: 'http://192.168.131.63:8080/api/v1/pay/prePay', //仅为示例，并非真实的接口地址
      data: {
        "totalFee": pay.price,
        "body": pay.doctorName,
        "openId": user.userOpenId,
        "mobile": user.mobile,
        "payType": "1"
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        let wxPay = res.data;
        if (wxPay.code == '200') {
          wx.request({
            url: 'http://192.168.131.63:8080/consult/api/v1/start', //仅为示例，并非真实的接口地址
            data: {
              "sponsor": user.userId,
              "receiver": pay.doctorId,
              "reportId": pay.reportId,
              "isAssist": '1'
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: resB => {
              console.log(resB.data.data);
              if (resB.data.code=="200"){
                wx.redirectTo({
                  url: `../ConInterface/ConInterface?dialogId=${resB.data.data.dialogId}&reportId=${pay.reportId}&dialoger=${pay.doctorName}&concultId=${resB.data.data.concultId}`,
                })
             } 
            }
          })
          // wx.requestPayment({
          //   'timeStamp': wxPay.data.timeStamp,
          //   'nonceStr': wxPay.data.nonceStr,
          //   'package': wxPay.data.package,
          //   'signType': wxPay.data.signType,
          //   'paySign': wxPay.data.paySign,
          //   'success': resA => {
          //     console.log(resA);
              
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