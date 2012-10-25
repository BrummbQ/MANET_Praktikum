#!/usr/bin/make

PROJECT_DIR = MANET_Praktikum
CWD := $(shell pwd)

aufgabe1_setup:
	@echo "Building simulation 1"
	@cp skripte/aufgabeEins.cc $(PROJECT_DIR).cc
	@waf

aufgabe1_1_hop: aufgabe1_setup
	@echo "simulation with 1 Hop"
	@waf --run "$(PROJECT_DIR) --lTopologie=50 --outputDir=$(CWD)/output/"
	@for file in output/*.pcap; do \
		tcpdump -ttnn -r $$file > $$file.tcpdump; \
		skripte/filter.awk $$file.tcpdump > $$file.dat; \
		[ -f output/1-Hop.dat ] || cp $$file.dat output/1-Hop.dat; \
	done
	@TOTAL=$$(cat output/1-Hop.dat | grep "Total" | cut -d" " -f 4) ; echo "1 $$TOTAL" > output/1-Hop-Sum.dat

aufgabe1_4_hop: aufgabe1_setup
	@echo "simulation with 4 Hop"
	@waf --run "$(PROJECT_DIR) --lTopologie=150 --outputDir=$(CWD)/output/"
	@for file in output/*.pcap; do \
		tcpdump -ttnn -r $$file > $$file.tcpdump; \
		skripte/filter.awk $$file.tcpdump > $$file.dat; \
		[ -f output/4-Hop.dat ] || cp $$file.dat output/4-Hop.dat; \
	done
	@TOTAL=$$(cat output/4-Hop.dat | grep "Total" | cut -d" " -f 4) ; echo "4 $$TOTAL" > output/4-Hop-Sum.dat

aufgabe1_8_hop: aufgabe1_setup
	@echo "simulation with 8 Hop"
	@waf --run "$(PROJECT_DIR) --lTopologie=350 --outputDir=$(CWD)/output/"
	@for file in output/*.pcap; do \
		tcpdump -ttnn -r $$file > $$file.tcpdump; \
		skripte/filter.awk $$file.tcpdump > $$file.dat; \
		[ -f output/8-Hop.dat ] || cp $$file.dat output/8-Hop.dat; \
	done
	@TOTAL=$$(cat output/8-Hop.dat | grep "Total" | cut -d" " -f 4) ; echo "8 $$TOTAL" > output/8-Hop-Sum.dat

aufgabe1: aufgabe1_8_hop aufgabe1_4_hop aufgabe1_1_hop
	DAT1=output/1-Hop.dat DAT4=output/4-Hop.dat DAT8=output/8-Hop.dat gnuplot skripte/graph1.plt
	DAT1=output/1-Hop-Sum.dat DAT4=output/4-Hop-Sum.dat DAT8=output/8-Hop-Sum.dat gnuplot skripte/graph2.plt
	@rm -f output/*.dat
	@rm -f $(PROJECT_DIR).cc
