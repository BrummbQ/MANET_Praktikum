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
//  *    *    *    *    *    *    *
//  |    |    |    |    |    |    |
// n6   n5   n4   n3   n2   n1   n0
//

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("testWifi");

int main (int argc, char *argv[]) {

	LogComponentEnable("BulkSendApplication", LOG_LEVEL_INFO);

	// in m
	unsigned lTopologie = 800;
	unsigned numberNodes = lTopologie / 50 + 1;

	NodeContainer nodes;
	nodes.Create(numberNodes);

	//Positionen der Knoten definieren
	MobilityHelper mobility;
	mobility.SetPositionAllocator("ns3::GridPositionAllocator",
			"GridWidth", UintegerValue(numberNodes),
			"MinX", DoubleValue(0.0),
			"MinY", DoubleValue(0.0),
			"DeltaX", DoubleValue(50.0),
			"DeltaY", DoubleValue(0.0),
			"LayoutType", StringValue("ColumnFirst"));
	mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
	mobility.Install(nodes);



	//AdHoc-Typ festlegen
	NqosWifiMacHelper mac = NqosWifiMacHelper::Default();
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

	//FTP mit letztem Knoten
	BulkSendHelper ftp = BulkSendHelper("ns3::TcpSocketFactory",InetSocketAddress (interfaces.GetAddress(numberNodes-1), 9));
	ftp.SetAttribute("SendSize", UintegerValue(1460));
	ApplicationContainer app = ftp.Install(nodes.Get(0));
	app.Start(Seconds(0.0));
	app.Stop(Seconds(30.0));

	wifiPhy.EnablePcapAll("output/testWifi");


	Simulator::Stop(Seconds(30.0));

	Simulator::Run();
	Simulator::Destroy();

	 Ptr<PacketSink> sink1 = DynamicCast<PacketSink> (app.Get (0));
	  std::cout << "Total Bytes Received: " << sink1->GetTotalRx () << std::endl;

	return 0;
}
