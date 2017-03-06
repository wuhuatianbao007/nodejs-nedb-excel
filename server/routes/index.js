var express = require('express'),path = require("path");
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var xlsx = require('node-xlsx');
//var xlsx = require('xlsx');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 上传*/
router.post('/file/uploading', function(req, res, next){
  console.log("fuck");
  //生成multiparty对象，并配置上传目标路径
  var uploadDir = path.resolve(__dirname, '../', 'public', 'uploadfile');
  var form = new multiparty.Form({uploadDir: uploadDir});
  
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    
    var filesTmp = JSON.stringify(files,null,2);

    if(err){
      console.log('parse error: ' + err);
    } else { 
      //console.log('parse files: ' + filesTmp);
     
      var inputFile = files.file[0];
      var uploadedPath = inputFile.path;
      var dstPath = uploadDir + "/"+inputFile.originalFilename;
      //重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          console.log('rename ok');

          //读取文件内容
          var obj = xlsx.parse(dstPath);
         // console.log(obj[0].data);
          var sheet = obj[0];
         // console.log(sheet);
          var datas = sheet.data;
              datas.splice(0,1)//去除头部： 序号	公众号	ID	分类	粉丝数/w	头条/元	二条/元	三条/元	四条/元	备注
                              //	是否开通评论功能	阅读量	是否认证	媒体手机	媒体QQ	折扣	下次更新时间	商务对接

        
            console.log(datas);
          
        }
   
      });
    }
    
    
    res.json(filesTmp);
    //res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
   // res.write('received upload:\n\n');
    //res.end(util.inspect({fields: fields, files: filesTmp}));
   // res.end(util.inspect({status:"200"}));
  // res.end("===");
  });
});

module.exports = router;
