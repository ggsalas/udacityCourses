
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var $street = $('#street').val();
    var $city = $('#city').val();
    var adress =  $street +', ' + $city;
    
    $greeting.text('¿Querés vivir en ' + adress + '?');
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + adress + '" alt="background" >');

    // New york Times 
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    var apiNYT = '3e7e7db331184d64be485dfd1681f4eb';
    url += '?' +  $.param({
                    'api-key': apiNYT,
                    'q': $city 
                  });

    $.getJSON(url, function(data){
      $nytHeaderElem.text('New York Times Articles about ' + $city);      
      var items = [];
      // iterate
      $.each( data.response.docs, function( key ) {
        items.push( '<li id="' + key + '"><a href="' + this.web_url + '" target="_blank">' +  this.headline.main  + '"</a><p>' + this.snippet + '</p></li>' );
      });
     
      // append and envolve with ul
      $( "<ul/>", {
        "class": "article-list",
        html: items.join( "" )
      }).appendTo( '#nytimes-articles' );
    })
      .error(function(){
        $nytHeaderElem.text('Can\'t load articles'); 
      });

    // Wikipedia
    var wikiRequestTimeout = setTimeout(function(){ // to eror handling
      $wikiElem.text('Not able to load wiki links');
    }, 8000);

    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+$city+'&format=json&callback=wikiCallback',
      dataType: 'jsonp',
    })
      .done(function(response) {
        var articleList = response[1];
        for (var i = 0; i < articleList.length; i++){
          $wikiElem.append('<li><a href="https://en.wikipedia.org/wiki/'+articleList[i]+'">'+articleList[i]+'</a></li>');
        }
        // remove error habdling because is ok
        clearTimeout(wikiRequestTimeout);
      })

    return false;
};



$('#form-container').submit(loadData);
