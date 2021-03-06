/***************** load web fonts *****************/
WebFont.load({
    google: {
        //families: fontsArray
        families: ['Open Sans:800,700', 'Great Vibes', 'Oswald:300', 'Elsie:900']
    },
    active: function() {

        let svgContainer = document.getElementById('svgContainer'); // get SVG Container Div
        if (svgContainer) {
            /***************** variables *****************/
            let svgNodes;
            let svgObj;
            let svgDoc;

            let svgLoaded; // SVG tag of loaded image

            let svgTexts; // SVG texts elements
            let fontsArray = []; // array to hold fonts names
            let txtBtn = document.getElementById('add-text-btn');
            let colorPickerBtn = document.getElementById('colorPicker');
            let textLeft = document.getElementById('text-left');
            let textRight = document.getElementById('text-right');
            let textCenter = document.getElementById('text-center');
            let textEditingState = false;

            /********* load svg element to the page *********/
            // full details : https://css-tricks.com/ajaxing-svg-sprite/
            /*<object id="svg-image" type="image/svg+xml" data="images/FP-Botanical-150x210mm-Recto-01.svg"></object>*/
            let svgDiv = document.createElement('object'); // Create Object tag
            // set Attribute
            svgDiv.setAttribute('id', 'svg-image');
            svgDiv.setAttribute('type', 'image/svg+xml');
            //svgDiv.setAttribute("data", "images/FP-Botanical-150x210mm-Recto-01.svg"); // URL
            //svgDiv.setAttribute("data", "images/FP-Botanical-A5-Verso.svg"); // URL
            svgDiv.setAttribute('data', 'images/std-recto.svg'); // URL
            svgContainer.appendChild(svgDiv); // Add to the HTML document
            let svgImg = document.getElementById('svg-image'); // it dose disappear after loading
            svgImg.addEventListener('load', function(event) { svgHandelLoad(event) }, false);


            let svgHandelLoad = function(event) {

                svgObj = event.currentTarget;
                svgDoc = svgObj.getSVGDocument();
                svgLoaded = svgDoc.childNodes[0];
                svgObj.parentNode.replaceChild(svgLoaded, svgObj);
                svgNodes = svgLoaded.childNodes;

                let activeNode = svgLoaded.getElementsByClassName('node-active');


                // for texts
                svgTexts = svgLoaded.getElementsByTagName('text');

                /***************** render text to be editable *****************/
                for (let i = 0; i < svgTexts.length; i++) {
                    getFontsProperties(svgTexts[i], i);
                    textEditable(svgTexts[i], i);
                }


                /***************** click events on the SVG *****************/
                // attach event to click to add text function
                svgLoaded.addEventListener('click', function(event) { svgClicker(event) }, false);
                let svgClicker = (event) => {
                    let el = event.target;

                    let activeNode = svgLoaded.getElementsByClassName('node-active');

                    // remove node-active class before assigning to the newly click node
                    if (activeNode.length) activeNode[0].classList.remove('node-active');

                    // if not clicked not text tag add new text node
                    if (el.tagName == 'TEXT') {
                        // add class node-active to element to receive
                        // modification colors and font properties
                        // flash effect to alert active node to the user
                        let elementParent = el.parentNode;
                        elementParent.classList += ' node-active';
                        // set selected text color to the color picker
                        let nodeColor = elementParent.style.color;
                        if (nodeColor.length) {
                            colorPickerBtn.setAttribute('value', rgb2hex(nodeColor))
                        } else {
                            // set color to black
                            colorPickerBtn.setAttribute('value', '#000000');
                        }
                    } else {
                        addText(event, svgLoaded)
                        el.classList.add('node-active');

                        // set selected text color to the color picker
                        let nodeColor = el.getAttribute('fill');

                        if (nodeColor != null) {
                            colorPickerBtn.setAttribute('value', nodeColor)
                        }
                    }
                }


                svgLoaded.addEventListener('dragstart', drag_start, false);


                /***************** editor panel *****************/

                // add fonts families
                let selectFontDiv = document.getElementById('font-families');
                for (let font of fontsArray) {
                    let fontOption = document.createElement('a');
                    let withNoDigits = font.replace(/[0-9]/g, '');
                    let fontName = withNoDigits.replace(':', '');

                    fontOption.setAttribute('value', fontName);
                    fontOption.setAttribute('name', fontName);
                    fontOption.setAttribute('href', '#');
                    fontOption.setAttribute('class', 'list-group-item');
                    fontOption.setAttribute('style', 'font-family:' + fontName);


                    fontOption.innerHTML = '' + fontName + '';
                    selectFontDiv.appendChild(fontOption);
                }
                selectFontDiv.addEventListener('click', (event) => { assignFontFamily(event) }, false)
                let assignFontFamily = (event) => {
                    event.preventDefault();

                    let element = event.target;
                    let fontValue = element.getAttribute('value');

                    if (activeNode.length) {
                        if (activeNode[0].tagName == 'foreignObject') {
                            activeNode[0].setAttributeNS(null, 'font-family', '' + fontValue + '');
                        }
                    }
                }
            }

            /***************** text editable *****************/
            // get every text tag in the SVG and wrap it with foreignObject
            // to add the ability to make text editable
            let textEditable = (element, i) => {
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
                let textdiv = document.createElement('text');
                let elementText = element.innerHTML;
                let decoded = elementText.replace(/&amp;/g, '&');
                let textnode = document.createTextNode(decoded);

                //console.log( element.getBoundingClientRect().width  );
                // set Attribute to text
                textdiv.setAttribute('contentEditable', 'true');
                textdiv.setAttribute('draggable', 'true');
                textdiv.setAttribute('width', 'auto');
                textdiv.appendChild(textnode);
                myforeign.setAttribute('width', '100%'); // set width bBox.width
                //myforeign.setAttribute('width', element.getBoundingClientRect().width + 'px'); // set width bBox.width
                myforeign.setAttribute('height', '100%'); // set width
                textdiv.classList.add('insideforeign'); //to make div fit text
                textdiv.setAttribute('id', 'text' + i); //to make div fit text
                // font properties
                myforeign.setAttributeNS(null, 'font-size', fontSize);
                myforeign.setAttributeNS(null, 'font-family', fontFamily);
                myforeign.setAttributeNS(null, 'font-weight', fontWeight);
                if (fillColor) myforeign.setAttributeNS(null, 'style', 'color:' + fillColor);
                myforeign.classList.add('foreign'); //to make div fit text        matrix.f = top
                myforeign.setAttributeNS(null, 'transform', 'translate(' + 0 + ' ' + matrix.f + ')');
                //myforeign.setAttributeNS(null, 'y',  bBox.y );

                //myforeign.setAttributeNS(null, 'transform',  element.getAttribute('transform') );

                element.parentNode.replaceChild(myforeign, element);
                myforeign.appendChild(textdiv);
            }

            /***************** drag *****************/
            function drag_start(event) {
                var style = window.getComputedStyle(event.target, null);
                event.dataTransfer.setData("text/plain",
                    (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
            }

            function drag_over(event) {
                event.preventDefault();
                return false;
            }

            function drop(event) {
                var offset = event.dataTransfer.getData("text/plain").split(',');
                var dm = document.getElementById('text4');
                var parentEle = dm.parentNode;

                //parentEle.setAttributeNS(null, 'style', 'color:' + 'red');


                //parentEle.setAttributeNS(null, 'style', 'left:' + event.clientX + 'px');

                console.log(event.clientX, event.clientY);
                //parentEle.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
                //parentEle.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';

                // have to work on the forigner element wich has transform position
                dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
                dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
                event.preventDefault();
                return false;
            }

            document.body.addEventListener('dragover', drag_over, false);
            document.body.addEventListener('drop', drop, false);

            /***************** fonts name *****************/
            let getFontsProperties = (element, i) => {
                let fontFamily = element.getAttribute('font-family');
                // remove single quote from the font name
                let fontFamilyStr = fontFamily.replace(/'/g, '');
                let fontWeight = element.getAttribute('font-weight');


                checkInArray(fontsArray, i, fontFamilyStr, fontWeight);
            }


            /***************** check in array *****************/
            let checkInArray = (arr, i, fontFamilyStr, fontWeight) => {
                // check if fontWeight is not defined
                if (fontWeight == null) {
                    // check if element isn't in the array push the element
                    // push element without the font-weight option
                    if (arr.indexOf(fontFamilyStr) === -1) arr.push(fontFamilyStr)
                }
                // check if fontWeight is already defined
                else {
                    // push element with the font-weight option
                    // arr.indexOf(fontFamilyStr+':'+fontWeight) === -1
                    if (arr.indexOf(fontFamilyStr + ':' + fontWeight) === -1) arr.push(fontFamilyStr + ':' + fontWeight)
                }
            }


            /***************** add text *****************/
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
            let addText = (event, svg) => {
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


            /***************** algin *****************/
            textLeft.addEventListener('click', function(event) { alignSet(event, 'left') }, false);
            textRight.addEventListener('click', function(event) { alignSet(event, 'right') }, false);
            textCenter.addEventListener('click', function(event) { alignSet(event, 'Center') }, false);
            //colorPickerBtn.onchange = (event) => { colorSet(event)};
            let alignSet = (event, textDirection) => {
                let activeNode = svgLoaded.getElementsByClassName('node-active');
                if (activeNode[0].tagName == 'foreignObject') {
                    activeNode[0].style.textAlign = textDirection;
                }
            }

            /***************** colors *****************/
            colorPickerBtn.addEventListener('change', function(event) { colorSet(event) }, false);
            //colorPickerBtn.onchange = (event) => { colorSet(event)};
            let colorSet = (event) => {
                    let element = event.target;
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
            let rgb2hex = (rgb) => {
                    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

                    function hex(x) {
                        return ('0' + parseInt(x).toString(16)).slice(-2);
                    }
                    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
                }
                /***************** debounce *****************/
                // https://davidwalsh.name/javascript-debounce-function
                // Returns a function, that, as long as it continues to be invoked, will not
                // be triggered. The function will be called after it stops being called for
                // N milliseconds. If `immediate` is passed, trigger the function on the
                // leading edge, instead of the trailing.
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
        }
    }
});
