(function() {

  let targeting = document.querySelector("#targeting"),
    descriptor = document.querySelector(".descriptor"),
    cals_displayer = document.querySelector(".cals-displayer"),
    key = localStorage.getItem("prod_img") ?
          JSON.parse(localStorage.getItem("prod_img")) : null;

  if (key != null) {
    caches.open("dependencies-cache").then(cache => {
      cache.keys().then(keys => {
        keys.map(request => {
          if (request.url.indexOf(key) != -1) {

            targeting.src = request.url;

            fetch("prod_descrip.json", {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }).then(response => {
              return response.json();
            }).then(json => {
              descriptor.innerText = json[key].description;
              cals_displayer.innerText = `${json[key].calories} calories`;
            });
          }
        });
      });
    });
    localStorage.removeItem(key);
  };
  targeting.src = "#";

  let startC_btn = document.querySelector(".start_Counter"),
      pauseC_btn = document.querySelector(".pause_Counter"),
      stopC_btn = document.querySelector(".stop_Counter"),
      counter_Output = document.querySelector(".counter_Output");

  let watchID;
  let init_Crds = [];

  const calculateDistance = ([lat1, lon1], [lat2, lon2]) => {
      const [pi, asin, sin, cos, sqrt, pow, round] = [
        'PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round']
      .map(k => Math[k]),
        [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2].map(x => x / 180 * pi),
        dLat = rlat2 - rlat1, dLon = rlon2 - rlon1, radius = 6372.8; // km
      return parseInt((round(radius * 2 * asin(
        sqrt(pow(sin(dLat / 2), 2) +
          pow(sin(dLon / 2), 2) *
          cos(rlat1) * cos(rlat2))
      ) * 100) / 100).toFixed());
  };

  const stop_Counter = () => {
  navigator.geolocation.clearWatch(watchID);
  init_Crds = [];
  watchID = 0;
  };

  const pause_Counter = () => {
  navigator.geolocation.clearWatch(watchID);
  counter_Output.innerHTML = "Paused";
  };

  const geo_Success = (position) => {
  console.log("success");

  let lat = position.coords.latitude,
      lon = position.coords.longitude;

  if (init_Crds.length > 0) {
  console.log("initial coords exist ", init_Crds);

  counter_Output.innerHTML = "You have burnt " + calculateDistance([init_Crds[0], init_Crds[1]], [lat, lon]) * 0.06 + " calories.";
    return;
  }

  [lat, lon].map(el => init_Crds.push(el));
  console.log("init_Crds don't exist. Now > ", init_Crds);
  counter_Output.innerHTML = "Ready. Will start counting as you walk";
};

const geo_error = () => {
  counter_Output.innerHTML = "Trying to connect...Hold on";
}

const start_Counter = () => {
  if (!navigator.geolocation) {
    counter_Output.innerHTML = "Geolocation is not supported by your browser";
    return;
  };

  counter_Output.innerHTML = "Locating...";

  watchID = navigator.geolocation.watchPosition(geo_Success, geo_error, {
    timeout: 2000
  });

};

startC_btn.addEventListener("click", start_Counter);
pauseC_btn.addEventListener("click", pause_Counter);
stopC_btn.addEventListener("click", stop_Counter);

})();
