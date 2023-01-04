//import "./styles.css";

var data_template = [
{
    id: "intro",
    //name: "intro",
    video: "movies/5.Mobile-Hand.mp4",
  },
  {
    id: "directions",
    name: "Directions",
    video: "movies/6.Mobile-directions_Meeting.mp4",
    subMenu: [
           {
               id: "meeting",
               name: "Meeting",
               video: "movies/7.Mobile-Meeting.mp4",
           },
          {
            id: "wait",
            name: "Waiting",
            video: "movies/8.Mobile-Wait_Fika.mp4",
            subMenu: [
              {
                id: "no",
                 name: "No",
                 video: "movies/9.Mobile-transfer_fika.mp4",
              },
              {
               id: "yes",
               name: "Yes",
               video: "movies/9b.Mobile-come_back.mp4",

              },
            ]
          },
        ],
  },
];

let activeMenu = "intro";

// Could be a path array like this
let activePathMenu = ["intro"];

function clearMenu(ref) {
  const myNode = document.getElementById("menuContent");
  myNode.innerHTML = "";
}

function clearPathMenu() {
  const myNode = document.getElementById("currentPath");
  myNode.innerHTML = "";
}
// If we want a show path menu (comment if you dont want it)
function showPathMenu () {
  const myNode = document.getElementById("currentPath");
  myNode.innerHTML = "";
  activePathMenu.forEach((apm, index) => {
    var node = document.createElement("li");
    node.id = apm;
    node.addEventListener("click", function handleClick(e) {
      console.log(e);
      if (activePathMenu.length >= 2) {
        if(e.target.id !== activeMenu) {
        activePathMenu.pop();
        activeMenu = apm;
        clearMenu();
        clearPathMenu();
        application();
        }
      }})

    node.innerHTML = index !== activePathMenu.length-1 ? apm + " >" : apm;
    myNode.appendChild(node)
  });

}


function loadVideo(videoLink) {
  // Set dom video
  console.log("src", videoLink);
  document.getElementById("videoRefDOM").src = videoLink;
}

function application() {
  document
    .getElementById("goBack")
    .addEventListener("click", function handleClick() {
      if (activePathMenu.length >= 2) {
        activePathMenu.pop();
      }

      activeMenu = "intro";
      clearMenu();
      clearPathMenu();
      application();
    });

  if (activeMenu !== "intro") {
    if (activePathMenu > 1) {
      console.log("Not main menu");
      // activeMenu.forEach()
    }

    document.getElementById("goBack").style.display = "block";

    /*
    A recursive function that traverses data_template structure recursively until finding item;
    @param: subMenu is the next data_template to traverse
    @param: isLast is an exist flag

    Note: a recursive function *has* to have an exit conditional
    */
    let foundNode = false;
    function deepFind(subMenu) {
      subMenu.find((index) => {
        if (index.id === activeMenu) {
          // We found the node here! We update the DOM and break out of recursion!
          loadVideo(index.video);
          clearMenu();
          var divRef = document.getElementById("menuContent");
          if (index && index.subMenu) {
            index.subMenu.forEach((item) => {
              addItem(divRef, item.name, item.id);
            });
          }
          // Break out of recursive function since we have our node found..
          foundNode = true;
          showPathMenu();
          return;
        } else {
          // No node yet, we keep looking
          if (foundNode) {
            return;
          }
          // We verify current node is in data_set or early exit
          const isInPath = !!activePathMenu.find((item) => item === index.id);
          if (isInPath) {
            if (index.id !== activeMenu && index.subMenu) {
              // recursion to next level submenu
              deepFind(index.subMenu, false);
            }
          } else {
            // exit if not in path
            return;
          }
        }
      });
    }

    deepFind(data_template);
  } else {
    loadVideo(data_template.find((i) => i.id === "intro").video);
    document.getElementById("goBack").style.display = "none";
  }

  function addItem(ref, buttonLabel, id) {
    var button = document.createElement("button");
    button.textContent = buttonLabel;
    button.addEventListener("click", function handleClick() {
      // button.textContent = "Button clicked";
      clearMenu();
      // if path array just push id to last item
      activeMenu = id;
      if (id !== "intro") {
        activePathMenu.push(id);
      }

      // boot application
      application();
    });

    console.log(ref);
    ref.appendChild(button);
  }

  // Imidiatly invoked function (called on start)
  function start() {
    // active state
    var divRef = document.getElementById("menuContent");
    // if path menu check length 0 and intro
    if (activeMenu === "intro") {
      data_template.forEach((item) => {
        addItem(divRef, item.name, item.id);
      });
    }

    // If you need endless menu
    if (activePathMenu.length === 1) {
    }
  }

  start();
}

application();
