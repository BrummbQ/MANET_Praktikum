/*
 * EvalVidUdpSendApplication.h
 *
 *  Created on: Nov 7, 2012
 *      Author: acer
 */

#ifndef EVALVIDUDPSENDAPPLICATION_H_
#define EVALVIDUDPSENDAPPLICATION_H_

#include "ns3/log.h"
#include "ns3/application.h"
#include "ns3/event-id.h"
//#include "ns3/ptr.h"
#include "ns3/address.h"
#include "ns3/ipv4-address.h"
#include "ns3/seq-ts-header.h"
#include "ns3/socket.h"

//#include <sys/types.h>
//#include <sys/stat.h>
//#include <netinet/in.h>

//#include <stdio.h>
//#include <iostream>
#include <fstream>
//#include <iomanip>


namespace ns3 {

class EvalVidUdpSendApplication : public Application {

public:

	EvalVidUdpSendApplication();
	virtual ~EvalVidUdpSendApplication();
	/**
	 * Initialisiert die Anwendung.
	 *
	 * \param mp4TraceDatei Speicherort der Ausgabe von mp4trace
	 * \param peerAddress	Ipv4-Adresse des Empfängers
	 * \param port			Port auf dem der Empfänger die Udp-Nachrichten annimmt
	 */
	void Setup( std::string mp4TraceDatei, Ipv4Address peerAddress, uint16_t port );

	//stellt eine Zeile einer mp4trace-Datei dar
	struct frame {
		u_int32_t id; /* Framenummer */
		char typ; /* Frametyp */
		u_int32_t groesse; /* Größe des Video-Frame */
		u_int32_t anzahl; /* Anzahl an Paketen */
		Time zeit; /* Sendezeitpunkt */
	};

protected:

	virtual void DoDispose( void );


private:

	virtual void StartApplication( void );
	virtual void StopApplication( void );

	void SendeDaten();
	void GetFrame( unsigned int& aktuellesFrame, frame& t );
	void Send( int nbyte );

	// laeuft die Anwendung gerade
	bool m_running;
	// Port des Empfängers
	uint16_t m_peerPort;
	// IP-Adresse des Empfängers
	Ipv4Address m_peerAddress;
	// Socket über den Udp-Nachrichten gesendet werden
	Ptr<Socket> m_socket;
	// Anzahl versendeter Pakete
	uint32_t m_sent; /* Anzahl versendeter Pakete */
	// Schedule-Eintrag für den Versand einzelner Frames
	EventId m_sendEvent;
	// Anzahl aller Frames der mp4Trace-Datei
	// Nummer des aktuell zu sendenden Frames
	unsigned int nFrames , nAktuellesFrame ;
	// Zeiger auf Array, welches alle Frames des Trace enthält
	frame* trace;
	// Frame, welches gerade gesendet wird
	frame aktuellesFrame;

};

}


#endif /* EVALVIDUDPSENDAPPLICATION_H_ */
