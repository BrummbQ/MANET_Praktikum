#!/usr/bin/awk -f
BEGIN {
  bytes = 0
  tcp_packages[0] = 0
  sequences[0] = 0
}
/length/ && !/ARP/ {
# extrem lahm!
#   for (seq in sequences) {
#     if (sequences[seq] == $9) {
#       next
#     }
#   }

  tcp_packages[int($1)]+=$NF
  sequences[$1]=$9
  bytes += $NF
#   print $1, $9, $NF
}
END {
  for(i=0; i<length(tcp_packages); ++i)
    print i, tcp_packages[i]

  print "# Total Bytes " bytes
}
