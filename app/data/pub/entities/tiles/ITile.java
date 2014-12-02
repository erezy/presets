package data.pub.entities.tiles;

/**
 * Created by tzachit on 19/11/14.
 */

public interface ITile {
    String getId();
    void setId(String id);
    TileType getType();
    void setType(TileType type);
    int getPosition();
    void setPosition(int position);
}
