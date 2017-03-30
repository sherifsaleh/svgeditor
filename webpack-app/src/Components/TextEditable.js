/***************** text editable *****************/
// get every text tag in the SVG and wrap it with foreignObject
// to add the ability to make text editable
let TextEditable = (element, i) => {
    // text attributes
    let fontFamily = element.getAttribute('font-family');
    let fontSize = element.getAttribute('font-size');
    let fontWeight = element.getAttribute('font-weight');
    let fillColor = element.getAttribute('fill');


    /***************** different ways to get text location  *****************/
    let bBox = element.getBBox(); // get coordinates // getBoundingClientRect() alternative fun
    let matrix = element.getCTM(); // a,b,c,d,e,f
    //let coordinates = element.getBoundingClientRect(); // get coordinates // getBoundingClientRect() alternative fun
    let objTransform = element.getAttribute('transform');
    //let objClean =  objTransform.replace(/[a-zA-Z]+|[\(]+|[\)]+/g,'').replace(/(\.\d+)+/,'').replace(/(\.\d+)+/,'');
    //let objMatrix = objClean.match(/[a-zA-Z]+|[0-9]+/g);

    //console.log('martix: ', matrix, 'bBox: ', bBox, 'objMatrix: ', objMatrix, 'coordinates: ', coordinates);

    // node creating
    let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    let textdiv = document.createElement('text');
    let elementText = element.innerHTML;
    let decoded = elementText.replace(/&amp;/g, '&');
    let textnode = document.createTextNode(decoded);

    //console.log( element.getBoundingClientRect().width  );
    // set Attribute to text
    textdiv.setAttribute('contentEditable', 'false');
    textdiv.setAttribute('draggable', 'true');
    textdiv.setAttribute('width', 'auto');
    textdiv.appendChild(textnode);
    //myforeign.setAttribute('width', '100%'); // set width bBox.width
    myforeign.setAttribute('width', bBox.width); // set width bBox.width
    myforeign.setAttribute('height', '100%'); // set width
    textdiv.classList.add('insideforeign'); //to make div fit text
    textdiv.setAttribute('id', 'text' + i); //to make div fit text
    // font properties
    myforeign.setAttributeNS(null, 'font-size', fontSize);
    myforeign.setAttributeNS(null, 'font-family', fontFamily);
    myforeign.setAttributeNS(null, 'font-weight', fontWeight);
    if (fillColor) myforeign.setAttributeNS(null, 'style', 'color:' + fillColor);
    myforeign.classList.add('foreign'); //to make div fit text        matrix.f = top
    //myforeign.setAttributeNS(null, 'transform', 'translate(' + 0 + ' ' + matrix.f + ')');
    myforeign.setAttributeNS(null, 'transform', objTransform);
    myforeign.setAttributeNS(null, 'y',  bBox.y );

    element.parentNode.replaceChild(myforeign, element);
    myforeign.appendChild(textdiv);
}
export default TextEditable;
