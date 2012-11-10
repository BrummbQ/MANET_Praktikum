#!/usr/bin/make

PROJECT_DIR := MANET_Praktikum
CWD := $(shell pwd)
OUTPUTDIR := $(CWD)/output
RESDIR := ressources
BINDIR := $(CWD)/bin

# exersise 1
# FIXME: 1-2 Hop
DATS := $(addprefix $(OUTPUTDIR)/,3-Hop.dat 4-Hop.dat 5-Hop.dat 6-Hop.dat 7-Hop.dat 8-Hop.dat)

# exersise 2
SRCVIDS := akiyo_cif.264 #highway_cif.264 #bridge-far_cif.264
YUVS := $(addprefix $(OUTPUTDIR)/,$(subst .264,.yuv,$(SRCVIDS)))
x264 := $(addprefix $(OUTPUTDIR)/,$(subst .264,.x264,$(SRCVIDS)))
MP4 := $(addprefix $(OUTPUTDIR)/,$(subst .264,.mp4,$(SRCVIDS)))
MP4TRACE := $(addprefix $(OUTPUTDIR)/,$(subst .264,.mp4trace,$(SRCVIDS)))
ETMP4MP4 := $(foreach hop,$(DATS),$(foreach file,$(SRCVIDS),$(subst .dat,-$(subst .264,-etmp4.mp4,$(file)),$(hop))))
PSNRS := $(subst .mp4,.psnr,$(ETMP4MP4))
ETMP4YUF := $(subst .mp4,.yuv,$(ETMP4MP4))
MEAN_PSNR_PNG := $(addprefix $(OUTPUTDIR)/,$(subst .264,.psnr.png,$(SRCVIDS)))

hop_count = $(shell basename "$1" | cut -d"-" -f1)
topo_length = $(shell echo "$1*50" | bc)

all: aufgabe1 tutorial1 doc

aufgabe1_setup: $(PROJECT_DIR).cc
	@cp skripte/aufgabeEins.cc $(PROJECT_DIR).cc
	@echo "Building simulation aufgabe1"
	@waf

$(OUTPUTDIR)/aufgabe1.pdf:
	@pdflatex --output-directory=$(OUTPUTDIR) skripte/aufgabe1.tex
	@pdflatex --output-directory=$(OUTPUTDIR) skripte/aufgabe1.tex
	@rm -f $(OUTPUTDIR)/{aufgabe1.aux,aufgabe1.log}

$(OUTPUTDIR)/throughput.png: $(DATS)
	DAT1=output/1-Hop.dat DAT4=output/4-Hop.dat DAT8=output/8-Hop.dat gnuplot skripte/graph1.plt

$(OUTPUTDIR)/total.png: $(DATS)
	DAT1=output/1-Hop-Sum.dat DAT2=output/2-Hop-Sum.dat DAT3=output/3-Hop-Sum.dat DAT4=output/4-Hop-Sum.dat \
	DAT5=output/5-Hop-Sum.dat DAT6=output/6-Hop-Sum.dat DAT7=output/7-Hop-Sum.dat DAT8=output/8-Hop-Sum.dat gnuplot skripte/graph2.plt

$(YUVS): $(OUTPUTDIR)/%.yuv: $(RESDIR)/%.264
	ffmpeg -i $< $@

$(x264): $(OUTPUTDIR)/%.x264: $(OUTPUTDIR)/%.yuv
	x264 -I 30 -B 64 --fps 30 -o $@ --input-res 352x288 $<

$(MP4): $(OUTPUTDIR)/%.mp4: $(OUTPUTDIR)/%.x264
	MP4Box -hint -mtu 1024 -fps 30 -add $< $@
	ffmpeg -i $@ $(subst .mp4,-ref.yuv,$@)

$(MP4TRACE): $(OUTPUTDIR)/%.mp4trace: $(OUTPUTDIR)/%.mp4
	nc -l -u localhost 12346 > /dev/null &
	@echo "You can trace the traffic with (run as root):  tcpdump -i lo -n -tt -v udp port 12346 > a01"
	$(BINDIR)/mp4trace -f -s localhost 12346 $< > $@
	killall nc

$(ETMP4MP4): $(OUTPUTDIR)/%.mp4: $(MP4TRACE)
	waf --run "$(PROJECT_DIR) --lTopologie=$(call topo_length, $(call hop_count,$@)) --mp4TraceDatei=$< --outputDir=$(OUTPUTDIR)/"
	FILES=(output/aufgabeZwei*.pcap) && \
	tcpdump -n -tt -v -r $${FILES[0]} > $(basename $<)_s.tcpdump && \
	tcpdump -n -tt -v -r $${FILES[$${#FILES[@]}-1]} > $(basename $<)_r.tcpdump
	cd $(OUTPUTDIR) && \
	$(BINDIR)/etmp4 -F -x $(basename $<)_s.tcpdump $(basename $<)_r.tcpdump $< $(subst .mp4trace,.mp4,$<) $(basename $(notdir $@))
	rm -f $(OUTPUTDIR)/{*.pcap,*.tcpdump}

$(ETMP4YUF): $(OUTPUTDIR)/%.yuv: $(OUTPUTDIR)/%.mp4
	ffmpeg -i $< $@

orig = $(OUTPUTDIR)/$(shell echo $(notdir $(subst -etmp4,,$1)) | cut -d - -f3)

$(PSNRS): $(OUTPUTDIR)/%.psnr: $(OUTPUTDIR)/%.yuv
	$(BINDIR)/psnr 352 288 420 $(call orig,$<) $< > $@
	@echo "$(call hop_count,$(notdir $<)) `skripte/sum-psnr.awk $@`" > $@.mean

mean = $(OUTPUTDIR)/$2-Hop-$(notdir $(subst .psnr.png,-etmp4.psnr.mean,$1))

$(MEAN_PSNR_PNG): $(OUTPUTDIR)/%.psnr.png: $(PSNRS)
	FILE3=$(call mean,$@,3) FILE4=$(call mean,$@,4) \
	FILE5=$(call mean,$@,5) FILE6=$(call mean,$@,6) \
	FILE7=$(call mean,$@,7) FILE8=$(call mean,$@,8) OUTPUT=$@ gnuplot skripte/a2_graph1.plt

$(DATS): $(OUTPUTDIR)/%.dat:
	@echo "Running simulation $@"
	@waf --run "$(PROJECT_DIR) --lTopologie=$(call topo_length, $(call hop_count,$@)) --outputDir=$(CWD)/$(OUTPUTDIR)/"
	@for file in output/*.pcap; do \
		tcpdump -ttnn -r $$file > $$file.tcpdump; \
		skripte/filter.awk $$file.tcpdump > $$file.dat; \
		[ -f $@ ] || cp $$file.dat $@; \
	done
	@TOTAL=$$(cat $@ | grep "Total" | cut -d" " -f 4) ; echo "$(call hop_count,$@) $$TOTAL" > $(OUTPUTDIR)/$(call hop_count,$@)-Hop-Sum.dat

aufgabe1: aufgabe1_setup $(DATS)
	@rm -f $(PROJECT_DIR).cc

tutorial1:
	@cp skripte/tutorial_first_extended.cc $(PROJECT_DIR).cc
	@waf
	@waf --run "$(PROJECT_DIR) --outputDir=$(CWD)/$(OUTPUTDIR)/"
	@for file in output/*.pcap; do \
		tcpdump -ttnn -r $$file > $$file.tcpdump; \
	done
	@rm $(PROJECT_DIR).cc

aufgabe2: aufgabe2_setup $(PSNRS) $(MEAN_PSNR_PNG)
	@rm $(PROJECT_DIR).cc
	@rm evalvid-udp-send-application.cc
	@rm evalvid-udp-send-application.h

aufgabe2_setup:
	@cp skripte/aufgabeZwei.cc $(PROJECT_DIR).cc
	@cp skripte/evalvid-udp-send-application.cc evalvid-udp-send-application.cc
	@cp skripte/evalvid-udp-send-application.h evalvid-udp-send-application.h
	@waf

doc: $(OUTPUTDIR)/throughput.png $(OUTPUTDIR)/total.png $(OUTPUTDIR)/aufgabe1.pdf

clean:
	@rm -f $(OUTPUTDIR)/*