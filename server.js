const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
app.use(express.json());

app.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/workspace", (req, res)=> {
    res.sendFile(path.join(__dirname, "editor.html"));
});

app.get("/p/:website", (req, res)=> {
    let website = req.params.website;
    if(!fs.existsSync(path.join(__dirname, "p", website,"index.html"))) {
        res.send("<h1>Error 404</h1>");
        return 0;
    } else {
        let p = path.join(__dirname, "p", website);
        let htmlContent = fs.readFileSync(path.join(p, "index.html"), "utf8");
        let cssContent = "";
        let scriptContent = "";

        if(fs.existsSync(path.join(p,"style.css"))) cssContent = fs.readFileSync(path.join(p, "style.css"), "utf8");
        if(fs.existsSync(path.join(p,"script.js"))) scriptContent = fs.readFileSync(path.join(p, "script.js"), "utf8");

        htmlContent += `<style>${cssContent}</style><script>${scriptContent}</script>`;

        res.send(htmlContent);
    }
});

const _postFile = async (folder, filename, main)=> {
    if(main[0][filename] == undefined) return;
    if (main[0]) {
        await fs.writeFile(path.join(folder, filename), main[0][filename], (err)=>{
            if(err) console.log(err)
            else {
                console.log(filename + " - up");
            }
        });
    } else {
        await fs.writeFile(path.join(folder, filename), main.files[filename], (err)=>{
            if(err) console.log(err)
            else {
                console.log(filename + " - up");
            }
        });
    }
}

app.post("/p/:website", async (req, res)=> {
    let website_name = req.params.website;
    let website_body = req.body;
    console.log(req.body)
    //let files = website_body[0]["files"];
    let p = path.join(__dirname, "p", website_name);

    if(fs.existsSync(path.join(__dirname, "p", website_name, "token"))) {
        let token_ = await fs.readFile(path.join(p, "token"), "utf-8", (err, data)=>{
            if(err) {
                console.log(err);
                return;
            } else {
                if(data === website_body[0].token) {
                    _postFile(p ,"index.html", website_body);
                    _postFile(p ,"style.css", website_body);
                    _postFile(p ,"script.js", website_body);
                    _postFile(p ,"token", website_body);
                    
                    res.status(200).json({message: "Website online"});
                } else {
                    res.status(200).json({message: "Wrong token"});
                }
            }
        });
    } else {
        await fs.mkdir(p, (err)=>{
            if(err) console.log(err);
        });
        _postFile(p ,"index.html", website_body);
        _postFile(p ,"style.css", website_body);
        _postFile(p ,"script.js", website_body);
        _postFile(p ,"token", website_body);
    }
});

app.get("/css", (req, res)=> {
    res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/index", (req, res)=> {
    res.sendFile(path.join(__dirname, "index.js"));
});

app.get("/editor", (req, res)=> {
    res.sendFile(path.join(__dirname, "editor.js"));
});

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000");
});