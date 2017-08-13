Published on August 11, 2017.

It started with a website. It usually does with me, but in this particular case it started with a client's website. I was working on behalf of [Minimill](/teams/minimill), building a site for Albert Wengers latest book, [World After Capital](https://worldaftercapital.org/). It was a simple static site: a handful of HTML pages with some shared CSS. 

I had finished the basic implementation, but I felt something was missing. It needed motion. The design used a small set of design components across all of the pages. A blue (and sometimes white) background, a striking yellow book cover, and a consistent navigation in the upper right.

[ images here ]

I wanted to create animations between each page, each component morphing into different forms as you switch between them. However, this presented a problem. Typically, in order to animate between pages on the web, you need a single page app, where all of the content and structure of the site is loaded at once and each page transition just hides and shows different parts of the page. My problem was, I already had a static website, and I didn't want to rewrite the entire website to add these page transitions. As a result, I was going to have to account for a browser refresh between each page.

To solve this problem a JavaScript library that choreographs entrance and exit animations between multiple website pages, hides the browser refresh, and removes the need for a single page app. 

### How it works

To use `pangea.js`, the web design must first take every pair of pages, and imagine a common visual state between them, and write the CSS. Instatiate the library on the page, and it does the rest. When you click a link, the following happens:

1. The library inspects the link's `href` property, to figure out where you're trying to go. 
2. If the destination is a known page with a shared state, add a class to the body, triggering CSS that animates you there.
3. Once in the shared state, trigger the page refresh, by modifying `window.location`.
4. On every new page, trigger entrance animations.

The effect is pretty amazing:

[ video ]

