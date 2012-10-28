set terminal png

set xlabel "Hop count"
set ylabel "throughput [kB/s]"
set xrange [0:9]
set boxwidth 0.8
set style fill solid 1.0

DAT1=system("echo $DAT1")
DAT2=system("echo $DAT2")
DAT3=system("echo $DAT3")
DAT4=system("echo $DAT4")
DAT5=system("echo $DAT5")
DAT6=system("echo $DAT6")
DAT7=system("echo $DAT7")
DAT8=system("echo $DAT8")

set output 'output/total.png'
plot DAT1 using 1:($2/1000/30) with boxes title "Total 1-Hop", \
  DAT2 using 1:($2/1000/30) with boxes title "Total 2-Hop", \
  DAT3 using 1:($2/1000/30) with boxes title "Total 3-Hop", \
  DAT4 using 1:($2/1000/30) with boxes title "Total 4-Hop", \
  DAT5 using 1:($2/1000/30) with boxes title "Total 5-Hop", \
  DAT6 using 1:($2/1000/30) with boxes title "Total 6-Hop", \
  DAT7 using 1:($2/1000/30) with boxes title "Total 7-Hop", \
  DAT8 using 1:($2/1000/30) with boxes title "Total 8-Hop"

