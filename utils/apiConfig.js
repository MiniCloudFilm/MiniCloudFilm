const server = require('serverConfig.js')
const basePath = server.url; 
module.exports={
  login:{
    //用户注册
    logon: basePath +'/api/v1/user/logon',
    //发送检验码
    sendCode: basePath +'/api/v1/user/sendCode',
    //检验验证码
    checkCode: basePath +'/api/v1/user/checkCode',
    //用户登录
    login: basePath +'/api/v1/user/login',

  },
  expert:{
    //专家列表
    expertList: basePath +'/doctor/api/v1/findDoctorList',
    //获取医生头像
    image: basePath +'/doctor/api/v1/lookImage/'
  },
  report:{
    //报告列表
    reportList: basePath +'/api/v1/report/findReportList'
  },
  pay:{
    //预支付
    prepay: basePath +'/api/v1/pay/prePay',
    //确认订单
    saveOrder: basePath +'/api/v1/pay/saveOrder',
    //交易列表
    payList: basePath +'/doctor/api/v1/myPayList',
    //交易详情
    PayInfo: basePath +'/common/api/v1/queryPayInfo',
    //提现
    getCash: basePath +'/doctor/api/v1/getCash'
  },
  websocket:{
    //推送消息给医生
    sendmsg: basePath +'/wxapi/sendmsg'
  },
  video:{
    //收费视频
    charge: basePath +'/common/api/v1/chargeVide',
    //免费
    free: basePath +'/common/api/v1/freeVideo',
    //记录保存
    save: basePath +'/common/api/v1/saveVideoLog',
    //获取观看记录
    query: basePath +'/common/api/v1/queryVideoLog',
    //购买的视频
    myVideo: basePath +'/doctor/api/v1/myVideoDoctor',
    //上传
    upload: basePath +'/doctor/api/v1/uploadVideo',
    //上架与下架 
    upDown: basePath +'/doctor/api/v1/upVideo',
    //删除
    deleteVideo: basePath +'/doctor/api/v1/deleteVideo',
    //视频列表
    uploadList: basePath +'/doctor/api/v1/myUploadVideo',
    //是否已购买
    checkIsBuy: basePath +'/doctor/api/v1/checkIsBuy',
  },
  consult:{
    //发起会诊
    start: basePath +'/consult/api/v1/start',
    //接收
    receive: basePath +'/consult/api/v1/receive',
    //拒绝  
    refuse: basePath +'/consult/api/v1/refuse',
    //结束
    end: basePath +'/consult/api/v1/end'
  },
  dialog:{
    //咨询列表
    dialogList: basePath +'/dialog/api/v1/dialogList', 
  },
  picker:{
    //获取地址
    area: basePath +'/api/v1/dict/getArea',
    //获取医院
    hospital: basePath +'/api/v1/dict /getHospital',
    //获取科室
    dept: basePath +'/api/v1/dict/getDept'
  },
  cert:{
    //头像上传
    avatar: basePath +'/doctor/api/v1/uploadAvatar',
    doctorInfo: basePath +'/doctor/api/v1/doctorCertified'
  }  
} 
