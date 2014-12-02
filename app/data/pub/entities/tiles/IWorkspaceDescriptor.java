package data.pub.entities.tiles;

import java.util.Date;

/**
 * Created by tzachit on 19/11/14.
 */
public interface IWorkspaceDescriptor extends ITile {
    String getName();
    void setName(String name);
    String getDescription();
    void setDescription(String description);
    Date getModified();
    void setModified(Date modified);
    Date getExpired();
    void setExpired(Date expired);
}
