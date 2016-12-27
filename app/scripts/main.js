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
    let inputForm = document.getElementById("text-editor");
    let input = document.getElementById('text-editor__input');
    let svgImg = document.getElementById('svg-image');


    // load svg element to the page
    // full details : https://css-tricks.com/ajaxing-svg-sprite/
    svgImg.addEventListener('load', function(e) {
        svgObj = e.currentTarget;
        svgDoc = svgObj.getSVGDocument();
        svg = svgDoc.childNodes[0];
        svgObj.parentNode.replaceChild(svg, svgObj);
        svgNodes = svg.childNodes;

        // start the program
        functionality.init();
    }, false);

    let functionality = {
        init: () => {
            // initialize submission
            functionality.submission();
            // attach event to every node and return a function
            for (let i = 0; i < svgNodes.length; i++) {
                svgNodes[i].addEventListener("click", function() { functionality.svgNodeClicks(i, svgNodes[i]) }, false);
            }
        },
        svgNodeClicks: (i, svgNode) => {

            // add class of selected element
            input.value = svgNode.innerHTML;

            // on editor submit update node with value
            modifyTextState = functionality.textEdit(svg)(i);

        },
        textEdit: (svg, elementId, elementText) => {
            // Function to change the content of svgNodes
            // curring because we are gathering elements from two functions
            // svgNodes clicked and inputSubmit
            let modifyText =
                (svg) =>
                    (elementId) =>
                        (elementText) => svg.childNodes[elementId].innerHTML = elementText;

            return modifyText;
        },
        submission: () => {
            // listen to form submit
            inputForm.addEventListener("submit", inputSubmit, false);

            function inputSubmit(evt) {
                evt.preventDefault();
                modifyTextState(input.value);
            }
        }
    }
})();
