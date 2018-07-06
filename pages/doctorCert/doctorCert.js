// pages/doctorCert/doctorCert.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hospital: ["北京大学深圳医院", "深圳第一医院", "深圳第二医院"],
    hospitalIndex:0,
    customItem:"请选择", 
    department: ["请选择", "放射科", "妇科", "男科"],
    departmentIndex: 0,
    title: ["请选择", '主任','副主任','医师'],
    titleIndex: 0,
    image: [],
    head:[]
  },
  bindHospitalChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      hospitalIndex: e.detail.value
    })
  },
  bindDepartmentChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      departmentIndex: e.detail.value
    })
  }, 
  bindTitleChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      titleIndex: e.detail.value
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        that.setData({
          image: that.data.image.concat(res.tempFilePaths)
        });
        console.log(that.data.image);
      }
    })
  },
  chooseHead:function(e){ 
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        that.setData({
          head: that.data.head.concat(res.tempFilePaths)
        });
        console.log(that.data.head);
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  formSubmit:function(e){ 
    let user=wx.getStorageSync('userList');
    console.log(user);
    wx.uploadFile({
      url: 'http://192.168.131.3:8080/doctor/api/v1/uploadAvatar', //仅为示例，非真实的接口地址
      filePath: this.data.head[0],
      name: 'avatarFile', 
      formData: {
        'userId': user.userId
      },
      success: function (res) {
        console.log(res);
        var data = res.data
        //do something
      }
    })
    // wx.request({
    //   url: 'https://192.168.131.3:8443/doctor/api/v1/uploadAvatar', //仅为示例，并非真实的接口地址
    //   data: {
    //     'avatarFile': this.data.image[0],
    //     'certificateFile': this.data.head[0],
    //     'doctorId': user.userId
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: res => {
    //     console.log(res);
    //     if (res.data.code == '200') { 
    //     }
    //   }
    // })
    // wx.navigateBack({
    //   delta: 1
    // })
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