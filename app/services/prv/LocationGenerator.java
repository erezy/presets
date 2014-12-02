package services.prv;

import data.pub.entities.ILocation;
import data.prv.entities.Location;
import services.pub.ILocationGenerator;

import java.util.Random;

/**
 * Created by tzachit on 17/11/14.
 */
public class LocationGenerator implements ILocationGenerator {

    private Random _random;

    public LocationGenerator(){
        this._random = new Random();
    }

    @Override
    public ILocation generate() {
        return new Location(
                (-90) + 180 * this._random.nextDouble(),
                (-180) + 360 * this._random.nextDouble()
        );
    }
}
