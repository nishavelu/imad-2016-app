function escapeHTML (text)
  {
 -    var $text = document.createTextNode(html);
 +    var $text = document.createTextNode(text);
      var $div = document.createElement('div');
      $div.appendChild($text);
      return $div.innerHTML;
