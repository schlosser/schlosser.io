import json
from os import listdir
from os.path import join

blogPostsDirectory = "static/blog/"
outputFilename = "data/blogPosts.json"

def main():
	posts = []
	postFiles = [f for f in listdir(blogPostsDirectory) if f.endswith('.html')]
	for postFile in postFiles:
		content = open(join(blogPostsDirectory, postFile), "r").read()
		post = {
			"id": postFile.rstrip('.html').strip(),
			"class": postFile.rstrip('.html').strip(),
			"title": content[content.index('<h3>')+4: content.index('</h3>')].strip(),
			"date": content[content.index('<em>')+4: content.index('</em>')].strip(),
			"preview": content[content.index('</em></p>')+9: content.index('<hr />')].strip(),
			"hidden": content[content.index('<hr />')+6:].strip(),
		}
		posts.insert(0, post)
	with open(outputFilename, 'w') as outfile:
  		json.dump(posts, outfile, indent=4, separators=(',', ': '))

if __name__ == '__main__': main()