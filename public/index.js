import { createLogin } from './componenti/login.js';
import { createNavigator } from "./componenti/navigator.js";
fetch("/conf.json")
      .then((r) => r.json())
      .then((conf) => {
          const login = createLogin();
          const navigator = createNavigator(document.querySelector("#container"));
      });



const createMiddleware = () => {
  return {
    load: async () => {
      const response = await fetch("/images");
      const json = await response.json();
      return json;
    },
    delete: async (id) => {
      const response = await fetch("/delete/" + id, {
        method: 'DELETE',
      });
      const json = await response.json();
      return json;
    },
    upload: async (inputFile) => {
      const formData = new FormData();
      formData.append("file", inputFile.files[0]);
      const body = formData;      
      const fetchOptions = {
        method: 'post',
        body: body
      };
      try {
        const res = await fetch("/upload", fetchOptions);
        const data = await res.json();
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

const controller = async (middleware) => {  
  const template = `
    <tr>
      <td><img src="$URL"style="width: 600px; height: 600px;" /></td>
      <td><button id="$ID" type="button" class="delete btn btn-button" style="background-color:red">ELIMINA</button></td>
    </tr>`;

  const render = (list) => {
    tabellaadmin.innerHTML = list.map((element) => {
      let row = template.replace("$ID", element.id);
      row = row.replace("$URL", element.name);
      row = row.replace("$URL", element.name);
      return row;
    }).join("\n");
    const bottoneelimina = document.querySelectorAll(".delete");
    bottoneelimina.forEach((button) => {
      button.onclick = () => {
        middleware.delete(button.id)
          .then(
            () => middleware.load()
          ).then((list) => {
            render(list);
            render1(list);
          });
      }
    });
  }

  

  const render1 = (list) => {
    let html = '';
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      let active = '';
      if (i === 0) {
        active = ' active';
      }
      html += '<div id="' + el.id + '" class="carousel-item' + active + '">'+
       '<img src="' + el.name + '" style="width: 1000px; height: 600px;" alt="Immagine ' + el.id + '" />'+
       '</div>';
    }
    carouselInner.innerHTML = html;
  };

  const inputFile = document.querySelector('#file');
  const button = document.querySelector("#button");  
  const tabellaadmin = document.getElementById("tabellaadmin");
  const carouselInner = document.getElementById("carouselInner");

  const handleSubmit = async (event) => {
    await middleware.upload(inputFile);
    const list = await middleware.load();
    render1(list);
    render(list);
    inputFile.value=""
  }
  button.onclick = handleSubmit;
  middleware.load().then((list) => {
    render(list);
    render1(list);
  });
}

controller(createMiddleware());