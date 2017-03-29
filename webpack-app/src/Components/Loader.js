//export default 'hello';
import SvgHandelLoad from './SvgHandelLoad';
let Loader = ()=>{
  let svgDiv = document.createElement('object'); // Create Object tag
  svgDiv.setAttribute('id', 'svg-image');   // set Attribute id
  svgDiv.setAttribute('type', 'image/svg+xml'); // set Attribute type
  svgDiv.setAttribute('data', './src/images/card.svg'); // set Attribute data URL
  svgContainer.appendChild(svgDiv); // Add to the HTML document
  let svgImg = document.getElementById('svg-image'); // it dose disappear after loading
  svgImg.addEventListener('load', function(event) {SvgHandelLoad(event)}, false);
}
export default Loader;
