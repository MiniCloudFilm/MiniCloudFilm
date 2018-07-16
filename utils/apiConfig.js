const server = require('serverConfig.js')
const basePath = server.url;  
module.exports={
  // 会话页面
  ConInterface:{
    // 获取报告
    getReport: basePath + '/api/v1/report/findReportById',
    // 开启websocket
    webSocket: 'ws://192.168.131.212:8080/openSocket/',
    // 结束会话
    endDialog: basePath +'/consult/api/v1/end',
    // 获取会话记录
    getDialogRecord: basePath + '/wxapi/chatRecord/'
  },
  
  assistList: {//协助专家
    // 获取报告
    getReport: basePath + '/api/v1/report/findReportById',
  },
  // 患者报告列表
  chRepCon:{
    getReportList: basePath + '/api/v1/report/findReportList'
  },
  // 会诊记录（医生）
  conAssistance:{
    // 所有咨询
    myALLConsult: basePath +'/consult/api/v1/myConsultRecord',
    //我发起的协助
    sendAssist: basePath +'/consult/api/v1/sponsorAssistRecord',
    //我协助的
    receiveAssist: basePath +'/consult/api/v1/myAssistConsultRecord'
  },
  counList:{//咨询列表
    accept: basePath +'/consult/api/v1/receive',
    refuse: basePath+'/consult/api/v1/refuse',
    getCounListOfPatient: basePath +'/dialog/api/v1/dialogList',
    getCounList: basePath +'/consult/api/v1/myConsultList',
    receiveAssist: basePath +'/consult/api/v1/myAssistConsultList',
    pendingAction: basePath +'/consult/api/v1/pandingConsultList',
  },
  doctorCert:{
    //上传头像
    upAvatar:basePath +'/doctor/api/v1/uploadAvatar',
    // 上传证书
    upCertificaterMethod: basePath + '/doctor/api/v1/uploadCertificate',
    // 认证提交
    formSubmit: basePath + '/doctor/api/v1/doctorCertified',
    //获取科室
    getDepartment: basePath +'/api/v1/dict/getDept',
    getArea: basePath + '/api/v1/dict/getArea',
    getHospital: basePath +'/api/v1/dict/getHospital'
  },
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
  film:{
    getChargeVideo: basePath +'/common/api/v1/chargeVideo',
    getFreeVideo: basePath +'/common/api/v1/freeVideo',
    getQueryVideoLog: basePath +'/common/api/v1/queryVideoLog',
    getSaveVideoLog: basePath +'/common/api/v1/saveVideoLog',
    checkIsBuy: basePath +'/video/api/v1/checkIsBuy'
  },
  filmshow:{
    filmUrl:'https://reader.lanwon.com/clinicWebPacsViewMobile/mobile.html#'
  },
  index:{
    postFormId: basePath +'/wxapi/wechatForm' 
  },
  myAccount:{
    postFormId: basePath +'/doctor/api/v1/myBalance'
  },
  report:{
    //报告列表
    reportList: basePath +'/api/v1/report/findReportList',
    reportPicture: basePath +'/api/v1/report/getReportPicture'
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
    getCash: basePath +'/doctor/api/v1/getCash',
    //退款
    refund: basePath + '/api/v1/pay/refund'
  },
  websocket:{
    //推送消息给医生
    sendmsg: basePath +'/wxapi/sendmsg'
  },
  pickupCach:{
    // 提交转账信息
    submitInfos: basePath + '/doctor/api/v1/getCash',
    saveCard: basePath + '/doctor/api/v1/saveBankCard',
    searchCard: basePath +'/doctor/api/v1/queryBankCard'
  },
  reportshow:{
    getReportPicture: basePath +'/api/v1/report/getReportPicture',
  },
  transactionList:{
    myPayList: basePath + '/doctor/api/v1/myPayList',
  } 
} 