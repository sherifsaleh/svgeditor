
    /***************** variables *****************/
    let svgNodes;
    let svgObj;
    let svgDoc;
    let svgLoaded; // SVG tag of loaded image

    let svgTexts; // SVG texts elements
    let fontsArray = []; // array to hold fonts names
    let txtBtn = document.getElementById('add-text-btn');
    let textEditingState = false;

    /********* load svg element to the page *********/
    // full details : https://css-tricks.com/ajaxing-svg-sprite/
    /*<object id="svg-image" type="image/svg+xml" data="images/FP-Botanical-150x210mm-Recto-01.svg"></object>*/
    let svgContainer = document.getElementById("svgContainer"); // get SVG Container Div
    let svgDiv = document.createElement("object"); // Create Object tag
    // set Attribute
    svgDiv.setAttribute("id", "svg-image");
    svgDiv.setAttribute("type", "image/svg+xml");
    //svgDiv.setAttribute("data", "images/FP-Botanical-150x210mm-Recto-01.svg"); // URL
    //svgDiv.setAttribute("data", "images/FP-Botanical-A5-Verso.svg"); // URL
    svgDiv.setAttribute("data", "images/std-recto.svg"); // URL
    svgContainer.appendChild(svgDiv); // Add to the HTML document
    let svgImg = document.getElementById('svg-image'); // it dose disappear after loading
    svgImg.addEventListener('load', function(event) { svgHandelLoad(event) }, false);



    let svgHandelLoad = function(event) {

        svgObj = event.currentTarget;
        svgDoc = svgObj.getSVGDocument();
        svgLoaded = svgDoc.childNodes[0];
        svgObj.parentNode.replaceChild(svgLoaded, svgObj);
        svgNodes = svgLoaded.childNodes;

        // for texts
        svgTexts = svgLoaded.getElementsByTagName("text");

        /***************** render text to be editable *****************/
        for (let i = 0; i < svgTexts.length; i++) {
            getFontsProperties(svgTexts[i], i);
            textEditable(svgTexts[i]);
        }
        /***************** load web fonts *****************/
        WebFont.load({
            google: {
                families: fontsArray
                //families: ['Open Sans:800,700', 'Great Vibes', 'Oswald:300']
            },
            active: function() {
            }
        });

        /***************** click events on the SVG *****************/
        // attach event to click to add text function
        svgLoaded.addEventListener("click", function(event){
          let el = event.target;

          // remove node-active class before assigning to the newly click node
          let activeNode = svgLoaded.getElementsByClassName("node-active");
          if (activeNode.length) {
              activeNode[0].classList.remove("node-active");
          }


          // if not clicked not text tag add new text node
          if ( el.tagName == 'TEXT'){
            // add class node-active to element to receive
            // modification colors and font properties
            // flash effect to alert active node to the user
            el.parentNode.classList += ' node-active';

          }else {
            addText(event, svgLoaded )
            el.classList.add('node-active');
          }
        }, false);
        /***************** editor panel *****************/

        // add fonts families
        let selectFont = document.getElementById('font-families');
        for (let font of fontsArray ) {
          let fontOption = document.createElement("a");
          fontOption.setAttribute("value", font);
          fontOption.setAttribute("name", font);
          fontOption.setAttribute("href", "#");
          fontOption.setAttribute("class", "list-group-item");
          fontOption.setAttribute("style", "font-family:" + font  );
          fontOption.innerHTML= font;
          selectFont.appendChild( fontOption );
        }

    }

    /***************** text editable *****************/
    // get every text tag in the SVG and wrap it with foreignObject
    // to add the ability to make text editable
    let textEditable = (element) => {
        // text attributes
        let bBox = element.getBBox(); // get coordinates // getBoundingClientRect() alternative fun
        let coordinates = element.getBoundingClientRect(); // get coordinates // getBoundingClientRect() alternative fun
        let matrix = element.getCTM(); // a,b,c,d,e,f
        let fontFamily = element.getAttribute('font-family');
        let fontSize = element.getAttribute('font-size');
        let fontWeight = element.getAttribute('font-weight');
        let fillColor = element.getAttribute('fill');
        let transform = element.getAttribute('transform');
        // node creating
        let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
        let textdiv = document.createElement("text");
        let elementText = element.innerHTML;
        let decoded = elementText.replace(/&amp;/g, '&');
        let textnode = document.createTextNode( decoded );

        // set Attribute to text
        textdiv.setAttribute("contentEditable", "true");
        textdiv.setAttribute("width", "auto");
        textdiv.appendChild(textnode);
        myforeign.setAttribute("width", "100%" ); // set width bBox.width
        myforeign.setAttribute("height", "100%" ); // set width
        textdiv.classList.add("insideforeign"); //to make div fit text
        // font properties
        myforeign.setAttributeNS(null, "font-size", fontSize);
        myforeign.setAttributeNS(null, "font-family", fontFamily);
        myforeign.setAttributeNS(null, "font-weight", fontWeight);
        if (fillColor) myforeign.setAttributeNS(null, "style", "color:" + fillColor);
        myforeign.classList.add("foreign"); //to make div fit text
        myforeign.setAttributeNS(null, "transform", "translate(" + 0 + " " + coordinates.top + ")");
        element.parentNode.replaceChild(myforeign, element);
        myforeign.appendChild(textdiv);
    }

    /***************** fonts name *****************/
    let getFontsProperties = (element, i) => {
       let fontFamily = element.getAttribute('font-family');
       // remove single quote from the font name
       let fontFamilyStr = fontFamily.replace(/'/g, "");
       let fontWeight = element.getAttribute('font-weight');


       checkInArray(fontsArray, i,fontFamilyStr, fontWeight);
    }


    /***************** check in array *****************/
    let checkInArray = ( arr, i, fontFamilyStr, fontWeight ) => {
      // check if fontWeight is not defined
      if( fontWeight == null ){
        // check if element isn't in the array push the element
        // push element without the font-weight option
        if ( arr.indexOf(fontFamilyStr) === -1 ) arr.push(fontFamilyStr)
      }
      // check if fontWeight is already defined
      else {
        // push element with the font-weight option
        // arr.indexOf(fontFamilyStr+':'+fontWeight) === -1
        if ( arr.indexOf(fontFamilyStr+':'+fontWeight) === -1 ) arr.push(fontFamilyStr+':'+fontWeight)
      }
    }


    /***************** add text *****************/
    // to check http://jsfiddle.net/brx3xm59/

    txtBtn.addEventListener('click', (event)=>{
      event.preventDefault();
      textEditingState = !textEditingState;
      if( textEditingState == true ){
        txtBtn.classList.add("btn-primary");
      }else {
        txtBtn.classList.remove("btn-primary");
      }
    }, false);


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
    let createText = debounce((localpoint, svg) => {
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
        myforeign.setAttributeNS(null, "transform", "translate(" + localpoint.x + " " + localpoint.y + ")");
        svg.appendChild(myforeign);
        myforeign.appendChild(textdiv);

    }, 100);

    // remove if no text entered
    let removeText = () => {

    };

    // add text function
    let addText = (event, svg) => {
        var localpoint = getLocalMouseCoord(event, svg);
        if ( textEditingState == true) {
            // add one text node
            createText(localpoint, svg);
            // turn off add text function
            textEditingState = false;
            // visual feedback
            txtBtn.classList.remove("btn-primary");
        }
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
            var context = this,
                args = arguments;
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
