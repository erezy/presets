package data.prv.repositories;

import com.google.inject.Inject;
import data.prv.context.IPresetsDbContext;
import data.prv.entities.Workspace;
import data.prv.entities.tiles.File;
import data.prv.entities.tiles.Map;
import data.prv.entities.tiles.WebPage;
import data.prv.entities.tiles.WorkspaceDescriptor;
import data.pub.entities.tiles.ITile;
import data.pub.reposotories.ITilesRepository;
import org.bson.types.ObjectId;
import org.jongo.MongoCollection;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by tzachit on 20/11/14.
 */
public class TilesRepository implements ITilesRepository {

    private final MongoCollection collection;

    @Inject
    public TilesRepository(IPresetsDbContext context){
        this.collection = context.getCollection("workspaces");
    }

    @Override
    public ITile findById(String workspaceId, String tileId) {

        Workspace workspace = this.collection
                .findOne("{_id: #}, {tiles: {$elemMatch: {id: #}}}", new ObjectId(workspaceId), new ObjectId(tileId))
                .as(Workspace.class);

        if(workspace == null || workspace.getTiles() == null){
            return null;
        }

        return workspace.getTiles().get(0);
    }

    @Override
    public List<ITile> findByWorkspace(String workspaceId) {

        Workspace workspace = this.collection
                .findOne("{_id: #}", new ObjectId(workspaceId))
                .as(Workspace.class);

        if(workspace == null || workspace.getTiles() == null){
            return null;
        }

        List<ITile> tiles = new ArrayList<>();
        workspace.getTiles().forEach(tiles::add);
        return tiles;
    }

    @Override
    public String addFile(String workspaceId, String path, int position) {

        if(path == null || position < 1 || position > Workspace.MAX_TILES){
            return null;
        }

        File file = new File(path, position);

        return this.collection
                .update("{_id: #, 'tiles.position': {$ne: #}}", new ObjectId(workspaceId), position)
                .with("{$push: {tiles: #}}", file)
                .getN() != 0 ? file.getId() : null;
    }

    @Override
    public String addWebPage(String workspaceId, String url, int position) {

        if(url == null || position < 1 || position > Workspace.MAX_TILES){
            return null;
        }

        WebPage webPage = new WebPage(url, position);

        return this.collection
                .update("{_id: #, 'tiles.position': {$ne: #}}", new ObjectId(workspaceId), position)
                .with("{$push: {tiles: #}}",  webPage)
                .getN() != 0 ? webPage.getId() : null;
    }

    @Override
    public String addWorkspaceDescriptor(String workspaceId, int position) {

        Workspace workspace = this.collection
                .findOne("{_id: #}", new ObjectId(workspaceId))
                .as(Workspace.class);

        if(workspace == null || position < 1 || position > Workspace.MAX_TILES){
            return null;
        }

        WorkspaceDescriptor workspaceDescriptor = new WorkspaceDescriptor(
                workspace.getName(),
                workspace.getDescription(),
                workspace.getModified(),
                workspace.getExpired(),
                position
        );

        return this.collection
                .update("{_id: #, 'tiles.position': {$ne: #}}", new ObjectId(workspaceId), position)
                .with("{$push: {tiles: #}}", workspaceDescriptor)
                .getN() != 0 ? workspaceDescriptor.getId() : null;
    }

    @Override
    public String addMap(String workspaceId, String name, int position) {

        if(name == null || position < 1 || position > Workspace.MAX_TILES){
            return null;
        }

        Map map = new Map(name, position);

        return this.collection
                .update("{_id: #, 'tiles.position': {$ne: #}}", new ObjectId(workspaceId), position)
                .with("{$push: {tiles: #}}",  map)
                .getN() != 0 ? map.getId() : null;
    }

    @Override
    public boolean updateFile(String workspaceId, String tileId, String path, Integer position) {

        if(path != null && position == null){
            return this.collection
                    .update("{_id: #, 'tiles.id': #}", new ObjectId(workspaceId), new ObjectId(tileId))
                    .with("{$set: {'tiles.$.path': #}}", path)
                    .getN() != 0;
        }

        if(path == null && position != null){
            if(position < 1 || position > Workspace.MAX_TILES){
                return false;
            }

            return this.collection
                    .update("{_id: #, 'tiles.id': #, 'tiles.position': {$ne: #}}",
                            new ObjectId(workspaceId), new ObjectId(tileId), position)
                    .with("{$set: {'tiles.$.position': #}}", position)
                    .getN() != 0;
        }

        if(path != null){
            if(position < 1 || position > Workspace.MAX_TILES){
                return false;
            }

            return this.collection
                    .update("{_id: #, 'tiles.id': #, 'tiles.position': {$ne: #}}",
                            new ObjectId(workspaceId), new ObjectId(tileId), position)
                    .with("{$set: {'tiles.$.path': #, 'tiles.$.position': #}}", path, position)
                    .getN() != 0;
        }

        return false;
    }

    @Override
    public boolean updateWebPage(String workspaceId, String tileId, String url, Integer position) {

        if(url != null && position == null){
            return this.collection
                    .update("{_id: #, 'tiles.id': #}", new ObjectId(workspaceId), new ObjectId(tileId))
                    .with("{$set: {'tiles.$.url': #}}", url)
                    .getN() != 0;
        }

        if(url == null && position != null){
            if(position < 1 || position > Workspace.MAX_TILES){
                return false;
            }

            return this.collection
                    .update("{_id: #, 'tiles.id': #, 'tiles.position': {$ne: #}}",
                            new ObjectId(workspaceId), new ObjectId(tileId), position)
                    .with("{$set: {'tiles.$.position': #}}", position)
                    .getN() != 0;
        }

        if(url != null){
            if(position < 1 || position > Workspace.MAX_TILES){
                return false;
            }

            return this.collection
                    .update("{_id: #, 'tiles.id': #, 'tiles.position': {$ne: #}}",
                            new ObjectId(workspaceId), new ObjectId(tileId), position)
                    .with("{$set: {'tiles.$.url': #, 'tiles.$.position': #}}", url, position)
                    .getN() != 0;
        }

        return false;
    }

    @Override
    public boolean updateWorkspaceDescriptor(String workspaceId, String tileId, Integer position) {

        Workspace workspace = this.collection
                .findOne("{_id: #}", new ObjectId(workspaceId))
                .as(Workspace.class);

        if (workspace == null) {
            return false;
        }

        if (position == null) {
            return this.collection
                    .update("{_id: #, 'tiles.id': #}", new ObjectId(workspaceId), new ObjectId(tileId))
                    .with("{$set: {'tiles.$.name': #, 'tiles.$.description': #, 'tiles.$.modified': #, 'tiles.$.expired': #}}",
                            workspace.getName(), workspace.getDescription(), workspace.getModified(), workspace.getExpired())
                    .getN() != 0;
        }

        if(position < 1 || position > Workspace.MAX_TILES){
            return false;
        }

        return this.collection
                .update("{_id: #, 'tiles.id': #, 'tiles.position': {$ne: #}}",
                        new ObjectId(workspaceId), new ObjectId(tileId), position)
                .with("{$set: {'tiles.$.name': #, 'tiles.$.description': #, 'tiles.$.modified': #, 'tiles.$.expired': #, 'tiles.$.position': #}}",
                        workspace.getName(), workspace.getDescription(), workspace.getModified(), workspace.getExpired(), position)
                .getN() != 0;
    }

    @Override
    public boolean updateMap(String workspaceId, String tileId, String name, Integer position) {

        if(name != null && position == null){
            return this.collection
                    .update("{_id: #, 'tiles.id': #}", new ObjectId(workspaceId), new ObjectId(tileId))
                    .with("{$set: {'tiles.$.name': #}}", name)
                    .getN() != 0;
        }

        if(name == null && position != null){
            if(position < 1 || position > Workspace.MAX_TILES){
                return false;
            }

            return this.collection
                    .update("{_id: #, 'tiles.id': #, 'tiles.position': {$ne: #}}",
                            new ObjectId(workspaceId), new ObjectId(tileId), position)
                    .with("{$set: {'tiles.$.position': #}}", position)
                    .getN() != 0;
        }

        if(name != null){
            if(position < 1 || position > Workspace.MAX_TILES){
                return false;
            }

            return this.collection
                    .update("{_id: #, 'tiles.id': #, 'tiles.position': {$ne: #}}",
                            new ObjectId(workspaceId), new ObjectId(tileId), position)
                    .with("{$set: {'tiles.$.name': #, 'tiles.$.position': #}}", name, position)
                    .getN() != 0;
        }

        return false;
    }

    @Override
    public boolean remove(String workspaceId, String tileId) {

        return this.collection
                .update(new ObjectId(workspaceId))
                .with("{$pull: {tiles: {id: #}}}", new ObjectId(tileId))
                .getN() != 0;
    }
}
