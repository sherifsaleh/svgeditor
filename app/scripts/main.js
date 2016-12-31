(function() {

    /***************** load web fonts *****************/
    WebFont.load({
        google: {
            families: ['Oswald:300', 'Great Vibes', 'Open Sans:800']
        }
    });

    /***************** variables *****************/
    let svgNodes;
    let svgObj;
    let svgDoc;
    let svgLoaded; // SVG tag of loaded image
    let textEditState; // is for the curring function of textEdit, first assignment svgNodeClicker, last assignment input submit
    let textCenterState; // is for the curring function of textCenter, first assignment svgNodeClicker, last assignment input submit


    /***************** DOM elements *****************/
    let inputForm = document.getElementById("text-editor");
    let input = document.getElementById('text-editor__input');
    let svgImg = document.getElementById('svg-image'); // it dose disappear after loading




    /********* load svg element to the page *********/
    // full details : https://css-tricks.com/ajaxing-svg-sprite/
    svgImg.addEventListener('load', function(event) { svgHandelLoad(event) }, false);

    let svgHandelLoad = function(event) {
        svgObj = event.currentTarget;
        svgDoc = svgObj.getSVGDocument();
        svgLoaded = svgDoc.childNodes[0];
        svgObj.parentNode.replaceChild(svgLoaded, svgObj);
        svgNodes = svgLoaded.childNodes;

        /***************** click events *****************/
        // attach event to every node and return a function
        for (let i = 0; i < svgNodes.length; i++) {
            // set event listener on each node element
            svgNodes[i].addEventListener("click", function() { svgNodeClicker(i, svgNodes[i]) }, false);
        }

        let svgTexts = document.getElementsByTagName('text');

        // attach event to click to add text function
        svgLoaded.addEventListener("click", function(event){ addText(event, svgLoaded) }, false);


    }


    /*************** svgNodeClicker ***************/
    // function called from click events to get the clicked node
    let svgNodeClicker = (i, svgNode) => {

        // set the input placeholder with the same value of the node text
        input.value = svgNode.innerHTML;


        // on editor submit update node with value
        textEditState = textEdit(svgLoaded)(i);

        // check if has Attribute return
        if (!svgNode.hasAttribute('text-anchor')) {
            // execute only first time add add attribute of the text-anchor
            textCenterState = textCenter(svgLoaded)(i);
        }

        // if it has the method it is a text ;)
        if (svgNode.getComputedTextLength) {
            // node position
            let position = svgNode.getBoundingClientRect();
            let width = svgNode.getComputedTextLength()
            showInputForm(position, width);
        }
    }

    /***************** modify node text *****************/
    // Function to change the content of svgNodes
    // curring because we are gathering elements from two functions
    // svgNodes clicked and inputSubmit
    let textEdit =
        (svg) =>
        (elementId) =>
        (inputText) =>
        svg.childNodes[elementId].innerHTML = inputText;

    /***************** text center *****************/
    let textCenter =
        (svg) =>
        (elementId) => {
            let node = svg.childNodes[elementId];
            if (node.getComputedTextLength) {
                let width = node.getComputedTextLength();
                let transform = node.getAttribute('transform');
                node.setAttribute('transform', transform + ' ' + 'translate(' + width / 2 + ')');
                node.setAttribute('transform', transform + ' ' + 'translate(' + width / 2 + ')');
                node.setAttribute('text-anchor', 'middle');
            }
        }
    /***************** show text form  *****************/
    let showInputForm = (position, width) => {
        // show // add classes
        inputForm.className += ' animated fadeIn';
    }

    /***************** add text *****************/
    // to check http://jsfiddle.net/brx3xm59/
    let mousedownonelement = false;

    function elementMousedown(evt) {
        mousedownonelement = true;
    }

    // get mouse coordinates on the SVG
    let getLocalMouseCoord = (event, svg) => {
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
    let createText = debounce( (localpoint, svg) => {
        let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
        let textdiv = document.createElement("text");
        let textnode = document.createTextNode("Click to edit");

        textdiv.appendChild(textnode);
        textdiv.setAttribute("contentEditable", "true");
        textdiv.setAttribute("width", "auto");
        myforeign.setAttribute("width", "100%");
        myforeign.setAttribute("height", "100%");
        myforeign.classList.add("foreign"); //to make div fit text
        myforeign.classList.add("text-left"); //to make div fit text
        textdiv.classList.add("insideforeign"); //to make div fit text
        textdiv.addEventListener("mousedown", elementMousedown, false);
        myforeign.setAttributeNS(null, "transform", "translate(" + localpoint.x + " " + localpoint.y + ")");
        svg.appendChild(myforeign);
        myforeign.appendChild(textdiv);

    }, 600);

    // remove if no text entered
    let removeText = ()=> {

    };

    // add text function
    let addText = (event, svg) => {
        var localpoint = getLocalMouseCoord(event, svg);
        if (!mousedownonelement) {
            createText(localpoint, svg);
        } else {
            mousedownonelement = false;
        }
    }







    /***************** submission *****************/
    // listen to form submit
    inputForm.addEventListener("submit", function(event){ inputSubmit(event)}, false);

    let inputSubmit = (evt) => {
        // prevent submit default action
        evt.preventDefault();
        // update svgNode[i] with the input value
        textEditState(input.value);
        // center element
        //textCenterState(input.value);
    }

    /***************** debounce *****************/
    // https://davidwalsh.name/javascript-debounce-function
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
})();
