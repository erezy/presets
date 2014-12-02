package controllers.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.inject.Inject;
import data.pub.entities.IWorkspace;
import data.pub.reposotories.IWorkspacesRepository;
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

        try {

            List<IWorkspace> workspaces = this.workspacesRepo.findAll();
            List<WorkspaceBaseOModel> workspaceBases = new ArrayList<>();

            workspaces.forEach(x -> workspaceBases.add(new WorkspaceBaseOModel(x.getId(), x.getName())));
            return ok(Json.toJson(workspaceBases));

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

            Form<AddWorkspaceIModel> addForm = new Form<AddWorkspaceIModel>(AddWorkspaceIModel.class);
            Form<AddWorkspaceIModel> model = addForm.bind(json);

            if(model.hasErrors()) {
                return badRequest(model.errorsAsJson());
            }

            AddWorkspaceIModel addModel = model.get();

            String workspaceId = this.workspacesRepo.add(
                    addModel.getName(),
                    addModel.getDescription(),
                    new Date(addModel.getExpired())
            );

            if(workspaceId == null){
                return badRequest(Json.toJson(new String[]{"Server error!", "Can't add!"}));
            }

            return ok(Json.toJson(new AddOModel(workspaceId)));

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

            Form<UpdateWorkspaceIModel> updateForm = new Form<UpdateWorkspaceIModel>(UpdateWorkspaceIModel.class);
            Form<UpdateWorkspaceIModel> model = updateForm.bind(json);

            if(model.hasErrors()) {
                return badRequest(model.errorsAsJson());
            }

            UpdateWorkspaceIModel updateModel = model.get();

            if(!this.workspacesRepo.update(
                    updateModel.getId(),
                    updateModel.getName(),
                    updateModel.getDescription(),
                    updateModel.getExpired() != null ? new Date(updateModel.getExpired()) : null))
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
