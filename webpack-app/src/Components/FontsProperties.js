import * as Config from './Config';
/***************** fonts name *****************/
let FontsProperties = (element, i) => {
    let fontFamily = element.getAttribute('font-family');
    // remove single quote from the font name
    let fontFamilyStr = fontFamily.replace(/'/g, '');
    let fontWeight = element.getAttribute('font-weight');


    checkInArray(Config.fontsArray, i, fontFamilyStr, fontWeight);
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

export default FontsProperties;
