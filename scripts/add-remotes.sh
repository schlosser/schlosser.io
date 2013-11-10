#! /bin/sh

ALREADY_EXISTS="already exists"
SUCCESSFUL=$true

printf "Adding origin... "
ORIGIN_OUTPUT=$(git remote add origin dan@danrs.ch:~/danrs-ch.git 2>&1)
if [ ! -z "$ORIGIN_OUTPUT" ]; then
	if [[ "$ORIGIN_OUTPUT" == *"$ALREADY_EXISTS"* ]]; then
		echo "Remote \"origin\" already exists. (SUCCESS)"

	else
		echo "Adding remote \"origin\" failed: " "$ORIGIN_OUTPUT"
		SUCCESSFUL=$false
	fi
else
	echo "Remote \"origin\" added successfully. (SUCCESS)"
fi

printf "Adding github... "
GITHUB_OUTPUT=$(git remote add github git@github.com:danrschlosser/danrs-ch.git 2>&1)
if [ ! -z "$GITHUB_OUTPUT" ]; then
	if [[ "$GITHUB_OUTPUT" == *"$ALREADY_EXISTS"* ]]; then
		echo "Remote \"github\" already exists. (SUCCESS)"
	else
		echo "Adding remote \"origin\" failed: " "$ORIGIN_OUTPUT"
		SUCCESSFUL=$false
	fi
else
	echo " Remote \"github\" added successfully. (SUCCESS)"
fi

if [ !$SUCCESSFUL ]; then
	echo "$0 ran with errors. (FAILURE)"
else
	git remote -vvv
	git fetch origin
	git checkout -b origin/post-images
	git branch --set-upstream-to=origin/post-images post-images
	git checkout -b github
	git branch --set-upstream-to=github/master github
	git branch --set-upstream-to=origin/master master
	git checkout master
fi
