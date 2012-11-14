#!/usr/bin/awk -f
/aodv/{c=1;next}
c--<0 && p{print p}
{p=$0}
END{print p}
