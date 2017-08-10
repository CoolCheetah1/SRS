const cv = require('opencv');
let img, r, g, b;

var rows, columns;
var mat = new cv.Matrix(rows, columns);

console.log(mat.shape);
cv.readImage(img, r, g, b, function(err, img, r, g, b){

    if(err) {
        throw new Error('something wrong before this');
    }

    const width = img.width();
    const height = img.height();

    if (width < 1 || height < 1) {
        throw new Error('Image has no size');

    }

    // do some cool stuff with image - i.e. go through it row by row and pixel by 

    let channels = img.channels();
    let nRows = img.rows;
    let nColumns = img.cols * channels;
    var p;
    var j;
    var count = 0;
    var start, end;
    var row = 0
    
    while(row<nRows){
        p = img.ptr(row);
        count = 0

        // count the number of highlighted pixels in the row
        for (var i = 0; i < nColumns-3; i += 3) {
            if(p[i] == b && p[i+1] == g && p[i+2] == r){
                count++;
            }
        }

        // if no highlighted pixels are found, set the row white

        if(count === 0){
            for (var i = 0; i < nColumns; i++) {
                p[i] = 255;
            }
        } else{
            start = row;
        }

        // if highlighted pixels are found, continue until a row where there aren't any

        while (count > 0) {
            count = 0;
            if (row + 1 < nRows) {
                row++;
                p = img.ptr(row);

                for (var i = 0; i < nColumns - 3; i++) {
                    if(p[i] == b && p[i+1] == g && p[i+2] == r){
                        count++;
                    }
                }
            }

            // a highlighted row has been found ==> set the areas of the row that are not highlighted to white
            if (count == 0) {
                row --;
                end = row;
                p = img.ptr(end);

                //for each pixel in a row
                for (var i = 0; i < nColumns - 3; i += 3) {
                    //Don't understand this now

                    if(p[i] != b || p[i+1] != g || p[i+2] != r){
                        for(var i = start; j < end+1; ++j){
                            p = img.ptr(j);
                            p[i] = 255;
                            p[i+1] = 255;
                            p[i+2] = 255;
                        }
                    }       
                }
            }
        }
        row ++;
    }

    // remove all highlighting, leaving only the text that was highlighted
    for (var row = 0; row < nRows; ++row){
        p = img.row;
        for (var i = 0; i < nColumns - 3; i += 3) {
            if (p[i] == b && p[i+1] == g && p[i+2] == r) {
                p[i] = 255;
                p[i+1] = 255;
                p[i+2] = 255;
            }
        }
    }
    
    img.convertGrayscale();

    // save image
    img.save('new.jpg');
});