/**
 * Created by mhh on 11/19/2016.
 */

$( document ).ready(function () {
  //Getting some information for the Collect Information tab
  $.ajax({
    type: 'Get',
    url: '/GetCollectHistory',
    success: function (data) {
      if(data!=undefined){
        if(data[0]!=undefined){
          var updatedDate=new Date(data[0].createdAt);
          $('#divLastConnected').text("Last collection happened on: " + getStandardDateTime(updatedDate));
        }
      }

    },
    error: function (data) {
      alert('Error in calling GetCollectHistory.');
      console.log(data);
    }
  });

  //Getting Number of real estates in the database
  $.ajax({
    type: 'Get',
    url: '/realestatenumber',
    success: function (data) {
      if(data!=undefined){

        $('#divRealEstatesNumber').text("Number of real estates: " + data);
        // if(data[0]!=undefined){
        //   var updatedDate=new Date(data[0].createdAt);
        //   $('#divLastConnected').text("Last collection happened on: " + getStandardDateTime(updatedDate));
        // }
      }

    },
    error: function (data) {
      alert('Error in calling GetCollectHistory.');
      console.log(data);
    }
  });

});

function performCollecting() {
  var keyword = $('#txtKeyWord').val();

  $.ajax({
    type: 'Get',
    url: '/search',
    data: {areaName: keyword},
    success: function (data) {
      $('#divLastConnected').text("Last collection happened on: " + getStandardDateTime(new Date()));
    },
    error: function (data) {
      alert('Error in calling the data collector.');
      console.log(data);
    }
  });
}

function getStandardDateTime(dateTime) {
  var currentdate = dateTime
  var standatrdDay = currentdate.getDate() < 10 ? "0" + currentdate.getDate() : currentdate.getDate();
  var standardMonth = (currentdate.getMonth() + 1) < 10 ? "0" + (currentdate.getMonth() + 1 ) : (currentdate.getMonth() + 1);
  var standardHour = currentdate.getHours() < 10 ? "0" + currentdate.getHours() : currentdate.getHours();
  var standatrdMinute = currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
  var standatrdSecond = currentdate.getSeconds() < 10 ? "0" + currentdate.getSeconds() : currentdate.getSeconds();
  var datetime = standatrdDay + "/"
    + (standardMonth ) + "/"
    + currentdate.getFullYear() + " "
    + standardHour + ":"
    + standatrdMinute + ":"
    + standatrdSecond;
  return datetime
}
