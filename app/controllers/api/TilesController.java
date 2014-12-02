package controllers.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.inject.Inject;
import data.pub.reposotories.ITilesRepository;
import models.input.AddTileIModel;
import models.input.UpdateTileIModel;
import models.output.AddOModel;
import play.data.Form;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;

/**
 * Created by tzachit on 24/11/14.
 */
public class TilesController extends Controller {

    private final ITilesRepository tilesRepo;

    @Inject
    public TilesController(ITilesRepository tilesRepository){
        this.tilesRepo = tilesRepository;
    }

    public Result getAll(String workspaceId){
        try {

            return ok(Json.toJson(this.tilesRepo.findByWorkspace(workspaceId)));

        }catch (Exception e){
            return badRequest(Json.toJson(new String[]{"Server error!"}));
        }
    }

    public Result get(String workspaceId, String tileId){
        try {

            return ok(Json.toJson(this.tilesRepo.findById(workspaceId, tileId)));

        }catch (Exception e){
            return badRequest(Json.toJson(new String[]{"Server error!"}));
        }
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result add(){

        try {

            JsonNode json = request().body().asJson();

            if(json == null) {
                return badRequest(Json.toJson(new String[]{"Expecting Json data"}));
            }

            Form<AddTileIModel> addForm = new Form<AddTileIModel>(AddTileIModel.class);
            Form<AddTileIModel> model = addForm.bind(json);

            if(model.hasErrors()) {
                return badRequest(model.errorsAsJson());
            }

            AddTileIModel addModel = model.get();

            String tileId = null;

            switch (addModel.getType()){
                case "File": {
                    tileId = this.tilesRepo.addFile(
                            addModel.getWorkspaceId(), addModel.getPath(), addModel.getPosition()
                    );
                    break;
                }
                case "WebPage": {
                    tileId = this.tilesRepo.addWebPage(
                            addModel.getWorkspaceId(), addModel.getUrl(), addModel.getPosition()
                    );
                    break;
                }
                case "WorkspaceDescriptor": {
                    tileId = this.tilesRepo.addWorkspaceDescriptor(
                            addModel.getWorkspaceId(), addModel.getPosition()
                    );
                    break;
                }
                case "Map": {
                    tileId = this.tilesRepo.addMap(
                            addModel.getWorkspaceId(), addModel.getName(), addModel.getPosition()
                    );
                    break;
                }
            }

            if(tileId == null){
                return badRequest(Json.toJson(new String[]{"Server error!", "Can't add!"}));
            }

            return ok(Json.toJson(new AddOModel(tileId)));

        }catch (Exception e){
            return badRequest(Json.toJson(new String[]{"Server error!"}));
        }
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result update(){

        try {

            JsonNode json = request().body().asJson();

            if(json == null) {
                return badRequest(Json.toJson(new String[]{"Expecting Json data"}));
            }

            Form<UpdateTileIModel> updateForm = new Form<UpdateTileIModel>(UpdateTileIModel.class);
            Form<UpdateTileIModel> model = updateForm.bind(json);

            if(model.hasErrors()) {
                return badRequest(model.errorsAsJson());
            }

            UpdateTileIModel updateModel = model.get();

            boolean updated = false;

            switch (updateModel.getType()){
                case "File": {
                    updated = this.tilesRepo.updateFile(
                            updateModel.getWorkspaceId(), updateModel.getTileId(), updateModel.getPath(), updateModel.getPosition()
                    );
                    break;
                }
                case "WebPage": {
                    updated = this.tilesRepo.updateWebPage(
                            updateModel.getWorkspaceId(), updateModel.getTileId(), updateModel.getUrl(), updateModel.getPosition()
                    );
                    break;
                }
                case "WorkspaceDescriptor": {
                    updated = this.tilesRepo.updateWorkspaceDescriptor(
                            updateModel.getWorkspaceId(), updateModel.getTileId(), updateModel.getPosition()
                    );
                    break;
                }
                case "Map": {
                    updated = this.tilesRepo.updateMap(
                            updateModel.getWorkspaceId(), updateModel.getTileId(), updateModel.getName(), updateModel.getPosition()
                    );
                    break;
                }
            }

            if(!updated){
                return badRequest(Json.toJson(new String[]{"Server error!", "Can't add!"}));
            }

            return ok(Json.toJson("Tile successfully updated!"));

        }catch (Exception e){
            return badRequest(Json.toJson(new String[]{"Server error!"}));
        }
    }

    public Result delete(String workspaceId, String tileId){

        try {

            if(!this.tilesRepo.remove(workspaceId, tileId)){
                return badRequest(Json.toJson(new String[]{"Server error!", "Can't remove!"}));
            }

            return ok("Tile successfully deleted!");

        }catch (Exception e){
            return badRequest("Server error!");
        }
    }
}
