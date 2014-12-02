package data.prv.entities.tiles;

import data.pub.entities.tiles.IWorkspaceDescriptor;
import data.pub.entities.tiles.TileType;

import java.util.Date;

/**
 * Created by tzachit on 19/11/14.
 */

public class WorkspaceDescriptor extends Tile implements IWorkspaceDescriptor {

    private String name;
    private String description;
    private Date modified;
    private Date expired;

    public WorkspaceDescriptor(){
        this(0);
    }

    public WorkspaceDescriptor(int position){
        this("", "", new Date(), new Date(), position);
    }

    public WorkspaceDescriptor(String name, String description, Date modified, Date expired, int position) {
        super(TileType.WorkspaceDescriptor, position);
        this.name = name;
        this.description = description;
        this.modified = modified;
        this.expired = expired;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getDescription() {
        return this.description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public Date getModified() {
        return this.modified;
    }

    @Override
    public void setModified(Date modified) {
        this.modified = modified;
    }

    @Override
    public Date getExpired() {
        return this.expired;
    }

    @Override
    public void setExpired(Date expired) {
        this.expired = expired;
    }
}
