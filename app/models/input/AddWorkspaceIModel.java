package models.input;

import play.data.validation.Constraints.*;

/**
 * Created by tzachit on 24/11/14.
 */
public class AddWorkspaceIModel {

    @Required
    @MinLength(2)
    @MaxLength(16)
    private String name;

    @Required
    @MinLength(2)
    @MaxLength(50)
    private String description;

    @Required
    private long expired;

    @Required
    private int cols;

    @Required
    private int rows;

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

    public long getExpired() {
        return expired;
    }

    public void setExpired(long expired) {
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
