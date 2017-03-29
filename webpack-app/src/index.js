import WebFont from './Components/Webfontloader';
import Loader from './Components/Loader';
import * as Config from './Components/Config';
/***************** load web fonts *****************/
WebFont.load({
    google: {
        families: Config.fontsArray
        //families: ['Open Sans:800,700', 'Great Vibes', 'Oswald:300', 'Elsie:900', 'Pacifico']
    },
    active: function() {
      Loader();
    }
});
