package data.prv.entities.tiles;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import data.pub.entities.tiles.IWebPage;
import data.pub.entities.tiles.TileType;

/**
 * Created by tzachit on 19/11/14.
 */

public class WebPage extends FormData implements IWebPage {

    private String url;

    public WebPage(){}

    public WebPage(String url) {
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
