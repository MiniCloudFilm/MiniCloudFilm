// pages/patientReg/patientReg.js
let app = getApp();
var phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [{
        value: 'M',
        name: '男'
      },
      {
        value: 'W',
        name: '女'
      }
    ],
    index: 0,
    mobile: '',
    getCodeButtonText: '获取验证码',
    getCodeButtonStatu: false,
    countdown: 60,
    password: true,
    invisible: true,
    name: '',
    idcard: '',
    firstP: '',
    secondP: ''
  },
  // 绑定输入
  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  checkIdcard: function(e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  mobileNum: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  getCode: function(e) {
    this.setData({
      secCode: e.detail.value
    })
  },
  firstPwd: function(e) {
    this.setData({
      firstP: e.detail.value
    })
  },
  secondPwd: function(e) {
    this.setData({
      secondP: e.detail.value
    })
  },

  //绑定删除icon
  clearName: function() {
    this.setData({
      name: ""
    })
  },
  clearIdcard: function() {
    this.setData({
      idcard: ""
    })
  },
  clearMobile: function() {
    this.setData({
      mobile: ""
    })
  },
  clearCode: function() {
    this.setData({
      secCode: ""
    })
  },
  clearfirstP: function() {
    this.setData({
      firstP: ""
    })
  },
  clearsecondP: function() {
    this.setData({
      secondP: ""
    })
  },

  // 获取用户信息
  getPersonalInfo: function() {
    var personalInfo = app.globalData.userList;
    this.setData({
      name: personalInfo.name,
      idcard: personalInfo.userIdcard,
      mobile: personalInfo.mobile
    })
  },
  // 验证手机号码
  sendCode: function() {
    if (!phoneReg.test(this.data.mobile)) { //验证手机号码
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else {
      console.log(this.data.mobile);
      wx.request({
        url: app.globalData.api.patientReg.sendCode,
        data: {
          'mobile': this.data.mobile
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '获取验证码成功！',
            icon: 'none',
            image: '',
            duration: 1500
          });
          this.setTime();
        }
      })
    }
  },
  //提交
  formSubmit: function(e) {
    var idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (e.detail.value.idCard == '') {
      wx.showToast({
        title: '身份证不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (!idCardReg.test(e.detail.value.idCard)) {
      wx.showToast({
        title: '身份证格式有误',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (!phoneReg.test(e.detail.value.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (e.detail.value.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (e.detail.value.pwd == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (this.data.firstP != this.data.secondP) {
      wx.showToast({
        title: '两次密码不一致，请重新输入！',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else {
      console.log(app.globalData.api.personalInfo.modifyInfo)
      wx.request({
        url: app.globalData.api.personalInfo.modifyInfo,
        data: {
          'token': app.globalData.token,
          'name': e.detail.value.name,
          'idcard': e.detail.value.idCard,
          'mobile': e.detail.value.mobile,
          'password': e.detail.value.pwd,
          'sex': e.detail.value.sex,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: resB => {
          console.log(resB.data);
          if (resB.data.code == "200") {
            wx.showToast({
              title: '修改信息成功！',
              icon: 'success',
              image: '',
              duration: 1000,
              success: resC => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            });
          } else {
            wx.showToast({
              title: '修改信息失败！',
              icon: 'none',
              image: '/image/pword-different.png',
              duration: 2000
            });
          }
        }
      })
    }
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //重新获取验证码
  setTime(type) {
    this.setData({
      getCodeButtonText: `${this.data.countdown}s后重新获取`,
      getCodeButtonStatu: true
    })
    let interval = setInterval(() => {
      this.data.countdown--;
      this.setData({
        getCodeButtonText: `${this.data.countdown}s后重新获取`
      })
      if (this.data.countdown <= 0) {
        clearInterval(interval);
        this.setData({
          getCodeButtonText: '获取验证码',
          countdown: 60,
          getCodeButtonStatu: false
        })
      }
    }, 1000)
  },
  //切换密码可见图片
  switchImage: function() {
    let tempVisible = !this.data.invisible;
    let tempPassword = !this.data.password;
    this.setData({
      invisible: tempVisible,
      password: tempPassword
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPersonalInfo();
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