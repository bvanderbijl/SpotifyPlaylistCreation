document.getElementById("trackSlider").oninput = function() {
    document.getElementById('trackCount').innerText = this.value;

    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, #1db954 0%, #1db954 ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)'
};
