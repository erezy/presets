package data.prv.entities.tiles;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import data.pub.entities.tiles.ITile;
import data.pub.entities.tiles.TileType;
import org.bson.types.ObjectId;

/**
 * Created by tzachit on 19/11/14.
 */

@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, property = "_class")
public abstract class Tile implements ITile {

    protected ObjectId id;
    protected TileType type;
    protected Integer position;

    public Tile(){
        this(null, 0);
        this.position = null;
    }

    public Tile(String id){
        this();
        this.id = new ObjectId(id);
    }

    public Tile(TileType type, int position){
        this.id = new ObjectId();
        this.type = type;
        this.position = position;
    }

    @Override
    public String getId() {
        return this.id.toString();
    }

    @Override
    public void setId(String id) {
        this.id = new ObjectId(id);
    }

    @Override
    public TileType getType() {
        return this.type;
    }

    @Override
    public void setType(TileType type) {
        this.type = type;
    }

    @Override
    public int getPosition() {
        return this.position;
    }

    @Override
    public void setPosition(int position) {
        this.position = position;
    }
}
