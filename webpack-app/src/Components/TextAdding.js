/***************** add text *****************/
let txtBtn = document.getElementById('add-text-btn');
let textEditingState = false;
// to check http://jsfiddle.net/brx3xm59/
txtBtn.addEventListener('click', (event) => {
    event.preventDefault();
    textEditingState = !textEditingState;
    if (textEditingState == true) {
        txtBtn.classList.add('btn-primary');
    } else {
        txtBtn.classList.remove('btn-primary');
    }
}, false);

// get mouse coordinates on the SVG
let getLocalMouseCoord = (event, svg) => {
    let svgLoaded = document.getElementById('card1');
    let pt = svgLoaded.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    let localpoint = pt.matrixTransform(svgLoaded.getScreenCTM().inverse());
    localpoint.x = Math.round(localpoint.x);
    localpoint.y = Math.round(localpoint.y);
    return localpoint;
};

// creating the text on the SVG
// wrapped with debounce function to avoid over calling the function in short time
let createText = debounce((localpoint, svg) => {
    let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    let textdiv = document.createElement('text');
    let textnode = document.createTextNode('Click to edit');

    textdiv.appendChild(textnode);
    textdiv.setAttribute('contentEditable', 'true');
    textdiv.setAttribute('width', 'auto');
    myforeign.setAttribute('width', '100%');
    myforeign.setAttribute('height', '100%');
    myforeign.classList.add('foreign'); //to make div fit text
    myforeign.classList.add('text-left'); //to make div fit text
    textdiv.classList.add('insideforeign'); //to make div fit text
    myforeign.setAttributeNS(null, 'transform', 'translate(' + localpoint.x + ' ' + localpoint.y + ')');
    svg.appendChild(myforeign);
    myforeign.appendChild(textdiv);
}, 100);

// add text function
export let addText = (event, svg) => {
    let localpoint = getLocalMouseCoord(event, svg);
    if (textEditingState == true) {
        // add one text node
        createText(localpoint, svg);
        // turn off add text function
        textEditingState = false;
        // visual feedback
        txtBtn.classList.remove('btn-primary');
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this,
            args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
