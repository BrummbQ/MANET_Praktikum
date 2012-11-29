CREATE DATABASE IF NOT EXISTS fingerprints;
Use fingerprints;
Drop table if exists fingerprint;
Drop table if exists httpAccept;
Drop table if exists supercookie;
drop table if exists font;
drop table if exists plugin;
drop table if exists fingerprintPlugin;
drop table if exists fingerprintFont;
drop table if exists fingerprintTime;

CREATE TABLE fingerprint (
  id mediumint NOT NULL AUTO_INCREMENT,
  userAgent varchar(1000) NOT NULL,
  httpAcceptHeadersId mediumint  NOT NULL REFERENCES httpAccept(id),
  cookies bit(1) NOT NULL,
  screenResolution varchar(14) NOT NULL,
  timezone int NOT NULL,
  supercookieID mediumint NOT NULL REFERENCES supercookie(id),
  PRIMARY KEY (id)
);

CREATE TABLE httpAccept (
  id mediumint NOT NULL AUTO_INCREMENT,
  httpAccept varchar(767) NOT NULL,
  charset varchar(500),
  language varchar(500),
  encoding varchar(500),
  PRIMARY KEY (id),
  UNIQUE httpA (httpAccept,charset,language,encoding)
);

CREATE TABLE supercookie (
  id mediumint NOT NULL AUTO_INCREMENT,
  domLocal bit(1) NOT NULL,
  domSession bit(1) NOT NULL,
  ieUserData bit(1) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO supercookie (domLocal, domSession, ieUserData) VALUES 
    (1,1,1),
    (1,1,0),
    (1,0,1),
    (1,0,0),
    (0,1,1),
    (0,1,0),
    (0,0,1),
    (0,0,0);

CREATE TABLE font (
  id mediumint NOT NULL AUTO_INCREMENT,
  wert varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE wert (wert)
);

CREATE TABLE plugin (
  id mediumint NOT NULL AUTO_INCREMENT,
  wert text NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE fingerprintPlugin (
  fingerprintId mediumint NOT NULL REFERENCES fingerprint(id),
  pluginId mediumint NOT NULL REFERENCES plugin(id),
  UNIQUE fp_p (fingerprintId,pluginId)
);

CREATE TABLE fingerprintFont (
  fingerprintId mediumint NOT NULL REFERENCES fingerprint(id),
  fontId mediumint NOT NULL REFERENCES font(id),
  UNIQUE fp_f (fingerprintId,fontId)
);

CREATE TABLE fingerprintTime (
  fingerprintId mediumint NOT NULL REFERENCES fingerprint(id),
  time timestamp NOT NULL,
  UNIQUE fp_p (fingerprintId,time)
);

GRANT ALL PRIVILEGES on fingerprints.* to fingerprintacc@'localhost' IDENTIFIED BY 'fingerprint';
FLUSH PRIVILEGES; 
