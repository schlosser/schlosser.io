#! /bin/sh

ALREADY_EXISTS="already exists"
SWITCHED_TO="Switched to"
SUCCESSFUL=true

ORIGIN_OUTPUT=$(git remote add origin dan@danrs.ch:~/danrs-ch.git 2>&1)
if [ ! -z "$ORIGIN_OUTPUT" ]; then
	if [[ "$ORIGIN_OUTPUT" == *"$ALREADY_EXISTS"* ]]; then
		echo "Remote origin already exists. (SUCCESS)"

	else
		echo "Adding remote origin failed: " "$ORIGIN_OUTPUT"
		SUCCESSFUL=false
	fi
else
	echo "Remote origin added successfully. (SUCCESS)"
fi

if ! $SUCCESSFUL ; then
	echo "Ran with errors. (FAILURE)"
else
	GITHUB_OUTPUT=$(git remote add github git@github.com:danrschlosser/danrs-ch.git 2>&1)
	if [ ! -z "$GITHUB_OUTPUT" ]; then
		if [[ "$GITHUB_OUTPUT" == *"$ALREADY_EXISTS"* ]]; then
			echo "Remote github already exists. (SUCCESS)"
		else
			echo "Adding remote origin failed: " "$ORIGIN_OUTPUT"
			SUCCESSFUL=false
		fi
	else
		echo " Remote github added successfully. (SUCCESS)"
	fi

	if ! $SUCCESSFUL ; then
		echo "Ran with errors. (FAILURE)"
	else
		git fetch origin
		CO_POST_IMAGES_OUTPUT=$(git checkout -b post-images 2>&1)
		if [[ "$CO_POST_IMAGES_OUTPUT" == *"$ALREADY_EXISTS"* ]]; then
			echo "Branch post-images already exists. (SUCCESS)"
		elif [["$CO_POST_IMAGES_OUTPUT" == *"$SWITCHED_TO"* ]]; then
			echo "Checked out branch post-images. (SUCCESS)"
		else
			echo "Checkout of branch post-images failed: " "$CO_POST_IMAGES_OUTPUT"
			SUCCESSFUL=false
		fi
		if ! $SUCCESSFUL ; then
			echo "Ran with errors. (FAILURE)"
		else
			git branch --set-upstream-to=origin/post-images post-images
			
			git fetch github
			CO_GITHUB_OUTPUT=$(git checkout -b github 2>&1)
			if [[ "$CO_GITHUB_OUTPUT" == *"$ALREADY_EXISTS"* ]]; then
				echo "Branch github already exists. (SUCCESS)"
			elif [["$CO_GITHUB_OUTPUT" == *"$SWITCHED_TO"* ]]; then
				echo "Checked out branch github. (SUCCESS)"
			else
				echo "Checkout of branch github failed: " "$CO_GITHUB_OUTPUT"
				SUCCESSFUL=false
			fi
			if ! $SUCCESSFUL ; then
				echo "Ran with errors. (FAILURE)"
			else
				git branch --set-upstream-to=github/master github
				git branch --set-upstream-to=origin/master master
				git checkout master
				git branch -vvv
				echo "All operations successful. (SUCCESS)"
			fi
		fi
	fi
fi
