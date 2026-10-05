/* inherited from search_elasticlunr.js */
import Fuse from '../plugins/fuse.min.js'

var suggestions = document.getElementById('suggestions');
var userinput = document.getElementById('userinput');

document.addEventListener('keydown', inputFocus);

function inputFocus(e) {

  if (e.keyCode === 191
      && document.activeElement.tagName !== "INPUT"
      && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    userinput.focus();
  }

  if (e.keyCode === 27 ) {
    userinput.blur();
    suggestions.classList.add('d-none');
  }

}

document.addEventListener('click', function(event) {

  var isClickInsideElement = suggestions.contains(event.target);

  if (!isClickInsideElement) {
    suggestions.classList.add('d-none');
  }

});

/*
Source:
  - https://dev.to/shubhamprakash/trap-focus-using-javascript-6a3
*/

document.addEventListener('keydown',suggestionFocus);

function suggestionFocus(e){
  const focusableSuggestions= suggestions.querySelectorAll('a');
  if (suggestions.classList.contains('d-none')
      || focusableSuggestions.length === 0) {
    return;
  }
  const focusable= [...focusableSuggestions];
  const index = focusable.indexOf(document.activeElement);

  let nextIndex = 0;

  if (e.keyCode === 38) {
    e.preventDefault();
    nextIndex= index > 0 ? index-1 : 0;
    focusableSuggestions[nextIndex].focus();
  }
  else if (e.keyCode === 40) {
    e.preventDefault();
    nextIndex= index+1 < focusable.length ? index+1 : index;
    focusableSuggestions[nextIndex].focus();
  }

}

/*
Source:
  - https://github.com/krisk/fuse
  - https://github.com/getzola/zola/blob/master/docs/static/search.js
*/
(function(){
  var fuse = new Fuse(window.searchIndex, {
    keys: ['title', 'description', 'body'],
    includeMatches: true,
  });
  userinput.addEventListener('input', show_results, true);
  suggestions.addEventListener('click', accept_suggestion, true);
  
  function show_results(){
    var value = this.value.trim();
    var results = fuse.search(value);
    console.log(results)

    var entry, childs = suggestions.childNodes;
    var i = 0, len = results.length;
    var items = value.split(/\s+/);
    suggestions.classList.remove('d-none');

    results.forEach(function(result) {
      if (result.item.body !== '') {
        entry = document.createElement('div');

        entry.innerHTML = '<a href><span></span><span></span></a>';
  
        var a = entry.querySelector('a');
        var t = entry.querySelector('span:first-child');
        var d = entry.querySelector('span:nth-child(2)');
        a.href = result.item.url;
        t.textContent = result.item.title;
        d.innerHTML = highlight(result.matches)
  
        suggestions.appendChild(entry);
      }
    });

    while(childs.length > len){
        suggestions.removeChild(childs[i])
    }

  }

  function accept_suggestion(){

      while(suggestions.lastChild){

          suggestions.removeChild(suggestions.lastChild);
      }

      return false;
  }

  function highlight(matches){
    for(var m in matches){
      var match = matches[m]
      var text = match['value']
      var indices = match['indices']
      var rendered = ''
      for(var i in indices){
        var ind = indices[i]
        if(rendered.length>0){
          rendered += '<br/>'
        }
        if(ind[0] - 12 > 0){
          rendered += '…'
        }
        rendered += text.substring(Math.max(0, ind[0] - 12), ind[0])
        rendered += '<b>'
        rendered += text.substring(ind[0], ind[1] + 1)
        rendered += '</b>'
        rendered += text.substring(ind[1] + 1, ind[1] + 12)
        if(ind[1] + 12 < text.length - 1){
          rendered += '…'
        }
      }
    }
    console.log(rendered)
    return rendered
  }
}());
