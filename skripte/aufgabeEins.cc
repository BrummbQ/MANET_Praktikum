/* -*- Mode:C++; c-file-style:"gnu"; indent-tabs-mode:nil; -*- */

#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/applications-module.h"
#include "ns3/wifi-module.h"
#include "ns3/mobility-module.h"
#include "ns3/aodv-module.h"
#include "ns3/ipv4-global-routing-helper.h"

// Netzwerk Topologie
//
// Wifi 10.1.1.0
//
//  *         *     *
//  |         |     |
// nnNodes   ...   n0
//

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("aufgabeEins");

int main (int argc, char *argv[]) {

	LogComponentEnable("BulkSendApplication", LOG_LEVEL_INFO);

	// Länge der Netzwerk-Topologie in m
	unsigned lTopologie = 350;
	// Abstand zweier Knoten in m
	unsigned deltaX = 50;
	// Ausgabe-Ordner für die Tracing-Files
	std::string outputDir = "gitFiles/output";

	CommandLine cmd;
	cmd.AddValue ("lTopologie", "Die Länge der Netzwerk-Topologie in m.", lTopologie);
	cmd.AddValue ("deltaX", "Abstand zweier Knoten in m.", deltaX);
	cmd.AddValue ("outputDir", "Ausgabe-Ordner für Tracing-Files", outputDir);
	cmd.Parse (argc, argv);

	// Deaktivierung der Fragmentierung
	Config::SetDefault("ns3::WifiRemoteStationManager::FragmentationThreshold", StringValue("2000"));
	// Deaktivierung des RtsCts-Mechanismus
	Config::SetDefault("ns3::WifiRemoteStationManager::RtsCtsThreshold", StringValue("2000"));
	// Paketlänge festlegen
	Config::SetDefault("ns3::MinstrelWifiManager::PacketLength", StringValue("1460"));
	// auch die TCP-Packetgröße muss hoch gesetzt werden, da sonst bei 536 liegend und die Packetgröße einschränkend
	Config::SetDefault("ns3::TcpSocket::SegmentSize", StringValue("1460"));

	// Anzahl Knoten
	unsigned nNodes = lTopologie / deltaX + 1;

	//Erstellen der Knoten
	NodeContainer nodes;
	nodes.Create(nNodes);

	//Positionen der Knoten definieren
	MobilityHelper mobility;
	mobility.SetPositionAllocator("ns3::GridPositionAllocator",
			"GridWidth", UintegerValue(nNodes),
			"MinX", DoubleValue(0.0),
			"MinY", DoubleValue(0.0),
			"DeltaX", DoubleValue(deltaX),
			"DeltaY", DoubleValue(0.0),
			"LayoutType", StringValue("RowFirst"));
	mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
	mobility.Install(nodes);

	//MAC-Schicht erstellen
	NqosWifiMacHelper mac = NqosWifiMacHelper::Default();
	//Adhoc-Typ festlegen
	mac.SetType("ns3::AdhocWifiMac");

	//Standard Eigenschaften setzen
	YansWifiPhyHelper wifiPhy = YansWifiPhyHelper::Default();
	YansWifiChannelHelper wifiChannel = YansWifiChannelHelper::Default();
	wifiPhy.SetChannel(wifiChannel.Create());

	WifiHelper wifi = WifiHelper::Default();
	wifi.SetRemoteStationManager("ns3::MinstrelWifiManager");
	//RtsCtsThreshold muss nicht gesetzt werden, da die Paketgröße kleiner als der Min-Wert ist
	//FragmentationThreshold ebenfalls nicht

	//802.11 g Modell festlegen
	wifi.SetStandard(WIFI_PHY_STANDARD_80211g);

	//Devices in den Nodes erstellen
	NetDeviceContainer devices;
	devices = wifi.Install(wifiPhy, mac, nodes);

	//AODV-Routing einstellen
	AodvHelper aodv;
	InternetStackHelper stack;
	stack.SetRoutingHelper(aodv);
	stack.Install(nodes);

	//Adressen-Zuweisung
	Ipv4AddressHelper address;
	address.SetBase("10.1.1.0", "255.255.255.0");
	Ipv4InterfaceContainer interfaces;
	interfaces = address.Assign(devices);

	//FTP-Packet an letzten Knoten senden/Port 9
	BulkSendHelper ftp = BulkSendHelper("ns3::TcpSocketFactory",InetSocketAddress (interfaces.GetAddress(nNodes-1), 9));
	//Paketgröße festlegen
	ftp.SetAttribute("SendSize", UintegerValue(1460));
	ApplicationContainer app = ftp.Install(nodes.Get(0));
	app.Start(Seconds(0.0));
	app.Stop(Seconds(30.0));

	//Eine Senke zum Empfang des FTP-Pakets
	PacketSinkHelper sink ("ns3::TcpSocketFactory",
	                         InetSocketAddress (Ipv4Address::GetAny (), 9));
	ApplicationContainer sinkApps = sink.Install (nodes.Get (nNodes-1));
	sinkApps.Start (Seconds (0.0));
	sinkApps.Stop (Seconds (30.0));

	//Tracing aktivieren für alle Devices aller Knoten
	wifiPhy.EnablePcap( outputDir + "/aufgabeEins", devices);

	//Routing-Tabelle, nur für Testzwecke
	Ptr<OutputStreamWrapper> routingStream = Create<OutputStreamWrapper> ( outputDir + "/aufgabeEins.routes", std::ios::out);
	aodv.PrintRoutingTableAllEvery (Seconds (1), routingStream);


	//Simulation
	Simulator::Stop(Seconds(30.0));

	Simulator::Run();
	Simulator::Destroy();

	//Ausgabe, wieviel Bytes empfangen werden an der Senke
	Ptr<PacketSink> sink1 = DynamicCast<PacketSink> (sinkApps.Get (0));
	std::cout << "Anzahl empfangener Bytes: " << sink1->GetTotalRx () << std::endl;

	return 0;
}
