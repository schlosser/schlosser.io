#! /bin/sh

ALREADY_EXISTS="already exists"

printf "Adding origin... "
ORIGIN_OUTPUT=$(git remote add origin dan@danrs.ch:~/danrs-ch.git 2>&1)
if [ ! -z "$ORIGIN_OUTPUT" ]; then
	if [[ "$ORIGIN_OUTPUT" == *"$ALREADY_EXISTS"* ]]; then
		echo "Remote \"origin\" already exists. (SUCCESS)"

	else
		echo "Adding remote \"origin\" failed: " "$ORIGIN_OUTPUT"
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
	fi
else
	echo " Remote \"github\" added successfully. (SUCCESS)"
fi

git remote -vvv