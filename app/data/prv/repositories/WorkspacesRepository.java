package data.prv.repositories;

import com.google.inject.Inject;
import data.prv.context.IPresetsDbContext;
import data.prv.entities.Workspace;
import data.pub.entities.IWorkspace;
import data.pub.reposotories.IWorkspacesRepository;
import org.bson.types.ObjectId;
import org.jongo.MongoCollection;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by tzachit on 20/11/14.
 */
public class WorkspacesRepository implements IWorkspacesRepository {

    private final MongoCollection collection;

    @Inject
    public WorkspacesRepository(IPresetsDbContext context){
        this.collection = context.getCollection("workspaces");
        this.collection.ensureIndex("{expired: 1}", "{expireAfterSeconds: 0}");
    }

    @Override
    public List<IWorkspace> findAll() {
        List<IWorkspace> workspaces = new ArrayList<>();
        this.collection.find().projection("{_id: 1, _class: 1, name: 1}")
                .as(Workspace.class).forEach(workspaces::add);
        return workspaces;
    }

    @Override
    public IWorkspace findById(String id) {
        return this.collection.findOne(new ObjectId(id)).as(Workspace.class);
    }

    @Override
    public String add(String name, String description, Date expired) {
        Workspace workspace = new Workspace(name, description, new Date(), expired);
        this.collection.save(workspace);
        return workspace.getId();
    }

    @Override
    public boolean update(String id, String name, String description, Date expired) {
        if(name != null && description == null && expired == null){
            return this.collection.update(new ObjectId(id))
                    .with("{$set: {name: #}}", name)
                    .getN() != 0;
        }

        if(name != null && description != null && expired == null){
            return this.collection.update(new ObjectId(id))
                    .with("{$set: {name: #, description: #}}", name, description)
                    .getN() != 0;
        }

        if(name != null && description == null){
            return this.collection.update(new ObjectId(id))
                    .with("{$set: {name: #, expired: #}}", name, expired)
                    .getN() != 0;
        }

        if(name != null){
            return this.collection.update(new ObjectId(id))
                    .with("{$set: {name: #, description: #, expired: #}}", name, description, expired)
                    .getN() != 0;
        }

        if(description != null && expired == null){
            return this.collection.update(new ObjectId(id))
                    .with("{$set: {description: #}}", description)
                    .getN() != 0;
        }

        if(description != null){
            return this.collection.update(new ObjectId(id))
                    .with("{$set: {description: #, expired: #}}", description, expired)
                    .getN() != 0;
        }

        if(expired != null){
            return this.collection.update(new ObjectId(id))
                    .with("{$set: {expired: #}}", expired)
                    .getN() != 0;
        }

        return false;
    }

    @Override
    public boolean remove(String id) {
        return this.collection.remove(new ObjectId(id)).getN() != 0;
    }

    @Override
    public long count() {
        return this.collection.count();
    }
}
