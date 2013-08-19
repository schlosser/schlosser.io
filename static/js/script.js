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
                        $('#blog-posts h2').html('&#x25c0; Blog').wrap('<a id="blog-home-link" href="#">');
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
    $(document).on('click', '.internal-link', function(e){
        e.preventDefault();
        $($(this).attr('target')).click();        
    })
    
    //Main Content Tabs
    var animating = false;
    $('.nav').click(function(e){
        e.preventDefault();
        // $('html').css('min-height', $(document).height());
        if(animating || $(this).attr("disabled") == "disabled") {
            return;
        }
        animating = true;
        var id = $(this).attr('href');
        var callback = function() {
            $(id).slideDown('slow', function(){     
            });
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
        return false;
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
 });   
/*********************************************************************
*  #### Twitter Post Fetcher v10.0 ####
*  Coded by Jason Mayes 2013. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here: 
*  http://www.jasonmayes.com/projects/twitterApi/
*  Updates will be posted to this site.
*********************************************************************/
var twitterFetcher;
var twitterFetcher=function(){function x(e){return e.replace(/<b[^>]*>(.*?)<\/b>/gi,function(c,e){return e}).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,"")}function p(e,c){for(var g=[],f=RegExp("(^| )"+c+"( |$)"),a=e.getElementsByTagName("*"),h=0,d=a.length;h<d;h++)f.test(a[h].className)&&g.push(a[h]);return g}var y="",l=20,s=!0,k=[],t=!1,q=!0,r=!0,u=null,v=!0,z=!0,w=null,A=!0;return{fetch:function(e,c,g,f,a,h,d,b,m,n){void 0===g&&(g=20);void 0===f&&(s=!0);void 0===a&&(a=
!0);void 0===h&&(h=!0);void 0===d&&(d="default");void 0===b&&(b=!0);void 0===m&&(m=null);void 0===n&&(n=!0);t?k.push({id:e,domId:c,maxTweets:g,enableLinks:f,showUser:a,showTime:h,dateFunction:d,showRt:b,customCallback:m,showInteraction:n}):(t=!0,y=c,l=g,s=f,r=a,q=h,z=b,u=d,w=m,A=n,c=document.createElement("script"),c.type="text/javascript",c.src="//cdn.syndication.twimg.com/widgets/timelines/"+e+"?&lang=en&callback=twitterFetcher.callback&suppress_response_codes=true&rnd="+Math.random(),document.getElementsByTagName("head")[0].appendChild(c))},
callback:function(e){var c=document.createElement("div");c.innerHTML=e.body;"undefined"===typeof c.getElementsByClassName&&(v=!1);e=[];var g=[],f=[],a=[],h=[],d=0;if(v)for(c=c.getElementsByClassName("tweet");d<c.length;){0<c[d].getElementsByClassName("retweet-credit").length?a.push(!0):a.push(!1);if(!a[d]||a[d]&&z)e.push(c[d].getElementsByClassName("e-entry-title")[0]),h.push(c[d].getAttribute("data-tweet-id")),g.push(c[d].getElementsByClassName("p-author")[0]),f.push(c[d].getElementsByClassName("dt-updated")[0]);
d++}else for(c=p(c,"tweet");d<c.length;)e.push(p(c[d],"e-entry-title")[0]),h.push(c[d].getAttribute("data-tweet-id")),g.push(p(c[d],"p-author")[0]),f.push(p(c[d],"dt-updated")[0]),0<p(c[d],"retweet-credit").length?a.push(!0):a.push(!1),d++;e.length>l&&(e.splice(l,e.length-l),g.splice(l,g.length-l),f.splice(l,f.length-l),a.splice(l,a.length-l));c=[];d=e.length;for(a=0;a<d;){if("string"!==typeof u){var b=new Date(f[a].getAttribute("datetime").replace(/-/g,"/").replace("T"," ").split("+")[0]),b=u(b);
f[a].setAttribute("aria-label",b);if(e[a].innerText)if(v)f[a].innerText=b;else{var m=document.createElement("p"),n=document.createTextNode(b);m.appendChild(n);m.setAttribute("aria-label",b);f[a]=m}else f[a].textContent=b}b="";s?(r&&(b+='<div class="user">'+x(g[a].innerHTML)+"</div>"),b+='<p class="tweet">'+x(e[a].innerHTML)+"</p>",q&&(b+='<p class="timePosted">'+f[a].getAttribute("aria-label")+"</p>")):e[a].innerText?(r&&(b+='<p class="user">'+g[a].innerText+"</p>"),b+='<p class="tweet">'+e[a].innerText+
"</p>",q&&(b+='<p class="timePosted">'+f[a].innerText+"</p>")):(r&&(b+='<p class="user">'+g[a].textContent+"</p>"),b+='<p class="tweet">'+e[a].textContent+"</p>",q&&(b+='<p class="timePosted">'+f[a].textContent+"</p>"));A&&(b+='<p class="interact"><a href="https://twitter.com/intent/tweet?in_reply_to='+h[a]+'" class="twitter_reply_icon">Reply</a><a href="https://twitter.com/intent/retweet?tweet_id='+h[a]+'" class="twitter_retweet_icon">Retweet</a><a href="https://twitter.com/intent/favorite?tweet_id='+
h[a]+'" class="twitter_fav_icon">Favorite</a></p>');c.push(b);a++}if(null==w){e=c.length;g=0;f=document.getElementById(y);for(h="<ul>";g<e;)h+="<hr><li>"+c[g]+"</li>",g++;f.innerHTML=h+"<hr><li><a href='http://twitter.com/danrschlosser'>See more on Twitter...</a></li></ul>"}else w(c);t=!1;0<k.length&&(twitterFetcher.fetch(k[0].id,k[0].domId,k[0].maxTweets,k[0].enableLinks,k[0].showUser,k[0].showTime,k[0].dateFunction,k[0].showRt,k[0].customCallback,k[0].showInteraction),k.splice(0,1))}}}();
twitterFetcher.fetch('347442772464246785', 'tweets', 3, true, false, true, "default", false, null, false);

