set terminal png

set xlabel "Hop count"
set ylabel "PSNR"
set xrange [0:9]
set boxwidth 0.8
set style fill solid 1.0

FILE1=system("echo $FILE1")
FILE2=system("echo $FILE2")
FILE3=system("echo $FILE3")
FILE4=system("echo $FILE4")
FILE5=system("echo $FILE5")
FILE6=system("echo $FILE6")
FILE7=system("echo $FILE7")
FILE8=system("echo $FILE8")
OUTPUT=system("echo $OUTPUT")

set output OUTPUT
plot FILE1 using 1:2 with boxes title "Mean PSNR 1-Hop", \
  FILE2 using 1:2 with boxes title "Mean PSNR 2-Hop", \
  FILE3 using 1:2 with boxes title "Mean PSNR 3-Hop", \
  FILE4 using 1:2 with boxes title "Mean PSNR 4-Hop", \
  FILE5 using 1:2 with boxes title "Mean PSNR 5-Hop", \
  FILE6 using 1:2 with boxes title "Mean PSNR 6-Hop", \
  FILE7 using 1:2 with boxes title "Mean PSNR 7-Hop", \
  FILE8 using 1:2 with boxes title "Mean PSNR 8-Hop"

