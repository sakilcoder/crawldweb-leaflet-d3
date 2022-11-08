let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
 let searchBtn = document.querySelector("#search");

closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("close");
  menuBtnChange();//calling the function(optional)
});

searchBtn.addEventListener("keyup", (event)=>{ // Sidebar open when you click on the search iocn
  if (event.keyCode === 13) {
    alert("Hello");
}
});

// following are the code to change sidebar button(optional)
function menuBtnChange() {
 if(sidebar.classList.contains("close")){
   closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
 }else {
   closeBtn.classList.replace("bx-menu","bx-menu-alt-right");//replacing the iocns class
 }
}
