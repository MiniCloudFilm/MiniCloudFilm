// pages/confirmPay/confirmPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
     checked:'true',
     allow:true,
     doctorP:{},
     videoP:{},
     payType:0
  }, 
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  }, 
  radioAllow:function(e){ 
    this.data.allow=!this.data.allow;
  },
  openConfirm: function () {
    if (this.data.payType=="0"){
      wx.showModal({
        title: '支付完成',
        content: '是否马上观看视频？',
        confirmText: "看视频",
        confirmColor: "#1c7eff",
        cancelText: "返回列表",
        cancelColor: "##1c7eff",
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../video/video'
            })
          } else {
            wx.redirectTo({
              url: '../film/film'
            })
          }
        }
      });
    }else{
      wx.showModal({
        title: '支付完成',
        content: '解读咨询已发起,请等待医生接受。',
        confirmText: "回主页",
        confirmColor: "#1c7eff",
        cancelText: "咨询列表",
        cancelColor: "#616569",
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          } else {
            wx.switchTab({
              url: '../counList/counList'
            })
          }
        }
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      payType: options.type
    }); 
    if(options.type=="0"){ 
      this.setData({
        videoP:options
      }); 
    } else {
      this.setData({
        doctorP:options
      });  

    }
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