(function($) {

  $(function() {

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register("sw.js")
        .then((reg) => {
          // registration worked
          console.log('Registration succeeded. Scope is ' + reg.scope);
        }).catch((error) => {
          // registration failed
          console.log('Registration failed with ' + error);
        });
    }

    $('.button-collapse').sideNav();

    let bt = document.querySelectorAll(".bt");

    [...bt].forEach((el) => {
      el.addEventListener("click", (el) => {
        localStorage.setItem("prod_img", JSON.stringify(el.target.id));
        window.location.href = "side-menu.html";
      });
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
