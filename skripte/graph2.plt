set terminal png

set xlabel "Hop count"
set ylabel "throughput [kB/s]"
set xrange [0:9]
set boxwidth 0.8
set style fill solid 1.0

DAT1=system("echo $DAT1")
DAT4=system("echo $DAT4")
DAT8=system("echo $DAT8")

set output 'output/total.png'
plot DAT1 using 1:($2/1000/30) with boxes title "Total 1-Hop", \
  DAT4 using 1:($2/1000/30) with boxes title "Total 4-Hop", \
  DAT8 using 1:($2/1000/30) with boxes title "Total 8-Hop"

