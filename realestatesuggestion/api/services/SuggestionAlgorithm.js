/**
 * Created by mhh on 11/1/2016.
 */
function SuggestionAlgorithm() {

}

SuggestionAlgorithm.prototype.algorithm = function (location, size,res) {
  console.log("Searching with: location: " + location + " size: " + size);

  sails.controllers.realestate.suggestPriceInner(size, location, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      if (data != undefined) {
        console.log("Number of real estates used in suggestion: " + data.length);
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
          sum += parseInt(data[i].price);
        }
        var suggestedPrice=sum/data.length;
        console.log("Suggested price: "+suggestedPrice);
        SearchHistory.create({
          suggestedPrice:suggestedPrice,
          landType:"Wohnung",
          locatedArea:location,
          searchDate:"05/12/2016",
          realEstate:JSON.stringify(data)
        }).exec(function (err,finn) {
          if(err){
            console.log("Error in writing to database for suggestion process: " + err);
          }
          else{
            console.log(JSON.stringify(data));
            console.log(finn);
            //res.json({suggested:finn,realEstates:data});
            var re=JSON.parse(finn.realEstate);
            console.log("Arrayed items:"+re[0]);
            res.redirect('/suggestResult?id=' + finn.id);
          }
        });

      }
    }
  });
  return "location: " + location + " size: " + size;
}

module.exports = SuggestionAlgorithm;
