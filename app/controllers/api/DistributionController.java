package controllers.api;

import com.google.inject.Inject;
import play.mvc.Controller;
import play.mvc.*;
import services.pub.IDistributionService;

/**
 * Created by tzachit on 17/11/14.
 */
public class DistributionController extends Controller{

    private final IDistributionService _distributionService;

    @Inject
    public DistributionController(IDistributionService distributionService){
        this._distributionService = distributionService;
    }

    public Result start(){
        this._distributionService.start();
        return ok("Distribution stated...");
    }

    public Result stop(){
        this._distributionService.stop();
        return ok("Distribution stopped...");
    }
}
