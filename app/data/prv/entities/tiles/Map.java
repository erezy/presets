package data.prv.entities.tiles;

import data.pub.entities.tiles.IMap;
import data.pub.entities.tiles.TileType;

/**
 * Created by tzachit on 19/11/14.
 */

public class Map extends Tile implements IMap{

    private String name;

    public Map(){
        this(0);
    }

    public Map(int position){
        this(null, position);
    }

    public Map(String name, int position) {
        super(TileType.Map, position);
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
