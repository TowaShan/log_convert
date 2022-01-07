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
      aft: text,
      tab: text[0]
    });
    // 戦闘削除してプレビューに表示
    text.shift();

    $("#pre1").html(fileList[fileList.length - 1].bef);
    $("#pre2").html(fileList[fileList.length - 1].aft);
  }
}
// ココフォリア→どどんとふ形式へ
function convert(htmlText) {
  var tabname = true;
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
      if ($("#defcolor").prop("checked") && color == '888888') {
        color = "000000";
      }
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

        // タブ名
        if (lines[i].endsWith('</span>')) {
          if ($("#tab").prop("checked")) {
            var test = lines[i].slice(6);
            test = test.slice(0, -7);
            addLine = addLine + test;
          }
          if (tabname) {
            var test = lines[i].slice(6);
            test = test.slice(0, -7);
            outArray.unshift(test);
            tabname = false;
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

  //行間の変化を検知
  $("#spacepx").on('input', function() {
    $("#spacepoint").html($(this).val());
  });
  // フォントサイズの変更を検知
  $("#fontpx").on('input', function() {
    $("#fontpoint").html($(this).val());
    $("font").css("font-size", $(this).val() + "px")
  });

  // フォントサイズの変更を検知
  $("#margin").on('input', function() {
    var margin = Number($(this).val()) * 10;
    $("#marginpoint").html(margin + "%");
    $("font").css("line-height", margin + "%")
  });

  $("#fileList").change(function() {
    var fileName = $(this).val();
    var selectFile = fileList.find(element => element.name == fileName);

    $("#pre1").html(selectFile.bef);
    $("#pre2").html(selectFile.aft);
  });


  $("#downLoad").click(function() {
    var margin = Number($("#margin").val()) * 10;
    for (var i = 0; i < fileList.length; i++) {

      var content =
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>\n" +
        "<html xmlns='http://www.w3.org/1999/xhtml' lang='ja'>\n" +
        "<head>\n" +
        "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />\n" +
        "<title>チャットログ" + fileList[i].tab + "</title>\n";

      content = content + "<style type='text/css'>\n" + "<!--\n" +
        "font {\n" +
        "font-size:" + $("#fontpx").val() + "px;\n" +
        "line-height:" + margin + "%;\n" +
        "}\n" +
        "-->\n" +
        "</style>\n";
      content = content + "</head>\n";

      for (var j = 1; j < fileList[i].aft.length; j++) {
        content = content + fileList[i].aft[j] + "\n";
      }
      content = content + "</body>";
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([content]));
      link.download = fileList[i].name;
      link.click();
    }
  });

});
