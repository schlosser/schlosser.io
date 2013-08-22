$(function(){
 // From Flask:
 //
 // var page = the /directory of the page linked 
 // var linked_post_id = the id of the format 2013-05-09 in /blog/post-2013-05-09
 // var post_ids = ['2013-05-09', '2013-04-16',...]
    var current_hash = window.location.hash;

    var hashIsPartOfBlog = function(string) {
        return (string.substring(0,5) === "#blog");
    }
    var hashIsBlogPost = function(string) {
        return (string.substring(0,11) === "#blog/post-")
    }

    var animating = false;
    var executeSlide = function(elementsToHide, elementsToShow, elementsToSlideUp, elementsToSlideDown, shouldHideBackArrow, shouldShowBackArrow, postIdToWrap, postIdToUnwrap) {   
        console.log("----------------\nExecuting slide with variables:");
        console.log("elementsToHide: ", elementsToHide);
        console.log("elementsToShow: ", elementsToShow);
        console.log("elementsToSlideUp: ", elementsToSlideUp);
        console.log("elementsToSlideDown: ", elementsToSlideDown);
        console.log("shouldHideBackArrow: ", shouldHideBackArrow);
        console.log("shouldShowBackArrow: ", shouldShowBackArrow);
        console.log("postIdToWrap: ", postIdToWrap);
        console.log("postIdToUnwrap: ", postIdToUnwrap);
        var callback = function() {
            if(shouldHideBackArrow) {
                $("#blog-posts-title").html('Blog').unwrap();

            } else if (shouldShowBackArrow) {
                $('#blog-posts-title').html('&#x25c0; Blog').wrap('<a id="blog-home-link" class="page-link" href="#blog">');
            }
            if(postIdToWrap) {
                $("."+postIdToWrap+".post-title").wrap('<a class="'+postIdToWrap+' internal-link " data-target=".'+postIdToWrap+'.page-link" href="#">');
            }
            if(postIdToUnwrap) {
                $("."+postIdToUnwrap+".post-title").unwrap();
            }
            if(elementsToHide) {
                elementsToHide.hide();
            }
            if(elementsToShow) {
                elementsToShow.show(); 
            }
            // This is not wrapped in ifelse because if you don't have elements to slide down I don't know what you're doing here...
            elementsToSlideDown.slideDown("slow", function() {
                current_hash = window.location.hash;
                animating = false;
            });
        }
        if (elementsToSlideUp) {
            $(elementsToSlideUp).slideUp('slow').promise().done(callback);
        } else {
            callback();
        }
    }

    var changeToHash = function(newHash) {
        if(!newHash) {
            newHash = "#home";
        }
        console.log("----------------\nChanging hash:")
        console.log("current_hash = " + current_hash);
        console.log("newHash = " + newHash);
        
        if(animating){return;} // Currenly animating, return.
        animating = true;

        var elementsToHide = $("");
        var elementsToShow = $("");
        var elementsToSlideUp;
        var elementsToSlideDown;
        var shouldShowBackArrow = false;
        var shouldHideBackArrow = false;
        var postIdToWrap = null;
        var postIdToUnwrap = null;
        if (hashIsBlogPost(current_hash)) {
            // Starting from /#blog/post-YYYY-MM-DD
            var old_post_id = current_hash.substr(11); //YYYY-MM-DD
            if (!hashIsBlogPost(newHash)) {
                // Lose the back arrow, because wherever you're going isn't a post.
                shouldHideBackArrow = true;
                postIdToWrap = old_post_id;

                // If you're not going to a post, all hidden divs should be hidden.
                elementsToHide = $(".hidden");

                if (hashIsPartOfBlog(newHash)){
                    // Should slide up the hidden part of the currently displayed blog post
                    elementsToSlideUp = $("."+old_post_id+".hidden");
                } 
                else {
                    //The entire blog will slide up, hide the hidden part of all posts and show the other posts and this post's "See more..." link
                    elementsToSlideUp = $("#blog");
                    elementsToShow = $("."+old_post_id+".page-link, #"+post_ids.join(", #"));
                }
            } else {
                // Moving between posts, slide up the entire post. Make sure to hide the hidden part, so it is not shown in the /#blog view.
                elementsToSlideUp = $("#"+old_post_id);
                elementsToHide = $("."+old_post_id+".hidden");
            }
        } else if(current_hash === "#blog" && hashIsBlogPost(newHash)) {
            //slide up all the other posts, and this post's "See more..." link
            var new_post_id = newHash.substr(11); //YYYY-MM-DD
            var post_ids_to_slide_up = post_ids.slice();
            post_ids_to_slide_up.splice(post_ids.indexOf(new_post_id), 1);
            elementsToSlideUp = $("."+new_post_id+".page-link, #"+post_ids_to_slide_up.join(", #"));
        } else {
            //just slide up the current page, going from /#page to /#page
            elementsToSlideUp = $(current_hash);
        }
        if (hashIsBlogPost(newHash)){
            var new_post_id = newHash.substr(11); //YYYY-MM-DD
            if (hashIsBlogPost(current_hash)) {
                // Moving between posts, slideUp and hide are set. Slide down the entire new post, after showing the hidden div and hiding it's "See more..." link.  Show the current post's "See more..." link.  Don't change the back arrow, is already there.
                if(newHash != current_hash) {
                    var old_post_id = current_hash.substr(11); //YYYY-MM-DD
                    elementsToShow = $("."+new_post_id+".hidden, ."+old_post_id+".page-link");
                    elementsToHide = $("."+new_post_id+".page-link");
                } else {
                    elementsToShow = $("."+new_post_id+".hidden");
                    elementsToHide = $("."+new_post_id+".page-link");
                }
                elementsToSlideDown = $("#"+new_post_id);
            } else {
                // Add the back arrow.
                shouldShowBackArrow = true;
                postIdToUnwrap = new_post_id;

                if (current_hash === "#blog") {
                    //nothing needs to be hidden or shown, but slide down the hidden div of the new post.
                    elementsToSlideDown = $("."+new_post_id+".hidden");
                } else {
                    // Going to /#blog/post-YYYY-MM-DD from a page other than a blog, so slide down the whole blog. Hide the new post's "See more..." link and all other posts, and show the full current post
                    var post_ids_to_hide = post_ids.slice();
                    post_ids_to_hide.splice(post_ids.indexOf(new_post_id), 1);
                    elementsToHide = $("."+new_post_id+".page-link, #"+post_ids_to_hide.join(", #")); 
                    elementsToShow = $("."+new_post_id+".hidden");
                    elementsToSlideDown = $("#blog");
                }   
            }
        } else if(hashIsPartOfBlog(newHash)){
            //But the hidden divs should be hidden!
            elementsToHide = $(".hidden");

            if(hashIsBlogPost(current_hash)) {
                // Going back from a post to the blog page, slide down all the other posts.
                var old_post_id = current_hash.substr(11); //YYYY-MM-DD
                var post_ids_to_slide_down = post_ids.slice();
                post_ids_to_slide_down.splice(post_ids.indexOf(old_post_id), 1);
                elementsToSlideDown = $("."+old_post_id+".page-link, #"+post_ids_to_slide_down.join(", #"));
            } else {
                // Going from a /#page to /#blog, slide down the whole blog. 
                elementsToSlideDown = $("#blog");
            }
        } else {
            //Going to a /#page, slide it down.
            elementsToSlideDown = $(newHash);
        }
        //Disable and enable nav buttons appropriately.
        $(".nav").removeAttr("disabled");
        if(hashIsPartOfBlog(newHash)) {
            $("#blog-button").attr("disabled", 'disabled');
        } else {
            $(newHash+"-button").attr("disabled", 'disabled');
        }
        executeSlide(elementsToHide, elementsToShow, elementsToSlideUp, elementsToSlideDown, shouldHideBackArrow, shouldShowBackArrow, postIdToWrap, postIdToUnwrap);
    }

    var pages = ['home', 'about', 'projects', 'resources', 'blog'];
    var capitalize = function(string) {
        return string.charAt(0).toUpperCase()+string.slice(1);
    }
    if(post_ids.indexOf(linked_post_id.substr(5))>=0){
        var title = capitalize("Blog");
        var new_url = "/#blog/"+linked_post_id;
        window.history.pushState({id:linked_post_id}, "title", new_url);
    }
    else if(page === "" && pages.indexOf(window.location.hash.slice(1)) < 0 && !hashIsBlogPost(window.location.hash)) {
        //the url = http://danrs.ch/ and the hash is not of the form #blog/post-*
        window.location.hash = "home";
    }
    else if(page !== ""){
        if(pages.indexOf(page) >= 0) {
            //the url = http://danrs.ch/page/
            var title = capitalize(page)+'| Dan Schlosser';
            var new_url = '/#'+page;
            window.history.pushState({id:page}, "title", new_url);
        }
        else {
            //the url = http://danrs.ch/invalid/
            var title = 'Dan Schlosser';
            var new_url = '/#home';
            window.history.pushState({id:page}, title, new_url);
        }
    }
    changeToHash(window.location.hash);

    //Page Load Animation
    setTimeout(function(){
        var elementsToHide = $("");
        var elementsToShow = $("");
        var elementsToSlideDown;
        var postIdToUnwrap = null;
        var shouldShowBackArrow = false;
        if (hashIsBlogPost(current_hash)) {
            var new_post_id = current_hash.substr(11);
            var post_ids_to_hide = post_ids.slice();
            post_ids_to_hide.splice(post_ids.indexOf(new_post_id), 1);
            elementsToHide = $("#"+new_post_id+"-page-link, #"+post_ids_to_hide.join(", #"));
            elementsToShow = $("."+new_post_id+".hidden");
            $("#blog-button").attr("disabled", "disabled");
            shouldShowBackArrow = true;
            postIdToUnwrap = new_post_id;
            elementsToSlideDown = $("#blog");
        } else {
            $(current_hash+'-button').attr("disabled", "disabled");
            elementsToSlideDown = $(current_hash);
        }
        executeSlide(elementsToHide, elementsToShow, null, elementsToSlideDown, false, shouldShowBackArrow, null, postIdToUnwrap);
        $('#email').slideDown('slow');        
    }, 100);

    // Buttons that make pages slide
    $('.page-link').click(function(e){
        e.preventDefault();

        if(animating){return;} // Currenly animating, return.

        if($(this).attr("disabled") != "disabled") {
            var hash = $(this).attr('href');
            window.location.hash = hash;  
        }
    });

    $(window).on('hashchange', function() {
        if(animating){return;} // Currenly animating, return.

        // Does this get called on page load and if so fix that.
        changeToHash(window.location.hash);
    });
   
    //Internal Linking
    $(document).on('click', '.internal-link', function(e){
        e.preventDefault();
        $($(this).data('target')).click();        
    })
    
    //Social Tabs
    $('.social-content').hide();
    $('.social-button').click(function(){
        var id = $(this).data('target');
        $('.social-content').slideUp('slow');
        setTimeout(function(){
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
      this.html("<span>Querying GitHub for "+"danrschlosser" +"'s repositories...</span>");
      var target = this
      $.githubUser(username, function(data) {
        var repos = data;
        sortByNumberOfWatchers(repos);
    
        var list = $('<div/>').addClass("github-repos");
        target.empty().append(list);
        list.append('<hr/>');
        $(repos).each(function() {
          list.append('<div class="social-update"><h5><a href="'+ this.url +'">'+this.name+
          '</a></h5>'+this.description+'</div><hr/>');
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
var twitterFetcher=function(){function x(e){return e.replace(/<b[^>]*>(.*?)<\/b>/gi,function(c,e){return e}).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,"")}function p(e,c){for(var g=[],f=RegExp("(^| )"+c+"( |$)"),a=e.getElementsByTagName("*"),h=0,d=a.length;h<d;h++)f.test(a[h].className)&&g.push(a[h]);return g}var y="",l=20,s=!0,k=[],t=!1,q=!0,r=!0,u=null,v=!0,z=!0,w=null,A=!0;return{fetch:function(e,c,g,f,a,h,d,b,m,n){void 0===g&&(g=20);void 0===f&&(s=!0);void 0===a&&(a=
!0);void 0===h&&(h=!0);void 0===d&&(d="default");void 0===b&&(b=!0);void 0===m&&(m=null);void 0===n&&(n=!0);t?k.push({id:e,domId:c,maxTweets:g,enableLinks:f,showUser:a,showTime:h,dateFunction:d,showRt:b,customCallback:m,showInteraction:n}):(t=!0,y=c,l=g,s=f,r=a,q=h,z=b,u=d,w=m,A=n,c=document.createElement("script"),c.type="text/javascript",c.src="//cdn.syndication.twimg.com/widgets/timelines/"+e+"?&lang=en&callback=twitterFetcher.callback&suppress_response_codes=true&rnd="+Math.random(),document.getElementsByTagName("head")[0].appendChild(c))},
callback:function(e){var c=document.createElement("div");c.innerHTML=e.body;"undefined"===typeof c.getElementsByClassName&&(v=!1);e=[];var g=[],f=[],a=[],h=[],d=0;if(v)for(c=c.getElementsByClassName("tweet");d<c.length;){0<c[d].getElementsByClassName("retweet-credit").length?a.push(!0):a.push(!1);if(!a[d]||a[d]&&z)e.push(c[d].getElementsByClassName("e-entry-title")[0]),h.push(c[d].getAttribute("data-tweet-id")),g.push(c[d].getElementsByClassName("p-author")[0]),f.push(c[d].getElementsByClassName("dt-updated")[0]);
d++}else for(c=p(c,"tweet");d<c.length;)e.push(p(c[d],"e-entry-title")[0]),h.push(c[d].getAttribute("data-tweet-id")),g.push(p(c[d],"p-author")[0]),f.push(p(c[d],"dt-updated")[0]),0<p(c[d],"retweet-credit").length?a.push(!0):a.push(!1),d++;e.length>l&&(e.splice(l,e.length-l),g.splice(l,g.length-l),f.splice(l,f.length-l),a.splice(l,a.length-l));c=[];d=e.length;for(a=0;a<d;){if("string"!==typeof u){var b=new Date(f[a].getAttribute("datetime").replace(/-/g,"/").replace("T"," ").split("+")[0]),b=u(b);
f[a].setAttribute("aria-label",b);if(e[a].innerText)if(v)f[a].innerText=b;else{var m=document.createElement("p"),n=document.createTextNode(b);m.appendChild(n);m.setAttribute("aria-label",b);f[a]=m}else f[a].textContent=b}b="";s?(r&&(b+='<div class="user">'+x(g[a].innerHTML)+"</div>"),b+='<p class="tweet">'+x(e[a].innerHTML)+"</p>",q&&(b+='<p class="timePosted">'+f[a].getAttribute("aria-label")+"</p>")):e[a].innerText?(r&&(b+='<p class="user">'+g[a].innerText+"</p>"),b+='<p class="tweet">'+e[a].innerText+
"</p>",q&&(b+='<p class="timePosted">'+f[a].innerText+"</p>")):(r&&(b+='<p class="user">'+g[a].textContent+"</p>"),b+='<p class="tweet">'+e[a].textContent+"</p>",q&&(b+='<p class="timePosted">'+f[a].textContent+"</p>"));A&&(b+='<p class="interact"><a href="https://twitter.com/intent/tweet?in_reply_to='+h[a]+'" class="twitter_reply_icon">Reply</a><a href="https://twitter.com/intent/retweet?tweet_id='+h[a]+'" class="twitter_retweet_icon">Retweet</a><a href="https://twitter.com/intent/favorite?tweet_id='+
h[a]+'" class="twitter_fav_icon">Favorite</a></p>');c.push(b);a++}if(null==w){e=c.length;g=0;f=document.getElementById(y);for(h="<ul>";g<e;)h+="<hr><li>"+c[g]+"</li>",g++;f.innerHTML=h+"<hr><li><a href='http://twitter.com/danrschlosser'>See more on Twitter...</a></li></ul>"}else w(c);t=!1;0<k.length&&(twitterFetcher.fetch(k[0].id,k[0].domId,k[0].maxTweets,k[0].enableLinks,k[0].showUser,k[0].showTime,k[0].dateFunction,k[0].showRt,k[0].customCallback,k[0].showInteraction),k.splice(0,1))}}}();
twitterFetcher.fetch('347442772464246785', 'tweets', 3, true, false, true, "default", false, null, false);

