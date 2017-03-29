import * as Config from './Config';
import TextEditable from './TextEditable';
import FontsProperties from './FontsProperties';
import DragDrop from './DragDrop';
import * as ColorPicking from './ColorPicking';
import * as TextAdding from './TextAdding';

let SvgHandelLoad = function(event) {
    let svgObj = event.currentTarget;
    let svgDoc = svgObj.getSVGDocument();
    let svgLoaded = svgDoc.childNodes[0];
    svgObj.parentNode.replaceChild(svgLoaded, svgObj);
    let svgNodes = svgLoaded.childNodes;
    let activeNode = svgLoaded.getElementsByClassName('node-active');
    svgLoaded.setAttribute('id', "card1");
    /***************** general variables *****************/
    let svgTexts = svgLoaded.getElementsByTagName('text'); // for texts

    /***************** render text to be editable *****************/
    for (let i = 0; i < svgTexts.length; i++) {
        FontsProperties(svgTexts[i], i);
        TextEditable(svgTexts[i], i );
    }


    /***************** click events on the SVG *****************/
    // attach event to click to add text function
    svgLoaded.addEventListener('click', function(event) {svgClicker(event)}, false);
    let svgClicker = (event) =>{
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
                ColorPicking.pickerBtn.setAttribute('value', ColorPicking.rgb2hex(nodeColor))
            } else {
                // set color to black
                ColorPicking.pickerBtn.setAttribute('value', '#000000');
            }
        } else {
            TextAdding.addText(event, svgLoaded)
            el.classList.add('node-active');

            // set selected text color to the color picker
            let nodeColor = el.getAttribute('fill');

            if (nodeColor != null) {
                ColorPicking.pickerBtn.setAttribute('value', nodeColor)
            }
        }
    }


    svgLoaded.addEventListener('dragstart',DragDrop.drag_start,false);

    /***************** editor panel *****************/
    // add fonts families
    let selectFontDiv = document.getElementById('font-families');
    for (let font of Config.fontsArray) {
        let fontOption = document.createElement('a');
        let withNoDigits = font.replace(/[0-9]/g, '');
        let fontName = withNoDigits.replace(':', '');

        fontOption.setAttribute('value', fontName);
        fontOption.setAttribute('name', fontName);
        fontOption.setAttribute('href', '#');
        fontOption.setAttribute('class', 'list-group-item');
        fontOption.setAttribute('style', 'font-family:' + fontName);


        fontOption.innerHTML = ''+fontName+'';
        selectFontDiv.appendChild(fontOption);
    }
    selectFontDiv.addEventListener('click', (event)=>{ assignFontFamily(event) }, false)
    let assignFontFamily = (event)=> {
        event.preventDefault();
        let element = event.target;
        let fontValue = element.getAttribute('value');

        if( activeNode.length ){
            if (activeNode[0].tagName == 'foreignObject') {
                activeNode[0].setAttributeNS(null, 'font-family', ''+fontValue+'' );
            }
        }
    }
}
export default SvgHandelLoad;
