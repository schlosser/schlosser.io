$(document).ready(function(){
    
    //Slashes to Hashes
    if(page === "") {
        window.location.hash="home";
    }
    else {
        var pages = ['home', 'about', 'projects', 'resources', 'blog'];
        if(pages.indexOf(page) >= 0) {
            console.log("failure")
            function capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            var title = capitalize(page)+'| Dan Schlosser';
            var new_url = '/#'+page;
            window.history.pushState({id:page}, title, new_url);
        }
        else {
            console.log("success!");
            var title = 'Dan Schlosser';
            var new_url = '/#home';
            window.history.pushState({id:page}, title, new_url);
        }
    }

    //Page Load Animation
    setTimeout(function(){
        var current_hash = window.location.hash;
        $(current_hash).slideDown('slow');
        $(current_hash+'-button').attr("disabled", "disabled");
        $('#email').slideDown('slow');        
    }, 1000);
    
    //Main Content Tabs
    $('.nav').click(function(e){
        e.preventDefault();
        var id = $(this).attr('href');
        var callback = function() {
            $(id).slideDown();
            window.location.hash=id;
            $(id+"-button").attr("disabled", "disabled");
        };
        var hash = window.location.hash;
        if (hash) {
            $(hash).slideUp(function(){
                callback();
            });
        } else{
            callback();
        }
        $(hash+"-button").removeAttr("disabled");
     });
    
    //Social Tabs
    $('.social-content').hide();
    $('.social-button').click(function(){
        var id = $(this).data('target');
        console.log("first");
        $('.social-content').slideUp();
        setTimeout(function(){
            console.log("second");
            $(id).slideDown();
        }, 500);    
    });
    


    //GitHub Configuration
    $(function() {
        $("#opensource-projects").loadRepositories("danrschlosser");
    });
    jQuery.githubUser = function(username, callback) {
      jQuery.getJSON("https://api.github.com/users/danrschlosser/repos?page=1&per_page=3", callback);
    }
    jQuery.fn.loadRepositories = function(username) {
      this.html("<span>Querying GitHub for " + "danrschlosser" +"'s repositories...</span>");
      var target = this
      $.githubUser(username, function(data) {
        var repos = data;
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
});