/**
 * Created by tzachit on 16/11/14.
 */

import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import data.prv.context.IPresetsDbContext;
import data.prv.context.PresetsDbContext;
import data.prv.entities.Track;
import data.prv.repositories.TilesRepository;
import data.prv.repositories.TracksRepository;
import data.prv.repositories.WorkspacesRepository;
import data.pub.reposotories.ITilesRepository;
import data.pub.reposotories.ITracksRepository;
import data.pub.reposotories.IWorkspacesRepository;
import play.Application;
import play.GlobalSettings;
import services.prv.DistributionService;
import services.prv.LocationGenerator;
import services.prv.SocketsManager;
import services.pub.IDistributionService;
import services.pub.ILocationGenerator;
import services.pub.ISocketsManager;

public class Global extends GlobalSettings {

    private static final int NUMBER_OF_TRACKS = 500;
    private static final TracksRepository tracksRepository = new TracksRepository(NUMBER_OF_TRACKS);
    private static final SocketsManager socketsManager = new SocketsManager();
    private static final LocationGenerator locationGenerator = new LocationGenerator();
    private static final Injector INJECTOR = createInjector();

    @Override
    public void onStart(Application app) {
        for(int i = 0; i < NUMBER_OF_TRACKS; i++){
            tracksRepository.add(new Track("" + i, "Hey i'm track no#: " + i, locationGenerator.generate()));
        }
    }

    @Override
    public <A> A getControllerInstance(Class<A> controllerClass) throws Exception {
        return INJECTOR.getInstance(controllerClass);
    }

    private static Injector createInjector() {
        return Guice.createInjector(new AbstractModule() {

            @Override
            protected void configure() {

                bind(ITracksRepository.class).toInstance(tracksRepository);
                bind(ISocketsManager.class).toInstance(socketsManager);
                bind(ILocationGenerator.class).toInstance(locationGenerator);

                DistributionService.CHUNKS_SIZE = 500;
                bind(IDistributionService.class).to(DistributionService.class);

                bind(IPresetsDbContext.class).to(PresetsDbContext.class);
                bind(IWorkspacesRepository.class).to(WorkspacesRepository.class);
                bind(ITilesRepository.class).to(TilesRepository.class);
            }
        });
    }

}