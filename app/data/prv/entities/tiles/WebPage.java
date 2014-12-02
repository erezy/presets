package data.prv.entities.tiles;

import data.pub.entities.tiles.IWebPage;
import data.pub.entities.tiles.TileType;

/**
 * Created by tzachit on 19/11/14.
 */

public class WebPage extends Tile implements IWebPage {

    private String url;

    public WebPage(){
        this(0);
    }

    public WebPage(int position){
        this(null, position);
    }

    public WebPage(String url, int position) {
        super(TileType.WebPage, position);
        this.url = url;
    }

    @Override
    public String getUrl() {
        return this.url;
    }

    @Override
    public void setUrl(String url) {
        this.url = url;
    }
}
