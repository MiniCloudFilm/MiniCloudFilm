var app = getApp();
var util = require('../../utils/bank.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ifHasRecord: true, //账号记录
    cardType: '',
    name: '',
    phoneNumber: '',
    bankNumber: '',
    cardList: []
  },
  //银行卡号
  getUserIdCardNumber: function(e) {
    var value = e.detail.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
    this.setData({
      bankNumber: value
    });
    value = value.replace(/\s/ig, '');
    console.log(value)
    var temp = util.bankCardAttribution(value);
    console.log(temp)
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    } else {
      this.setData({
        cardType: temp.bankName + temp.cardTypeName,
      })
    }
  },
  //提交转账信息
  submitInfos: function(cardId) {
      var that = this;
      wx.request({
        url: app.globalData.api.pickupCach.submitInfos,
        data: {
          'reflectCharge': this.data.reflectCharge,
          "bankCardId": cardId,
          'token': this.data.token
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.code=="200"){
            wx.showModal({
              title: '提现成功',
              content: '我们将在3个工作日把款项转至您账户,请耐心等待。',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    url: "../myAccount/account"
                  })
                }
              }
            })
          }else{
            app.globalData.util.showFail("提现失败！")
          }
        },
        fail:function(){
          app.globalData.util.showFail("服务连接失败")
        }

      })

  },
  //新增银行卡--提现按钮触发
  saveCard: function() {
    var that = this;
    if (!that.data.bankNumber) {
      app.globalData.util.showWarning('账号不能为空')
    } else if (!that.data.cardType) {
      app.globalData.util.showWarning('卡号类型不支持')
    } else {
      let bankNumber = this.data.bankNumber.replace(/\s/ig, '');
      var flag = false;//判断卡号是否重复
      that.data.cardList.forEach(function (val, i) {
        if (val.cardNumber == bankNumber) {
          flag = true;
          that.setData({
            cardId:val.id
          })
        }
      });
      if (!flag){//如果不重复 则保存  
        wx.request({
          url: app.globalData.api.pickupCach.saveCard,
          data: {
            'cardBankName': this.data.cardType,
            'cardUserName': this.data.name,
            'cardNumber': bankNumber,
            'token': this.data.token
          },
          method: "post",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var cardId = res.data.data.id;
            that.submitInfos(cardId)
          }
        });
      }else{//直接提现
          that.submitInfos(this.data.cardId);
      }
    }
  },
  //查询银行卡
  searchCard: function(e) {
    var that = this;
    wx.request({
      url: app.globalData.api.pickupCach.searchCard,
      data: {
        'token': this.data.token
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.code == 200) {
          if (res.data.data.length == 0) {
            that.setData({
              ifHasRecord: false
            })
          } else {
            var cardMesArr = [];
            var cardMesObj = res.data.data;
            cardMesObj.forEach(function (val, i) {
              cardMesArr.push(val.cardBankName + "-" + val.cardNumber)
            });
            var value = cardMesObj[0].cardNumber.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
            that.setData({
              cardList: cardMesObj,
              cardMesArr: cardMesArr,//展示数据的
              cardType: cardMesObj[0].cardBankName,
              bankNumber: value
            });
          }
        } else {
          that.setData({
            ifHasRecord: false
          })
        }
      }
    })
  },
  //选择账号
  bindPickerChange: function(e) {
    var that = this;
    var value = this.data.cardList[e.detail.value].cardNumber.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
    this.setData({
      cardId: that.data.cardList[e.detail.value].id,
      bankNumber: value
    });
    var temp = util.bankCardAttribution(this.data.cardList[e.detail.value].cardNumber);
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    } else {
      this.setData({
        cardType: temp.bankName + temp.cardTypeName,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userList = app.globalData.userList;
    this.setData({
      reflectCharge: options.balance,
      name: userList.name,
      token: app.globalData.token
    });
    this.searchCard(); //查询卡号记录
  }
})