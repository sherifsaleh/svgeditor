import * as Config from './Config';
/***************** colors *****************/
export let pickerBtn = document.getElementById('colorPicker');
pickerBtn.addEventListener('change', function(event) { colorSet(event) }, false);
//pickerBtn.onchange = (event) => { colorSet(event)};
export let colorSet = (event) => {
    let element = event.target;
    let svgLoaded = document.getElementById('card1');
    let activeNode = svgLoaded.getElementsByClassName('node-active');

    // set selected text color to the color picker
    let nodeColor = element.value;

    if (activeNode[0].tagName == 'foreignObject') {
        activeNode[0].style.color = nodeColor;
    } else {
        activeNode[0].setAttribute('fill', nodeColor);
    }
}
    /***************** rgb2hex *****************/
    // using this function for the coloring
    // http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
export let rgb2hex = (rgb) => {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
