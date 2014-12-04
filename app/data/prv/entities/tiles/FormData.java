package data.prv.entities.tiles;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import data.pub.entities.tiles.IFormData;

/**
 * Created by erezy on 12/4/2014.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, property = "_class")
public class FormData implements IFormData{

   public FormData(){}
}
