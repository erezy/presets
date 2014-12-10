package data.pub.reposotories;

import data.pub.entities.IWorkspace;
import data.pub.entities.tiles.ITile;

import java.util.Date;
import java.util.List;

/**
 * Created by tzachit on 19/11/14.
 */
public interface IWorkspacesRepository {
    List<IWorkspace> findAll();
    IWorkspace findById(String id);
    String add(String name, String description, Date expired, int cols, int rows);
    boolean update(String id, String name, String description, Date expired, int cols, int rows ,List<ITile> tiles);
    boolean addTiles(String id,List<ITile> tiles);
    boolean remove(String id);
    long count();
}
