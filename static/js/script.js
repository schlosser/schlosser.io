$(document).ready(function(){
    if (page !== "") {
        navToTab(page);
    }
    
    //Main Content Tabs
    $('.nav').click(function(e){
        e.preventDefault();
        var id = $(this).attr('href');
        navToTab(id);
    });
    
    function navToTab(id) {
        var callback = function() {
            $(id).slideDown();
        };
        var hash = window.location.hash;
        $('.content').slideUp(callback);
        var pageTitle= id + ' | Dan Schlosser';
        //var urlPath= id;
      //  window.history.pushState({"pageTitle":pageTitle},"", urlPath);
    }
    
    //Social Tabs
    $('social-content').slideUp();
    var isSocialHome = true;    
    $('#email-button').click(function(){
        if(isSocialHome){
            $('#email').slideDown();
            isSocialHome = false;
        }else {
            goSocialHome();
            if(!$('#email').is(":visible")){
                setTimeout(function(){$('#email').slideDown();}, 500);
            }else{
                isSocialHome=true;
        }}
    });
    $('#github-button').click(function(){
        if(isSocialHome){
            $('#github').slideDown();
            isSocialHome = false;
        }else {
            goSocialHome();
            if(!$('#github').is(":visible")){
                setTimeout(function(){$('#github').slideDown();}, 500);
            }else{
                isSocialHome=true;
        }}
    });
    $('#twitter-button').click(function(){
        if(isSocialHome){
            $('#twitter').slideDown();
            isSocialHome = false;
        }else {
            goSocialHome();
            if(!$('#twitter').is(":visible")){
                setTimeout(function(){$('#twitter').slideDown();}, 500);
            }else{
                isSocialHome=true;
        }}
    });
    $('#more-social-button').click(function(){
        if(isSocialHome){
            $('#more-social').slideDown();
            isSocialHome = false;
        }else {
            goSocialHome();
            if(!$('#more-social').is(":visible")){
                setTimeout(function(){$('#more-social').slideDown();}, 500);
            }else{
                isSocialHome=true;
        }}
    }); 
});

function goSocialHome(){
    
}





    //GitHub Configuration
    $(function() {
        $("#opensource-projects").loadRepositories("danrschlosser");
    });
    jQuery.githubUser = function(username, callback) {
      jQuery.getJSON("https://api.github.com/users/danrschlosser/repos?page=1&per_page=3", callback);
    }
    jQuery.fn.loadRepositories = function(username) {
      this.html("<span>Querying GitHub for " + "danrschlosser" +"'s repositories...</span>");
      var target = this;
      console.log("here");
      $.githubUser(username, function(data) {
        var repos = data;
        console.log(repos);
        sortByNumberOfWatchers(repos);
    
        var list = $('<div/>').addClass("github-repos");
        target.empty().append(list);
        list.append('<hr/>');
        $(repos).each(function() {
          list.append('<div class="social-update"><h5><a href="'+ this.url +'">' + this.name + 
          '</a></h5>' + this.description + '</div><hr/>');
        });
        list.append($('<a class="social-update" href="http://github.com/danrschlosser">See more on GitHub...</a>'));
      });
    
      function sortByNumberOfWatchers(repos) {
        repos.sort(function(a,b) {
          return b.watchers - a.watchers;
        });
      }
    };
    
    //Twitter Configuration
    $.getJSON(
        'http://api.twitter.com/1/statuses/user_timeline.json?callback=?&screen_name=danrschlosser&count=4',
        function (data)
        {
            var $tweets = $('#tweets');
            $tweets.empty();
            $tweets.append($('<hr/>'));
            if (data.length !== 0) {
                $.each(data, function (i, tweet)
                {
                    if (tweet.text !== undefined) {
                        var text = tweet.text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) { 
                            var wrap = document.createElement('div');
                            var anch = document.createElement('a');
                            anch.href = url;
                            anch.target = "_blank";
                            anch.innerHTML = url;
                            console.log(url);
                            wrap.appendChild(anch);
                            return wrap.innerHTML;
                        });
                        text = text.replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2" target="_blank">@$2</a>');
                        text = text.replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank">#$2</a>');
                        $tweets.append($('<div class="social-update">' + text + '</div>'));
                        $tweets.append($("<div>").addClass("post-time")
                            .html($('<a>')
                            .text($.timeago(tweet['created_at']))
                            .attr('href', 'https://twitter.com/danrschlosser/status/' + data['id_str'])));
                        $tweets.append($('<hr/>'));
                    }
                });
            } else {
                $tweets.append($('<div class="social-update">No recent tweets</div>'));
            }
            $tweets.append($('<a class="social-update" href="http://www.twitter.com/danrschlosser">View more tweets...</a>'));
        }
    );