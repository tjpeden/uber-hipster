(function() {
  jQuery(function($) {
    $('a[data-remote]').live('click', function(e) {
      e.preventDefault();
      var element = $(this);
      var url = element.attr('href');
      var method = element.data('method');
      var type = element.data('type');
      var $confirm = element.data('confirm');
      
      if(!$confirm || confirm($confirm)) {
        $.ajax({
          url: url,
          type: method || 'get',
          dataType: type,
          cache: false,
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [error, status, xhr]);
          }
        });
      }
    });
    
    $("#notes a.delete")
    .live('ajax:success', function(event, data, status, xhr) {
      $('#notes').html(data);
    })
    .live('ajax:error', function(event, error, status, xhr) {
      console.log(error);
    });
    
    $("#notes a.star")
    .live('ajax:success', function(event, data, status, xhr) {
      $('#notes').html(data);
    })
    .live('ajax:error', function(event, error, status, xhr) {
      console.log(error);
    });
      
    $("#notes a.show")
    .live('ajax:success', function(event, data, status, xhr) {
      $('#description').html(data.description);
    })
    .live('ajax:error', function(event, error, status, xhr) {
      console.log(error);
    });
    
    $('#copyText').click(function(event) {
      // http://code.google.com/chrome/extensions/manifest.html#permissions
      var node = document.createElement('div');
      var selection = window.getSelection();
      var range = document.createRange();
      document.designMode = "On";
      
      $(node).html( $('textarea').text() ).appendTo(document.body);
      
      range.setStart(node, 0);
      range.setEnd(node, 1);
      
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy', false, null);
      
      selection.removeAllRanges();
      $(node).remove();
      document.designMode = "Off";
	  });
  });
})();