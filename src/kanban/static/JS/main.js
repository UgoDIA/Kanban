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
      // console.log(el, target, source, sibling)
    },
    // dragEl: function(el, target, source, sibling){
    //   console.log("drag",el.getAttribute('data-titre'));
    //   console.log(target.parentElement.getAttribute('data-id'),"colonne:",target.parentElement.getAttribute('data-order'))
    //   console.log(target)
    // },
    buttonClick: function(el, boardId) {
      console.log(el);
      console.log(boardId);
      // create a form to enter element
      var formItem = document.createElement("form");
      formItem.setAttribute("class", "itemform");
      formItem.innerHTML =
        '<div class="form-group"><textarea class="form-control" rows="2" autofocus></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Submit</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancel</button></div>';

      KanbanTest.addForm(boardId, formItem);
      formItem.addEventListener("submit", function(e) {
        e.preventDefault();
        var text = e.target[0].value;
        KanbanTest.addElement(boardId, {
          title: text
        });
        formItem.parentNode.removeChild(formItem);
      });
      document.getElementById("CancelBtn").onclick = function() {
        formItem.parentNode.removeChild(formItem);
      };
    },
    itemAddOptions: {
      enabled: false,
      content: '+ Ajouter une tâche',
      class: 'custom-button',
      footer: true
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
    // console.log(KanbanTest)
    // console.log(KanbanTest.boardContainer[0].parentElement.attributes[0].nodeValue)
  //  console.log(KanbanTest)
  })


  // var addBoardDefault = document.getElementById("addDefault");
  // addBoardDefault.addEventListener("click", function() {
  //   KanbanTest.addBoards([
  //     {
  //       id: "test",
  //       title: "TEST",
  //       class:"error",
  //     }
  //   ]);
  // });
  
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

  })

  var addColonne= document.getElementById("addColonne");
  addColonne.addEventListener('click', function(){

  fetch('http://127.0.0.1:8000/kanban/api/colonnes/')
    .then((resp)=>resp.json())
    .then(function(colonneCount){
      count=colonneCount.length

      KanbanTest.addBoards([
        {
          id: "Nouvelle Colonne",
          title: "Nouvelle Colonne",
          'titre':"Nouvelle Colonne",
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
          "titre_colonne": "Nouvelle Colonneq",
          "ordre": count+1,
      })
      })
  })


  })
 
}


  //var removeBoard = document.getElementById("removeBoard");
  //removeBoard.addEventListener("click", function() {
  //  KanbanTest.removeBoard("_done");
  //});

  //var removeElement = document.getElementById("removeElement");
  //removeElement.addEventListener("click", function() {
  //  KanbanTest.removeElement("_test_delete");
  //});

  // var allEle = KanbanTest.getBoardElements("_todo");
  // allEle.forEach(function(item, index) {
  //   console.log(item,index);
  // });

 
  // console.log(KanbanTest.boardContainer.length)



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