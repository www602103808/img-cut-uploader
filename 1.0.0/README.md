# 图片剪切上传文档
## 1.简介
此插件完成了图片剪切后上传服务器功能

## 2.Js、Css引入
* <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css"></link>
* <script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
* <script type="text/javascript" src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
* <script type="text/javascript" src="./js/cutUploader.js"></script>
* <script type="text/javascript" src="./js/ddUtil.js"></script>

## 3.页面元素及说明
  ### html代码如下：
  `<div id="img" class="dd-uploader" dd-uploader-name="img" dd-uploader-preview="http://ubuddy-1253953128.costj.myqcloud.com/57BC935FFFD740F69DAE38B5B2B446CD.jpeg,http://ubuddy-1253953128.costj.myqcloud.com/BE053BC26EC84226900BE9BA13BCF1B1.jpeg"></div>`
  ### 说明：
 * id：属性自己定义
 * class：属性必须包含dd-uploader
 * dd-uploader-name： 上传完成后，路径存储input的name值
 * dd-uploader-preview： 图片回显路径，使用逗号分割
  
## 4.初始化及参数说明
  ### 初始化Js如下：
    `$("#img").ddCutUploader({uploadUrl: "" // 必须});`
### 参数说明:
* uploadUrl: 图片上传路径，(必须)
* value_name：同dd-uploader-name属性,同时存在时,以dd-uploader-name为准
* maxLength：允许上传的图片数量，默认没有限制
* autoCropArea：图片剪切默认剪切大小，为0-1小数，默认为1
* aspectRatio：剪切比例，默认
