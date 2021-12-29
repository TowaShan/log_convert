var fileList = new Array();

var dragover = function(e) {
  // ブラウザ機能キャンセル
  e.preventDefault();
};


// ドロップ処理
var drop = function(e) {
  //セレクト&ファイルリストリセット
  $('#fileList > option').remove();
  fileList = new Array();

  // ブラウザ機能キャンセル
  e.preventDefault();
  // ファイル取出
  var files = e.dataTransfer.files;

  for (var i = 0; i < files.length; i++) {
    addSelect(files[i]);
  }
};

// セレクトボックス追加処理
function addSelect(file) {
  //FileReaderの作成
  var reader = new FileReader();
  //テキスト形式で読み込む
  reader.readAsText(file);
  //読込終了後の処理
  reader.onload = function(ev) {

    // HTML変換処理
    var text = convert(reader.result);

    //セレクトボックス追加
    $("#fileList").append($('<option>', {
      value: file.name,
      text: file.name
    }));

    fileList.push({
      name: file.name,
      bef: reader.result,
      aft: text
    });

    $("#pre1").html(fileList[fileList.length - 1].bef);
    $("#pre2").html(fileList[fileList.length - 1].aft);
  }
}
// ココフォリア→どどんとふ形式へ
function convert(htmlText) {

  var text = htmlText.replace(/\r\n|\r/g, "\n");
  var lines = text.split('\n');
  var outArray = new Array();

  var addLine = '';

  for (var i = 0; i < lines.length; i++) {
    // 前半部分の空白無視
    lines[i] = lines[i].trim();
  }

  for (i = 0; i < lines.length; i++) {
    // 空行は無視
    if (lines[i] == '') {
      continue;
    }
    // <p>タグから色取得
    if (lines[i].startsWith('<p style=')) {
      var color = lines[i].substring(17, 23);
      addLine = '<font color="#' + color + '">';
    }

    // <span>タグは名前orメッセージ
    if (lines[i].startsWith('<span>')) {
      if (lines[i] == "<span>") {
        i++;
        for (;;) {
          if (lines[i] == "</span>") {
            break;
          } else {
            addLine = addLine + lines[i];
            i++;
          }
        }
      } else {
        // <span>~</span>の場合は名前orタブ名
        if (lines[i].endsWith('</span>')) {
          if ($("#tab").prop("checked")) {
            var test = lines[i].slice(6);
            test = test.slice(0, -7);
            addLine = addLine + test;
          }
        } else {
          var test = lines[i].slice(6);
          test = test.slice(0, -9);
          addLine = addLine + '<b>' + test + '</b>:';
        }
      }
    }

    if (lines[i].startsWith('</p>')) {
      addLine = addLine + '</font><br>'
      outArray.push(addLine);
    }
  }
  return outArray;
}

$(document).ready(function() {

  $("#fileList").change(function() {
    // if ($(this).val() != $('#fileList option:selected').val()) {
      var fileName = $(this).val();
      var selectFile = fileList.find(element => element.name == fileName);

      $("#pre1").html(selectFile.bef);
      $("#pre2").html(selectFile.aft);
    // }
  });

});
