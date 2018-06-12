// pages/expertList/expert.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '深圳市'],
    customItem: '全部',
    doctorList:[
      { "doctorImg": "/image/icon-doctor.png", "doctorName": "兰建清", "department": "妇科", "position": "主任医师", "belong": "深圳第一医院", "level": "三甲医院", "skill": "妇科疾病诊断治疗", "price": "8.88" },
      { "doctorImg": "/image/icon-doctor.png", "doctorName": "罗腾可", "department": "放射科", "position": "主任医师", "belong": "北京大学深圳医院", "level": "三甲医院", "skill": "超声诊断", "price": "6.88" },
      { "doctorImg": "/image/icon-doctor.png", "doctorName": "田程林", "department": "男科", "position": "主任医师", "belong": "深圳第二医院", "level": "三甲医院", "skill": "男性疾病诊断", "price": "5.88" }, 
      ]
  
  },
  bindRegionChange: function (e) { 
    this.setData({
      region: e.detail.value
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      doctorMes: options
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