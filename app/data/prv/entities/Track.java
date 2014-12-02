package data.prv.entities;

import data.pub.entities.ILocation;
import data.pub.entities.ITrack;

/**
 * Created by tzachit on 17/11/14.
 */
public class Track implements ITrack {

    private String id;
    private String status;
    private ILocation location;

    public Track(){
        this(null, null, null);
    }

    public Track(String id, String status, ILocation location){
        this.id = id;
        this.status = status;
        this.location = location;
    }

    @Override
    public String getId() {
        return this.id;
    }

    @Override
    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String getStatus() {
        return this.status;
    }

    @Override
    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public ILocation getLocation() {
        return this.location;
    }

    @Override
    public void setLocation(ILocation location) {
        this.location = location;
    }
}
