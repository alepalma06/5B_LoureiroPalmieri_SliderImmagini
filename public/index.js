import { createLogin } from './componenti/login.js';
import { createNavigator } from "./componenti/navigator.js";
fetch("/conf.json")
      .then((r) => r.json())
      .then((conf) => {
          const login = createLogin();
          const navigator = createNavigator(document.querySelector("#container"));
      });

(async () => {
    const inputFile = document.querySelector('#file');
    const button = document.querySelector("#button");
    const link = document.querySelector("#link");
  
    const render = async () => {
      const res = await fetch("/fileslist");
      const data = await res.json();
      link.innerHTML = data.map(file => `<li><a href="files/${file}">${file}</a></li>`).join("");
    };
  
    (async () => {
      await render();
      })();
  
    const handleSubmit = async (event) => {
      const formData = new FormData();
      formData.append("file", inputFile.files[0]);
      const body = formData;
      body.description = inputFile.value;
      const fetchOptions = {
        method: 'post',
        body: body
      };
      try {
        const res = await fetch("/upload", fetchOptions);
        const data = await res.json();
        link.setAttribute("href", data.url);
        link.innerText = data.url;
        await render();
      } catch (e) {
        console.log(e);
      }
    }
  
    button.onclick = handleSubmit;
  })();