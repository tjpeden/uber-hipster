/* Author: TJ Peden */

/*
(function($) {
  function Workflow(options) {
    this.selected = null;
    this.options = options;
    
    this.select(options.start)
  }
  
  var methods = {
    select: function(id) {
      this.id = id;
      this.selected = $('#' + id);
      return this;
    },
    watch: function() {
      var self = this;
      this.selected.find(':input').change(function(event) {
        var result = false;
        self.selected.find(':input').each(function(index, element){
          result = result & (self.options[self.id][$(this).attr('id')])
        });
      });
      return self;
    },
    
  }
  
  $.extend(Workflow.prototype, methods);
})(jQuery);
*/

(function() {
  jQuery(function($) {
    $('header h1').click(function() {
      window.location.reload();
    });
    
    $('a[data-remote]').click(function(e) {
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
    
    $("#presets li a:first-child")
        .live('ajax:success', function(event, data, status, xhr) {
          $('#presets').html(data);
        })
        .live('ajax:error', function(event, error, status, xhr) {
          console.log(error);
        });
      
    $("#presets li a:last-child")
      .live('ajax:success', function(event, data, status, xhr) {
        $('#description').html(data.description);
      })
      .live('ajax:error', function(event, error, status, xhr) {
        console.log(error);
      });
    
    $("#copy-button").zclip({
      path: '/javascripts/ZeroClipboard.swf',
      copy: function() {
        return $("#description").html();
      },
      afterCopy: function() {
        $("#description").html('');
      }
    });
  });
})();