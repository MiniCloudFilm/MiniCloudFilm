var util = require('../../utils/bank.js');
var userList = wx.getStorageSync('userList');
var myId = JSON.stringify(userList.userId);
var userName = userList.name;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardType: '',
    name: '',
    phoneNumber: '',
    bankName: '',
    bankNumber: '',
    cardList:[
      "农业银行-6228480078036553978",
      "招商银行-6225768753214921",
      "交通银行-6222530793288817",
      "工商银行-6212261410000802843"
    ]
  },
  //银行卡号
  getUserIdCardNumber: function (e) {
    this.setData({
      bankNumber: e.detail.value
    })
    var temp = util.bankCardAttribution(e.detail.value)
    console.log(temp)
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    }
    else {
      this.setData({
        cardType: temp.bankName + temp.cardTypeName,
      })
    }
  },
  //提交转账信息
  submitInfos: function () {
    var that = this;
    if (!that.data.bankNumber) {
      wx.showToast({
        title: '收款账号不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (!that.data.cardType) {
      wx.showToast({
        title: '不支持该类型的银行卡，请更换',
        icon: 'none',
        image: '',
        duration: 1000
      })
    }else {
      wx.request({
        url: 'http://192.168.131.63:8080/doctor/api/v1/getCash', //仅为示例，并非真实的接口地址
        data: {
          'userId': myId,
          'reflectCharge': this.data.reflectCharge,
          "bankCardId": this.data.bankNumber,
          'bankName': this.data.bankName,
          'token': ''
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.code=="200"){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              image: '',
              duration: 1500,
              success:function(){
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateBack({
                    url: "../myAccount/account"
                  })
                }, 2000) //延迟时间
               
              }
            })
          }else{
            wx.showToast({
              title:'提现失败，请稍后再试！',
              icon: 'none',
              image: '',
              duration: 1500
            })
          }
        }
      })
    };

  },
  //查询银行卡
  searchCard:function(e){
    wx.request({
      url: 'http://192.168.131.63:8080/doctor/api/v1/queryBankCard', //仅为示例，并非真实的接口地址
      data: {
        'userId': myId,
        'token' :''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // this.setData({
        //   cardList:res.data
        // })
        console.log(res.data)
      }
    })
  },
  //选择账号
  bindPickerChange:function(e){
    var that = this;
    this.setData({
      bankNumber:that.data.cardList[e.detail.value].split("-")[1]
    });
    var temp = util.bankCardAttribution(that.data.cardList[e.detail.value].split("-")[1])
    console.log(temp)
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    }else {
      this.setData({
        cardType: temp.bankName + temp.cardTypeName,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      reflectCharge:options.balance,
      name: userName
    })
  }
})
