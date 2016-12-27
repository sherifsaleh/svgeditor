(function() {

    // load web fonts
    WebFont.load({
        google: {
            families: ['Oswald:300', 'Great Vibes', 'Open Sans:800']
        }
    });


    let svgNodes;
    let svgObj;
    let svgDoc;
    let svg;

    let inputForm = document.getElementById("text-editor");
    let input = document.getElementById('text-editor__input');
    let mySVG = document.getElementById('mySVG');


    // load svg element
    // full details : https://css-tricks.com/ajaxing-svg-sprite/
    mySVG.addEventListener('load', function(e) {

        svgObj = e.currentTarget;
        svgDoc = svgObj.getSVGDocument();
        svg = svgDoc.childNodes[0];

        svgObj.parentNode.replaceChild(svg, svgObj);


        svgNodes = svg.childNodes;

        // attach event listener
        function addEvent(element, event_name, func) {
            if (element.addEventListener) {
                element.addEventListener(event_name, func, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + event_name, func);
            }
        }


        // attach event to every node and return a function
        for (let i = 0; i < svgNodes.length; i++) {
            svgNodes[i].addEventListener("click", function() { svgNodeClicker(i, "hey") }, false);
        }


    }, false);


    // function get the clicked node
    function svgNodeClicker(i, text) {
        // do some logic
        // define type of clicked node
        // call right function if text or graphical element or image
        //console.log( this.innerHTML, this.id,  i);
        modifyText(i, text)
    }

    // Function to change the content of svgNodes
    function modifyText(i, text) {
        svg.childNodes[i].innerHTML = text;
    }


    inputForm.addEventListener("submit", inputSubmit);

    function inputSubmit( evt ) {
        evt.preventDefault();
        return input.value;
    }


})();
