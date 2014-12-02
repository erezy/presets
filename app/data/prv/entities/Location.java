package data.prv.entities;

import data.pub.entities.ILocation;

/**
 * Created by tzachit on 17/11/14.
 */
public class Location implements ILocation {

    private double lat;
    private double lon;

    public Location(){
        this(0,0);
    }

    public Location(double lat, double lon){
        this.lat = lat;
        this.lon = lon;
    }

    @Override
    public double getLat() {
        return this.lat;
    }

    @Override
    public boolean setLat(double lat) {
        if(lat > 90 || lat < (-90)){
            return false;
        }

        this.lat = lat;
        return true;
    }

    @Override
    public double getLon() {
        return this.lon;
    }

    @Override
    public boolean setLon(double lon) {
        if(lon > 180 || lon < (-180)){
            return false;
        }

        this.lon = lon;
        return true;
    }
}
