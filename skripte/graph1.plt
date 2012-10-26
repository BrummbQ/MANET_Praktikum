set terminal png

set xlabel "time [s]"
set ylabel "throughput [kbyte/s]"

DAT1=system("echo $DAT1")
DAT4=system("echo $DAT4")
DAT8=system("echo $DAT8")

set output 'output/throughput.png'
plot DAT1 using 1:($2/1000) with lines title "throughput 1-Hop", \
  DAT4 using 1:($2/1000) with lines title "throughput 4-Hop", \
  DAT8 using 1:($2/1000) with lines title "throughput 8-Hop"

