initEditor();

function initEditor() {
    var myTextArea = document.getElementById('myTextArea')

    var myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
        value: "function myScript(){return 100;}",
        mode: "markdown",
        indentUnit: 4,               // 缩进4个空格
        lineNumbers: true,           // 开始行数
        scrollbarStyle: "overlay",    // 设置滚动条样式
        undoDepth: 200,               // 最大撤销次数，默认为200
        dragDrop: false,              // 控制是否开启拖放功能,默认为 true
        allowDropFileTypes: [],       // 允许拖放到编辑器中的文件类型的数组，默认为 null，字符串应该是 MIME类型，并且将根据浏览器报告的File对象的类型进行检查。
        viewportMargin: Infinity,   // 指定在当前滚动到视图中的文档部分上方和下方呈现的行数, 您通常应将其保留为默认值10.可以将其设置为“无限”，以确保始终呈现整个文档，从而浏览器的文本搜索工作 
        lineWrapping: true,         // 自动折行
    })

    myCodeMirror.setValue(localStorage.localData || '');  // 先尝试从在本地存储获取数据

    var preview = $("#preview");
    parseMarkdown(myCodeMirror)

    fixScrollBar(myCodeMirror, preview)

    myCodeMirror.on('change', function() {
        parseMarkdown(myCodeMirror)
    })

    window.editor = myCodeMirror
}

// function parseMarkdown(editor) {
//     var preview = $("#preview");

//     var data = editor.getValue("\n");

//     

//     localStorage.localData = data;   // 将数据缓存在本地

//     data = marked(data, {
//           gfm: true,
//           tables: true,
//           breaks: true,
//           pedantic: false,
//           sanitize: false,
//           smartLists: true,
//           smartypants: false
//     });
//     preview.html(data);

//     $('pre > code', preview).each(function() {
//         hljs.highlightBlock(this);
//     })
// }


function parseMarkdown(editor) {
    var preview = $("#preview");
    var converter = new showdown.Converter({extensions: ["prettify"], tables: true, tasklists: true, openLinksInNewWindow: true, tablesHeaderId: true});
    var data = editor.getValue("\n");

    localStorage.localData = data;   
    data = converter.makeHtml(data)
    preview.html(data);

    PR.prettyPrint()
}

function fixScrollBar(editor, preview) {
    editor.on('scrollCursorIntoView', function() {
        var top = editor.getScrollInfo().top;
        preview.scrollTop(top);
    })

    preview.on('scroll', function() {
        var top = preview.scrollTop();
        editor.scrollTo(undefined, top);
    })
}