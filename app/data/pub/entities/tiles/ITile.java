package data.pub.entities.tiles;

/**
 * Created by tzachit on 19/11/14.
 */

public interface ITile {
    int getId();
    void setId(int id);
    int getTypeId();
    void setTypeId(int type);
    int[] getFirstLocation();
    void setFirstLocation(int[] location);
    int[] getLocation();
    void setLocation(int[] location);
    int[] getSize();
    void setSize(int[] size);
    int getUnderBox();
    void setUnderBox(int underBox);
    boolean isHidden();
    void setHidden(boolean hidden);
    boolean getIsSet();
    void setIsSet(boolean isSet);
    IFormData getFormData();
    void setFormData(IFormData formData);
}
