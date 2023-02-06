//import "./styles.css";

var data_template = [
  {
    id: "directions",
    name: "directions",
    video: ["movies/6a.Mobile-directions.mp4","movies/6.Mobile-directions_Meeting.mp4"],
    subMenu: [
      {
        id: "knock",
        name: "Knock",
        video: ["movies/7.Mobile-Meeting.mp4","movies/8.Mobile-Wait_Fika.mp4"],
        subMenu: [
            {
              id: "no",
               name: "No",
               video: "movies/9b.Mobile-come_back.mp4",
            },
            {
             id: "yes",
             name: "Yes",
             video: ["movies/9.Mobile-transfer_fika.mp4","movies/10.Mobile-Move_to_robot.mp4"],
            },

        ],
      }
     ],
  },
];

let activeMenu = "directions";

// Could be a path array like this
let activePathMenu = ["directions"];

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
      console.log("click detected: ", {e, activePathMenu});
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

function playNextVideo(videoLinks) {
  // Check if there are more videos to play
  if (videoLinks.length > 0) {
    console.log('video links', videoLinks);
    // Get the next video link
    const nextVideoLink = videoLinks.shift();
    console.log('next video link', videoLinks);
    // Create a new video element
    const video = document.getElementById("videoRefDOM");

    // Set the video source and autoplay attributes
    video.src = nextVideoLink;
    video.autoplay = true;

    // Append the video element to the container
    // videoContainer.appendChild(video);

    // Add an event listener to play the next video when the current one ends
    video.addEventListener('ended', () => playNextVideo(videoLinks));
  }
}

function loadVideo(videoLink) {
  // Set dom video
  console.log("src", videoLink);
  if(Array.isArray(videoLink)) {
    console.log('Reach array status')
    const clonedVideos = [...videoLink];
    playNextVideo(clonedVideos)
  } else {
    document.getElementById("videoRefDOM").src = videoLink;
  }
}

function application() {
  document
    .getElementById("goBack")
    .addEventListener("click", function handleClick() {
      if (activePathMenu.length >= 2) {
        activePathMenu.pop();
      }
      activePathMenu = ["directions"];
      activeMenu = "directions";
      clearMenu();
      clearPathMenu();
      application();
    });

    document.getElementById("goBack").style.display = "none";
    console.log("activeMenu", {activeMenu, activePathMenu})
  if (activeMenu) {
    if (activePathMenu.length > 1) {
      console.log("Not main menu");
      document.getElementById("goBack").style.display = "block";
    }

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
    loadVideo(data_template.find((i) => i.id === "directions").video);
    document.getElementById("goBack").style.display = "none";
  }

  function addItem(ref, buttonLabel, id) {
    var button = document.createElement("button");
    button.textContent = buttonLabel;
    button.addEventListener("click", function handleClick() {
      // button.textContent = "Button clicked";
      console.log('Clicked item', id)
      clearMenu();
      // if path array just push id to last item
      activeMenu = id;
      if (id !== "directions") {
        activePathMenu.push(id);
      }

      // boot application
      application();
    });

    console.log(ref);
    if (id !== "directions") {
      ref.appendChild(button);
    }
  }

  // Imidiatly invoked function (called on start)
  function start() {
    // active state
    var divRef = document.getElementById("menuContent");
    // if path menu check length 0 and directions
    if (activeMenu === "directions") {
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
