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
    /*********************************************************************
	*  #### Twitter Post Fetcher v7.0 ####
	*  Coded by Jason Mayes 2013. A present to all the developers out there.
	*  www.jasonmayes.com
	*  Please keep this disclaimer with my code if you use it. Thanks. :-)
	*  Got feedback or questions, ask here: 
	*  http://www.jasonmayes.com/projects/twitterApi/
	*  Updates will be posted to this site.
	*********************************************************************/
	var twitterFetcher = function () {
	    function t(d) {
	        return d.replace(/<b[^>]*>(.*?)<\/b>/gi, function (c, d) {
	            return d
	        }).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi, "")
	    }
	
	    function m(d, c) {
	        for (var f = [], e = RegExp("(^| )" + c + "( |$)"), g = d.getElementsByTagName("*"), b = 0, a = g.length; b < a; b++) e.test(g[b].className) && f.push(g[b]);
	        return f
	    }
	    var u = "",
	        j = 20,
	        n = !0,
	        h = [],
	        p = !1,
	        k = !0,
	        l = !0,
	        q = null,
	        r = !0;
	    return {
	        fetch: function (d, c, f, e, g, b, a) {
	            void 0 === f && (f = 20);
	            void 0 === e && (n = !0);
	            void 0 === g && (g = !0);
	            void 0 === b && (b = !0);
	            void 0 === a && (a = "default");
	            p ? h.push({
	                id: d,
	                domId: c,
	                maxTweets: f,
	                enableLinks: e,
	                showUser: g,
	                showTime: b,
	                dateFunction: a
	            }) : (p = !0, u = c, j = f, n = e, l = g, k = b, q = a, c = document.createElement("script"), 
	            c.type = "text/javascript", 
	            c.src = "//cdn.syndication.twimg.com/widgets/timelines/" + d + "?&lang=en&callback=twitterFetcher.callback&suppress_response_codes=true&rnd=" + Math.random(), 
	            document.getElementsByTagName("head")[0].appendChild(c))
	        },
	        callback: function (d) {
	            var c = document.createElement("div");
	            c.innerHTML = d.body;
	            "undefined" ===
	                typeof c.getElementsByClassName && (r = !1);
	            var f = d = null,
	                e = null;
	            r ? (d = c.getElementsByClassName("e-entry-title"), f = c.getElementsByClassName("p-author"), e = c.getElementsByClassName("dt-updated")) : (d = m(c, "e-entry-title"), f = m(c, "p-author"), e = m(c, "dt-updated"));
	            for (var c = [], g = d.length, b = 0; b < g;) {
	                if ("string" !== typeof q) {
	                    var a = new Date(e[b].getAttribute("datetime").replace(/-/g, "/").replace("T", " ").split("+")[0]),
	                        a = q(a);
	                    e[b].setAttribute("aria-label", a);
	                    if (d[b].innerText)
	                        if (r) e[b].innerText = a;
	                        else {
	                            var s = document.createElement("p"),
	                                v = document.createTextNode(a);
	                            s.appendChild(v);
	                            s.setAttribute("aria-label", a);
	                            e[b] = s
	                        } else e[b].textContent = a
	                }
	                n ? (a = "", l && (a += '<div class="user">' + t(f[b].innerHTML) + "</div>"), a += '<p class="tweet">' + t(d[b].innerHTML) + "</p>", k && (a += '<p class="timePosted">' + e[b].getAttribute("aria-label") + "</p>")) : d[b].innerText ? (a = "", l && (a += '<p class="user">' + f[b].innerText + "</p>"), a += '<p class="tweet">' + d[b].innerText + "</p>", k && (a += '<p class="timePosted">' + e[b].innerText + "</p>")) : (a = "", l && (a += '<p class="user">' + f[b].textContent +
	                    "</p>"), a += '<p class="tweet">' + d[b].textContent + "</p>", k && (a += '<p class="timePosted">' + e[b].textContent + "</p>"));
	                c.push(a);
	                b++
	            }
	            c.length > j && c.splice(j, c.length - j);
	            d = c.length;
	            f = 0;
	            e = document.getElementById(u);
	            for (g = "<ul>"; f < d;) g += "<li>" + c[f] + "</li>", f++;
	            e.innerHTML = g + "</ul>";
	            p = !1;
	            0 < h.length && (twitterFetcher.fetch(h[0].id, h[0].domId, h[0].maxTweets, h[0].enableLinks, h[0].showUser, h[0].showTime, h[0].dateFunction), h.splice(0, 1))
	        }
	    }
	}();
    twitterFetcher.fetch('347442772464246785', 'tweets', 3, true);
});