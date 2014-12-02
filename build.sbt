name := """Presets_Backend"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  javaWs,
  "com.google.inject" % "guice" % "3.0",
  "org.mongodb" % "mongo-java-driver" % "2.12.4",
  "org.mongodb.morphia" % "morphia" % "0.108",
  "cglib" % "cglib-nodep" % "3.1",
  "com.thoughtworks.proxytoys" % "proxytoys" % "1.0",
  "org.mongodb.morphia" % "morphia-validation" % "0.108",
  "org.jongo" % "jongo" % "1.1",
  "com.fasterxml.jackson.datatype" % "jackson-datatype-joda" % "2.4.3"
)
