

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

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
            var sanitizedRoom = escapeHtml(data.results[i].roomname);
            //var dataRoom = sanitizedRoom.split(' ').join('_')
            var dataRoom = sanitizedRoom.replace(/\s/g, '_');
            var user = "<div class = 'username' data-username = " + data.results[i].username + "><p>" + escapeHtml(data.results[i].username) + "</p></div>";
            var text = "<div class = 'text'><p>" + escapeHtml(data.results[i].text) + "</p></div>";
            var time = "<div class = 'time'><p>" + escapeHtml(data.results[i].createdAt) + "</p></div>";
            var room = "<div class = 'time'><p>" + sanitizedRoom + "</p></div>";
            $chat.append('<div class = "message" data-roomname='+dataRoom+'>' + user + time + text + room +'</div>')
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
      
        var user = "<div class = 'username'><p>" + message.username + "</p></div>";
        var text = "<div class = 'text'><p>" + message.text + "</p></div>";
        var room = "<div class = 'time'><p>" + message.roomname + "</p></div>";
        $chat.append('<div class = "message">' + user + room + text + '</div>')
      },

    addRoom: function(roomname) {
      $('#roomSelect').append('<div class = "room">' + roomname + '</div>');
    }, 

    addFriend : function(name){
      $.ajax({
        url: this.server,
        type: 'POST',
        data: JSON.stringify(name),
        success: function(data){
          console.log('Friend added')
        }, 
        error : function(data){
          console.log(data)
        }
      })
    },


};

$('document').ready(function(){
  $('body').on('click', '.username', function(){ app.addFriend($(this).data('username')) })

  $('.submit').on('click', function() {
    var message = {};
    message.time = new Date();
    message.username = 'Frank';
    message.text = $('.messageBody').val();
    console.log(message)
    app.send(message);
  });
});

app.fetch();
