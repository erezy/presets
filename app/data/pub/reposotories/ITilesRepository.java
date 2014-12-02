package data.pub.reposotories;

import data.pub.entities.tiles.ITile;

import java.util.List;

/**
 * Created by tzachit on 20/11/14.
 */
public interface ITilesRepository {
    ITile findById(String workspaceId, String tileId);
    List<ITile> findByWorkspace(String workspaceId);
    String addFile(String workspaceId, String path, int position);
    String addWebPage(String workspaceId, String url, int position);
    String addWorkspaceDescriptor(String workspaceId, int position);
    String addMap(String workspaceId, String name, int position);
    boolean updateFile(String workspaceId, String tileId, String path, Integer position);
    boolean updateWebPage(String workspaceId, String tileId, String url, Integer position);
    boolean updateWorkspaceDescriptor(String workspaceId, String tileId, Integer position);
    boolean updateMap(String workspaceId, String tileId, String name, Integer position);
    boolean remove(String workspaceId, String tileId);
}
