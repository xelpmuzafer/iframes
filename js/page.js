var i;
var mybutton = document.getElementById("pageUpBtn");
var navbar = document.getElementById("navbar-menu");
var navbarBtn = document.getElementById("navbar-btn");
var sticky = navbar.offsetTop;

window.onscroll = function () {
  scrollFunction();
};

window.setupAccordionEventListeners = function () {
  var acc = document.getElementsByClassName("accordion");
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
};

function scrollFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
    closeMenu();
  } else {
    navbar.classList.remove("sticky");
  }

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeMenu() {
  var navbarDiv = document.getElementById("navbarCollapse");
  navbarDiv.classList.remove("show");
}

$(document).ready(function () {
  $(".smoothScroll").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });
});

window.setupAccordionEventListeners();
