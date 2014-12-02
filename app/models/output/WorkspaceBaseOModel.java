package models.output;

/**
 * Created by tzachit on 24/11/14.
 */
public class WorkspaceBaseOModel {

    private String id;
    private String name;

    public WorkspaceBaseOModel(){}

    public WorkspaceBaseOModel(String id, String name){
        this.id = id;
        this.name = name;
    }

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
}
