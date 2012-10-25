set terminal svg

set xlabel "Hop count"
set ylabel "Total bytes [kB]"
set xrange [0:9]

DAT1=system("echo $DAT1")
DAT4=system("echo $DAT4")
DAT8=system("echo $DAT8")

set output 'output/total.svg'
plot DAT1 using 1:($2/1000) title "Total 1-Hop", \
  DAT4 using 1:($2/1000) title "Total 4-Hop", \
  DAT8 using 1:($2/1000) title "Total 8-Hop"

