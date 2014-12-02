package data.prv.context;

import org.jongo.MongoCollection;

/**
 * Created by tzachit on 20/11/14.
 */
public interface IPresetsDbContext {
    MongoCollection getCollection(String name);
}
