function controlFromSlider(fromSlider, toSlider) {
    const [from, to] = getParsed(fromSlider, toSlider);
  
    if (from > to) {
      // If the min slider surpasses the max slider, adjust the max slider
      toSlider.value = from;
    }
  
    fillSlider(fromSlider, toSlider, '#d3d3d3', '#1db954', toSlider);
}

function controlToSlider(fromSlider, toSlider) {
    const [from, to] = getParsed(fromSlider, toSlider);
  
    if (to < from) {
      // If the max slider surpasses the min slider, adjust the min slider
      fromSlider.value = to;
    }
  
    fillSlider(fromSlider, toSlider, '#d3d3d3', '#1db954', toSlider);
}

function getParsed(currentFrom, currentTo) {
  const from = parseFloat(currentFrom.value, 10);
  const to = parseFloat(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

// Acousticness
const fromSliderAcousticness = document.querySelector('#fromSliderAcousticness');
const toSliderAcousticness = document.querySelector('#toSliderAcousticness');
fillSlider(fromSliderAcousticness, toSliderAcousticness, '#d3d3d3', '#1db954', toSliderAcousticness);

fromSliderAcousticness.oninput = () => controlFromSlider(fromSliderAcousticness, toSliderAcousticness);
toSliderAcousticness.oninput = () => controlToSlider(fromSliderAcousticness, toSliderAcousticness);

// Danceability
const fromSliderDanceability = document.querySelector('#fromSliderDanceability');
const toSliderDanceability = document.querySelector('#toSliderDanceability');
fillSlider(fromSliderDanceability, toSliderDanceability, '#d3d3d3', '#1db954', toSliderDanceability);

fromSliderDanceability.oninput = () => controlFromSlider(fromSliderDanceability, toSliderDanceability);
toSliderDanceability.oninput = () => controlToSlider(fromSliderDanceability, toSliderDanceability);

// Energy
const fromSliderEnergy = document.querySelector('#fromSliderEnergy');
const toSliderEnergy = document.querySelector('#toSliderEnergy');
fillSlider(fromSliderEnergy, toSliderEnergy, '#d3d3d3', '#1db954', toSliderEnergy);

fromSliderEnergy.oninput = () => controlFromSlider(fromSliderEnergy, toSliderEnergy);
toSliderEnergy.oninput = () => controlToSlider(fromSliderEnergy, toSliderEnergy);

// Instrumentalness
const fromSliderInstrumentalness = document.querySelector('#fromSliderInstrumentalness');
const toSliderInstrumentalness = document.querySelector('#toSliderInstrumentalness');
fillSlider(fromSliderInstrumentalness, toSliderInstrumentalness, '#d3d3d3', '#1db954', toSliderInstrumentalness);

fromSliderInstrumentalness.oninput = () => controlFromSlider(fromSliderInstrumentalness, toSliderInstrumentalness);
toSliderInstrumentalness.oninput = () => controlToSlider(fromSliderInstrumentalness, toSliderInstrumentalness);

// Liveness
const fromSliderLiveness = document.querySelector('#fromSliderLiveness');
const toSliderLiveness = document.querySelector('#toSliderLiveness');
fillSlider(fromSliderLiveness, toSliderLiveness, '#d3d3d3', '#1db954', toSliderLiveness);

fromSliderLiveness.oninput = () => controlFromSlider(fromSliderLiveness, toSliderLiveness);
toSliderLiveness.oninput = () => controlToSlider(fromSliderLiveness, toSliderLiveness);

// Popularity
const fromSliderPopularity = document.querySelector('#fromSliderPopularity');
const toSliderPopularity = document.querySelector('#toSliderPopularity');
fillSlider(fromSliderPopularity, toSliderPopularity, '#d3d3d3', '#1db954', toSliderPopularity);

fromSliderPopularity.oninput = () => controlFromSlider(fromSliderPopularity, toSliderPopularity);
toSliderPopularity.oninput = () => controlToSlider(fromSliderPopularity, toSliderPopularity);

// Valence
const fromSliderValence = document.querySelector('#fromSliderValence');
const toSliderValence = document.querySelector('#toSliderValence');
fillSlider(fromSliderValence, toSliderValence, '#d3d3d3', '#1db954', toSliderValence);

fromSliderValence.oninput = () => controlFromSlider(fromSliderValence, toSliderValence);
toSliderValence.oninput = () => controlToSlider(fromSliderValence, toSliderValence);
