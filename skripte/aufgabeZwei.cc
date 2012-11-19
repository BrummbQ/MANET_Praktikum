/* -*- Mode:C++; c-file-style:"gnu"; indent-tabs-mode:nil; -*- */

#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/applications-module.h"
#include "ns3/wifi-module.h"
#include "ns3/mobility-module.h"
#include "ns3/aodv-module.h"
#include "ns3/ipv4-global-routing-helper.h"
#include "evalvid-udp-send-application.h"

// Netzwerk Topologie
//
// Wifi 10.1.1.0
//
//  *         *     *
//  |         |     |
// nnNodes   ...   n0
//

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("aufgabeZwei");

int main (int argc, char *argv[]) {

	LogComponentEnable("EvalVidUdpSendApplication", LOG_LEVEL_INFO);
	LogComponentEnable("UdpServer", LOG_LEVEL_INFO);

	// Länge der Netzwerk-Topologie in m
	unsigned lTopologie = 350;
	// Abstand zweier Knoten in m
	unsigned deltaX = 50;
	// Maximale Simulatorlaufzeit in s
	unsigned maxTime = 75;
	// Ausgabe-Ordner für die Tracing-Files
	std::string outputDir = "";
	std::string mp4traceDatei = "";

	CommandLine cmd;
	cmd.AddValue( "lTopologie", "Die Länge der Netzwerk-Topologie in m.", lTopologie );
	cmd.AddValue( "deltaX", "Abstand zweier Knoten in m.", deltaX);
	cmd.AddValue( "outputDir", "Ausgabe-Ordner für Tracing-Files", outputDir );
	cmd.AddValue( "mp4TraceDatei", "mp4trace-Datei", mp4traceDatei);
	cmd.AddValue( "maxTime", "Maximale Laufzeit des Simulators in s", maxTime );
	cmd.Parse( argc, argv );

	// Deaktivierung der Fragmentierung
	Config::SetDefault("ns3::WifiRemoteStationManager::FragmentationThreshold", StringValue("6000"));
	// Deaktivierung des RtsCts-Mechanismus
	Config::SetDefault("ns3::WifiRemoteStationManager::RtsCtsThreshold", StringValue("6000"));
	// Paketlänge festlegen
	Config::SetDefault("ns3::MinstrelWifiManager::PacketLength", StringValue("1460"));

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

	//Udp-Pakete senden
	Ptr<EvalVidUdpSendApplication> evalvidApp = CreateObject<EvalVidUdpSendApplication>();
	//mp4trace-Datei einlesen
	evalvidApp->Setup( mp4traceDatei, interfaces.GetAddress( nNodes - 1 ), 9 );
	nodes.Get(0)->AddApplication( evalvidApp );
	ApplicationContainer app;
	app.Add(evalvidApp);
	app.Start(Seconds(1.0));
	app.Stop(Seconds(maxTime));

	//Udp-Senke, da der Server eingehende Pakete nur annimmt und zusätzlich noch die Anzahl der erfolgreich empfangenen Pakete sich merkt
	UdpServerHelper sinkApp = UdpServerHelper(9);
	ApplicationContainer sinkApps = sinkApp.Install(nodes.Get(nNodes-1));
	sinkApps.Start (Seconds (0.0));
	sinkApps.Stop (Seconds (maxTime));

	//Tracing aktivieren für alle Devices aller Knoten
	wifiPhy.EnablePcap( outputDir + "aufgabeZwei", devices);

	//Simulation
	Simulator::Stop(Seconds(maxTime));

	Simulator::Run();
	Simulator::Destroy();

	//Ausgabe, wieviel Pakete empfangen werden an der Senke
	Ptr<UdpServer> sink1 = DynamicCast<UdpServer> (sinkApps.Get (0));
	std::cout << "Anzahl erfolgreich empfangener Pakete: " << sink1->GetReceived() << " Anzahl verlorener Pakete: " << sink1->GetLost() << std::endl;


	return 0;
}
