/*********************************
      CHART UPDATE FUNCTIONS
 *********************************/

// Render Choropleth Based On Year
function primaryChartUpdate() {
  yearLabel.innerText = year.value;
  updateChoropleth(year.value);
}

// Render Share Chart Based On Type
function shareChartRedraw(type) {
  // Ensure Type Not Already Active
  if (!buttons[type].classList.contains("active")) {
    for (let i = 0; i < buttons.length; i++)
      if (i == type) buttons[i].classList.add("active");
      else buttons[i].classList.remove("active");
    
  }
}

// Update Selected Region & Render Charts Accordingly
function choroplethRegionUpdate(region) {
  if (activeRegion == region) activeRegion = "World";
  else activeRegion = region;
}

// Update Pie/Bar Charts When New Region Selected
function regionSelectorUpdate() {
  let type = 0;
  for (let i = 0; i < buttons.length; i++)
    if (buttons[i].classList.contains("active")) { type = i; break; }

}


/*********************************
    TIMELINE EVENTS & FUNCTIONS
 *********************************/

// Update Timeline Label Based On Timeline Value
function timelineUpdate() {
  yearLabel.innerText = year.value;
  pauseTimeline();
}

// Pause A Running Timeline
function pauseTimeline() {
  playButton.firstElementChild.classList.remove("bi-pause-fill");
  playButton.firstElementChild.classList.add("bi-play-fill");

  // Clear All Playing Channels
  let timeoutIDs = setTimeout(function() {}, 0);
  while (timeoutIDs--) clearTimeout(timeoutIDs);
}

// Update Play/Pause State Of Timeline
function timelineButtonUpdate() {
  // If Currently Paused
  if (playButton.firstElementChild.classList.contains("bi-play-fill")) {
    playButton.firstElementChild.classList.remove("bi-play-fill");
    playButton.firstElementChild.classList.add("bi-pause-fill");

    // If At End Of Timeline, Reset To Beginning
    if (year.value == 2021) {
      year.value = 1965;
      yearLabel.innerText = year.value;
    }

    // Loop Through Timeline
    let loopTimeout = function(i, max, interval, func) {
      if (i > max) { // End Of Timeline
        playButton.firstElementChild.classList.remove("bi-pause-fill");
        playButton.firstElementChild.classList.add("bi-play-fill");
        return;
      }

      func(i); // Call Update Function
      i++; // Increment Control Variable
      setTimeout(function() { loopTimeout(i, max, interval, func) }, interval);
    };

    // Start Playing Timeline
    loopTimeout(parseInt(year.value), 2021, 700, (yearVal) => {
      year.value = yearVal;
      primaryChartUpdate();
    });
  }

  // If Currently Playing
  else pauseTimeline();
}
