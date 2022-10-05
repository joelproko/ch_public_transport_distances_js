# ✍ Deutsch, Français, Italiano, Rumantsch ✍

---

# Beschreibung
 Serverlose Webseite: Wann muss ich von einer Adresse los, um per ÖV/SBB zu gegebenen Zeiten/Daten an gegebenen Adressen/Orten anzukommen?
 
Funktioniert mit der API von fahrplan.search.ch, beschrieben unter https://timetable.search.ch/api/help

(Der "Tag" *housing* wurde hinzugefügt, weil der Sinn dieses Projekts ist, beim Suchen nach Wohnsituationen schnell und einfach sehen zu können, wie weit es mit dem öffentlichen Verkehr zu Arbeitsort, Freunden und anderen wichtigen Fix-Orten ist.

---

# Anwendung (Mobile / nicht serverless)

Auf https://joelproko.github.io/ch_public_transport_distances_js gehen.

# "Installation" (PC)

1. Projekt herunterladen
2. Projekt entpacken (falls als Archiv heruntergeladen)

# Anwendung (PC)

<ol><li>index.html im entpackten Ordner mit Browser* öffnen</li>
<li>Wichtige Zieldestinationen eingeben; braucht jeweils<dl>
  <dt>Adresse</dt><dd>Kann ein Ortsname sein, kann eine Haltestelle sein, kann aber auch "Strasse Nr(,) (PLZ) Ort" oder "(PLZ) Ort(,) Strasse Nr" sein</dd>
  <dt>Datum</dt><dd>Hauptsächlich für Arbeitstag vs. Wochenende relevant, kann aber auch für das Überprüfen der ÖV-Situation an Feiertagen genutzt werden</dd>
  <dt>Ankunftszeit</dt><dd>Um welche Zeit man spätestens an der Zieladresse ankommen möchte</dd></dl>
  -> nicht vergessen, auf "hinzufügen" zu klicken ;-)<br>
  Die hinzugefügte Destination erscheint nun in einer Liste.

  <strong><i>Es können mehrere Destinationen zur Liste hinzugefügt werden.</i></strong><br>
  Beim eingeben einer Startadresse im nächsten Schritt werden für alle Destinationen in der Liste gleichzeitig Verbindungen gesucht.
  </li>
<li>Adresse einer möglichen Startadresse (bzw. eines potentiellen Wohnorts) markieren und entweder
<ul><li>in das nun grüne Eingabefeld direkt hineinziehen, oder</li>
<li>kopieren, im grünen Eingabefeld einfügen, und "abschicken" klicken, oder</li>
<li>Adresse von Hand ins grüne Eingabefeld eintippen und "abschicken" klicken</li></ul>
</li>
<li>Für jede Zieldestination wird nun die letztmögliche Verbindung angezeigt, um zum gewünschten Zeitpunkt angekommen zu sein (je nach Bildschirmgrösse entweder unter oder neben dem Eingabefeld).</li>
</ol>

Ist ein Feld rot, wurde entweder vergessen es auszufüllen (beim hinzufügen von Zieldestinationen) oder es wurde eine Adresse eingegeben, die nicht existiert oder nicht verstanden wurde.

Sollte beim Eingeben einer Zieldestination ein Fehler gemacht worden sein, oder will man eine Destination aus einem anderen Grund entfernen, geht das durch klicken auf das [x] rechts davon.

Durch klicken auf das Symbol oben rechts ist es möglich, die Sprache umzustellen. Falls eine reine Schweizer Flagge für Rumantsch besser gefällt als das weisse R, das teilweise das Schweizerkreuz verdeckt, hat es im Ordner ```img``` auch eine ungenutzte Datei ```ch.png```, die ```rm.png``` ersetzen könnte.

---

*Internet Explorer wird wahrscheinlich nicht funktionieren. Firefox hat zwei minime Schönheitsfehler wenn<br>
```layout.css.has-selector.enabled``` in ```about:config``` nicht aktiviert ist, funktioniert aber problemlos.
