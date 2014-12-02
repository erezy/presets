package models.input;

import play.data.validation.Constraints.*;

/**
 * Created by tzachit on 24/11/14.
 */
public class AddTileIModel {

    @Required
    @Pattern("[0-9a-fA-F]{24}")
    private String workspaceId;

    @Required
    private int position;

    @Required
    @Pattern("(File)|(WebPage)|(WorkspaceDescriptor)|(Map)")
    private String type;

    @MinLength(2)
    @MaxLength(50)
    private String path;

    @MinLength(2)
    @MaxLength(50)
    private String url;

    @MinLength(2)
    @MaxLength(16)
    private String name;

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
