var searchBox = document.getElementById("searchBox");
var autocompleteList = document.getElementById("autocompleteList");


var autocompleteData = [];

d3.csv("data/data_stop.csv", function(d) {
    return d;
    }).then(function(data) {
    autocompleteData = data.map(function(d) {
    return d.stop_name;
    });
    console.log(autocompleteData)
    });





searchBox.addEventListener("input", function() {
  var input = searchBox.value.toLowerCase();
  var autocompleteSuggestions = autocompleteData.filter(function(item) {
    return item.toLowerCase().startsWith(input);
  });

  displayAutocompleteSuggestions(autocompleteSuggestions);
});

function displayAutocompleteSuggestions(suggestions) {
  autocompleteList.innerHTML = "";
  suggestions.forEach(function(suggestion) {
    var li = document.createElement("li");
    li.textContent = suggestion;
    li.addEventListener("click", function() {
      searchBox.value = suggestion;
      autocompleteList.innerHTML = "";
    });
    autocompleteList.appendChild(li);
  });
}
