package data.pub.entities;

/**
 * Created by tzachit on 17/11/14.
 */
public interface ITrack {
    String getId();
    void setId(String id);
    String getStatus();
    void setStatus(String status);
    ILocation getLocation();
    void setLocation(ILocation location);
}
