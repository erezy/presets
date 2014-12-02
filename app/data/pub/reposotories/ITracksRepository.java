package data.pub.reposotories;

import data.pub.entities.ITrack;

import java.util.Collection;

/**
 * Created by tzachit on 17/11/14.
 */
public interface ITracksRepository {
    boolean add(ITrack track);
    boolean remove(ITrack track);
    boolean remove(String id);
    boolean update(ITrack track);
    ITrack get(String id);
    boolean exist(String id);
    boolean exist(ITrack track);
    Collection<ITrack> getAll();
    int size();
}
