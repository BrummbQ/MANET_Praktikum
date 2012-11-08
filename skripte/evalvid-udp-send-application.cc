/*
 * EvalVidUdpSendApplication.cc
 *
 *  Created on: Nov 7, 2012
 *      Author: acer
 */

/* -*- Mode:C++; c-file-style:"gnu"; indent-tabs-mode:nil; -*- */


//#include "ns3/ipv4-address.h"
//#include "ns3/nstime.h"
#include "ns3/inet-socket-address.h"
//#include "ns3/socket.h"
#include "ns3/simulator.h"
//#include "ns3/socket-factory.h"
#include "ns3/packet.h"
//#include "ns3/uinteger.h"
//#include "ns3/string.h"
//
#include "evalvid-udp-send-application.h"



namespace ns3 {

NS_LOG_COMPONENT_DEFINE ("EvalVidUdpSendApplication");
NS_OBJECT_ENSURE_REGISTERED (EvalVidUdpSendApplication);


EvalVidUdpSendApplication::EvalVidUdpSendApplication():
		m_running(false),
		m_peerPort(0),
		m_socket(0),
		m_sent(0),
		nFrames(0),
		nAktuellesFrame(0)
{
	NS_LOG_FUNCTION_NOARGS ();
	m_sendEvent = EventId ();
}

EvalVidUdpSendApplication::~EvalVidUdpSendApplication() {
	NS_LOG_FUNCTION( this );
}

void EvalVidUdpSendApplication::DoDispose( void ) {
	NS_LOG_FUNCTION( this );
	Application::DoDispose();
}

void EvalVidUdpSendApplication::StartApplication( void ) {
	NS_LOG_FUNCTION( this );

	m_running = true;

	if( m_socket == 0 ) {
		TypeId tid = TypeId::LookupByName( "ns3::UdpSocketFactory" );
		m_socket = Socket::CreateSocket( GetNode(), tid );
		m_socket->Bind();
		m_socket->Connect( InetSocketAddress( m_peerAddress, m_peerPort ) );
	}

	m_socket->SetRecvCallback( MakeNullCallback< void, Ptr< Socket > >() );

	NS_LOG_LOGIC( "Videoversand gestartet" );
	m_sendEvent = Simulator::Schedule( aktuellesFrame.zeit, &EvalVidUdpSendApplication::SendeDaten, this );
}

void EvalVidUdpSendApplication::StopApplication() {
	NS_LOG_FUNCTION( this );

	m_running = false;

	if ( m_sendEvent.IsRunning() ) {
		Simulator::Cancel( m_sendEvent );
	}

	if ( m_socket ) {
		m_socket->Close();
	}
}

void EvalVidUdpSendApplication::Setup( std::string mp4TraceDatei, Ipv4Address peerAddress, uint16_t peerPort ) {
	m_peerPort = peerPort;
	m_peerAddress = peerAddress;

	unsigned long id, groesse, anzahl;
	double zeit;
	char typ;
	frame* t;

	std::ifstream traceDatei(mp4TraceDatei.c_str(), std::ios::in);

	if (traceDatei.bad()) {
		NS_LOG_ERROR("Fehler beim Öffnen der TraceDatei.\n");
		return;
	}
	//Anzahl der Zeilen ermitteln
	while (traceDatei >> id >> typ >> groesse >> anzahl >> zeit) {
		nFrames++;
	}

	traceDatei.clear();
	//wieder an Anfang springen
	traceDatei.seekg(0);
	//TraceZeilen einlesen
	trace = new struct frame[nFrames];
	t = trace;

	while (traceDatei >> id >> typ >> groesse >> anzahl >> zeit) {
		t->id = id;
		t->typ = typ;
		t->groesse = groesse;
		t->anzahl = anzahl;
		t->zeit = Seconds( zeit );
		t++;
	}

	//1. Frame laden
	GetFrame(nAktuellesFrame, aktuellesFrame);
}

void EvalVidUdpSendApplication::GetFrame( unsigned int& nAktuellesFrame, frame& t ) {

	t.zeit = trace[nAktuellesFrame].zeit;
	t.groesse = trace[nAktuellesFrame].groesse;
	t.typ = trace[nAktuellesFrame].typ;
	t.anzahl = trace[nAktuellesFrame].anzahl;
	t.id = trace[nAktuellesFrame].id;

}

void EvalVidUdpSendApplication::SendeDaten() {

	Send(aktuellesFrame.groesse);

	Time zeitLetztesFrame = aktuellesFrame.zeit;

	//teste ob schon alle Pakete gesendet wurden
	if( nAktuellesFrame < nFrames - 1 ) {

		//nächstes Frame holen
		GetFrame(++nAktuellesFrame, aktuellesFrame);

		Time sendeZeit = aktuellesFrame.zeit - zeitLetztesFrame;

		//if there are frames to send, so schedule that
		// Zeit ist relativ zu der aktuellen Simulationszeit
		m_sendEvent = Simulator::Schedule( sendeZeit, &EvalVidUdpSendApplication::SendeDaten, this );

	}
}


void EvalVidUdpSendApplication::Send( int nByte ) {
	NS_LOG_FUNCTION_NOARGS();
	NS_ASSERT( m_sendEvent.IsExpired() );
	//Udp-Header vor die Daten hängen
	SeqTsHeader seqTs;
	seqTs.SetSeq( m_sent );
	Ptr<Packet> p = Create<Packet>( nByte + ( 8 + 4 ) ); // 8+4 : the size of the seqTs header
	p->AddHeader( seqTs );

	std::stringstream peerAddressStringStream;
	peerAddressStringStream << Ipv4Address::ConvertFrom( m_peerAddress );

	if( ( m_socket->Send( p ) ) >= 0 ) {
		++m_sent;
		// Nutzung gleicher Ausgaben wie in udp-client.cc
		NS_LOG_INFO( "TraceDelay TX " << nByte << " bytes to "
				<< peerAddressStringStream.str() << " Uid: "
				<< p->GetUid() << " Time: "
				<< ( Simulator::Now() ).GetSeconds() );

	} else {
		// Nutzung gleicher Ausgaben wie in udp-client.cc
		NS_LOG_INFO( "Error while sending " << nByte << " bytes to "
				<< peerAddressStringStream.str () );
	}

}

} // Namespace ns3



