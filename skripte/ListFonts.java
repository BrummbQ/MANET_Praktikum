/* Auteur: Nicolas JANEY         */
/* nicolas.janey@univ-fcomte.fr  */
/* Novembre 2001                 */

import java.awt.*;
import java.awt.event.*;
import java.applet.*;
import java.awt.font.*;
import java.awt.geom.*;

public class ListeFontes extends Applet {
  

  public void init() {
    setBackground(Color.white); 
    GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
    String [] polices = ge.getAvailableFontFamilyNames();
    List lst = new List(polices.length,false);
    for ( int i = 0 ; i < polices.length ; i++ )
      lst.add(polices[i]);
    setLayout(new BorderLayout());
    add("Center",lst);
  }

  public String getAppletInfo() {
    return "Liste des polices de caracteres.";
  }
}
