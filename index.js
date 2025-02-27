const _projects = JSON.parse(localStorage.getItem("projects")) || [];
let pjs = 0;

var actualSelection = 0;

const basicTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My Website</title>
  </head>
  <body>
    <main>
        <h1>Welcome to My Website</h1>  
    </main>
  </body>
</html>
`;

const nameGenerator = ()=> {
    let result = "";
    const names = [
        "Nova",
        "Forge",
        "Vibe",
        "Pulse",
        "Nest",
        "Core",
        "Wave",
        "Shift",
        "Craft",
        "Spark",
        "Box",
        "Grid",
        "Sphere",
        "Space",
        "Hive",
        "Craftify",
        "Nexify",
        "Echo",
        "Quest",
        "Flux"
    ];
    

    for(let n = 0; n < Math.floor(Math.random()*5)+2; n++) {
        result += names[Math.floor(Math.random()*names.length)];
    }

    return result;
}

const deleteProject = (id)=> {
    _projects.splice(id, 1);
    document.getElementById("projects").removeChild(document.getElementById("project-" + id));
    pjs--;
    document.getElementById('context-menu').style.top = '150%';
    localStorage.setItem("projects", JSON.stringify(_projects));
}

const registerProject = (title, description="Nothing yet.", files, _online=false, load=false)=> {
    if(title.trim() === "") title = nameGenerator();
    if(description.trim() === "") description = "Nothing yet.";
    
    title = title.replaceAll(" ", "-");
    if(title.length > 18) title = title.substring(0,18);
    if(description.length > 50) description = description.substring(0,50);
    
    pjs++;

    let pj = {
        title : title,
        description : description,
        files: files || {
            "index.html" : basicTemplate.trim(),
            "style.css" : "",
            "index.js" : ""
        },
        online: _online,
        id: pjs-1
    };

    if(!load) _projects.push(pj);
    
    let body = document.createElement("div");
    body.id = "project-" + pj.id;
    let header = document.createElement("h1");
    let desc = document.createElement("p");
    let online = document.createElement("span");

    body.addEventListener("click", (e)=> {
        localStorage.setItem("actual-project", pj.id);
        window.open("./editor.html");
    });

    body.addEventListener("contextmenu", (e)=> {
        e.preventDefault();
        actualSelection = pj.id;
        document.getElementById("context-menu").style.top = "50%";
    });

    body.appendChild(header);
    body.appendChild(desc);

    body.setAttribute("class", "project");
    header.innerText = pj.title;
    online.innerText = pj.online;
    desc.innerText = `${pj.description}`;

    desc.appendChild(online);

    document.getElementById("projects").appendChild(body);

    localStorage.setItem("projects", JSON.stringify(_projects));

    document.getElementById("pname").innerText = "";
    document.getElementById("pdesc").innerText = "";
}

if(_projects.length > 0) {
    Object.keys(_projects).forEach((key, index)=> {
        let pj = _projects[key];
        registerProject(pj.title, pj.description, pj.files, pj.online, true);
    });
}