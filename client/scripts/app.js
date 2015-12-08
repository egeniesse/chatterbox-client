

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

var app = {
    roomCache: {},
    friendCache: {},
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
      var counter = 0;
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: this.server,
        type: 'GET',
        //data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          var $chat = $('#chats');
          console.log(data);
          $chat.children().remove();

          for (var i = 0; i < data.results.length; i++){

            var sanitizedRoom = escapeHtml(data.results[i].roomname);
            //var dataRoom = sanitizedRoom.split(' ').join('_')
            var dataRoom = sanitizedRoom.replace(/\s/g, '_');
            var user = "<div class = 'username' data-username = " + data.results[i].username + "><p>" + escapeHtml(data.results[i].username) + "</p></div>";
            var text = "<div class = 'text'><p>" + escapeHtml(data.results[i].text) + "</p></div>";
            var time = "<div class = 'time'><p>" + escapeHtml(data.results[i].createdAt) + "</p></div>";
            var room = "<div class = 'time'><p>" + sanitizedRoom + "</p></div>";
            $chat.append('<div class = "message '+dataRoom+'">' + user + time + text + room +'</div>')
            if(!app.roomCache[sanitizedRoom]){
              app.roomCache[sanitizedRoom] = true;
              $('.menu ul').append('<li class = "childLi">' + dataRoom + '</li>');
            }
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
        $chat.prepend('<div class = "message">' + user + room + text + '</div>')
      },

    addRoom: function(roomname) {
      $('.menu ul').append('<li class = "childLi">' + roomname + '</li>');
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

  $('#send .submit').on('click', function() {
    var message = {};
    message.time = new Date();
    message.username = 'Frank';
    message.text = $('.messageBody').val();
    console.log(message)
    app.send(message);
  });

  $('.refresh').on('click', function(){ app.fetch()})
  
  $('body').on('mouseEnter',$('.menu li'),function(){
    $('.childLi').show();
  });

   $('body').on('mouseexit', $('.childLi'), function(){hide()});
  

  $('body').on('click', '.menu li', function(){
    //console.log($(this).text())
    if($(this).text().replace(/ /g, '') === 'Home') { // home is broken TODO
      $('#chats').children().show();
    } else {
      showSelectedRoom($(this).text());
    }
  });
});
//setInterval(function(){ app.fetch() }, 1000);
//app.fetch();
var showSelectedRoom = function(room){
  $('#chats').children().hide();
  var dataRoom = room.replace(/\s/g, '_');
  $('.'+dataRoom).show();
}



