// pages/expertList/expert.js

// var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// var qqmapsdk;
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
    areaIndex: [0, 0, 0], 
    value: 0,  
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
        // console.log(res.data)
        if (res.data.code == "200") {
          that.setData({
            departList: res.data.data
          })
          let depart = [[], []]
          for (let i = 0; i < res.data.data.length; i++) {
            depart[0].push(res.data.data[i])
          }
          depart[1] = res.data.data[0].children;
          // console.log(depart);
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
          this.getExpert(440000, this.data.deptId)
          // console.log(list[i]);
          // console.log(list[i].deptId); 
        } else {
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
        let parentId = list[e.detail.column][i].areaId;
        let level = list[e.detail.column][i].areaLevel + 1;
        if(level<4){ 
          this.getArea(parentId, level);
          this.setData({
            sure: true
          })
        }
      }
      this.setData({
        areaIndex: data.areaIndex
      })
    }
    // if (this.data.areaIndex[2]>0){ 
    //   console.log(this.data.areaList[2][this.data.areaIndex[2]].areaName);
    // }
    console.log(this.data.areaList)
  },
  bindAreaChange: function () { },
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