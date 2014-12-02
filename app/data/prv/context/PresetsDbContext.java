package data.prv.context;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import org.jongo.Jongo;
import org.jongo.MongoCollection;
import org.jongo.marshall.jackson.JacksonMapper;

import java.net.UnknownHostException;

import static com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.PUBLIC_ONLY;

/**
 * Created by tzachit on 20/11/14.
 */
public class PresetsDbContext implements IPresetsDbContext {

    private Jongo jongo;

    public PresetsDbContext() throws UnknownHostException {

        DB db = new MongoClient().getDB("presets");

        this.jongo = new Jongo(db,
                new JacksonMapper.Builder()
                        .registerModule(new JodaModule())
                        .enable(MapperFeature.AUTO_DETECT_GETTERS)
                        .enable(MapperFeature.AUTO_DETECT_SETTERS)
                        .withView(PUBLIC_ONLY.getClass())
                        .build()
        );
    }

    @Override
    public MongoCollection getCollection(String name){
        return this.jongo.getCollection(name);
    }
}
