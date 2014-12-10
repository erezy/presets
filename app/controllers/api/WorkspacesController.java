package controllers.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.inject.Inject;
import data.prv.entities.tiles.*;
import data.pub.entities.IWorkspace;
import data.pub.entities.tiles.ITile;
import data.pub.reposotories.IWorkspacesRepository;
import models.input.AddTileIModel;
import models.input.AddWorkspaceIModel;
import models.input.UpdateWorkspaceIModel;
import models.output.AddOModel;
import models.output.WorkspaceBaseOModel;
import play.data.Form;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by tzachit on 24/11/14.
 */
public class WorkspacesController extends Controller {

    private final IWorkspacesRepository workspacesRepo;

    @Inject
    public WorkspacesController(IWorkspacesRepository workspacesRepository){
        this.workspacesRepo = workspacesRepository;
    }

    public Result get(String id){

        try {

            IWorkspace workspace = this.workspacesRepo.findById(id);

            if(workspace == null){
                return badRequest(Json.toJson(new String[]{"Workspace not found!"}));
            }

            return ok(Json.toJson(workspace));

        }catch (Exception e){
            return badRequest("Server error!");
        }
    }

    public Result getAll(){
        System.out.println("in getAll");
        try {

            List<IWorkspace> workspaces = this.workspacesRepo.findAll();
            //List<WorkspaceBaseOModel> workspaceBases = new ArrayList<>();

            //workspaces.forEach(x -> workspaceBases.add(new WorkspaceBaseOModel(x.getId(), x.getName())));
            return ok(Json.toJson(workspaces));

        }catch (Exception e){
            e.printStackTrace();
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

            Form<AddWorkspaceIModel> addForm = new Form<AddWorkspaceIModel>(AddWorkspaceIModel.class);
            Form<AddWorkspaceIModel> model = addForm.bind(json);
            if(model.hasErrors()) {
                return badRequest(model.errorsAsJson());
            }
            AddWorkspaceIModel addModel = model.get();
            String workspaceId = this.workspacesRepo.add(
                    addModel.getName(),
                    addModel.getDescription(),
                    new Date(addModel.getExpired()),
                    addModel.getCols(),
                    addModel.getRows()
            );

            if(workspaceId == null){
                return badRequest(Json.toJson(new String[]{"Server error!", "Can't add workspace!"}));
            }else{
                List<ITile> tiles = new ArrayList<ITile>();;
                JsonNode node = buiidTilesArray(json,tiles);
                if(node != null){
                    return badRequest(node);
                }
                if(!this.workspacesRepo.addTiles(workspaceId,tiles)){
                    return badRequest(Json.toJson(new String[]{"Server error! Can't add Tiles"}));
                }
            }

            return ok(Json.toJson(new AddOModel(workspaceId)));

        }catch (Exception e){
            e.printStackTrace();
            return badRequest(Json.toJson(new String[]{"Server error!"}));
        }
    }

    private JsonNode buiidTilesArray(JsonNode json,List<ITile> tiles) throws Exception{
        Form<AddTileIModel> addTile = new Form<AddTileIModel>(AddTileIModel.class);
        Form<AddTileIModel> tileModel;
        ITile tile;
        JsonNode tileNodes = json.path("tiles");
        JsonNode formData;
        for(int i=0;tileNodes.has(i);i++){
            System.out.println("in add Tile "+i+": "+tileNodes.get(i).toString());
            formData = tileNodes.get(i).get("formData");
            if(formData != null) {
                tileModel = addTile.bind(formData);
                if (tileModel.hasErrors()) {
                    return tileModel.errorsAsJson();
                }
            }
            tile = buildTileByType(tileNodes.get(i));
            tiles.add(tile);
        }
        return null;
    }

    private ITile buildTileByType(JsonNode tileNode) throws Exception {
        try {
            ITile tile = new Tile();
            JsonNode nodeType = tileNode.get("typeId");
            tile.setFormData(null);
            if (nodeType != null) {
               JsonNode nodeForm = tileNode.get("formData");
                switch (nodeType.asInt()) {
                    case 1:
                        tile.setFormData(new WebPage(nodeForm.get("url").asText()));
                        break;
                    case 2:
                        tile.setFormData(new File(nodeForm.get("path").asText()));
                        break;
                    case 3:
                        tile.setFormData(new WorkspaceDescriptor());
                        break;
                    case 4:
                        tile.setFormData(new Map());
                }
            }
            tile.setFirstLocation(getIntArrayFromJson(tileNode,"firstLocation",2));
            tile.setLocation(getIntArrayFromJson(tileNode,"location",2));
            tile.setSize(getIntArrayFromJson(tileNode,"size",2));

            tile.setId(tileNode.get("id").asInt());
            if(tileNode.has("typeId")) {
                tile.setTypeId(tileNode.get("typeId").asInt());
            }
            if(tileNode.has("hidden")) {
                tile.setHidden(tileNode.get("hidden").asBoolean());
            }
            if(tileNode.has("isSet")) {
                tile.setIsSet(tileNode.get("isSet").asBoolean());
            }
            if(tileNode.has("underBox")) {
                tile.setUnderBox(tileNode.get("underBox").asInt());
            }
            return tile;
        }catch (Exception e){
            e.printStackTrace();
            throw new Exception("Failed to build a Tile");
        }
    }

    private int[] getIntArrayFromJson(JsonNode tileNode, String name, int size) {
        int [] arr = new int[size];
        JsonNode node = tileNode.path(name);
        if(node.isArray()) {
            for (int i = 0; i < arr.length; i++) {
                arr[i] = node.get(i).asInt();
            }
        }
        return arr;
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result update(){

        try {

            JsonNode json = request().body().asJson();

            if(json == null) {
                return badRequest(Json.toJson(new String[]{"Expecting Json data"}));
            }

            Form<UpdateWorkspaceIModel> updateForm = new Form<UpdateWorkspaceIModel>(UpdateWorkspaceIModel.class);
            Form<UpdateWorkspaceIModel> model = updateForm.bind(json);

            if(model.hasErrors()) {
                return badRequest(model.errorsAsJson());
            }

            List<ITile> tiles = new ArrayList<ITile>();;
            JsonNode node = buiidTilesArray(json,tiles);
            if(node != null){
                return badRequest(node);
            }
            UpdateWorkspaceIModel updateModel = model.get();

            if(!this.workspacesRepo.update(
                    updateModel.getId(),
                    updateModel.getName(),
                    updateModel.getDescription(),
                    new Date(updateModel.getExpired()),
                    updateModel.getCols(),
                    updateModel.getRows(),
                    tiles))
            {
                return badRequest(Json.toJson(new String[]{"Server error!", "Can't update!"}));
            }

            return ok("Workspace successfully updated!");

        }catch (Exception e){
            return badRequest(Json.toJson(new String[]{"Server error!"}));
        }
    }

    public Result delete(String id){

        try {

            if(!this.workspacesRepo.remove(id)){
                return badRequest(Json.toJson(new String[]{"Server error!", "Can't remove!"}));
            }

            return ok("Workspace successfully deleted!");

        }catch (Exception e){
            return badRequest("Server error!");
        }
    }
}
