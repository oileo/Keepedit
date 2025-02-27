const _code = localStorage.getItem("actual-project");
const _projects = JSON.parse(localStorage.getItem("projects"));
const EDITOR = document.getElementById("code-editor");
const PREVIEW = document.getElementById("preview");
var actualFile = "index.html";

const types = Object.freeze({
    "index.html" : "htmlmixed",
    "style.css" : "css",
    "script.js" : "javascript"
});

document.addEventListener("DOMContentLoaded", function () {
    const code = _projects[_code];
    let runCode = code.files["index.html"];
    runCode = `<style>${code.files["style.css"]}</style>` + runCode;
    runCode = runCode + `<script>${code.files["script.js"]}</script>`;
    const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        mode: "htmlmixed",
        theme: "dracula",
        lineNumbers: true
    });

    editor.on("change", () => {
        code.files[actualFile] = editor.getValue();
        runCode = code.files["index.html"];
        runCode = `<style>${code.files["style.css"]}</style>` + runCode;
        runCode = runCode + `<script>${code.files["script.js"]}</script>`;
        console.clear();
        PREVIEW.srcdoc = runCode;
    });

    editor.setValue(code.files[actualFile]);
    document.title = `Editor - ${code.title}`;

    PREVIEW.srcdoc = runCode;

    document.getElementById("save").addEventListener("click", (e)=> {
        _projects[_code] = code;
        localStorage.setItem("projects", JSON.stringify(_projects));
        alert("Saved!!!");
    });

    document.getElementById("refresh").addEventListener("click", (e)=> {
        code.files[actualFile] = editor.getValue();
    });

    document.getElementById("files").addEventListener("change", (e)=> {
        actualFile = files.value;
        editor.setOption("mode", types[actualFile]);
        editor.setValue(code.files[actualFile] || "");
    });
});
