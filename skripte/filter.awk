#!/usr/bin/awk -f
# Name :  awkargs
/length/ {
  field[int($1)]+=$NF
#   print int($1), $NF
}
END {
  for(i=0; i<length(field); ++i)
    print i, field[i]
}
