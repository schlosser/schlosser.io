require 'jekyll-press'

# This is a hack for fixing Jekyll Press. We need the @@mtimes variable,
# and we want to ignore the warning that ruby throws when you declare it.
original_verbose, $VERBOSE = $VERBOSE, nil
@@mtimes = {}
$VERBOSE = original_verbose
