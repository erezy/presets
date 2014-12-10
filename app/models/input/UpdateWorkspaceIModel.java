package models.input;

import play.data.validation.Constraints.*;

/**
 * Created by tzachit on 24/11/14.
 */
public class UpdateWorkspaceIModel {

    @Required
    @Pattern("[0-9a-fA-F]{24}")
    private String id;

    @Required
    @MinLength(2)
    @MaxLength(16)
    private String name;

    @Required
    @MinLength(2)
    @MaxLength(50)
    private String description;

    @Required
    private Long expired;

    @Required
    private int cols;

    @Required
    private int rows;

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

    public void setExpired(Long expired) {
        this.expired = expired;
    }

    public int getCols() {
        return cols;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }
}
