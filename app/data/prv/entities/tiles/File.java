package data.prv.entities.tiles;

import data.pub.entities.tiles.IFile;
import data.pub.entities.tiles.TileType;


/**
 * Created by tzachit on 19/11/14.
 */

public class File extends Tile implements IFile {

    private String path;

    public File(){
        this(0);
    }

    public File(int position){
        this(null, position);
    }

    public File(String path, int position) {
        super(TileType.File, position);
        this.path = path;
    }

    @Override
    public String getPath() {
        return this.path;
    }

    @Override
    public void setPath(String path) {
        this.path = path;
    }
}
