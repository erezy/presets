package models.input;

import play.data.validation.Constraints.*;

/**
 * Created by tzachit on 24/11/14.
 */
public class UpdateTileIModel {

    @Required
    @Pattern("[0-9a-fA-F]{24}")
    private String workspaceId;

    @Required
    @Pattern("[0-9a-fA-F]{24}")
    private String tileId;

    @Required
    @Pattern("(File)|(WebPage)|(WorkspaceDescriptor)|(Map)")
    private String type;

    @Min(1)
    @Max(25)
    private Integer position;

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

    public String getTileId() {
        return tileId;
    }

    public void setTileId(String tileId) {
        this.tileId = tileId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
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
