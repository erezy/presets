package data.prv.repositories;

import data.pub.entities.ITrack;
import data.pub.reposotories.ITracksRepository;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by tzachit on 17/11/14.
 */
public class TracksRepository implements ITracksRepository {

    private final ConcurrentHashMap<String, ITrack> _tracks;

    public TracksRepository(){
        this._tracks = new ConcurrentHashMap<>();
    }

    public TracksRepository(int capacity){
        this._tracks = new ConcurrentHashMap<>(capacity);
    }

    @Override
    public boolean add(ITrack track) {
        if(this._tracks.containsKey(track.getId())){
            return false;
        }

        this._tracks.put(track.getId(), track);
        return true;
    }

    @Override
    public boolean remove(ITrack track) {
        return this._tracks.remove(track.getId(), track);
    }

    @Override
    public boolean remove(String id) {
        return this._tracks.remove(id) != null;
    }

    @Override
    public boolean update(ITrack track) {
        return this._tracks.putIfAbsent(track.getId(), track) != null;
    }

    @Override
    public ITrack get(String id) {
        return this._tracks.get(id);
    }

    @Override
    public boolean exist(String id) {
        return this._tracks.containsKey(id);
    }

    @Override
    public boolean exist(ITrack track) {
        return this._tracks.contains(track);
    }

    @Override
    public Collection<ITrack> getAll() {
        return this._tracks.values();
    }

    @Override
    public int size() {
        return this._tracks.size();
    }
}
