// pages/doctorCert/doctorCert.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hospital: [{
      "hospitalId": "0",
      "hospitalLevel": "3",
      "hospitalName": "请选择医院"
    }],
    hospitalIndex: 0,
    customItem: "请选择",
    departmentIndex: [0, 0],
    depart: [
      [],
      []
    ],
    doctorLevel: ["主任医师", "副主任医师", "主治医师", "医师"],
    titleIndex: 0,
    image: [],
    areaIndex: [0, 0, 0],
    head: [],
    countHeadImg: 0
  },
  bindHospitalChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      hospitalIndex: e.detail.value
    })
  },
  bindDepartmentChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      departmentIndex: e.detail.value
    })
  },
  bindTitleChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      titleIndex: e.detail.value
    })
  },
  //选证书
  chooseImage: function(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        this.setData({
          image: this.data.image.concat(res.tempFilePaths)
        });
        console.log(this.data.image);
      }
    })
  },
  //选头像
  chooseHead: function(e) {
    if (this.data.head.length < 1) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res);
          this.setData({
            head: this.data.head.concat(res.tempFilePaths)
          });
          console.log(this.data.head);
        }
      })
    } else {
      wx.showToast({
        title: '只能上传一张头像!',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //上传头像
  upAvatar: function() {
    let user = this.data.user;
    console.log('头像');
    console.log(this.data.head);
    wx.uploadFile({
      url: app.globalData.api.cert.avatar, //仅为示例，非真实的接口地址
      filePath: this.data.head[0],
      name: 'avatarFile',
      formData: {
        'token': this.data.token
      },
      success: res => {
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    })
  },
  //上传证书方法
  upCertificaterMethod: function(num) {
    // console.log(this.data.image);
    // console.log('方法');
    let user = this.data.user;
    wx.uploadFile({
      url: app.globalData.api.cert.avatar, //仅为示例，非真实的接口地址
      filePath: this.data.image[num],
      name: 'certificateFile',
      formData: {
        'token': this.data.token
      },
      success: res => {
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    })
  },
  //上传多张证书
  upCertificater: function() {
    for (let i = 0; i < this.data.image.length; i++) {
      this.upCertificaterMethod(i);
    }
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  formSubmit: function(e) {
    console.log(e.detail.value);
    let user = this.data.user; 
    let data=e.detail.value 
    console.log(this.data.deptId);
    if (data.hospitalId==0){
      wx.showToast({
        title: '请选择医院！',
        icon: 'none',
        duration: 2000
      })
    } else if (data.charge =="") {
      wx.showToast({
        title: '请填写价格！',
        icon: 'none',
        duration: 2000
      })
    } else if (data.age =="") {
      wx.showToast({
        title: '请填写年龄！',
        icon: 'none',
        duration: 2000
      })
    } 
    // else if (data.doctorLevel == 0) {
    //   wx.showToast({
    //     title: '请选择职称！',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
     else if (data.doctorNum == "") {
      wx.showToast({
        title: '请填写医师资格证！',
        icon: 'none',
        duration: 2000
      })
    } else if (data.introduction == "") {
      wx.showToast({
        title: '请填写简介！',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.deptId == undefined) {
      wx.showToast({
        title: '请选择科室！',
        icon: 'none',
        duration: 2000
      })
    }else{
      this.upAvatar();
      this.upCertificater();
      let dataList = {
        'token': this.data.token,
        'deptId': this.data.deptId,
        'age': data.age,
        'charge': data.charge,
        'hospitalId': this.data.hospital[data.hospitalId].hospitalId,
        'doctorLevel': data.doctorLevel+1,
        'synopsis': data.introduction,
        'qualification': data.doctorNum
      }
      console.log(data);
      wx.request({
        url: app.globalData.api.cert.doctorInfo,
        data: dataList,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: res => {
          console.log(res);
          if (res.data.code == "200") {
            wx.showModal({
              title: '提示',
              content: '认证信息提交成功！', 
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })  
                }  
              }
            })
          } 
        }
      })
    } 
  },
  //获取科室
  getDepartment: function() {
    let that = this; 
    wx.request({
      url: app.globalData.api.picker.dept, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log(res.data)
        let arr = res.data.data;
        let arr0 = {
          "deptName": "请选择科室",
          "children": [],
          "deptId": 'all',
          "parentId": 0
        }
        arr.unshift(arr0);
        // console.log(arr);
        if (res.data.code == "200") {
          that.setData({
            departList: arr
          })
          let depart = [
            [],
            []
          ]
          for (let i = 0; i < arr.length; i++) {
            depart[0].push(arr[i])
          }
          depart[1] = arr[0].children;
          // console.log(depart);
          that.setData({
            department: depart
          })
        }
      }
    })
  },
  //获取科室列
  bindMultiPickerColumnChange: function(e) {
    // console.log(e.detail.column, e.detail.value);
    var data = {
      department: this.data.department,
      departmentIndex: this.data.departmentIndex
    };
    data.departmentIndex[e.detail.column] = e.detail.value;
    // console.log(data.departmentIndex);
    if (e.detail.column == 0) {
      for (let i = 0; i < this.data.departList.length; i++) {
        if (e.detail.value == i) {
          let list = this.data.department;
          list[1] = this.data.departList[i].children;
          this.setData({
            department: list
          })
        }
      }
    }
    this.setData({
      departmentIndex: data.departmentIndex
    })
  },
  //选定科室
  bindDepartmentChange: function(e) {
    // console.log(e);
    let index = e.detail.value;
    let parent = index[0];
    let value = index[1];
    let list = this.data.departList;
    for (let i = 0; i < list.length; i++) {
      if (parent == i) {
        if (value == 0) {
          this.setData({
            deptId: list[i].deptId
          })
        } else {
          this.setData({
            deptId: list[i].children[value].deptId
          })
        }
      }
    }
  },
  //选择区域
  bindAreaColumnChange: function(e) {
    var data = {
      areaList: this.data.areaList,
      areaIndex: this.data.areaIndex
    };
    data.areaIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      data.areaIndex[1] = 0;
      data.areaIndex[2] = 0;
    }
    for (let i = 0; i < this.data.areaList[e.detail.column].length; i++) {
      if (e.detail.value == i) {
        let list = this.data.areaList;
        let parentId = list[e.detail.column][i].areaId;
        let level = list[e.detail.column][i].areaLevel + 1;
        if (level < 4) {
          this.getArea(parentId, level);
        }
      }
      this.setData({
        areaIndex: data.areaIndex
      })
    }
    // console.log(this.data.areaList)
  },
  //选定区域
  bindAreaChange: function(e) {
    // console.log(e.detail.value, this.data.areaList); 
    let indexArr = e.detail.value;
    let areaList = this.data.areaList;
    let areaId = "";
    if (indexArr[2] == 0) {
      if (indexArr[1] == 0) {
        if (indexArr[0] == 0) {
          areaId = areaList[0][0].areaId
          this.getHospital(areaId);
        } else {
          areaId = areaList[0][indexArr[0]].areaId
          this.getHospital(areaId);
        }
      } else {
        areaId = areaList[1][indexArr[1]].areaId
        this.getHospital(areaId);
      }
    } else {
      areaId = areaList[2][indexArr[2]].areaId
      this.getHospital(areaId);
    }
  },
  //获取地市
  getArea: function(parentId, level) {
    wx.request({
      url: app.globalData.api.picker.area,
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
        // console.log(res);
        // console.log(res.data.data)
        if (res.data.code == "200") {
          let list = res.data.data;
          let first = {
            "areaId": 'all',
            "areaName": '全部',
            "areaLevel": level,
            "parentId": parentId
          }
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
          } else if (level == 3) {
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
  //获取医院
  getHospital: function(areaId) {
    wx.request({
      url: app.globalData.api.picker.hospital,
      data: {
        'token': '',
        'areaId': areaId
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        // console.log(res.data.data);
        if (res.data.code == "200") {
          let arr = this.data.hospital;
          arr=arr.concat(res.data.data);
          // console.log(arr);
          this.setData({
            hospital: arr
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    this.setData({
      areaList: [
        [],
        [],
        []
      ],  
    })
    this.getDepartment();
    this.getArea('0', 1);
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
    this.setData({ 
      user: wx.getStorageSync('userList'),
      token: wx.getStorageSync('token')
    })
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