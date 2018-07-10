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
    doctorLevel: ["请选择", "主任医师","副主任医师","主治医师","医师"],
    titleIndex: 0,
    image: [], 
    areaIndex: [0, 0, 0], 
    head:[],
    countHeadImg:0,
    user:wx.getStorageSync('userList'),
    token: wx.getStorageSync('token'),
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
    wx.chooseImage({ 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:res=> {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        this.setData({
          image: this.data.image.concat(res.tempFilePaths)
        });
        console.log(this.data.image);
      }
    })
  },
  chooseHead:function(e){  
    if (this.data.head.length < 1) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res=> {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res);
          this.setData({
            head: this.data.head.concat(res.tempFilePaths) 
          });
          console.log(this.data.head);
        }
      })
    }else{
      wx.showToast({
        title: '只能上传一张头像!', 
        icon: 'none',
        duration: 2000
      })
    }
  },
  //上传头像
  upAvatar: function () {
    let user = this.data.user;
    console.log('头像');
    console.log(this.data.head);
    wx.uploadFile({
      url: 'http://192.168.131.102:8080/doctor/api/v1/uploadAvatar', //仅为示例，非真实的接口地址
      filePath: this.data.head[0],
      name: 'avatarFile',
      formData: {
        'token': this.data.token
      },
      success: res=> {
        console.log(res); 
      }, 
      fail: res => {
        console.log(res); 
      }
    })
  }, 
  //上传证书方法
  upCertificaterMethod: function (num) { 
    console.log(this.data.image);
    console.log('方法');
    let user =this.data.user;
    wx.uploadFile({
      url: 'http://192.168.131.102:8080/doctor/api/v1/uploadCertificate', //仅为示例，非真实的接口地址
      filePath: this.data.image[num],
      name: 'certificateFile',
      formData: {
        'token': this.data.token
      },
      success: res=> {
        console.log(res); 
      },
      fail: res => {
        console.log(res);
      }
    })
  }, 
  //上传多张证书
  upCertificater:function(){
    for(let i=0;i<this.data.image.length;i++){
      this.upCertificaterMethod(i);
    }
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  formSubmit:function(e){ 
    console.log(this.data.token);
    let user=this.data.user;
    console.log(user);  
    this.upAvatar();
    this.upCertificater();
    wx.request({
      url: 'http://192.168.131.102:8080/doctor/api/v1/doctorCertified',
      data: {
        'token': this.data.token,
        'deptId': '20',
        'age': '20',
        'charge': '18',
        'hospitalId': "45576818X",
        'doctorLevel': '1',
        'synopsis': '建清是个逗比',
        'qualification': '112233445566' 
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
      }
    })  
  },
  //获取地市
  getArea: function (parentId, level) {
    wx.request({
      url: 'http://192.168.131.102:8080/api/v1/dict/getArea',
      data: {
        'token': '',
        'parentId': parentId,
        'level': level
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
        console.log(res.data.data)
        if (res.data.code == "200") {
          let list = res.data.data;
          let first = { "areaId": 'all', "areaName": '全部', "areaLevel": level, "parentId": parentId }
          list.unshift(first)
          let DList = this.data.areaList;
          if (level == 1) {
            DList[0] = list;
            this.setData({
              areaList: DList
            })
          } else if (level == 2) {
            DList[2] = [];
            DList[2].push(first);
            this.setData({
              arealist: DList
            })
            DList[1] = list;
            this.setData({
              areaList: DList
            })
            // if (this.data.sure) {
            //   this.getArea(this.data.areaList[1][this.data.value].areaId, this.data.areaList[1][this.data.value].areaLevel + 1)
            // }
          }
          else if (level == 3) {
            DList[2] = [];
            DList[2] = list;
            this.setData({
              areaList: DList
            })
          }
        }
      }
    })
  },
  //选择区域
  bindAreaColumnChange: function (e) {
    if (e.detail.column == 1) {
      this.setData({
        value: e.detail.value
      })
    }
    var data = {
      areaList: this.data.areaList,
      areaIndex: this.data.areaIndex
    };
    data.areaIndex[e.detail.column] = e.detail.value;
    console.log(this.data.areaIndex); 
    for (let i = 0; i < this.data.areaList[e.detail.column].length; i++) {
      if (e.detail.value == i) {
        let list = this.data.areaList;
        let parentId =list[e.detail.column][i].areaId;
        let level = list[e.detail.column][i].areaLevel + 1;
        this.getArea(parentId, level);
        this.setData({
          sure: true
        })
      }
    }
  },
  bindAreaChange: function () { }, 
  //获取医院
  getHospital:function(){
    wx.request({
      url: 'http://192.168.131.102:8080/api/v1/dict/getHospital',
      data: {
        'token': '',
        'areaId': '440000'
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
      }
    })
  },
  //获取科室
  getDept:function(){
    wx.request({
      url: 'http://192.168.131.102:8080/api/v1/dict/getDept',
      data: {
        'token': ''
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      areaList:[[],[],[]]
    })
    this.getDept();
    this.getArea('0',1); 
    this.getHospital();
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