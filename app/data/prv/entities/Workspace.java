package data.prv.entities;

import data.prv.entities.tiles.Tile;
import data.pub.entities.IWorkspace;
import data.pub.entities.tiles.ITile;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by tzachit on 19/11/14.
 */

public class Workspace extends Entity implements IWorkspace {

    public static final int MAX_TILES = 25;

    private String name;
    private String description;
    private Date modified;
    private Date expired;
    private int cols;
    private int rows;
    private List<Tile> tiles;

    public Workspace(){
        this(null);
    }

    public Workspace(String name){
        this(name, null);
    }

    public Workspace(String name, String description){
        this(name, description, new Date());
    }

    public Workspace(String name, String description, Date modified){
        this(name, description, modified, new Date(),0,0);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DATE, 14);
        this.expired = calendar.getTime();
    }

    public Workspace(String name, String description, Date modified, Date expired, int cols, int rows){
        this(name, description, modified, expired, cols, rows, new ArrayList<>());
    }

    public Workspace(String name, String description, Date modified, Date expired, int cols, int rows, List<ITile> tiles){
        this.name = name;
        this.description = description;
        this.modified = modified;
        this.expired = expired;
        this.cols = cols;
        this.rows = rows;
        this.tiles = new ArrayList<>();

        if(tiles != null && tiles.size() != 0){
            tiles.forEach(tile -> this.tiles.add((Tile)tile));
        }
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getDescription() {
        return this.description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public Date getModified() {
        return this.modified;
    }

    @Override
    public void setModified(Date modified) {
        this.modified = modified;
    }

    @Override
    public Date getExpired() {
        return this.expired;
    }

    @Override
    public void setExpired(Date expired) {
        this.expired = expired;
    }
    @Override
    public int getCols() {
        return cols;
    }

    @Override
    public void setCols(int cols) {
        this.cols = cols;
    }

    @Override
    public int getRows() {
        return rows;
    }

    @Override
    public void setRows(int rows) {
        this.rows = rows;
    }

    @Override
    public List<ITile> getTiles() {
        List<ITile> tiles = new ArrayList<>();
        this.tiles.forEach(tiles::add);
        return tiles;
    }
}
