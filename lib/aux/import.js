var GoogleSpreadsheet = require("google-spreadsheet");

var my_sheet = new GoogleSpreadsheet('1DKTFmVjyRZU8sNPrGD1kRB2uSjfJNqv9YHw2COmQJys');

// without auth -- read only
// # is worksheet id - IDs start at 1
my_sheet.getRows( 1, function(err, row_data){
    console.log( 'pulled in '+row_data.length + ' rows ');
    console.log(row_data);
})