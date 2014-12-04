package data.prv.entities.tiles;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import data.pub.entities.tiles.IFile;
import data.pub.entities.tiles.TileType;


/**
 * Created by tzachit on 19/11/14.
 */

public class File extends FormData implements IFile {

    private String path;

    public File(){}

    public File(String path) {
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
