(function() {

    // load web fonts
    WebFont.load({
        google: {
            families: ['Oswald:300', 'Great Vibes', 'Open Sans:800']
        }
    });


    // variables
    let svgNodes;
    let svgObj;
    let svgDoc;
    let svg;
    let modifyTextState;

    // DOM elements
    let inputForm   = document.getElementById("text-editor");
    let input       = document.getElementById('text-editor__input');
    let svgImg      = document.getElementById('svg-image');


    // load svg element to the page
    // full details : https://css-tricks.com/ajaxing-svg-sprite/
    svgImg.addEventListener('load', function(e) {
        svgObj = e.currentTarget;
        svgDoc = svgObj.getSVGDocument();
        svg = svgDoc.childNodes[0];
        svgObj.parentNode.replaceChild(svg, svgObj);
        svgNodes = svg.childNodes;


        // attach event to every node and return a function
        for (let i = 0; i < svgNodes.length; i++) {
            svgNodes[i].addEventListener("click", function() { svgNodeClicker(i, svgNodes[i] ) }, false);
        }


        // Function to change the content of svgNodes
        // curring because we are gathering elements from two functions
        // svgNodes clicked and inputSubmit
        let modifyText =
            (svg) =>
                (elementId) =>
                    (elementText) =>
                        svg.childNodes[elementId].innerHTML = elementText;
        // let modifyText = (i, text) => {
        //     svg.childNodes[i].innerHTML = text;
        //     console.log( svg );
        // }

        //modifyText(svg)(3)('hello');


        // function get the clicked node
        let svgNodeClicker = (i, svgNode ) => {

            // add class of selected element
            input.value = svgNode.innerHTML;

            // do some logic
            // show editor
            // on editor submit update node with value
            modifyTextState = modifyText(svg)(i);
            // define type of clicked node
            // call right function if text or graphical element or image
        }

        // listen to form submit
        inputForm.addEventListener("submit", inputSubmit, false );

        function inputSubmit( evt ) {
            evt.preventDefault();
            modifyTextState( input.value );
        }

    }, false);
})();
