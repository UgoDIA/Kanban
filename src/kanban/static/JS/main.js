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

buildKanban()
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
    // dragBoard: function(el, source){
    //   console.log("Drag Board:")
    //   console.log(el.getAttribute('data-id'),"position:",el.getAttribute('data-order'))
    // },
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
        fetch(`http://127.0.0.1:8000/kanban/api/colonneOrder/${col.titre_colonne}/`,{
          method:'POST',
          headers:{
            'content-type':'application/json',
            'X-CSRFToken':csrftoken,
          },
          body:JSON.stringify({
            "titre_colonne": col.titre_colonne,
            "ordre": col.ordre
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
        fetch(`http://127.0.0.1:8000/kanban/api/tacheOrder/${tache.id_tache}/`,{
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
    // dragEl: function(el, target, source, sibling){
    //   console.log("drag",el.getAttribute('data-titre'));
    //   console.log(target.parentElement.getAttribute('data-id'),"colonne:",target.parentElement.getAttribute('data-order'))
    //   console.log(target)
    // },
    buttonClick: function(el, boardId) {
      console.log(el);
      console.log(boardId);
    
    },
    itemAddOptions: {
      enabled: true,
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
          id: item.titre_colonne,
          title: item.titre_colonne,
          'titre':item.titre_colonne,
          class:"info",
        }
      ]);
    })
  
  })

  fetch('http://127.0.0.1:8000/kanban/api/taches/')
  .then((resp)=>resp.json())
  .then(function(tachesData){  
    // console.log(tachesData)
    tachesData.forEach(item => {
    KanbanTest.addElement(item.titre_colonne, {
      title: item.titre_tache,
      'id': item.id_tache,
      'titre':item.titre_tache,
    }, item.ordre);
   })
  
  })
  .catch(error => console.log("Erreur : " + error));
  

  
  var addTache= document.getElementById("addTache");
  addTache.addEventListener('click', function(){
  
    fetch('http://127.0.0.1:8000/kanban/api/taches/')
    .then((resp)=>resp.json())
    .then(function(tachesCount){
      let count = 0;
    for (let i = 0; i < tachesCount.length; i++) {
      if (tachesCount[i].titre_colonne === "TO DO") {
        count++;
      }
    }
      KanbanTest.addElement("TO DO",{
        title:"Nouvelle Tâche",
        'id': tachesCount.length+1,
        'titre':"Nouvelle Tâche",
      },count)
      fetch('http://127.0.0.1:8000/kanban/api/createTaches/',{
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
  })

  const formColonne =document.getElementById("formColonne");
const submitButton = document.getElementById('submit');

formColonne.addEventListener("input", updatesubmitButton);

function updatesubmitButton() {
if (formColonne.value.length == 0) {
     submitButton.disabled = true; 
} else {
     submitButton.disabled = false;
}
}


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

    fetch('http://127.0.0.1:8000/kanban/api/createColonne/',{
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

}


let popupbg = document.getElementById("popupbg");
function openPopup(){
  document.getElementById("popupbg").style.visibility="visible"
}
function closePopup(){
  document.getElementById("popupbg").style.visibility="hidden"
}


