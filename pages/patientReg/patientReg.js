// pages/patientReg/patientReg.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      {value:1,name:'普通用户'},  
      {value: 2, name: '医生' }
      ],
      index:0,
    mobile:''
  },
  mobileNum:function(e){
    console.log(e.detail.value);
    this.setData({
      mobile: e.detail.value
    })
  },
  firstPwd: function (e) {
    console.log(e.detail.value);
    this.setData({
      firstP: e.detail.value
    })
  },
  secondPwd: function (e) {
    console.log(e.detail.value);
    this.setData({
      secondP: e.detail.value
    }) 
  },
  sendCode:function(){ 
    wx.request({
      url: 'http://192.168.131.63:8080/api/v1/user/sendCode', //仅为示例，并非真实的接口地址
      data: {
        'mobile': this.data.mobile 
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data) 

      }
    })
  }, 
  formSubmit: function (e) {
    wx.login({
      success: res => {   
         console.log(e.detail.value);
        let that = this;
        wx.request({
          url: 'http://192.168.131.63:8080/api/v1/user/checkCode', //仅为示例，并非真实的接口地址
          data: {
            'mobile': e.detail.value.mobile,
            "code": e.detail.value.code
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (resA) {
            console.log(resA.data)
            // that.setData({
            //   checkCode:res.data.data
            // }) 
            if (resA.data.data == true) {
              console.log('进入');
              if (that.data.firstP != null && that.data.firstP == that.data.secondP) {
                wx.request({
                  url: 'http://192.168.131.63:8080/api/v1/user/logon', //仅为示例，并非真实的接口地址
                  data: {
                    'name': e.detail.value.name,
                    'idcard': e.detail.value.idCard,
                    'mobile': that.data.mobile,
                    'password': that.data.firstP,
                    'userType': e.detail.value.userType,
                    'code': res.code,
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function (resB) {
                    console.log(resB.data) 
                    if(resB.data.code=='200'){
                      wx.redirectTo({
                        url: `../login/login?mobile=${that.data.mobile}`
                      })
                    }
                  }
                })
              }
            }
          }
        })
      }
    })
    
  
  },
  bindPickerChange:function(e){
    this.setData({
      index:e.detail.value
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