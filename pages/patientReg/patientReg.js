// pages/patientReg/patientReg.js
let app = getApp();
var phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [{
        value: 1,
        name: '普通用户'
      },
      {
        value: 2,
        name: '医生'
      }
    ],
    index: 0,
    mobile: '',
    getCodeButtonText:'获取验证码',
    getCodeButtonStatu:false,
    countdown: 60,
  },
  mobileNum: function(e) {
    // console.log(e.detail.value);
    this.setData({
      mobile: e.detail.value
    })
    console.log(this.data.mobile)
  },
  firstPwd: function(e) {
    // console.log(e.detail.value);
    this.setData({
      firstP: e.detail.value
    })
  },
  secondPwd: function(e) {
    // console.log(e.detail.value);
    this.setData({
      secondP: e.detail.value
    })
  },
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
        success: res=>{
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
  formSubmit: function(e) {
    // console.log(e.detail.value);
    var idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (this.data.from == 'register' && e.detail.value.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (this.data.from == 'register' && e.detail.value.idCard == '') {
      wx.showToast({
        title: '身份证不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (this.data.from == 'register' && !idCardReg.test(e.detail.value.idCard)) {
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
    } else { //注册逻辑
      wx.login({
        success: res => { 
          wx.request({
            url: app.globalData.api.patientReg.checkCode,
            data: {
              'mobile': e.detail.value.mobile,
              "code": e.detail.value.code
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: resA => { 
              if (resA.data.data == true) {
                // console.log('进入注册/忘记密码逻辑');
                let url, data, tipTitle;
                if (this.data.from == 'register') {
                  url = app.globalData.api.patientReg.logon;
                  data = {
                    'name': e.detail.value.name,
                    'idcard': e.detail.value.idCard,
                    'mobile': this.data.mobile,
                    'password': this.data.firstP,
                    'userType': e.detail.value.userType,
                    'code': res.code
                  };
                  tipTitle = "恭喜注册成功";
                } else if (this.data.from == 'forgetPas') {
                  url = app.globalData.api.patientReg.forgetPas;
                  data = {
                    'mobile': this.data.mobile,
                    'password': this.data.firstP,
                    'userType': e.detail.value.userType,
                    'code': res.code
                  };
                  tipTitle = "重置密码成功"
                }
                wx.request({
                  url: url,
                  data: data,
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: resB => {
                    console.log(resB.data);
                    if (resB.data.code == "200") {
                      wx.showToast({
                        title: '恭喜你，注册成功',
                        icon: 'none',
                        image: '',
                        duration: 1000,
                        success: resC => {
                          setTimeout(() => {
                            wx.setStorageSync('user', this.data.mobile)
                            wx.setStorageSync('type', e.detail.value.userType) 
                            wx.navigateBack({  
                              delta: 1
                            });
                          },2000)
                        }
                      });
                    } else {
                      wx.showToast({
                        title: resB.data.msg,
                        icon: 'none',
                        image: '',
                        duration: 2000
                      });
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      sex: this.data.array[e.detail.value].name
    })
  },
  //修改个人信息
  modifyInfo: function(e) {
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
    }else if (this.data.firstP != this.data.secondP) {
      wx.showToast({
        title: '两次密码不一致，请重新输入！',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else { //注册逻辑
      wx.request({
        url: app.globalData.api.patientReg.modifyInfo,
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
            wx.setStorageSync('userList', resB.data.data.user);
            app.globalData.userList = resB.data.data.user;
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
      });
    }
  },
  //重新获取验证码
  setTime(type) {
    this.setData({
      getCodeButtonText: `${this.data.countdown}s后重新获取`,
      getCodeButtonStatu:true
    })
    let interval = setInterval(()=>{
      this.data.countdown--;
      this.setData({
        getCodeButtonText: `${this.data.countdown}s后重新获取`
      })
      if (this.data.countdown <= 0) {
        clearInterval(interval);
        this.setData({
          getCodeButtonText: '获取验证码',
          countdown:60,
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
  // 获取用户信息---个人信息
  getPersonalInfo: function() {
    var personalInfo = app.globalData.userList;
    this.setData({
      name: personalInfo.name,
      idcard: personalInfo.userIdcard,
      mobile: personalInfo.mobile,
      sex: personalInfo.sex == 'M' ? '男' : '女',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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