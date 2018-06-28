// pages/expertList/expert.js

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');   
var qqmapsdk;  
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    customItem: '全部',
    hospital: [], 
    doctorList:[
      { "doctorImg": "/image/icon-doctor.png", "doctorName": "兰建清", "department": "妇科", "position": "主任医师", "belong": "深圳第一医院", "level": "三甲医院", "skill": "妇科疾病诊断治疗", "price": "8.88" },
      { "doctorImg": "/image/icon-doctor.png", "doctorName": "罗腾可", "department": "放射科", "position": "主任医师", "belong": "北京大学深圳医院", "level": "三甲医院", "skill": "超声诊断", "price": "6.88" },
      { "doctorImg": "/image/icon-doctor.png", "doctorName": "田程林", "department": "男科", "position": "主任医师", "belong": "深圳第二医院", "level": "三甲医院", "skill": "男性疾病诊断", "price": "5.88" }, 
      ]
  
  },
  bindRegionChange: function (e) { 
    let that=this;
    this.setData({
      region: e.detail.value
    })  
    this.getHospital();
  },
  turn:function(e){
    console.log(this.data.doctorMes.order);
    if (this.data.doctorMes.order == 'before') {
      wx.navigateTo({
        url: `../chRepCon/chRepCon?doctorName=${e.currentTarget.dataset.doctor}&belong=${e.currentTarget.dataset.belong}&price=${e.currentTarget.dataset.price}&order=after`
      })
    } else {
      wx.navigateTo({
        url: `../confirmPay/confirmPay?doctorName=${e.currentTarget.dataset.doctor}&belong=${e.currentTarget.dataset.belong}&price=${e.currentTarget.dataset.price}&type=1`
      })
     
    }
  },
  getHospital:function(){
    let that=this;
    let areaName = '';
    console.log(this.data.region[2]);
    if (this.data.region[2] == '全部') {
      if (this.data.region[1] == '全部') {
        areaName = this.data.region[0];
      } else {
        areaName = this.data.region[1];
      }
    } else {
      areaName = this.data.region[2];
    }
    var apiUrl = `http://192.168.131.227:8080/dict/api/v1/getHospital?areaName=${areaName}`;
    wx.request({
      url: apiUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          hospital: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    qqmapsdk = new QQMapWX({
      key: 'NOYBZ-WXICJ-XMGFO-FF2UV-ULBW7-UEBFX'//此处使用你自己申请的key  
    　　});  
    this.setData({
      doctorMes: options
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {   
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude:res.longitude
          },
          success: function (resA) {
            that.setData({
              region: [resA.result.address_component.province, resA.result.address_component.city, resA.result.address_component.district]
            }) 
            that.getHospital();
            console.log(resA);
          },
          fail: function (resA) {
            console.log(resA);
          },
          complete: function (resA) {
            console.log(resA);
          }
        });
      }
    })
   
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