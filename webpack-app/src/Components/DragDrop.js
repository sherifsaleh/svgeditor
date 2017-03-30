let activeNode = document.getElementsByClassName('node-active');
let dragData;
/***************** drag *****************/
export function drag_start(event) {
    let element = event.target;
    let elementParent = element.parentNode;
    dragData = event;
    //console.log('before: ', event);


    event.dataTransfer.setData("text/plain", event.target.id);
    //event.setData('text', 'foo');

    // remove node-active class before assigning to the newly click node
    if (activeNode.length) activeNode[0].classList.remove('node-active');

    if( elementParent.tagName == 'foreignObject'){
        elementParent.classList += ' node-active';
        activeNode = elementParent;
    }
    let style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
}

function drag_over(event) {
    event.preventDefault();
    return false;
}

function drop(event) {
    event.preventDefault();
    let dropData = event; //.split(',');
    //let dm = document.getElementById('text4');
    let element = event.target;


    let matrix = activeNode.getCTM();
    let xNewValue = matrix.e - ( dragData.x - dropData.x ); // -  - matrix.e ;
    let yNewValue = dropData.y - dragData.y;
    //console.log('after: ', event);


    console.log( xNewValue, dragData.x, dropData.x );





    //activeNode.setAttributeNS(null, 'transform', event.x);
    activeNode.setAttributeNS(null, 'transform', 'translate(' +   xNewValue  + ' ' + 184 + ')');


    // let activeNode = svgLoaded.getElementsByClassName('node-active');

    //parentEle.setAttributeNS(null, 'transform', 'translate(' + event.clientX + ' ' + event.clientY + ')');

    // if(parentEl.tagName == 'foreignObject'){

    // }


    //parentEle.setAttributeNS(null, 'style', 'color:' + 'red');

    //console.log(dm);
    //parentEle.setAttributeNS(null, 'style', 'left:' + event.clientX + 'px');

    //console.log(parentEle , event.clientX, event.clientY);
    //parentEle.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    //parentEle.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';

    //dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    //dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';

    event.preventDefault();
    return false;
}

document.body.addEventListener('dragover', function(event){
  drag_over(event);
}, false);
document.body.addEventListener('drop', function(event){
  drop(event)
}, false);

//export default [drag_start, drag_over, drop];
