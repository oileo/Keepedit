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
        lineNumbers: true,
        viewportMargin: Infinity
    });

    document.getElementById("token").addEventListener("click", (e)=> {
        if(document.getElementById("token").innerText === "[See token]"){
            document.getElementById("token").innerText = code.token;
            document.getElementById("token").style.cursor = "text";
        }
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

    document.getElementById("share").addEventListener("click", async (e)=> {
        let _token = prompt("Project token");
        if(!_token || _token.trim() === "") {
            alert("Put a valid token!!!");
            return;
        }

        let c = [];
        c.push(code.files);

        const response = await fetch("./p/" + code.title, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(c),
        });
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
