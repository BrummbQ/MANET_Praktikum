import java.awt.*;
import java.awt.event.*;
import java.applet.*;
import java.awt.font.*;
import java.awt.geom.*;
import java.util.Arrays;

public class ListFonts extends Applet {

  public void init() {}

  public String getFonts() {
    GraphicsEnvironment e = GraphicsEnvironment.getLocalGraphicsEnvironment();
    String[] fonts = e.getAvailableFontFamilyNames();
    return Arrays.toString(fonts);
  }
}
