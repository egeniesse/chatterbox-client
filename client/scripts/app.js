var app = {
    //
    server: 'https://api.parse.com/1/classes/chatterbox',

    init: function(){},

    send: function(message){
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: this.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });
    },

    fetch: function() {
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: this.server,
        type: 'GET',
        //data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          var $chat = $('#chats');
          for (var i = 0; i < data.results.length; i++){
            var user = "<div class = 'user'><p>" + data.results[i].username + "</p></div>";
            var text = "<div class = 'text'><p>" + data.results[i].text + "</p></div>";
            var time = "<div class = 'time'><p>" + data.results[i].createdAt + "</p></div>";
            $chat.append('<div class = "message">' + user + time + text + '</div>')
          }
          // var test = '<div>' + data.results[0] + '<div>';
          //append to the dom
          // $('.messageContainer').append(test);
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to get message');
        }
      });
    },

    clearMessages: function() {
      $('#chats').html('')
    },

    addMessage: function(message) {
      var $chat = $('#chats');
      
        var user = "<div class = 'user'><p>" + message.username + "</p></div>";
        var text = "<div class = 'text'><p>" + message.text + "</p></div>";
        var time = "<div class = 'time'><p>" + message.roomname + "</p></div>";
        $chat.append('<div class = "message">' + user + time + text + '</div>')
      },

    addRoom: function(roomname) {
      $('#roomSelect').append('<div>' + roomname + '</div>');
    }

    // $('document').ready(function(){

    // });

}
