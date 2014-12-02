package data.pub.entities;

import data.pub.entities.tiles.ITile;

import java.util.Date;
import java.util.List;

/**
 * Created by tzachit on 19/11/14.
 */
public interface IWorkspace {
    String getId();
    String getName();
    void setName(String name);
    String getDescription();
    void setDescription(String description);
    Date getModified();
    void setModified(Date modified);
    Date getExpired();
    void setExpired(Date expired);
    List<ITile> getTiles();
}
