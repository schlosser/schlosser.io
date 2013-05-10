$(function(){
    
    //blog rendering
    var all_blog_posts = [];
    var single_post_id = "";
    var blog_dir = "static/blog/";
    $.get(blog_dir+"file_list.txt", function(data){
        $.each(data.split("\n").sort().reverse(), function(i, val){
            if(!val) return;
            all_blog_posts.push("post-"+val.slice(0, -5))
            $.get(blog_dir+val, function(data){
                data = data.replace("<h3>", "<h3 class='post-title'>")
                           .replace("<em>", "<em class='post-date'>");
                var post_id = "post-"+val.slice(0, -5);
                var $post = $('<div>', {"class":"post", html:data, "id":post_id});
                var paragraphs = $post.children('p')
                paragraphs.slice(2).hide();
                $post.append($('<a>', {"class":"see-more", html:"See more &hellip;", href:"#", click:function(e){
                    e.preventDefault();
                    var $this = $(this);
                    var $others = $('#blog-posts hr:not(:first), .post:not(#' + post_id + ')');
                    single_post_id = post_id;
                    var callback = function(){
                        $('#blog-posts h2').html('&#x25c0 Blog').wrap('<a id="blog-home-link" href="#">');
                        $this.hide();                                
                        var slice = paragraphs.slice(2);
                        slice.wrapAll('<div class="extra-wrapper">').slideDown();
                    };
                    if ($others.length) {
                        $others.slideUp();
                        window.setTimeout(callback, 500);
                    }
                    else {
                        callback();
                    }
                }}));
                $('#blog-posts').append($('<hr/>'));
                $('#blog-posts').append($post);               
            });
        });
    });
    $(document).on('click','#blog-home-link', function(e){
        e.preventDefault();
        $(this).children('h2').html('Blog');
        if(!single_post_id) return;
        var $post = $('#'+single_post_id);
        var $others = $('#blog-posts hr:not(:first), .post:not(#' + single_post_id + ')');        
        $('.see-more').slideDown();
        var $extras = $post.children('.extra-wrapper').slideUp(function(){
            $('.extra-wrapper p:first-child').unwrap();
            $('#blog-posts-title').unwrap();
            $post.children('p').slice(2).hide();
            $others.slideDown();
        }); 
    });
    
    
    
    //Konami Code
    $('.konami-box').hide();
    //Breaks mobile
    /* function rotate() {
        var $konami = $("#konami");
        rotate(0);
        function rotate(degree) {        
            $konami.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});  
            $konami.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});                      
            timer = setTimeout(function() {
                rotate(++degree);
            },5);
        };
    };
    var konami = new Konami(function(){
        $('.konami-box').show(rotate) //<--breaks mobile
    });   */
    
    //Slashes to Hashes
    
    setTimeout(function(){
        if(all_blog_posts.indexOf(linked_post_id)>=0){
            $("#"+linked_post_id+" .see-more").click();
        }
    }, 1000);
    var pages = ['home', 'about', 'projects', 'resources', 'blog'];
    if(page === "" && pages.indexOf(window.location.hash.slice(1)) < 0) {
        window.location.hash="home";
    }
    else if(page !== ""){
        if(pages.indexOf(page) >= 0) {
            function capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            var title = capitalize(page)+'| Dan Schlosser';
            var new_url = '/#'+page;
            window.history.pushState({id:page}, title, new_url);
        }
        else {
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
    }, 100);
    
    //Internal Linking
    $('.internal-link').click(function(e){
        e.preventDefault();
        $($(this).attr('target')).click();
    });
    
    
    //Main Content Tabs
    var animating = false;
    $('.nav').click(function(e){
        e.preventDefault();
        if(animating || $(this).attr("disabled") == "disabled") {
            return;
        }
        animating = true;
        var id = $(this).attr('href');
        var callback = function() {
            $(id).slideDown('slow');
            window.location.hash=id;
            $(id+"-button").attr("disabled", "disabled");
            animating = false;
        };
        var hash = window.location.hash;
        if (hash) {
            $(hash).slideUp('slow', callback);
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
        $('.social-content').slideUp('slow');
        setTimeout(function(){
            console.log("second");
            $(id).slideDown('slow');
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