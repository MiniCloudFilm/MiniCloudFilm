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
    departmentIndex: [0, 0],
    depart: [[], []],
    index: 0,
    // doctorList: [
    //   { "doctorImg": "/image/icon-doctor.png", "doctorName": "兰建清", "department": "妇科", "position": "主任医师", "belong": "深圳第一医院", "level": "三甲医院", "skill": "妇科疾病诊断治疗", "price": "8.88" },
    //   { "doctorImg": "/image/icon-doctor.png", "doctorName": "罗腾可", "department": "放射科", "position": "主任医师", "belong": "北京大学深圳医院", "level": "三甲医院", "skill": "超声诊断", "price": "6.88" },
    //   { "doctorImg": "/image/icon-doctor.png", "doctorName": "田程林", "department": "男科", "position": "主任医师", "belong": "深圳第二医院", "level": "三甲医院", "skill": "男性疾病诊断", "price": "5.88" },
    // ] 
  },
  //获取地市
  getArea:function(){
    wx.request({
      url: 'http://192.168.131.3:8080/api/v1/dict/getArea',
      data: {
        'token': '',
        'parentId': '',
        'level': 1
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res.data.data)
        if (res.data.code == "200") {
          
        }
      }
    })
  },
  //选择区域
  bindRegionChange: function (e) {
    let that = this;
    this.setData({
      region: e.detail.value
    })
    console.log(e.detail.value);
    // this.getHospital();
  },
  turn: function (e) {
    console.log(this.data.doctorMes.order);
    console.log(this.data.doctorMes);
    if (this.data.doctorMes.order == 'before') {
      wx.navigateTo({
        url: `../chRepCon/chRepCon?doctorName=${e.currentTarget.dataset.doctor}&belong=${e.currentTarget.dataset.belong}&price=${e.currentTarget.dataset.price}&doctorId=${e.currentTarget.dataset.doctorid}&order=after`
      })
    } else {
      wx.navigateTo({
        url: `../confirmPay/confirmPay?doctorName=${e.currentTarget.dataset.doctor}&belong=${e.currentTarget.dataset.belong}&price=${e.currentTarget.dataset.price}&doctorId=${e.currentTarget.dataset.doctorid}&reportId=${this.data.doctorMes.reportId}&type=1`
      })

    }
  },
  //获取科室
  getDepartment: function () {
    let that = this;
    let apiUrl = `http://192.168.131.63:8080/api/v1/dict/getDept`;
    wx.request({
      url: apiUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        if (res.data.code == "200") {
          that.setData({
            departList: res.data.data
          })
          let depart = [[], []]
          for (let i = 0; i < res.data.data.length; i++) {
            depart[0].push(res.data.data[i])
          }
          depart[1] = res.data.data[0].children;
          console.log(depart);
          that.setData({
            department: depart
          })
        }
      }
    })
  },
  //获取科室列
  bindMultiPickerColumnChange: function (e) {
    // console.log(e.detail.column, e.detail.value);
    var data = {
      department: this.data.department,
      departmentIndex: this.data.departmentIndex
    }; 
    data.departmentIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      for (let i = 0; i < this.data.departList.length; i++) {
        if (e.detail.value == i) {
          let list = this.data.department;
          list[1] = this.data.departList[i].children;
          this.setData({
            department: list
          })
          // console.log(this.data.department);
          // console.log(this.data.department[1]);
          // console.log(this.data.departList[i]);
          // console.log(this.data.departList[i].children);
          // console.log(this.data.department);
        }
      }
    }

  },
  //获取专家列表
  getExpert: function (areaId, deptId) {
    wx.request({
      url: 'http://192.168.131.63:8080/doctor/api/v1/findDoctorList',
      data: {
        'token': '',
        'areaId': areaId,
        'deptId': deptId
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res.data.data)
        if (res.data.code == "200") {
          this.setData({
            expertList: res.data.data
          })
        }
      }
    })
  },
  //选定科室
  bindDepartmentChange: function (e) {
    console.log(e); 
    let index=e.detail.value;
    let parent=index[0];
    let value=index[1];
    let list = this.data.departList;
    for(let i=0;i<list.length;i++){
      if (parent==i){
        if (value == 0) {
          this.setData({
            deptId: list[i].deptId
          })
          this.getExpert(440000, this.data.deptId)
          // console.log(list[i]);
          // console.log(list[i].deptId); 
        }else{ 
          // console.log(list[i].children[value])
          // console.log(list[i].children[value].deptId);
          this.setData({
            deptId: list[i].children[value].deptId
          }) 
          this.getExpert(440000, this.data.deptId)
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.getArea();
    console.log(options); 
    this.getDepartment();
    this.getExpert(440000, 'all');
    var that = this;
    this.setData({
      doctorMes: options
    })

    // qqmapsdk = new QQMapWX({
    //   key: 'NOYBZ-WXICJ-XMGFO-FF2UV-ULBW7-UEBFX'//此处使用你自己申请的key  
    // });
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       },
    //       success: function (resA) {
    //         that.setData({
    //           region: [resA.result.address_component.province, resA.result.address_component.city, resA.result.address_component.district]
    //         })
    //         // that.getHospital();
    //         // console.log(resA);
    //       },
    //       fail: function (resA) {
    //         console.log(resA);
    //       },
    //       complete: function (resA) {
    //         // console.log(resA);
    //       }
    //     });
    //   }
    // })
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