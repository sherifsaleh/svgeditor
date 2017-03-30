/***************** drag *****************/
export function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    console.log(event);
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
    //var dm = document.getElementsByClassName('node-active');
    var parentEle = dm.parentNode;

    //parentEle.setAttributeNS(null, 'style', 'color:' + 'red');

    //console.log(dm);
    //parentEle.setAttributeNS(null, 'style', 'left:' + event.clientX + 'px');

    //console.log(parentEle , event.clientX, event.clientY);
    //parentEle.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    //parentEle.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';

    // have to work on the forigner element wich has transform position
    //dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    //dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    //parentEle.setAttributeNS(null, 'transform', 'translate(' + 0 + ' ' + event.clientY + ')');

    event.preventDefault();
    return false;
}

document.body.addEventListener('dragover', drag_over, false);
document.body.addEventListener('drop', drop, false);

//export default [drag_start, drag_over, drop];
