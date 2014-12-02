package models.input;

import play.data.validation.Constraints.*;

/**
 * Created by tzachit on 24/11/14.
 */
public class UpdateWorkspaceIModel {

    @Required
    @Pattern("[0-9a-fA-F]{24}")
    private String id;

    @MinLength(2)
    @MaxLength(16)
    private String name;

    @MinLength(2)
    @MaxLength(50)
    private String description;

    private Long expired;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getExpired() {
        return expired;
    }

    public void setExpired(long expired) {
        this.expired = expired;
    }
}
