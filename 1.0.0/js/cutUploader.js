(function () {

    'use strict';

    if("undefined" == typeof $) {
        DDUtil.message("jQuery is not defined!");
        throw new Error("jQuery is not defined!");
    }

    var defaultOption = {
        form_id: "fileForm",
        value_name: 'img',
        file_types: ["image/jpg", "image/jpeg", "image/png"],
        file_size: 1024 * 1024 * 10,
        maxLength: 2,
        autoCropArea: 1,
        aspectRatio: ["16:9", "4:3"]
    };

    $.fn.ddCutUploader = function (option) {
        option.$uplorderDom = $(this);
        var options = $.extend({}, defaultOption, option);
        var fileField = createThis(option);
        fileField.$input_file.change(function () {createCutView(options, fileField, this)});
        option.$uplorderDom.find(".btn-dd-uploader").click(function () {fileField.$input_file.click()});
        handelAttrAndOption(option);
    };

    function handelAttrAndOption(option) {
        var valueName = option.$uplorderDom.attr("dd-uploader-name");
        if(valueName) {
            option.value_name = valueName;
        }
        var previewNames = option.previewNames || option.$uplorderDom.attr("dd-uploader-preview");
        if(previewNames) {
            option.previewNames = previewNames;
            var previewNameArr = previewNames.split(",");
            for(var i = 0; i < previewNameArr.length; i ++) {
                handelOneImgPath(option, previewNameArr[i]);
            }
        }
        checkOption(option);
    }

    function checkOption(option) {
        if(!option.uploadUrl) {
            DDUtil.message("uploadUrl not config");
            throw new Error("uploadUrl not config");
        }
    }

    function createThis(option) {
        createJsAndCss();
        var fileField = {};
        var $uploadHtml = $("<div class='btn-dd-uploader'></div>");
        fileField.$input_file = $("<input type='file' style='display: none'/>");
        option.$uplorderDom.append($uploadHtml).append(fileField.$input_file);
        return fileField;
    }

    function createJsAndCss() {
        DDUtil.addJsOrCss("./../css/uploader.css");
        DDUtil.addJsOrCss("https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js");
        DDUtil.addJsOrCss("https://cdn.bootcss.com/cropper/3.1.3/cropper.min.js");
        DDUtil.addJsOrCss("https://cdn.bootcss.com/cropper/3.1.3/cropper.min.css");
    }

    function createCutView(options, fileField, _this) {
        cutImgView(options);
        fileField.file_path = $(_this).val();
        fileField.file = $(_this)[0].files[0];
        createCropImg(options, fileField, _this);
        $("#modalCrop").modal();
    }

    function cutImgView(options) {
        var cropperHtml = '<div class="modal fade" id="modalCrop" aria-labelledby="modalLabel" role="dialog" tabindex="-1">' +
            '    <div class="modal-dialog" role="document">' +
            '      <div class="modal-content">' +
            '        <div class="modal-header">' +
            '          <h5 class="modal-title" id="modalLabel">Crop the image</h5>' +
            '          <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '            <span aria-hidden="true">&times;</span>' +
            '          </button>' +
            '        </div>' +
            '        <div class="modal-body">' +
            '          <div>' +
            '            <img id="imageCrop" style="max-width: 100%;" alt="Picture">' +
            '          </div>' +
            '        </div>' +
            '        <div class="modal-footer">' +
            '          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
            '          <span class="dd-cropper-radio">';
        for (var index in options.aspectRatio) {
            cropperHtml += '<button type="button" class="btn ' + (index == 0? 'btn-github': 'btn-success') + ' cropper-radio" data-radioIndex="' + index + '">' + (options.aspectRatio[index]) + '</button>';
        }
        cropperHtml += '              </span><span  class="dd-cropper-download"><button id="dd-cropper-download" type="button" class="btn btn-danger">确定</button></span>' +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        $("body").append(cropperHtml);
    }

    function createCropImg(options, fileField){
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 设置 canvas 的宽度和高度
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.width);
                var base64 = canvas.toDataURL('image/png');
                createCropperPlugin(options, fileField, base64);
            };

            img.src = e.target.result;
        };
        reader.readAsDataURL(fileField.file);
    }

    function createCropperPlugin(option, fileField, base64) {
        fileField.$image = $('#imageCrop');
        fileField.$image.prop("src", base64);
        fileField.cropperOption = {
            autoCropArea: option.autoCropArea
        };
        if(option.aspectRatio[0]) {
            fileField.cropperOption.aspectRatio = eval(option.aspectRatio[0].replace(":", "/"));
        }
        $('#modalCrop').on('shown.bs.modal', function () {
            fileField.$image.cropper(fileField.cropperOption);
        }).on('hidden.bs.modal', function () {
            fileField.cropBoxData = fileField.$image.cropper('getCropBoxData');
            fileField.canvasData = fileField.$image.cropper('getCanvasData');
            fileField.$image.cropper('destroy');
            $(this).remove();
            fileField.$input_file.val("");
        }).on("click", ".cropper-radio", function () {
            if($(this).hasClass("btn-github")) {
                return;
            }
            var radioIndex = $(this).attr("data-radioIndex");
            var aspectRatio = eval(option.aspectRatio[radioIndex].replace(":", "/"));
            if(!aspectRatio) {
                DDUtil.message("invalid param aspectRatio indexOf '" + radioIndex + "' !");
                throw new Error("invalid param aspectRatio indexOf '" + radioIndex + "' !");
            }
            fileField.cropperOption.aspectRatio = aspectRatio;
            fileField.$image.cropper('destroy').cropper(fileField.cropperOption);
            $(this).addClass("btn-github").removeClass("btn-success");
            $(this).siblings(".cropper-radio").removeClass("btn-github").addClass("btn-success");
        }).on("click", "#dd-cropper-download", function () {
            fileField.cropperResult = fileField.$image.cropper("getCroppedCanvas", {fillColor: "#fff", maxHeight: 4096, maxWidth: 4096});
            createCropperConfirm(option, fileField);
            $('#cropperConfirmModal').modal();
        });
    }

    function createCropperConfirm(option, fileField) {
        var cropperConfirmHtml = '<div class="modal fade docs-cropped" id="cropperConfirmModal" aria-hidden="true" aria-labelledby="getCroppedCanvasTitle" role="dialog" tabindex="-1">' +
            '  <div class="modal-dialog">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <h5 class="modal-title" id="getCroppedCanvasTitle">Cropped</h5>' +
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '          <span aria-hidden="true">&times;</span>' +
            '        </button>' +
            '      </div>' +
            '      <div class="modal-body" style="text-align: center; position: relative; flex: 1 1 auto; padding: 15px;"></div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
            '        <a class="btn btn-primary" id="dd-uploader-confirm" href="javascript:void(0);">上传</a>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        $("body").append(cropperConfirmHtml);
        $('#cropperConfirmModal').on('shown.bs.modal', function () {
            $(this).find(".modal-body").html(fileField.cropperResult);
            $("#dd-uploader-confirm").attr('data-imgBase64', fileField.cropperResult.toDataURL("image/jpeg"));
        }).on('hidden.bs.modal', function () {
            $(this).remove();
        }).on("click", "#dd-uploader-confirm", function () {
            var imgBase64 = $(this).attr("data-imgBase64");
            requestUpload(option, imgBase64);
        });
    }

    function requestUpload(option, imgBase64) {
        var $Blob= getBlobByDataURI(imgBase64,'image/jpeg');
        var formData = new FormData();
        formData.append("action", "uploads");
        formData.append("imgBase64", $Blob ,"file_"+Date.parse(new Date())+".jpeg");
        var request = new XMLHttpRequest();
        request.open("POST", option.uploadUrl);
        $("button[data-dismiss=modal]").click();
        var loadingIndex = DDUtil.openLoading();
        request.onreadystatechange = function(event) {
            if (request.readyState==4) {
                if(request.status==200){
                    var imgPath = eval("(" + event.currentTarget.response + ")");
                    handelOneImgPath(option, imgPath.url);
                }else{
                    DDUtil.message("upload Error, uploadUrl is not true");
                    throw new Error("upload Error, uploadUrl is not true");
                }
                DDUtil.close(loadingIndex);
            }
        };
        request.send(formData);
    }

    function getBlobByDataURI(dataURI,type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type:type });
    }

    function handelOneImgPath(option, imgPath) {
        var $item = $('<div class="dd-uploader-item" id="dd-uploader-item_' + new Date().getTime() + '">' +
            '  <div class="dd-uploader-div-img">' +
            '    <img src="' + imgPath + '">' +
            '  </div>' +
            '  <div class="dd-uploader-div-panel" style="height: 0px;">' +
            '    <span class="cancel">删除</span>' +
            '    <span class="next">后移</span>' +
            '    <span class="prev">前移</span>' +
            '    <input type="hidden" name="' + option.value_name + '" value="' + imgPath + '">' +
            '  </div>' +
            '</div>');
        option.$uplorderDom.append($item);
        $item.on( 'mouseenter', function() {
            $(this).find(".dd-uploader-div-panel").first().stop().animate({height: 30});
        }).on( 'mouseleave', function() {
            $(this).find(".dd-uploader-div-panel").first().stop().animate({height: 0});
        }).on("click", ".cancel", function () {
            $item.remove();
            if (option.$uplorderDom.children(".dd-uploader-item").size() < option.maxLength) {
                option.$uplorderDom.find(".btn-dd-uploader").first().show();
            }
        }).on("click", ".next", function () {
            if ($item.next(".dd-uploader-item").attr("id") != null ) {
                $item.insertAfter($item.next(".dd-uploader-item"));
            }
        }).on("click", ".prev", function () {
            if ($item.next(".dd-uploader-item").attr("id") != null ) {
                $item.insertBefore($item.prev(".dd-uploader-item"));
            }
        });

        if (option.$uplorderDom.children(".dd-uploader-item").length >= option.maxLength) {
            option.$uplorderDom.find(".btn-dd-uploader").first().hide();
        }
    }

})();