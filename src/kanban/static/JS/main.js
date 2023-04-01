function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');

window.onload = function() {
  buildKanban()
};


function buildKanban(){  
var KanbanTest = new jKanban({
    element: "#myKanban",
    gutter: "10px",
    widthBoard: "350px",  

    click: function(el) {
      console.log("Trigger on all items click!");
    },
    context: function(el, e) {
      console.log("Trigger on all items right-click!");
    },
    dragBoard: function(el, source){
      console.log("Drag Board:")
      console.log(el.getAttribute('data-id'),"position:",el.getAttribute('data-order'))
    },
    dragendBoard: function(el, target, source, sibling){
      console.log("Drop Board:")
      console.log(el.getAttribute('data-id'),"position:",el.getAttribute('data-order'))
      const boards = document.querySelectorAll('.kanban-board');
      const disco = [];
      boards.forEach((board, index) => {
        const dataId = board.getAttribute('data-id');
        disco.push({ titre_colonne: dataId, ordre: index + 1 });
      });
      // console.log(disco);
      disco.forEach(col=>{
        fetch(`http://127.0.0.1:8000/kanban/api/colonnes/${col.titre_colonne}/`,{
          method:'POST',
          headers:{
            'content-type':'application/json',
            'X-CSRFToken':csrftoken,
          },
          body:JSON.stringify({
            "id_colonne": col.titre_colonne,
            "titre_colonne": 'test',
            "ordre": col.ordre,
        })
        })
      })
    },
    dropEl: function(el, target, source, sibling){
      console.log("drop",el.getAttribute('data-titre'));
      console.log(target.parentElement.getAttribute('data-id'),"colonne:",target.parentElement.getAttribute('data-order'))
      console.log(el.parentElement)
      const IDCol=target.parentElement.getAttribute('data-id')
      const colDiv = document.querySelector(`div[data-id="${IDCol}"]`);
      const ordreTache = colDiv.querySelectorAll("div[data-eid]");
      const dicta = [];
      ordreTache.forEach((tache, index) => {
        const dataId = tache.getAttribute('data-eid');
        const dataTitre=tache.getAttribute('data-titre')
        dicta.push({ id_tache: dataId, ordre: index + 1, data_titre:dataTitre });
      });
      // console.log(dicta)

      dicta.forEach(tache=>{
        fetch(`http://127.0.0.1:8000/kanban/api/taches/${tache.id_tache}/`,{
          method:'POST',
          headers:{
            'content-type':'application/json',
            'X-CSRFToken':csrftoken,
          },
          body:JSON.stringify({
            "id_tache": tache.id_tache,
            "titre_tache": tache.data_titre,
            "ordre": tache.ordre,
            "titre_colonne": IDCol,
        })
        })
      })
    },
    dragEl: function(el, target, source, sibling){
      console.log("drag",el.getAttribute('data-titre'));
      console.log(target.parentElement.getAttribute('data-id'),"colonne:",target.parentElement.getAttribute('data-order'))
      console.log(target)
    },
    buttonClick: function(el, boardId) {
      console.log(el.parentElement);
      console.log(boardId);
      const mainDiv=document.querySelector(`div[data-id='${boardId}']`)
      const titreDiv= mainDiv.querySelector('.kanban-title-board')
      const titre=titreDiv.innerHTML
      console.log(titre)
      openPopup()
      document.getElementById("titre_form").innerHTML ="Modifier le nom de la colonne"
      formColonne.placeholder=titre
      
      submitButton.addEventListener("click", function(){
      console.log(formColonne.value)
      formValue=formColonne.value
      closePopup()
      
      const ordre=mainDiv.getAttribute('data-order')
      const titreBoard= mainDiv.querySelector('.kanban-title-board')
      titreBoard.innerHTML =formValue
      const listeTache = mainDiv.querySelectorAll("div[data-eid]");
      const dicta = [];
      listeTache.forEach((tache, index) => {
        const dataId = tache.getAttribute('data-eid');
        const dataTitre=tache.getAttribute('data-titre')
        dicta.push({ id_tache: dataId, ordre: index + 1, data_titre:dataTitre });
      });
      // console.log(dicta)
      
      fetch(`http://127.0.0.1:8000/kanban/api/colonnes/`,{
        method:'POST',
        headers:{
          'content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({
          "titre_colonne": formValue,
          "ordre": ordre,
        })
      }).then(function(){
        dicta.forEach(tache=>{
          fetch(`http://127.0.0.1:8000/kanban/api/taches/${tache.id_tache}/`,{
            method:'POST',
            headers:{
              'content-type':'application/json',
              'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({
              "id_tache": tache.id_tache,
              "titre_tache": tache.data_titre,
              "ordre": tache.ordre,
              "titre_colonne": formValue,
            })
          })
        })
      }).then(function(){
        fetch(`http://127.0.0.1:8000/kanban/api/colonnes/${titre}/`, {
          method:'DELETE', 
          headers:{
              'Content-type':'application/json',
              'X-CSRFToken':csrftoken,
          }
        })
      })

    })
    
    },
    itemAddOptions: {
      enabled: false,
      content: 'Editer',
      class: 'custom-button',
      footer: false
    },
  
  });

fetch('http://127.0.0.1:8000/kanban/api/colonnes/')
  .then((resp)=>resp.json())
  .then(function(colonneData){
    colonneData.forEach(item => {
      KanbanTest.addBoards([
        {
          'id': "board"+item.id_colonne,
          'title': item.titre_colonne,
          'class':"info",
        }
      ]);
    })
  
    fetch('http://127.0.0.1:8000/kanban/api/taches/')
    .then((resp)=>resp.json())
    .then(function(tachesData){  
      // console.log(tachesData)
      tachesData.forEach(item => {
      KanbanTest.addElement("board"+item.id_colonne,{
        "id"    : item.id_tache,
        "title" : item.titre_tache,
        "titre" : item.titre_tache,
      });
     })
    
    })
  

  })


  
  
  var addTache= document.getElementById("addTache");
  addTache.addEventListener('click', function(){
  
    fetch('http://127.0.0.1:8000/kanban/api/taches/')
    .then((resp)=>resp.json())
    .then(function(taches){
      let count = 0;
    for (let i = 0; i < taches.length; i++) {
      if (taches[i].titre_colonne === "TO DO") {
        count++;
      }
    }
      KanbanTest.addElement("TO DO",{
        title:"Nouvelle Tâche",
        'id': taches.length+1,
        'titre':"Nouvelle Tâche",
      },count)
      fetch('http://127.0.0.1:8000/kanban/api/taches/',{
        method:'POST',
        headers:{
          'content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({
          "titre_tache": "Nouvelle Tâche",
          "ordre": count+1,
          "titre_colonne": "TO DO"
      })
      })
    })
    .catch(error => console.log("Erreur : " + error));

  })

  var addColonne= document.getElementById("addColonne");
  addColonne.addEventListener('click', function(){
    openPopup();
    document.getElementById("titre_form").innerHTML ="Nom de la nouvelle colonne"
    submitButton.addEventListener("click", function(){
      console.log(formColonne.value)
      closePopup()
      fetch('http://127.0.0.1:8000/kanban/api/colonnes/')
      .then((resp)=>resp.json())
      .then(function(colonneCount){
        count=colonneCount.length
    
        KanbanTest.addBoards([
          {
            id: formColonne.value,
            title: formColonne.value,
            'titre':formColonne.value,
            class:"info",
          }
        ]);
    
        fetch('http://127.0.0.1:8000/kanban/api/colonnes/',{
          method:'POST',
          headers:{
            'content-type':'application/json',
            'X-CSRFToken':csrftoken,
          },
          body:JSON.stringify({
            "titre_colonne": formColonne.value,
            "ordre": count+1,
        })
        })
    })
    })
  })

const formColonne =document.getElementById("formColonne");
const submitButton = document.getElementById('submit');

formColonne.addEventListener("input", updateSubmitButton);

function updateSubmitButton() {
const inputValue = formColonne.value.trim();
  if (inputValue.length == 0) {
      submitButton.disabled = true; 
  } else {
      submitButton.disabled = false;
  }
}




}


let popupbg = document.getElementById("popupbg");
function openPopup(){
  document.getElementById("popupbg").style.visibility="visible"
}
function closePopup(){
  document.getElementById("popupbg").style.visibility="hidden"
}


