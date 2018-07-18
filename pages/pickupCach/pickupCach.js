var app = getApp();
var util = require('../../utils/bank.js');
var userList = app.globalData.userList;
var myId = JSON.stringify(userList.userId);
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ifHasRecord:true,//账号记录
    cardType: '',
    name:'',
    phoneNumber: '',
    bankNumber: '',
    cardList:[ 
    ]
  },
  //银行卡号
  getUserIdCardNumber: function (e) {
    var value = e.detail.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
    this.setData({
      bankNumber: value
    });
    value = value.replace(/\s/ig, '');
    var temp = util.bankCardAttribution(value);
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
      let bankNumber = this.data.bankNumber.replace(/\s/ig, '');
      wx.request({
        url: app.globalData.api.pickupCach.submitInfos,
        data: {
          'userId': myId,
          'reflectCharge': this.data.reflectCharge,
          "bankCardId": bankNumber,
          'bankName': this.data.cardType,
          'token': wx.getStorageSync("token")
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.code=="200"){
            var flag = true;//判断卡号是否重复
            that.data.cardList.forEach(function(val,i){
              if (val.indexOf(bankNumber)!=-1){
                flag=false;
              }
            })
            if (flag) that.saveCard(bankNumber);
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
  //新增银行卡
  saveCard: function (bankNumber){
    wx.request({
      url: app.globalData.api.pickupCach.saveCard,
      data: {
        'userId': myId,
        'cardBankName': this.data.cardType,
        'cardUserName': userList.name,
        'cardNumber': bankNumber,
        'token':wx.getStorageSync("token")
      },
      method:"post",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("保存成功")
      }
    })
  },
  //查询银行卡
  searchCard:function(e){
    var that = this;
    wx.request({
      url: app.globalData.api.pickupCach.searchCard,
      data: {
        'userId': myId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if(res.data.code==200){
          if(res.data.data.length==0){
            that.setData({
              ifHasRecord:false
            })
          }else{
            var cardMes=[];
            res.data.data.forEach(function(val,i){
              cardMes.push(val.cardBankName + "-" + val.cardNumber)
            });
            var value = cardMes[0].split("-")[1].replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
            that.setData({
              cardList: cardMes,
              cardType: cardMes[0].split("-")[0],
              bankNumber: value
            });
          }
        }else{
          that.setData({
            ifHasRecord: false
          })
        } 
      }
    })
  },
  //选择账号
  bindPickerChange:function(e){
    var that = this;
    var value = this.data.cardList[e.detail.value].split("-")[1].replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
    this.setData({
      cardType: that.data.cardList[e.detail.value].split("-")[0],
      bankNumber: value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      reflectCharge:options.balance,
      name: userList.name
    });
    this.searchCard();//查询卡号记录
  }
})
