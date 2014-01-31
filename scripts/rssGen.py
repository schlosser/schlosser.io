import PyRSS2Gen, datetime, re
from os import listdir
from os.path import isfile, join

def removeTags(s):
    if s.find('<') == -1:
        return s
    return removeTags(s[0:s.find('<')]+s[s.find('>')+1:])

def main():
    rssTitle = "Dan Schlosser"
    rssLink = "http://danrs.ch/"
    rssDescription = "The latest blog posts, updates, and other news from Dan Schlosser."
    rssItems = []

    # Populate rssItems
    blogPath = "../static/blog/"
    for filename in [ f for f in listdir("../static/blog/") if isfile(join("../static/blog/",f)) ]:
        # File reading
        postFile = open("../static/blog/"+filename)
        postText = postFile.read()
        postFile.close()

        # Create Data structure
        h3start, h3end = postText.find('<h3>')+4, postText.find('</h3>')
        postTitle = postText[h3start:h3end]
        postLink = "http://danrs.ch/blog/post-"+filename
        postDescription = ""
        for p in postText[postText.find("</em></p>")+9:].strip().split('<p>'):
            postDescription+=removeTags(p).strip()+"\n\n"
        postGuid = PyRSS2Gen.Guid(postLink)
        postPubDate = datetime.datetime(
                      int(filename[0:4]),
                      int(filename[5:7]),
                      int(filename[8:10]), 12, 00)

        # Append the post
        rssItems.append(PyRSS2Gen.RSSItem(
             title = postTitle,
             link = postLink,
             description = postDescription,
             guid = postGuid,
             pubDate = postPubDate))

    # Create RSS data structure
    rss = PyRSS2Gen.RSS2(
        title = rssTitle,
        link = rssLink,
        description = rssDescription,
        lastBuildDate = datetime.datetime.now(),
        items = rssItems)

    # Write to RSS file
    rss.write_xml(open("../static/rss.xml", "w"))


if __name__ == "__main__": main()
