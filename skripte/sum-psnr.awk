#!/usr/bin/awk -f
BEGIN {
  psnr_sum = 0
}
{
  psnr_sum+=$1
}
END {
  print psnr_sum/NR
}
