package data.prv.entities;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import data.pub.entities.IEntity;
import org.bson.types.ObjectId;

/**
 * Created by tzachit on 19/11/14.
 */

@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, property = "_class")
public abstract class Entity implements IEntity<String> {

    private ObjectId _id;

    public String getId(){
        return this._id.toString();
    }
}
