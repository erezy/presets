package data.prv.entities.tiles;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import data.pub.entities.tiles.IFormData;
import data.pub.entities.tiles.ITile;
import data.pub.entities.tiles.TileType;
import org.bson.types.ObjectId;

/**
 * Created by tzachit on 19/11/14.
 */

@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, property = "_class")
public class Tile implements ITile {

    protected int id;
    protected int typeId;
    protected int[] firstLocation;
    protected int[] location;
    protected int[] size;
    protected int underBox;
    protected boolean hidden;
    protected boolean isSet;
    protected FormData formData;

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    @Override
    public int getTypeId() {
        return typeId;
    }

    @Override
    public void setTypeId(int type) {
        this.typeId = type;
    }

    @Override
    public int[] getFirstLocation() {
        return firstLocation;
    }

    @Override
    public void setFirstLocation(int[] location) {
        this.firstLocation = location;
    }

    @Override
    public int[] getLocation() {
        return location;
    }

    @Override
    public void setLocation(int[] location) {
        this.location = location;
    }

    @Override
    public int[] getSize() {
        return size;
    }

    @Override
    public void setSize(int[] size) {
        this.size = size;
    }
    public int getUnderBox() {
        return underBox;
    }

    public void setUnderBox(int underBox) {
        this.underBox = underBox;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public boolean getIsSet() {
        return isSet;
    }

    public void setIsSet(boolean isSet) {
        this.isSet = isSet;
    }

    public IFormData getFormData() {
        return formData;
    }
    public void setFormData(IFormData formData) {
        this.formData = (FormData)formData;
    }
}
