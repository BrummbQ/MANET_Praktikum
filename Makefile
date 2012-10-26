#!/usr/bin/make

PROJECT_DIR := MANET_Praktikum
OUTPUTDIR := output
CWD := $(shell pwd)
DATS := $(addprefix $(OUTPUTDIR)/,1-Hop.dat 4-Hop.dat 8-Hop.dat)

aufgabe1_setup: $(PROJECT_DIR).cc
	@echo "Building simulation aufgabe1"
	@waf

$(PROJECT_DIR).cc:
	@cp skripte/aufgabeEins.cc $(PROJECT_DIR).cc

simulate_1 =


hop_count = $(shell basename "$1" | cut -d"-" -f1)

topo_length = $(shell echo "$1*50" | bc)

$(DATS): $(OUTPUTDIR)/%.dat: aufgabe1_setup
	@echo "Running simulation $@"
	@waf --run "$(PROJECT_DIR) --lTopologie=$(call topo_length, $(call hop_count,$@)) --outputDir=$(CWD)/$(OUTPUTDIR)/"
	@for file in output/*.pcap; do \
		tcpdump -ttnn -r $$file > $$file.tcpdump; \
		skripte/filter.awk $$file.tcpdump > $$file.dat; \
		[ -f $@ ] || cp $$file.dat $@; \
	done
	@TOTAL=$$(cat $@ | grep "Total" | cut -d" " -f 4) ; echo "$(call hop_count,$@) $$TOTAL" > $(OUTPUTDIR)/$(call hop_count,$@)-Hop-Sum.dat

aufgabe1: $(DATS)
	DAT1=output/1-Hop.dat DAT4=output/4-Hop.dat DAT8=output/8-Hop.dat gnuplot skripte/graph1.plt
	DAT1=output/1-Hop-Sum.dat DAT4=output/4-Hop-Sum.dat DAT8=output/8-Hop-Sum.dat gnuplot skripte/graph2.plt
	@rm -f $(PROJECT_DIR).cc

clean:
	@rm -f $(OUTPUTDIR)/*

.PHONY: $(HOPS)